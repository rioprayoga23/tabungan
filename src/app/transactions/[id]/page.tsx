"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Clock, FileText, ImageIcon, User, Calendar } from "lucide-react";
import { fetchTransactionById } from "@/actions/transaction";
import type { TransactionWithUser } from "@/types/database";
import { Card, Button, Avatar, LoadingOverlay } from "@/components/ui";
import { Header } from "@/components";
import Image from "next/image";

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
    const id = Number(params.id);
    if (!id || isNaN(id)) {
      setTransaction(null);
      setIsLoading(false);
      return;
    }
    const res = await fetchTransactionById(id);
    if (res.success && res.data) {
      setTransaction(res.data);
    } else {
      setTransaction(null);
    }
    setIsLoading(false);
  };

  if (!mounted || !isAuthenticated) return null;
  if (isLoading) return <LoadingOverlay message="Memuat detail..." />;

  if (!transaction) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          title="Detail Transaksi"
          backHref="/transactions"
          maxWidth="2xl"
        />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <Card className="block w-full">
            <Card.Content className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Transaksi tidak ditemukan
              </p>
              <Button
                variant="default"
                onClick={() => router.push("/transactions")}
              >
                Kembali
              </Button>
            </Card.Content>
          </Card>
        </main>
      </div>
    );
  }

  const userName = transaction.users?.name || "Unknown";
  const isRio = userName.toLowerCase().includes("rio");
  const date = new Date(transaction.created_at);

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Detail Transaksi"
        backHref="/transactions"
        maxWidth="2xl"
      />

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
        {/* Hero Amount Card */}
        <Card className="block w-full shadow-lg">
          <div
            className={`p-6 sm:p-8 text-center border-2 border-border ${
              isRio
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            <div className="flex justify-center mb-3">
              <Avatar className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-current">
                <Avatar.Fallback
                  className={`text-lg sm:text-xl ${
                    isRio
                      ? "bg-primary-foreground text-primary"
                      : "bg-secondary-foreground text-secondary"
                  }`}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar.Fallback>
              </Avatar>
            </div>
            <p className="font-bold text-sm sm:text-base mb-2 opacity-80">
              {userName}
            </p>
            <p className="text-3xl sm:text-4xl font-head font-bold">
              +{formatCurrency(transaction.amount)}
            </p>
            <p className="mt-3 opacity-70 flex items-center justify-center gap-2 text-xs sm:text-sm">
              <Calendar className="w-4 h-4" />
              {date.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card className="block w-full">
            <Card.Content className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-border bg-primary flex items-center justify-center text-primary-foreground">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-bold uppercase">
                    Dari
                  </p>
                  <p className="font-bold text-sm sm:text-base truncate">
                    {userName}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
          <Card className="block w-full">
            <Card.Content className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-border bg-secondary flex items-center justify-center text-secondary-foreground">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-bold uppercase">
                    Waktu
                  </p>
                  <p className="font-bold text-sm sm:text-base">
                    {date.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WIB
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Notes */}
        {transaction.notes && (
          <Card className="block w-full">
            <Card.Content className="p-3 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-border bg-accent flex items-center justify-center text-accent-foreground flex-shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-1">
                    Catatan
                  </p>
                  <p className="text-foreground text-sm sm:text-base">
                    {transaction.notes}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Image */}
        {transaction.image_url && (
          <Card className="block w-full">
            <Card.Content className="p-3 sm:p-5">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-border bg-success flex items-center justify-center text-success-foreground">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="font-bold text-sm sm:text-base">Bukti Transfer</p>
              </div>
              <div className="border-2 border-border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={transaction.image_url}
                  alt="Bukti transfer"
                  className="w-full h-auto object-contain"
                />
              </div>
            </Card.Content>
          </Card>
        )}
      </main>
    </div>
  );
}
