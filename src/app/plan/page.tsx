"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  Target,
  Calendar,
  Check,
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
  CardBody,
  Button,
  Input,
  Alert,
  ProgressBar,
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
      <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
        <Card className="shadow-2xl max-w-sm w-full border-0 overflow-hidden">
          <div className="bg-gradient-to-br from-success to-primary p-8 text-center text-success-content">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Berhasil! 🎯</h2>
            <p className="opacity-80">Rencana tersimpan</p>
          </div>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen gradient-mesh">
      <Header
        title="Rencana Tabungan"
        icon={<Target className="w-4 h-4" />}
        backHref="/dashboard"
      />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Progress Card */}
        {plan && (
          <Card className="border-0 shadow-glow overflow-hidden">
            <div className="bg-gradient-to-br from-primary via-primary to-secondary p-6 text-primary-content relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Coins className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm opacity-70">Terkumpul</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(plan.currentSavings)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-extrabold">
                      {plan.progressPercentage}%
                    </span>
                    {plan.progressPercentage > 0 && (
                      <TrendingUp className="w-5 h-5 inline ml-1" />
                    )}
                  </div>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${plan.progressPercentage}%` }}
                  />
                </div>
                <p className="text-center text-sm mt-3 opacity-70">
                  Target: {formatCurrency(plan.target_amount)}
                </p>
              </div>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Target Amount */}
          <Card className="border border-base-content/5 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary to-secondary" />
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl icon-box-solid flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Target Tabungan</h3>
                  <p className="text-xs text-base-content/50">
                    Berapa yang ingin dikumpulkan?
                  </p>
                </div>
              </div>
              <Input
                leftAddon="Rp"
                type="text"
                inputMode="numeric"
                value={targetAmount}
                onChange={(e) => setTargetAmount(formatAmount(e.target.value))}
                placeholder="100.000.000"
                className="text-2xl font-bold"
                required
              />
            </CardBody>
          </Card>

          {/* Date */}
          <Card className="border border-base-content/5 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-warning to-error" />
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warning to-error flex items-center justify-center text-warning-content shadow-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Target Tanggal</h3>
                  <p className="text-xs text-base-content/50">
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
            </CardBody>
          </Card>

          {/* Preview */}
          {preview && (
            <Card className="border-2 border-primary shadow-glow overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-5">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl icon-box-solid flex items-center justify-center shadow-lg animate-pulse-glow">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">Rekomendasi Bulanan</p>
                    <p className="text-sm text-base-content/60">
                      Untuk mencapai target dalam {preview.months} bulan
                    </p>
                    <p className="text-3xl font-extrabold text-gradient-primary mt-2">
                      {formatCurrency(preview.monthly)}
                      <span className="text-base text-base-content/50 font-normal">
                        /bulan
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-base-100 rounded-2xl p-4 flex items-center gap-4 shadow-soft">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-secondary-content shadow-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-base-content/60">
                      Per orang (berdua)
                    </p>
                    <p className="text-xl font-bold text-gradient-primary">
                      {formatCurrency(preview.monthly / 2)}
                      <span className="text-sm text-base-content/50 font-normal">
                        /bulan
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-success font-semibold">
                  <Rocket className="w-5 h-5" />
                  <span>Target akan tercapai tepat waktu!</span>
                </div>
              </div>
            </Card>
          )}

          {error && <Alert variant="error">{error}</Alert>}

          <Button
            type="submit"
            variant="primary"
            block
            size="lg"
            loading={isSaving}
            leftIcon={<Target className="w-5 h-5" />}
            className="shadow-glow"
          >
            Simpan Rencana
          </Button>
        </form>
      </main>
    </div>
  );
}
