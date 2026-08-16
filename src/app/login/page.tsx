import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage(props: PageProps<"/login">) {
  const params = await props.searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 book-shadow">
        <h1 className="font-display mb-1 text-2xl font-semibold text-ink">
          Welcome back
        </h1>
        <p className="mb-6 text-sm text-ink-soft">
          Log in to see your orders and saved books.
        </p>
        <LoginForm next={next} />
        <p className="mt-6 text-center text-sm text-ink-soft">
          <Link
            href="/forgot-password"
            className="font-medium text-coral hover:underline"
          >
            Forgot your password?
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-ink-soft">
          New here?{" "}
          <Link
            href="/signup"
            className="font-medium text-coral hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </Container>
  );
}
