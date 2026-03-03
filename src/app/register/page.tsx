"use client";

import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import FormRegister from "@/components/Login/FormRegister";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthRedirect } from "@/helpers/funciones/useAuthRedirect";

import Image from "next/image";

export default function RegisterPage() {
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
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-700">
              Registro en El Sembrador FDN
            </CardTitle>
            <CardDescription>
              Completa el formulario para crear tu cuenta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormRegister />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
