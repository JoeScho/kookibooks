-- KookiBooks-previews: composited page images (background art + hero pose
-- cutout, see lib/composer.ts) produced during book generation and shown
-- in the free pre-purchase preview. Written server-side only (via the
-- admin/service-role client in app/api/generate-book/route.ts), but must
-- be publicly *readable* since <img> tags and the print-ready PDF
-- (lib/pdf.ts) both fetch these by public URL — same pattern as
-- KookiBooks-photos (see 0002_storage_policies.sql / 0003).
--
-- Run this against your Supabase project (SQL Editor, or `supabase db
-- push`), and create the "KookiBooks-previews" bucket itself via the
-- dashboard/CLI first if it doesn't already exist.

create policy "Anyone can read KookiBooks-previews"
  on storage.objects for select
  to public
  using (bucket_id = 'KookiBooks-previews');

-- No public insert policy: writes only ever happen via the service-role
-- admin client (lib/supabase/admin.ts), which bypasses RLS entirely.

update storage.buckets set public = true where name = 'KookiBooks-previews';
