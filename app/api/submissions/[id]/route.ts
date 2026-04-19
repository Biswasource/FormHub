import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/lib/models/Submission';
import { Form } from '@/lib/models/Form';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get('FORMHUBS_session')?.value;

    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { answers } = await req.json();

    await connectToDatabase();

    const submission = await Submission.findById(resolvedParams.id);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const form = await Form.findById(submission.formId);
    if (!form || form.userId !== sessionUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    submission.answers = answers;
    await submission.save();

    return NextResponse.json({ message: 'Submission updated successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get('FORMHUBS_session')?.value;

    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    await connectToDatabase();

    const submission = await Submission.findById(resolvedParams.id);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const form = await Form.findById(submission.formId);
    if (!form || form.userId !== sessionUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Submission.findByIdAndDelete(resolvedParams.id);
    
    // Decrement submissions count
    await Form.findByIdAndUpdate(submission.formId, { $inc: { submissionsCount: -1 } });

    return NextResponse.json({ message: 'Submission deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
