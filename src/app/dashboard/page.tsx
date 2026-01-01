"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import {
  Heart,
  Upload,
  Target,
  LogOut,
  FileDown,
  Coins,
  Wallet,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { fetchDashboardSummary } from "@/actions/transaction";
import type { DashboardSummary } from "@/services/transaction";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  Badge,
  ProgressBar,
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
    const res = await fetchDashboardSummary();
    if (res.success && res.data) setSummary(res.data);
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
      `tabungan_${new Date().toISOString().split("T")[0]}.xlsx`
    );
    setIsExporting(false);
  };

  if (!mounted || !isAuthenticated) return null;
  if (isLoading) return <LoadingOverlay message="Memuat dashboard..." />;

  return (
    <div className="min-h-screen gradient-mesh">
      <Header
        title="Tabungan Bersama"
        subtitle={`Halo, ${user?.name}! 👋`}
        icon={<Heart className="w-4 h-4" fill="currentColor" />}
        actions={
          <Button variant="ghost" circle onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        }
      />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Hero Stats Card */}
        <section>
          <Card className="overflow-hidden border-0 shadow-glow">
            <div className="bg-gradient-to-br from-primary via-primary to-secondary p-6 sm:p-8 text-primary-content relative">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08)_0%,transparent_40%)]" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-primary-content/70 text-sm font-medium flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      Total Tabungan
                    </p>
                    <p className="stat-value-lg sm:text-4xl mt-1">
                      {formatCurrency(summary?.totalSavings || 0)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-success/20 text-success-content px-3 py-1.5 rounded-full text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    Aktif
                  </div>
                </div>

                {/* User contributions */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {summary?.userSavings.map((u) => {
                    const isRio = u.name.toLowerCase().includes("rio");
                    const percentage = summary?.totalSavings
                      ? Math.round((u.total / summary.totalSavings) * 100)
                      : 0;
                    return (
                      <div
                        key={u.userId}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar name={u.name} size="md" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{u.name}</p>
                            <p className="text-xs text-primary-content/70">
                              {percentage}% kontribusi
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold">
                          {formatCurrency(u.total)}
                        </p>
                        <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isRio ? "bg-white" : "bg-secondary-content"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <p className="section-title">Menu Cepat</p>
          <div className="grid grid-cols-3 gap-4">
            <Link href="/upload">
              <Card className="card-hover group border border-base-content/5">
                <CardBody className="items-center p-5 sm:p-6">
                  <div className="w-14 h-14 rounded-2xl icon-box-solid flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-sm sm:text-base">Upload</p>
                  <p className="text-xs text-base-content/50 hidden sm:block">
                    Bukti Transfer
                  </p>
                </CardBody>
              </Card>
            </Link>
            <Link href="/plan">
              <Card className="card-hover group border border-base-content/5">
                <CardBody className="items-center p-5 sm:p-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-secondary-content mb-3 group-hover:scale-110 transition-transform shadow-lg">
                    <Target className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-sm sm:text-base">Rencana</p>
                  <p className="text-xs text-base-content/50 hidden sm:block">
                    Target Tabungan
                  </p>
                </CardBody>
              </Card>
            </Link>
            <Card
              className="card-hover group border border-base-content/5 cursor-pointer"
              onClick={handleExport}
            >
              <CardBody className="items-center p-5 sm:p-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning to-error flex items-center justify-center text-warning-content mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  {isExporting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <FileDown className="w-6 h-6" />
                  )}
                </div>
                <p className="font-bold text-sm sm:text-base">
                  {isExporting ? "..." : "Export"}
                </p>
                <p className="text-xs text-base-content/50 hidden sm:block">
                  Download Excel
                </p>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className="section-title mb-0">Transaksi Terkini</p>
            <Link
              href="/transactions"
              className="btn btn-ghost btn-sm gap-1 text-primary"
            >
              Lihat Semua <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {summary?.recentTransactions &&
          summary.recentTransactions.length > 0 ? (
            <TransactionList
              transactions={summary.recentTransactions}
              limit={5}
            />
          ) : (
            <Card className="border border-base-content/5">
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
