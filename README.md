# 💕 Tabungan Bersama - Rio & Zahra

Aplikasi tabungan bersama.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)

## ✨ Fitur

### 🔐 Authentication

- Login dengan username & password
- Session management dengan Zustand

### 📊 Dashboard

- Total tabungan bersama
- Total masing-masing (Rio & Zahra)
- Transaksi terkini dengan progress bar
- Download Excel seluruh data

### 📤 Upload Bukti Transfer

- Upload foto bukti transfer
- Input jumlah dengan format rupiah
- Catatan opsional
- Preview gambar sebelum submit

### 🎯 Rencana Tabungan

- Set target tabungan
- Set tanggal target
- Saran tabungan bulanan otomatis
- Saran per orang (berdua)
- Progress tracker

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS 4
- **State**: Zustand (persisted)
- **Icons**: Lucide React
- **Excel**: SheetJS (xlsx)

## 📁 Struktur Folder

```
src/
├── actions/              # Server Actions
│   ├── auth/
│   ├── transaction/
│   └── savings-plan/
├── app/                  # Pages (App Router)
│   ├── dashboard/
│   ├── upload/
│   ├── plan/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/                  # Library configs
│   └── supabase/
│       ├── client.ts     # Browser client
│       └── server.ts     # Server client
├── services/             # Server-only services
│   ├── base/
│   ├── auth/
│   ├── transaction/
│   ├── storage/
│   └── savings-plan/
├── store/                # Zustand stores
│   └── auth.store.ts
└── types/                # TypeScript types
    └── database.ts
```

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd tabungan
npm install
```

### 2. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan SQL di `supabase-schema.sql` via SQL Editor
3. Buat Storage Bucket `transfer-proofs`:
   - Storage → New Bucket → `transfer-proofs` → Public

### 3. Environment Variables

Buat file `.env.local`:

```env
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

# Anon Key (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Service Role Key (private)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

> Lihat `env.example.md` untuk panduan lengkap

### 4. Buat User Pertama

Karena app ini private, buat user via Supabase Dashboard:

1. **Authentication → Users → Add User**

   - Email: `rio@tabungan.local`
   - Password: (password kamu)
   - Auto Confirm: ✅

2. **Table Editor → users → Insert Row**
   - id: (copy dari auth user)
   - username: `rio`
   - name: `Rio`

Ulangi untuk user kedua (Zahra).

### 5. Run Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📱 Responsive Design

App ini fully responsive:

- **Mobile**: Touch-friendly, compact layout
- **Tablet**: Balanced spacing
- **Desktop**: Full feature display

## 🎨 Design System

- **Colors**: Indigo primary, Emerald accent, Rose secondary
- **Glass Morphism**: Blur effects & transparency
- **Animations**: Smooth transitions & micro-interactions
- **Dark Mode**: Auto-detect system preference

## 📝 API Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │ ──▶ │   Actions   │ ──▶ │  Services   │
│  Components │     │ (use server)│     │ (use server)│
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │  Supabase   │
                                        │   Server    │
                                        └─────────────┘
```

- **Components**: React Client Components
- **Actions**: Server Actions sebagai bridge
- **Services**: Business logic & database operations
- **Supabase**: Rest API & Realtime

## 🔒 Security

- Service Role Key hanya di server
- Row Level Security (RLS) enabled
- Input validation di server
- File type & size validation

## 📄 License

MIT License - Rio & Zahra © 2026
