"use server";

import * as z from "zod";

export interface ContactFormState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

const ContactSchema = z.object({
  name: z.string().trim().min(1, { error: "Please enter your name." }),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  message: z
    .string()
    .trim()
    .min(10, { error: "Tell us a little more (at least 10 characters)." }),
});

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  // TODO: wire this up to a real inbox (e.g. Resend, Postmark) or a
  // support-desk integration. For now we just log it so nothing is lost.
  console.log("New contact message:", parsed.data);

  return { success: true };
}
