import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Otp } from '@/lib/models/Otp';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return NextResponse.json({ error: 'User does not exist.' }, { status: 400 });
    }

    // Find the latest OTP for this email
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json({ error: 'OTP expired or not requested' }, { status: 400 });
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Remove OTP after successful login
    await Otp.deleteMany({ email });

    // Establish secure Multi-tenant session boundary Native to Next.js
    const cookieStore = await cookies();
    cookieStore.set('FORMHUBS_session', existingUser._id.toString(), { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    // Return success to client so it redirects to dashboard
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
