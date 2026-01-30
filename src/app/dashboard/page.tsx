"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import {
  Upload,
  Target,
  LogOut,
  FileDown,
  Coins,
  Wallet,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { fetchDashboardSummary } from "@/actions/transaction";
import { fetchSavingsPlan } from "@/actions/savings-plan";
import type { DashboardSummary } from "@/services/transaction";
import type { SavingsPlanWithSuggestion } from "@/services/savings-plan";
import {
  Card,
  Button,
  Avatar,
  Progress,
  Loading,
  LoadingOverlay,
} from "@/components/ui";
import { Header, TransactionList, EmptyState } from "@/components";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [plan, setPlan] = useState<SavingsPlanWithSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }
    load();
  }, [isAuthenticated, router]);

  const load = async () => {
    setIsLoading(true);
    const [summaryRes, planRes] = await Promise.all([
      fetchDashboardSummary(),
      fetchSavingsPlan(),
    ]);

    if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
    if (planRes.success && planRes.data) setPlan(planRes.data);
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleExport = async () => {
    if (!summary) return;
    setIsExporting(true);
    const data = summary.recentTransactions.map((tx) => ({
      Tanggal: new Date(tx.created_at).toLocaleDateString("id-ID"),
      Nama: tx.users?.name || "-",
      Jumlah: tx.amount,
      Catatan: tx.notes || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transaksi");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf]),
      `tabungan_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    setIsExporting(false);
  };

  if (!mounted || !isAuthenticated) return null;
  if (isLoading) return <LoadingOverlay message="Memuat dashboard..." />;

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Tabungan Bersama"
        subtitle={`Halo, ${user?.name}! 👋`}
        actions={
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            className="w-8 h-8 sm:w-10 sm:h-10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        }
      />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Hero Stats Card */}
        <section>
          <Card className="block w-full shadow-xl">
            <div className="bg-primary p-6 sm:p-8 text-primary-foreground border-2 border-border">
              <div className="w-full flex items-start justify-between mb-4">
                <div className="w-full">
                  <p className="text-primary-foreground/70 text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
                    <Coins className="w-4 h-4" />
                    Total Tabungan
                  </p>
                  <p className="text-3xl sm:text-4xl font-head font-bold mt-2">
                    {formatCurrency(summary?.totalSavings || 0)}
                  </p>
                  {plan && (
                    <div className="w-full mt-6 grid md:grid-cols-2 gap-3 relative z-10">
                      {/* Target Info */}
                      <div className="bg-accent/20 backdrop-blur-md rounded-lg p-3 sm:p-4 border-2 border-dashed border-accent/50 relative overflow-hidden group text-center">
                        <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-2 text-white text-xs font-bold uppercase tracking-wider">
                            <Target className="w-3 h-3" />
                            Target
                          </div>
                          <span className="font-mono font-bold text-xl sm:text-2xl text-blue-300 drop-shadow-sm break-words w-full">
                            {formatCurrency(plan.target_amount)}
                          </span>
                          <span className="text-xs text-white mt-1">
                            {new Date(plan.target_date).toLocaleDateString(
                              "id-ID",
                              {
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Remaining Info */}
                      {plan.remainingAmount > 0 ? (
                        <div className="bg-secondary/20 backdrop-blur-md rounded-lg p-3 sm:p-4 border-2 border-dashed border-secondary/50 relative overflow-hidden group text-center">
                          <div className="absolute inset-0 bg-secondary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-2 text-white text-xs font-bold uppercase tracking-wider">
                              <TrendingUp className="w-3 h-3" />
                              Kurang
                            </div>
                            <span className="font-mono font-bold text-xl sm:text-2xl text-yellow-300 drop-shadow-sm break-words w-full">
                              {formatCurrency(plan.remainingAmount)}
                            </span>
                            <span className="text-xs text-white mt-1">
                              Semangat!
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-success/20 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-success/30 flex items-center justify-center text-center">
                          <p className="font-bold text-white flex items-center gap-2 text-lg">
                            <span className="text-2xl">🎉</span>
                            Target Tercapai!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* <div className="flex items-center gap-1 bg-success text-success-foreground px-3 py-1.5 border-2 border-border text-xs font-bold">
                  <TrendingUp className="w-3 h-3" />
                  Semangat
                </div> */}
              </div>

              {/* User contributions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mt-6">
                {summary?.userSavings.map((u) => {
                  const isRio = u.name.toLowerCase().includes("rio");
                  const percentage = summary?.totalSavings
                    ? Math.round((u.total / summary.totalSavings) * 100)
                    : 0;
                  return (
                    <div
                      key={u.userId}
                      className="bg-card border-2 border-border p-3 sm:p-4 text-card-foreground flex flex-col items-center text-center"
                    >
                      <Avatar
                        className={`w-12 h-12 sm:w-16 sm:h-16 mb-2 ${
                          isRio ? "border-primary" : "border-secondary"
                        }`}
                      >
                        <Avatar.Fallback
                          className={`text-base sm:text-lg ${
                            isRio
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar>
                      <p className="font-bold text-sm sm:text-base">{u.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {percentage}% kontribusi
                      </p>
                      <p className="text-lg sm:text-xl font-bold mb-2">
                        {formatCurrency(u.total)}
                      </p>
                      <Progress
                        value={percentage}
                        className="h-2 sm:h-3 w-full [&>div]:bg-success"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary" />
            Menu
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Link href="/upload">
              <Card className="block w-full card-hover">
                <Card.Content className="items-center text-center p-3 sm:p-6">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 border-2 border-border bg-primary flex items-center justify-center text-primary-foreground mb-2 sm:mb-3 mx-auto">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <p className="font-bold text-xs sm:text-base">Upload</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Bukti Transfer
                  </p>
                </Card.Content>
              </Card>
            </Link>
            <Link href="/plan">
              <Card className="block w-full card-hover">
                <Card.Content className="items-center text-center p-3 sm:p-6">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 border-2 border-border bg-secondary flex items-center justify-center text-secondary-foreground mb-2 sm:mb-3 mx-auto">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <p className="font-bold text-xs sm:text-base">Rencana</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Target Tabungan
                  </p>
                </Card.Content>
              </Card>
            </Link>
            <Card
              className="block w-full card-hover cursor-pointer"
              onClick={handleExport}
            >
              <Card.Content className="items-center text-center p-3 sm:p-6">
                <div className="w-10 h-10 sm:w-14 sm:h-14 border-2 border-border bg-success flex items-center justify-center text-success-foreground mb-2 sm:mb-3 mx-auto">
                  {isExporting ? (
                    <Loading size="sm" />
                  ) : (
                    <FileDown className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>
                <p className="font-bold text-xs sm:text-base">
                  {isExporting ? "..." : "Export"}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Download Excel
                </p>
              </Card.Content>
            </Card>
          </div>
        </section>

        {/* Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="w-1 h-4 bg-primary" />
              Transaksi Terbaru
            </p>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" className="gap-1">
                Lihat Semua <ArrowUpRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          {summary?.recentTransactions &&
          summary.recentTransactions.length > 0 ? (
            <TransactionList
              transactions={summary.recentTransactions}
              limit={5}
            />
          ) : (
            <Card className="block w-full">
              <EmptyState
                icon={<Wallet className="w-8 h-8" />}
                title="Belum ada transaksi"
                description="Mulai dengan upload bukti transfer pertama kamu!"
                action={{
                  label: "Upload Sekarang",
                  onClick: () => router.push("/upload"),
                }}
              />
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
