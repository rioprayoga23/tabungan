"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { useAuthStore } from "@/store/auth.store";
import { Heart, Lock, User, Sparkles, ArrowRight } from "lucide-react";
import { Card, Button, Input, Alert, Text, Loading } from "@/components/ui";

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
    <main className="fixed inset-0 grid place-items-center p-4 overflow-auto bg-background">
      {/* Retro grid pattern background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />

        {/* Decorative shapes - responsive sizes */}
        <div className="absolute top-10 left-4 sm:top-20 sm:left-20 w-16 h-16 sm:w-24 md:w-32 sm:h-24 md:h-32 border-4 border-primary bg-primary/20 animate-float" />
        <div
          className="absolute bottom-16 right-4 sm:bottom-20 sm:right-20 w-14 h-14 sm:w-20 md:w-24 sm:h-20 md:h-24 border-4 border-secondary bg-secondary/20 rotate-12 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/4 right-8 sm:top-1/3 sm:right-1/4 w-10 h-10 sm:w-12 md:w-16 sm:h-12 md:h-16 border-4 border-accent bg-accent/20 rotate-45 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 left-8 sm:bottom-1/3 sm:left-16 w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 border-4 border-success bg-success/20 -rotate-6 animate-float"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="hidden sm:block absolute top-16 right-1/3 w-8 h-8 md:w-12 md:h-12 border-3 border-primary bg-primary/30 rotate-45 animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="hidden sm:block absolute top-1/2 left-8 md:left-16 w-10 h-10 md:w-14 md:h-14 border-3 border-secondary bg-secondary/30 rotate-12 animate-float"
          style={{ animationDelay: "2.5s" }}
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center max-w-sm sm:max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 border-4 border-border bg-primary mb-3 sm:mb-4 shadow-lg relative">
            <Heart
              className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground"
              fill="currentColor"
            />
            <div className="absolute -right-1.5 -top-1.5 sm:-right-2 sm:-top-2 w-5 h-5 sm:w-6 sm:h-6 border-2 border-border bg-success flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success-foreground" />
            </div>
          </div>
          <Text
            as="h1"
            className="text-gradient-primary mb-1 text-2xl sm:text-3xl md:text-4xl"
          >
            Tabungan Bersama
          </Text>
          <p className="text-muted-foreground flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
            <span className="w-5 h-0.5 sm:w-6 bg-primary" />
            Rio & Zahra
            <span className="w-5 h-0.5 sm:w-6 bg-secondary" />
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <Card.Content className="p-4 sm:p-6">
            <div className="text-center mb-4 sm:mb-5">
              <Text as="h3" className="text-lg sm:text-xl">
                Selamat Datang! 👋
              </Text>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Masuk untuk melanjutkan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold flex items-center gap-2">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  Username
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && <Alert variant="error">{error}</Alert>}

              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loading size="sm" />
                    <span>Memuat...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </Card.Content>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4 sm:mt-6 font-medium">
          Dibuat dengan{" "}
          <Heart
            className="inline w-3 h-3 text-destructive"
            fill="currentColor"
          />{" "}
          untuk masa depan kita
        </p>
      </div>
    </main>
  );
}
