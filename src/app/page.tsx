"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { useAuthStore } from "@/store/auth.store";
import { Heart, Lock, User, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardBody, Button, Input, Alert } from "@/components/ui";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, setUser } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login({ username, password });
      if (result.success && result.data) {
        setUser(result.data);
        router.replace("/dashboard");
      } else {
        setError(result.error || "Login gagal");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;
  if (isAuthenticated) return null;

  return (
    <main className="min-h-screen flex items-center justify-center gradient-hero p-4 relative overflow-hidden">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 sm:w-[30rem] h-80 sm:h-[30rem] bg-secondary/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(oklch(var(--bc)/0.03)_1px,transparent_1px),linear-gradient(90deg,oklch(var(--bc)/0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary mb-6 shadow-2xl animate-pulse-glow relative">
            <Heart
              className="w-12 h-12 text-primary-content"
              fill="currentColor"
            />
            <div className="absolute -right-1 -top-1 w-6 h-6 rounded-full bg-success flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-success-content" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold mb-2">
            <span className="text-gradient-primary">Tabungan Bersama</span>
          </h1>
          <p className="text-base-content/60 flex items-center justify-center gap-2 text-lg">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
            Rio & Zahra
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-secondary/50" />
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border border-base-content/5 glass-card">
          <CardBody className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">Selamat Datang! 👋</h2>
              <p className="text-sm text-base-content/60">
                Masuk untuk melanjutkan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && <Alert variant="error">{error}</Alert>}

              <Button
                type="submit"
                variant="primary"
                block
                size="lg"
                loading={isLoading}
                className="shadow-glow animate-gradient bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%]"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Masuk
              </Button>
            </form>
          </CardBody>
        </Card>

        <p className="text-center text-sm text-base-content/40 mt-8">
          Dibuat dengan{" "}
          <Heart
            className="inline w-4 h-4 text-error animate-pulse"
            fill="currentColor"
          />{" "}
          untuk masa depan kita
        </p>
      </div>
    </main>
  );
}
