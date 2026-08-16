"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { signUp } from "@/lib/auth/actions";

export function SignupForm() {
  const [state, action, pending] = useActionState(signUp, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-ink"
        >
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
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
          autoComplete="email"
          className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-coral"
        />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-ink"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-coral"
        />
        <p className="mt-1 text-xs text-ink-soft">At least 8 characters.</p>
        <FieldError errors={state.fieldErrors?.password} />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating your account…" : "Create account"}
      </Button>
    </form>
  );
}
