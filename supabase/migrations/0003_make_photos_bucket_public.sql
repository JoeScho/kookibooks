-- The bucket's own "public" flag is a separate switch from the RLS
-- policies added in 0002 — RLS governs read/write on storage.objects rows;
-- this flag governs whether the CDN-style /storage/v1/object/public/...
-- URL (what getPublicUrl() returns, and what fal.ai fetches as the
-- reference image) resolves at all. Without it, that endpoint 404s with
-- "Bucket not found" regardless of any RLS policy.
update storage.buckets set public = true where name = 'KookiBooks-photos';
