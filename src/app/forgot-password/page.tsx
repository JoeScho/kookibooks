import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 book-shadow">
        <h1 className="font-display mb-1 text-2xl font-semibold text-ink">
          Reset your password
        </h1>
        <p className="mb-6 text-sm text-ink-soft">
          Enter your email and we'll send you a link to set a new password.
        </p>
        <ForgotPasswordForm />
        <p className="mt-6 text-center text-sm text-ink-soft">
          <Link
            href="/login"
            className="font-medium text-coral hover:underline"
          >
            Back to log in
          </Link>
        </p>
      </div>
    </Container>
  );
}
