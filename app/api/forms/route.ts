import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { Form } from '@/lib/models/Form';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get('FORMHUBS_session')?.value;

    if (!sessionUserId) {
        return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 });
    }

    const { title, description, fields, isHeadless } = await req.json();

    if (!isHeadless && (!fields || !Array.isArray(fields) || fields.length === 0)) {
      return NextResponse.json({ error: 'Form must have at least one field.' }, { status: 400 });
    }

    await connectToDatabase();

    const newForm = await Form.create({
      userId: sessionUserId,
      title: title || 'Untitled Endpoint',
      description: description || '',
      isHeadless: isHeadless || false,
      fields: fields || []
    });

    return NextResponse.json({ message: 'Form saved successfully', formId: newForm._id }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save form.' }, { status: 500 });
  }
}
