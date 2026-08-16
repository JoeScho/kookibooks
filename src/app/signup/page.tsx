import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Create your account" };

export default function SignupPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 book-shadow">
        <h1 className="font-display mb-1 text-2xl font-semibold text-ink">
          Create your account
        </h1>
        <p className="mb-6 text-sm text-ink-soft">
          Save your books, track orders, and check out faster next time.
        </p>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-coral hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </Container>
  );
}
