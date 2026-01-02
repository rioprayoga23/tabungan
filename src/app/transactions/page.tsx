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
    <div className="min-h-screen bg-background">
      <Header
        title="Semua Transaksi"
        subtitle={`${filtered.length} transaksi`}
        backHref="/dashboard"
        maxWidth="3xl"
      />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Filter */}
        <Card className="block w-full">
          <Card.Content className="p-3 flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Semua
              </Button>
              <Button
                variant={filter === "rio" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("rio")}
                className="gap-2"
              >
                <Avatar className="w-5 h-5 border-primary">
                  <Avatar.Fallback className="bg-primary text-primary-foreground text-xs">
                    R
                  </Avatar.Fallback>
                </Avatar>
                Rio
              </Button>
              <Button
                variant={filter === "zahra" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter("zahra")}
                className="gap-2"
              >
                <Avatar className="w-5 h-5 border-secondary">
                  <Avatar.Fallback className="bg-secondary text-secondary-foreground text-xs">
                    Z
                  </Avatar.Fallback>
                </Avatar>
                Zahra
              </Button>
            </div>
          </Card.Content>
        </Card>

        {/* Transactions */}
        {filtered.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([date, txs]) => (
              <div key={date}>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary" />
                  {date}
                </p>
                <TransactionList transactions={txs} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="block w-full">
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
