import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Otp } from '@/lib/models/Otp';

export async function POST(req: Request) {
  try {
    const { name, email, otp } = await req.json();

    if (!name || !email || !otp) {
      return NextResponse.json({ error: 'Name, email, and OTP are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Find the latest OTP for the email
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json({ error: 'OTP expired or not found' }, { status: 400 });
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Check if user already exists (double check)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Delete OTP after successful verification
    await Otp.deleteMany({ email });

    // Create User
    const newUser = await User.create({ name, email });

    return NextResponse.json({ message: 'User registered successfully', user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
