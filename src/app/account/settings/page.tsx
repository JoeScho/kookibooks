import type { Metadata } from "next";
import Link from "next/link";
import { getUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Account settings" };

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Settings
      </h1>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-sm font-semibold text-ink">Profile</h2>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-ink-soft">Name</dt>
            <dd className="font-medium text-ink">
              {user?.user_metadata?.full_name ?? "—"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Email</dt>
            <dd className="font-medium text-ink">{user?.email}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-2 text-sm font-semibold text-ink">Password</h2>
        <p className="mb-3 text-sm text-ink-soft">
          Need to change your password? We'll email you a secure reset link.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-coral hover:underline"
        >
          Send reset link
        </Link>
      </div>
    </div>
  );
}
