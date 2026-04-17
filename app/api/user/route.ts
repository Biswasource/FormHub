import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get('FORMHUBS_session')?.value;

    if (!sessionUserId) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { name, email, forwardingEmail } = await req.json();

    if (!name || !email) {
        return NextResponse.json({ error: 'Name and Account Email are required.' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if the new account email already exists on someone else's account safely
    const existingEmailMatch = await User.findOne({ email });
    if (existingEmailMatch && existingEmailMatch._id.toString() !== sessionUserId) {
        return NextResponse.json({ error: 'This email is already linked to another account.' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
        sessionUserId,
        { name, email, forwardingEmail },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        return NextResponse.json({ error: 'User mapping not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated securely' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error while syncing profile parameters' }, { status: 500 });
  }
}
