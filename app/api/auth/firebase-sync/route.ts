import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Sync Firebase User with MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name: name || email.split('@')[0],
        isSetupComplete: false,
      });
    }

    // 2. Set the custom session cookie
    const cookieStore = await cookies();
    cookieStore.set('FORMHUBS_session', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 Year
    });

    return NextResponse.json({ message: 'Sync successful' }, { status: 200 });
  } catch (error: any) {
    console.error('Firebase Sync Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
