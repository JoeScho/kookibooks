"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { submitContactForm } from "@/lib/contact-actions";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactForm, {});

  if (state.success) {
    return (
      <div className="rounded-2xl bg-mint p-6 text-mint-dark">
        <p className="font-semibold">Thanks — we've got your message!</p>
        <p className="mt-1 text-sm">We usually reply within one working day.</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-ink"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-coral"
        />
        <FieldError errors={state.fieldErrors?.name} />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-ink"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-coral"
        />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-ink"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-border bg-surface p-4 text-sm outline-none focus:border-coral"
        />
        <FieldError errors={state.fieldErrors?.message} />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
