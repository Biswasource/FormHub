import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Otp } from '@/lib/models/Otp';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ error: 'No account found with this email! Please sign up.' }, { status: 404 });
    }

    // Generate a 6-digit OTP
    const _otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await Otp.deleteMany({ email }); // Remove old OTPs for this email
    await Otp.create({ email, otp: _otp });

    // Handle email sending
    if(process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
        to: email,
        subject: 'FORMHUBS- Your Login OTP',
        html: `<p>Welcome back to FORMHUBS!</p><p>Your login OTP is <b style="font-size: 24px;">${_otp}</b>. It is valid for 5 minutes.</p>`,
      });
    } else {
       console.log("\n=======================================================");
       console.log("No SMTP_EMAIL and SMTP_PASSWORD set in env.");
       console.log("Simulating OTP email send to " + email + ": " + _otp);
       console.log("=======================================================\n");
    }

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
