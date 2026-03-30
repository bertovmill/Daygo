-- Allow authenticated users to upload meal images under their own folder
CREATE POLICY "Users can upload meal images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'food-images'
  AND (storage.foldername(name))[1] = 'meals'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow authenticated users to update (replace) their own meal images
CREATE POLICY "Users can update meal images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'food-images'
  AND (storage.foldername(name))[1] = 'meals'
  AND (storage.foldername(name))[2] = auth.uid()::text
);
