-- Storage RLS policies. A bucket's "Public" flag only controls whether
-- files can be *read* without auth — writes always go through row-level
-- security on storage.objects regardless, and there's no policy for that
-- by default. Book creation doesn't require login (guest checkout is
-- allowed), so uploads need to work for anonymous visitors too.

-- KookiBooks-photos: uploaded face photos, used as the fal.ai reference
-- image during book generation.
create policy "Anyone can upload to KookiBooks-photos"
  on storage.objects for insert
  to public
  with check (bucket_id = 'KookiBooks-photos');

create policy "Anyone can read KookiBooks-photos"
  on storage.objects for select
  to public
  using (bucket_id = 'KookiBooks-photos');

-- KookiBooks-pdfs: compiled print-ready PDFs. This bucket must stay
-- PRIVATE (no public read) — the app only ever accesses it via the
-- service-role admin client (lib/pdf.ts), which bypasses RLS entirely, so
-- no select/insert policy is granted to the public or authenticated roles
-- here. Nothing below this line for that bucket is intentional.
