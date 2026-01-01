-- 1. TABEL USERS
-- Menyimpan data profil user (Rio & Zahra)
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABEL TRANSACTIONS
-- Menyimpan semua transaksi tabungan
CREATE TABLE IF NOT EXISTS public.transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL CHECK (amount > 0),
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL SAVINGS_PLANS
-- Menyimpan target dan rencana tabungan
CREATE TABLE IF NOT EXISTS public.savings_plans (
  id BIGSERIAL PRIMARY KEY,
  target_amount BIGINT NOT NULL CHECK (target_amount > 0),
  target_date DATE NOT NULL,
  monthly_suggestion BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES UNTUK PERFORMA
-- ============================================

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (if any)
DROP POLICY IF EXISTS "Allow all access to users" ON public.users;
DROP POLICY IF EXISTS "Allow all access to transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow all access to savings_plans" ON public.savings_plans;

-- Policy untuk akses publik (karena kita tidak pakai Supabase Auth)
-- Users
CREATE POLICY "Allow all access to users" 
  ON public.users FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Transactions
CREATE POLICY "Allow all access to transactions" 
  ON public.transactions FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Savings Plans
CREATE POLICY "Allow all access to savings_plans" 
  ON public.savings_plans FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- ============================================
-- TRIGGERS UNTUK AUTO UPDATE updated_at
-- ============================================

-- Function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk users
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk transactions
DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk savings_plans
DROP TRIGGER IF EXISTS update_savings_plans_updated_at ON public.savings_plans;
CREATE TRIGGER update_savings_plans_updated_at
  BEFORE UPDATE ON public.savings_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA - Buat User Awal
-- ============================================
-- Password plain text untuk development
-- Untuk production, gunakan bcrypt atau hashing

INSERT INTO public.users (username, password, name) VALUES
  ('rio', 'password123', 'Rio'),
  ('zahra', 'password123', 'Zahra')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- QUERY UNTUK CEK DATA
-- ============================================
-- SELECT * FROM public.users;
-- SELECT * FROM public.transactions;
-- SELECT * FROM public.savings_plans;
