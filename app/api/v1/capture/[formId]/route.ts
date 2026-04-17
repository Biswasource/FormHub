import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Form } from '@/lib/models/Form';
import { Submission } from '@/lib/models/Submission';
import nodemailer from 'nodemailer';

// Allow CORS for headless integrations
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ formId: string }> }) {
  try {
    const { formId } = await params;
    if (!formId) return NextResponse.json({ error: 'Missing Developer Endpoint ID.' }, { status: 400 });

    await connectToDatabase();
    
    const targetForm = await Form.findById(formId);
    if (!targetForm) return NextResponse.json({ error: 'Endpoint destination not found.' }, { status: 404 });

    const targetUser = await User.findById(targetForm.userId);
    if (!targetUser) return NextResponse.json({ error: 'Associated user unresolvable.' }, { status: 404 });

    const destinationEmail = targetUser.forwardingEmail || targetUser.email;

    let payload: Record<string, any> = {};

    // Support both application/json and multipart/form-data organically
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
       payload = await req.json();
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
       const formData = await req.formData();
       formData.forEach((value, key) => {
         payload[key] = value;
       });
    }

    if (Object.keys(payload).length === 0) {
        return NextResponse.json({ error: 'Empty payload received.' }, { status: 400 });
    }

    // Process payload into an Email Notification precisely
    let parsedAnswersHtml = `<h3>New Headless Form Submission: ${targetForm.title}</h3><table border="1" cellpadding="10" style="border-collapse: collapse; min-width: 400px; max-width: 100%;">`;
    
    Object.entries(payload).forEach(([key, value]) => {
        parsedAnswersHtml += `<tr><td style="background-color: #f4f4f5; font-weight: bold; text-transform: capitalize;">${key.replace(/[_]/g, ' ')}</td><td style="white-space: pre-wrap;">${String(value)}</td></tr>`;
    });
    parsedAnswersHtml += "</table><br><p>Powered by FORMHUBSDeveloper API</p>";

    // Store Submission and Increment Form metrics securely
    await Submission.create({
        formId,
        answers: payload
    });

    await Form.findByIdAndUpdate(formId, { $inc: { submissionsCount: 1 } });

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
          to: destinationEmail,
          subject: `FORMHUBSHeadless API - New Submission`,
          html: parsedAnswersHtml,
        });
    } else {
        console.log(`\n=== API CAPTURE: Fake Email Sent to ${destinationEmail} ===`);
        console.log(payload);
        console.log("========================================================\n");
    }

    return NextResponse.json(
        { success: true, message: 'Data perfectly captured and dispatched.' },
        { 
            status: 200,
            headers: {
               'Access-Control-Allow-Origin': '*'
            }
        }
    );

  } catch (error: any) {
    console.error("Developer API Error:", error);
    return NextResponse.json({ error: 'Failed to process API integration request.' }, { status: 500 });
  }
}
