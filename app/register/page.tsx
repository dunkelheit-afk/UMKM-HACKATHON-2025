// app/register/page.tsx
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Impor ikon

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

// Skema validasi Zod dengan pesan dalam Bahasa Indonesia
const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Nama lengkap minimal 2 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
  confirmPassword: z.string().min(6, { message: "Konfirmasi password minimal 6 karakter." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok.",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        toast({
            title: "Pendaftaran Gagal",
            description: result.error || "Terjadi kesalahan yang tidak diketahui.",
            variant: "destructive",
        });
    } else {
        toast({
            title: "Pendaftaran Berhasil!",
            description: "Silakan periksa email Anda untuk verifikasi akun.",
            variant: "default",
        });
        // Arahkan ke halaman login setelah berhasil mendaftar
        router.push('/login');
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: `url('/bsvbg.jpg')` }}
    >
      <Card
        className="relative w-full max-w-md space-y-8 p-8 shadow-lg rounded-2xl
                   transition-all duration-700 ease-out hover:shadow-xl hover:scale-[1.01] hover:ring-4 hover:ring-purple-300 hover:ring-offset-2 hover:ring-offset-gray-50
                   animate-in fade-in zoom-in-50"
      >
        {/* === TOMBOL KEMBALI BARU === */}
        <Link href="/" className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Kembali ke halaman utama</span>
          </Button>
        </Link>
        {/* ========================== */}

        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-900">
            Buat Akun Anda
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-gray-600">
            Daftar untuk memulai perjalanan Anda dengan Digi<span className="text-purple-600">UM</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
                <Label htmlFor="email">Alamat Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Daftar
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Atau lanjutkan dengan
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 2.04-4.82 2.04-5.82 0-9.6-4.82-9.6-9.6s3.78-9.6 9.6-9.6c2.58 0 4.6.96 6.18 2.4l2.16-2.16C19.38 1.18 16.38 0 12.48 0 5.82 0 .12 5.7 .12 12.36s5.7 12.36 12.36 12.36c6.66 0 11.7-4.44 11.7-11.52 0-.78-.06-1.56-.18-2.34H12.48z"></path></svg>
            Daftar dengan Google
          </Button>

          <div className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Masuk
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
