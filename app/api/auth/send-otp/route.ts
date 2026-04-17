import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Otp } from '@/lib/models/Otp';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const _otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await Otp.deleteMany({ email }); // Remove old OTPs for this email
    await Otp.create({ email, otp: _otp });

    // Ensure EMAIL credentials are provided for testing format, 
    // fallback to a console log if no SMTP is provided.
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
        subject: 'FORMHUBS- Your Sign Up OTP',
        html: `<p>Hi ${name},</p><p>Your OTP for sign up is <b style="font-size: 24px;">${_otp}</b>. It is valid for 5 minutes.</p>`,
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
