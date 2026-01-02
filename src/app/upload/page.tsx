"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  Upload,
  ImageIcon,
  FileText,
  Wallet,
  Check,
  X,
  Camera,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { addTransaction } from "@/actions/transaction";
import {
  Card,
  Button,
  Input,
  Textarea,
  Alert,
  Text,
  Loading,
} from "@/components/ui";
import { Header } from "@/components";
import Image from "next/image";

export default function UploadPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Hanya JPG, PNG, WebP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Maksimal 5MB");
      return;
    }
    setImageFile(file);
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatAmount = (v: string) =>
    v.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const num = parseInt(amount.replace(/\./g, ""), 10);
    if (!num || num <= 0) {
      setError("Jumlah tidak valid");
      setIsLoading(false);
      return;
    }
    const fd = new FormData();
    fd.append("userId", String(user?.id || ""));
    fd.append("amount", num.toString());
    fd.append("notes", notes);
    if (imageFile) fd.append("image", imageFile);
    const res = await addTransaction(fd);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } else setError(res.error || "Gagal");
    setIsLoading(false);
  };

  if (!mounted || !isAuthenticated) return null;

  if (success)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="block max-w-sm w-full shadow-xl">
          <div className="bg-success p-8 text-center text-success-foreground border-2 border-border">
            <div className="w-24 h-24 border-4 border-success-foreground flex items-center justify-center mx-auto mb-4 animate-bounce-in">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <Text as="h2">Berhasil! 🎉</Text>
            <p className="opacity-80 mt-2">Transaksi tersimpan</p>
          </div>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Header title="Upload Bukti" backHref="/dashboard" maxWidth="2xl" />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount Card */}
          <Card className="block w-full">
            <div className="h-2 bg-primary border-b-2 border-border" />
            <Card.Content className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border-2 border-border bg-primary flex items-center justify-center text-primary-foreground">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Jumlah Transfer</h3>
                  <p className="text-xs text-muted-foreground">
                    Masukkan nominal
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Rp</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(formatAmount(e.target.value))}
                  placeholder="0"
                  className="text-2xl font-bold"
                  required
                />
              </div>
              {amount && (
                <div className="mt-3 flex items-center gap-2 text-sm font-bold bg-success/20 text-success px-3 py-2 border-2 border-border">
                  <Sparkles className="w-4 h-4" />
                  <span>Rp {amount} akan ditambahkan ke tabungan</span>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Image Card */}
          <Card className="block w-full">
            <div className="h-2 bg-secondary border-b-2 border-border" />
            <Card.Content className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border-2 border-border bg-secondary flex items-center justify-center text-secondary-foreground">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Bukti Transfer</h3>
                  <p className="text-xs text-muted-foreground">Opsional</p>
                </div>
              </div>
              {imagePreview ? (
                <div className="relative border-2 border-border overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt=""
                    width={600}
                    height={300}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute top-3 right-3 bg-destructive text-destructive-foreground"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-success font-bold bg-card px-2 py-1 border-2 border-border">
                    <Check className="w-4 h-4" />
                    Gambar dipilih
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-border p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-primary hover:bg-primary/10 transition-all group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 border-2 border-border bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <Camera className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold">Tap untuk upload</p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WebP (max 5MB)
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </Card.Content>
          </Card>

          {/* Notes Card */}
          <Card className="block w-full">
            <div className="h-2 bg-accent border-b-2 border-border" />
            <Card.Content className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border-2 border-border bg-accent flex items-center justify-center text-accent-foreground">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Catatan</h3>
                  <p className="text-xs text-muted-foreground">Opsional</p>
                </div>
              </div>
              <Textarea
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNotes(e.target.value)
                }
                placeholder="Contoh: Tabungan bulan Januari..."
                className="min-h-[100px]"
              />
            </Card.Content>
          </Card>

          {error && <Alert variant="error">{error}</Alert>}

          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loading size="sm" className="mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Simpan Transaksi
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
