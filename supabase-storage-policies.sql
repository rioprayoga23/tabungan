-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;
DROP POLICY IF EXISTS "Public access for transfer proofs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own uploads" ON storage.objects;

-- Storage Policy - INSERT (upload)
CREATE POLICY "Anyone can upload" 
  ON storage.objects FOR INSERT 
  TO public 
  WITH CHECK (bucket_id = 'bukti-transfer');

-- Storage Policy - SELECT (view/download)
CREATE POLICY "Public access for transfer proofs" 
  ON storage.objects FOR SELECT 
  TO public 
  USING (bucket_id = 'bukti-transfer');

-- Storage Policy - DELETE
CREATE POLICY "Anyone can delete uploads" 
  ON storage.objects FOR DELETE 
  TO public 
  USING (bucket_id = 'bukti-transfer');
