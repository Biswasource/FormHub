import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import { Form } from "@/lib/models/Form"
import ClientForm from "./ClientForm"

async function getForm(id: string) {
  try {
    await connectToDatabase();
    // Increment view count while fetching
    const form = await Form.findByIdAndUpdate(id, { $inc: { views: 1 } }, { returnDocument: 'after' });
    if (!form) return null;
    return JSON.parse(JSON.stringify(form));
  } catch (err) {
    return null;
  }
}

export default async function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const form = await getForm(resolvedParams.id);

  if (!form) {
    return notFound();
  }

  return <ClientForm form={form} />
}
