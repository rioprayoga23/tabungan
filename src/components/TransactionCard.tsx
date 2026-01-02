"use client";

import Link from "next/link";
import { ChevronRight, Clock, ArrowUpRight } from "lucide-react";
import { Card, Avatar } from "@/components/ui";
import type { TransactionWithUser } from "@/types/database";

interface TransactionCardProps {
  transaction: TransactionWithUser;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export function TransactionCard({ transaction }: TransactionCardProps) {
  const userName = transaction.users?.name || "Unknown";
  const isRio = userName.toLowerCase().includes("rio");

  return (
    <Link href={`/transactions/${transaction.id}`}>
      <Card className="block w-full card-hover">
        <Card.Content className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Avatar
              className={`w-10 h-10 sm:w-14 sm:h-14 ${
                isRio ? "border-primary" : "border-secondary"
              }`}
            >
              <Avatar.Fallback
                className={`text-sm sm:text-base ${
                  isRio
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm sm:text-base truncate">
                {userName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-xs">
                  {formatDate(transaction.created_at)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right">
                <p className="font-bold text-success text-sm sm:text-lg">
                  +{formatCurrency(transaction.amount)}
                </p>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-border flex items-center justify-center bg-muted">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </Link>
  );
}

interface TransactionListProps {
  transactions: TransactionWithUser[];
  limit?: number;
  showViewAll?: boolean;
}

export function TransactionList({
  transactions,
  limit,
  showViewAll = false,
}: TransactionListProps) {
  const displayed = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="space-y-2 sm:space-y-3">
      {displayed.map((tx) => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
      {showViewAll && transactions.length > (limit || 0) && (
        <Link href="/transactions" className="block">
          <div className="p-3 sm:p-4 border-2 border-dashed border-primary bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 text-primary font-bold text-sm sm:text-base">
            <span>Lihat {transactions.length - (limit || 0)} Lainnya</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>
      )}
    </div>
  );
}
