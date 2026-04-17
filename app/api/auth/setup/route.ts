import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get('FORMHUBS_session')?.value;

    if (!sessionUserId) {
        return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 });
    }

    const { forwardingEmail } = await req.json();

    if (!forwardingEmail || !forwardingEmail.includes('@')) {
        return NextResponse.json({ error: 'Please provide a valid forwarding email address.' }, { status: 400 });
    }

    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
        sessionUserId,
        { 
            forwardingEmail,
            isSetupComplete: true 
        },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        return NextResponse.json({ error: 'User mapping not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Account securely updated' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error while syncing account setup' }, { status: 500 });
  }
}
