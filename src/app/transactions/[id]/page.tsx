"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  Clock,
  FileText,
  ImageIcon,
  User,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { fetchDashboardSummary } from "@/actions/transaction";
import type { TransactionWithUser } from "@/types/database";
import {
  Card,
  CardBody,
  Button,
  Badge,
  Avatar,
  LoadingOverlay,
} from "@/components/ui";
import { Header } from "@/components";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [transaction, setTransaction] = useState<TransactionWithUser | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }
    load();
  }, [isAuthenticated, router, params.id]);

  const load = async () => {
    setIsLoading(true);
    const res = await fetchDashboardSummary();
    if (res.success && res.data) {
      const tx = res.data.recentTransactions.find(
        (t) => t.id === Number(params.id)
      );
      setTransaction(tx || null);
    }
    setIsLoading(false);
  };

  if (!mounted || !isAuthenticated) return null;
  if (isLoading) return <LoadingOverlay message="Memuat detail..." />;

  if (!transaction) {
    return (
      <div className="min-h-screen gradient-mesh">
        <Header title="Detail Transaksi" backHref="/transactions" />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <Card className="border border-base-content/5">
            <CardBody className="text-center py-12">
              <p className="text-base-content/50 mb-4">
                Transaksi tidak ditemukan
              </p>
              <Button
                variant="primary"
                onClick={() => router.push("/transactions")}
              >
                Kembali
              </Button>
            </CardBody>
          </Card>
        </main>
      </div>
    );
  }

  const userName = transaction.users?.name || "Unknown";
  const isRio = userName.toLowerCase().includes("rio");
  const date = new Date(transaction.created_at);

  return (
    <div className="min-h-screen gradient-mesh">
      <Header title="Detail Transaksi" backHref="/transactions" />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Hero Amount Card */}
        <Card className="border-0 shadow-glow overflow-hidden">
          <div
            className={`p-8 text-center ${
              isRio
                ? "bg-gradient-to-br from-primary to-secondary"
                : "bg-gradient-to-br from-secondary to-accent"
            } text-primary-content relative`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
            <div className="relative">
              <div className="flex justify-center mb-4">
                <Avatar
                  name={userName}
                  size="lg"
                  className="ring-4 ring-white/20"
                />
              </div>
              <Badge className="bg-white/20 border-0 text-white mb-3">
                {userName}
              </Badge>
              <p className="stat-value-lg sm:text-5xl">
                +{formatCurrency(transaction.amount)}
              </p>
              <p className="mt-2 opacity-70 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                {date.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border border-base-content/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-base-content/50">Dari</p>
                  <p className="font-bold">{userName}</p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-base-content/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-base-content/50">Waktu</p>
                  <p className="font-bold">
                    {date.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WIB
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Notes */}
        {transaction.notes && (
          <Card className="border border-base-content/5">
            <CardBody className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-base-content/50 font-medium uppercase tracking-wide mb-1">
                    Catatan
                  </p>
                  <p className="text-base-content">{transaction.notes}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Image */}
        {transaction.image_url && (
          <Card className="border border-base-content/5 overflow-hidden">
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center text-info">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <p className="font-bold">Bukti Transfer</p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={transaction.image_url}
                  alt="Bukti transfer"
                  className="w-full h-auto object-cover"
                />
              </div>
            </CardBody>
          </Card>
        )}
      </main>
    </div>
  );
}
