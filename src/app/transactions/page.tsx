"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Receipt, Filter } from "lucide-react";
import { fetchDashboardSummary } from "@/actions/transaction";
import type { TransactionWithUser } from "@/types/database";
import { Card, Button, Avatar, LoadingOverlay } from "@/components/ui";
import { Header, TransactionList, EmptyState } from "@/components";

export default function TransactionsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [transactions, setTransactions] = useState<TransactionWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "rio" | "zahra">("all");
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
    if (res.success && res.data) setTransactions(res.data.recentTransactions);
    setIsLoading(false);
  };

  const filtered = transactions.filter((tx) => {
    if (filter === "all") return true;
    const name = tx.users?.name?.toLowerCase() || "";
    return name.includes(filter);
  });

  const groupedByDate = filtered.reduce((acc, tx) => {
    const date = new Date(tx.created_at).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {} as Record<string, TransactionWithUser[]>);

  if (!mounted || !isAuthenticated) return null;
  if (isLoading) return <LoadingOverlay message="Memuat transaksi..." />;

  return (
    <div className="min-h-screen gradient-mesh">
      <Header
        title="Semua Transaksi"
        subtitle={`${filtered.length} transaksi`}
        icon={<Receipt className="w-4 h-4" />}
        backHref="/dashboard"
      />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Filter */}
        <Card className="border border-base-content/5">
          <div className="p-3 flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-base-content/50 flex-shrink-0" />
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Semua
              </Button>
              <Button
                variant={filter === "rio" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilter("rio")}
                leftIcon={<Avatar name="Rio" size="xs" />}
              >
                Rio
              </Button>
              <Button
                variant={filter === "zahra" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter("zahra")}
                leftIcon={<Avatar name="Zahra" size="xs" />}
              >
                Zahra
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions */}
        {filtered.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([date, txs]) => (
              <div key={date}>
                <p className="section-title">{date}</p>
                <TransactionList transactions={txs} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="border border-base-content/5">
            <EmptyState
              icon={<Receipt className="w-8 h-8" />}
              title="Tidak ada transaksi"
              description={
                filter !== "all"
                  ? `Belum ada transaksi dari ${
                      filter === "rio" ? "Rio" : "Zahra"
                    }`
                  : "Belum ada transaksi"
              }
            />
          </Card>
        )}
      </main>
    </div>
  );
}
