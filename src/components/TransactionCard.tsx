"use client";

import Link from "next/link";
import { ChevronRight, Clock, ArrowUpRight } from "lucide-react";
import { Card, CardBody, Avatar, Badge } from "@/components/ui";
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
      <Card className="card-hover border border-base-content/5 group">
        <CardBody className="p-4 flex-row items-center gap-4">
          <div className="relative">
            <Avatar name={userName} size="md" />
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-base-100 ${
                isRio ? "bg-primary" : "bg-secondary"
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate">{userName}</span>
              <Badge variant={isRio ? "primary" : "secondary"} size="xs">
                {isRio ? "Rio" : "Zahra"}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-base-content/50">
              <Clock className="w-3 h-3" />
              <span className="text-xs">
                {formatDate(transaction.created_at)} •{" "}
                {formatTime(transaction.created_at)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-bold text-success text-lg">
                +{formatCurrency(transaction.amount)}
              </p>
              {transaction.notes && (
                <p className="text-xs text-base-content/50 truncate max-w-[100px]">
                  {transaction.notes}
                </p>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-base-200 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4 text-base-content/40 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </CardBody>
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
    <div className="space-y-3">
      {displayed.map((tx) => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
      {showViewAll && transactions.length > (limit || 0) && (
        <Link href="/transactions" className="block">
          <div className="p-4 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-primary font-semibold">
            <span>
              Lihat {transactions.length - (limit || 0)} Transaksi Lainnya
            </span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>
      )}
    </div>
  );
}
