"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { requestPasswordReset } from "@/lib/auth/actions";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, {});
  const submitted =
    pending === false && state && !state.error && !state.fieldErrors;

  return (
    <form action={action} className="flex flex-col gap-4">
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
          autoComplete="email"
          className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-coral"
        />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send reset link"}
      </Button>
      {submitted && (
        <p className="text-sm text-mint-dark">
          If that email has an account, a reset link is on its way.
        </p>
      )}
    </form>
  );
}
