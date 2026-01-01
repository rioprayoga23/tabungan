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
  CardBody,
  Button,
  Input,
  Textarea,
  Alert,
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
      <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
        <Card className="shadow-2xl max-w-sm w-full border-0 overflow-hidden">
          <div className="bg-gradient-to-br from-success to-primary p-8 text-center text-success-content">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Berhasil! 🎉</h2>
            <p className="opacity-80">Transaksi tersimpan</p>
          </div>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen gradient-mesh">
      <Header
        title="Upload Bukti"
        icon={<Upload className="w-4 h-4" />}
        backHref="/dashboard"
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount Card */}
          <Card className="border border-base-content/5 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary to-secondary" />
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl icon-box-solid flex items-center justify-center shadow-lg">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Jumlah Transfer</h3>
                  <p className="text-xs text-base-content/50">
                    Masukkan nominal
                  </p>
                </div>
              </div>
              <Input
                leftAddon="Rp"
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(formatAmount(e.target.value))}
                placeholder="0"
                className="text-2xl font-bold"
                required
              />
              {amount && (
                <div className="mt-3 flex items-center gap-2 text-sm text-success font-medium bg-success/10 px-3 py-2 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                  <span>Rp {amount} akan ditambahkan ke tabungan</span>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Image Card */}
          <Card className="border border-base-content/5 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-secondary to-accent" />
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-secondary-content shadow-lg">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Bukti Transfer</h3>
                  <p className="text-xs text-base-content/50">Opsional</p>
                </div>
              </div>
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={imagePreview}
                    alt=""
                    width={600}
                    height={300}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Button
                    variant="error"
                    circle
                    size="sm"
                    className="absolute top-3 right-3"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-sm">
                    <Check className="w-4 h-4 text-success" />
                    Gambar dipilih
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-base-300 rounded-2xl p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 rounded-2xl bg-base-200 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Camera className="w-7 h-7 text-base-content/50 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Tap untuk upload</p>
                    <p className="text-xs text-base-content/50">
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
            </CardBody>
          </Card>

          {/* Notes Card */}
          <Card className="border border-base-content/5 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-warning to-error" />
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warning to-error flex items-center justify-center text-warning-content shadow-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Catatan</h3>
                  <p className="text-xs text-base-content/50">Opsional</p>
                </div>
              </div>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Tabungan bulan Januari..."
                className="min-h-[100px]"
              />
            </CardBody>
          </Card>

          {error && <Alert variant="error">{error}</Alert>}

          <Button
            type="submit"
            variant="primary"
            block
            size="lg"
            loading={isLoading}
            leftIcon={<Upload className="w-5 h-5" />}
            className="shadow-glow"
          >
            Simpan Transaksi
          </Button>
        </form>
      </main>
    </div>
  );
}
