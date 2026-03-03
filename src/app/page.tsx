"use client";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import LoginForm from "@/components/Login/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthRedirect } from "@/helpers/funciones/useAuthRedirect";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const { isChecking } = useAuthRedirect();

  if (isChecking) {
    return <FullScreenLoader />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Ganaderia.png"
          alt="Campo agrícola"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-20"
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-700">
              El Sembrador FDN
            </CardTitle>
            <CardDescription>
              Accede a tu cuenta para gestionar tus servicios agrícolas
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center space-y-2">
            <Link
              href="/reset-password"
              className="text-green-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <div className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/register"
                className="text-green-600 p-0 h-auto hover:underline"
              >
                Regístrate aquí
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
