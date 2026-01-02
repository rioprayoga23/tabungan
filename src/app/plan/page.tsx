"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  Target,
  Calendar,
  Sparkles,
  Rocket,
  Users,
  Coins,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { fetchSavingsPlan, saveSavingsPlan } from "@/actions/savings-plan";
import type { SavingsPlanWithSuggestion } from "@/services/savings-plan";
import {
  Card,
  Button,
  Input,
  Alert,
  Progress,
  Text,
  Loading,
  LoadingOverlay,
} from "@/components/ui";
import { Header } from "@/components";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
const formatAmount = (v: string) =>
  v.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function PlanPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [plan, setPlan] = useState<SavingsPlanWithSuggestion | null>(null);
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<{
    monthly: number;
    months: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }
    load();
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!targetAmount || !targetDate) {
      setPreview(null);
      return;
    }
    const t = parseInt(targetAmount.replace(/\./g, ""), 10);
    const now = new Date(),
      end = new Date(targetDate);
    const months = Math.max(
      1,
      (end.getFullYear() - now.getFullYear()) * 12 +
        end.getMonth() -
        now.getMonth()
    );
    const remaining = Math.max(0, t - (plan?.currentSavings || 0));
    setPreview({ monthly: Math.ceil(remaining / months), months });
  }, [targetAmount, targetDate, plan]);

  const load = async () => {
    setIsLoading(true);
    const res = await fetchSavingsPlan();
    if (res.success && res.data) {
      setPlan(res.data);
      setTargetAmount(formatAmount(res.data.target_amount.toString()));
      setTargetDate(res.data.target_date);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    const num = parseInt(targetAmount.replace(/\./g, ""), 10);
    if (!num || !targetDate) {
      setError("Lengkapi form");
      setIsSaving(false);
      return;
    }
    const res = await saveSavingsPlan({ targetAmount: num, targetDate });
    if (res.success) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } else setError(res.error || "Gagal");
    setIsSaving(false);
  };

  const minDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  if (!mounted || !isAuthenticated) return null;
  if (isLoading) return <LoadingOverlay message="Memuat rencana..." />;

  if (success)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="block max-w-sm w-full shadow-xl">
          <div className="bg-success p-8 text-center text-success-foreground border-2 border-border">
            <div className="w-24 h-24 border-4 border-success-foreground flex items-center justify-center mx-auto mb-4 animate-bounce-in">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <Text as="h2">Berhasil! 🎯</Text>
            <p className="opacity-80 mt-2">Rencana tersimpan</p>
          </div>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Header title="Rencana Tabungan" backHref="/dashboard" maxWidth="2xl" />

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Progress Card */}
        {plan && (
          <Card className="block w-full shadow-xl">
            <div className="bg-primary p-4 sm:p-6 text-primary-foreground border-2 border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-primary-foreground/30 flex items-center justify-center">
                    <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm opacity-70 font-bold uppercase tracking-wide">
                      Terkumpul
                    </p>
                    <p className="text-base sm:text-xl font-bold">
                      {formatCurrency(plan.currentSavings)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-4xl font-head font-bold">
                    {plan.progressPercentage}%
                  </span>
                  {plan.progressPercentage > 0 && (
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 inline ml-1" />
                  )}
                </div>
              </div>
              <Progress
                value={plan.progressPercentage}
                className="h-3 sm:h-4"
              />
              <p className="text-center text-xs sm:text-sm mt-3 opacity-70 font-medium">
                Target: {formatCurrency(plan.target_amount)}
              </p>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Target Amount */}
          <Card className="block w-full">
            <div className="h-2 bg-primary border-b-2 border-border" />
            <Card.Content className="p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-border bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    Target Tabungan
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Berapa yang ingin dikumpulkan?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg">Rp</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={targetAmount}
                  onChange={(e) =>
                    setTargetAmount(formatAmount(e.target.value))
                  }
                  placeholder="100.000.000"
                  className="text-lg sm:text-2xl font-bold"
                  required
                />
              </div>
            </Card.Content>
          </Card>

          {/* Date */}
          <Card className="block w-full">
            <div className="h-2 bg-secondary border-b-2 border-border" />
            <Card.Content className="p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-border bg-secondary flex items-center justify-center text-secondary-foreground flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    Target Tanggal
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Kapan target harus tercapai?
                  </p>
                </div>
              </div>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={minDate()}
                required
              />
            </Card.Content>
          </Card>

          {/* Preview */}
          {preview && (
            <Card className="block w-full border-2 border-primary shadow-lg">
              <div className="bg-primary/10 p-4 sm:p-5 border-b-2 border-border">
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 border-2 border-border bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base sm:text-lg">
                      Rekomendasi Bulanan
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Untuk mencapai target dalam {preview.months} bulan
                    </p>
                    <p className="text-xl sm:text-2xl font-head font-bold text-primary mt-2">
                      {formatCurrency(preview.monthly)}
                      <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                        /bulan
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-card border-2 border-border p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-border bg-secondary flex items-center justify-center text-secondary-foreground flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Per orang (berdua)
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-primary">
                      {formatCurrency(preview.monthly / 2)}
                      <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                        /bulan
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 flex items-center gap-2 text-success font-bold text-sm sm:text-base">
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Target akan tercapai tepat waktu!</span>
                </div>
              </div>
            </Card>
          )}

          {error && <Alert variant="error">{error}</Alert>}

          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 text-center"
          >
            {isSaving ? (
              <>
                <Loading size="sm" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                <span>Simpan Rencana</span>
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
