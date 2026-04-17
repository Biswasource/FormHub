import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/lib/models/Submission';
import { Form } from '@/lib/models/Form';
import { User } from '@/lib/models/User';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { formId, answers } = await req.json();

    if (!formId || !answers) {
      return NextResponse.json({ error: 'Missing form ID or answers.' }, { status: 400 });
    }

    await connectToDatabase();

    // Store the submission
    const newSubmission = await Submission.create({
      formId,
      answers
    });

    // Increment submissions count on the parent form
    const pristineForm = await Form.findByIdAndUpdate(formId, { $inc: { submissionsCount: 1 } }, { returnDocument: 'after' });

    if (pristineForm && pristineForm.userId) {
        // Evaluate destination user email binding natively
        const parentUser = await User.findById(pristineForm.userId);
        const destinationEmail = parentUser?.forwardingEmail || parentUser?.email;

        if (destinationEmail) {
            let parsedAnswersHtml = `<h3>New Submission for: ${pristineForm.title}</h3><table border="1" cellpadding="10" style="border-collapse: collapse; min-width: 400px; max-width: 100%;">`;
            
            // Reconstruct questions by their IDs intelligently
            pristineForm.fields.forEach((field: any) => {
               if (['statement', 'banner'].includes(field.type)) return;
               const label = field.label || field.type.toUpperCase();
               const answer = answers[field.id] !== undefined && answers[field.id] !== "" ? answers[field.id] : "<em>Empty</em>";
               parsedAnswersHtml += `<tr><td style="background-color: #f4f4f5; font-weight: bold;">${label}</td><td>${answer}</td></tr>`;
            });
            parsedAnswersHtml += "</table><br><p>Log into your FORMHUBSDashboard to view full analytics.</p>";

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
                subject: `FORMHUBS- New Response for "${pristineForm.title}"`,
                html: parsedAnswersHtml,
              });
            } else {
               console.log(`\n=== NO SMTP CONFIGURED: Fake Email Sent to ${destinationEmail} ===`);
               console.log(`SUBJECT: New Response for "${pristineForm.title}"`);
               Object.keys(answers).forEach(k => console.log(`[Field ${k}]: ${answers[k]}`));
               console.log("=================================================================\n");
            }
        }
    }

    return NextResponse.json({ message: 'Submission created successfully', submissionId: newSubmission._id }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to capture submission.' }, { status: 500 });
  }
}
