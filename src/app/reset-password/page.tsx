"use client";
import { CambiarContraseña } from "@/apis/users/accions/update-password";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthRedirect } from "@/helpers/funciones/useAuthRedirect";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormData = {
  email: string;
  nuevaContrasena: string;
  confirmPassword: string;
};

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>();
  const { isChecking } = useAuthRedirect();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: CambiarContraseña,
    onSuccess: () => {
      toast.success("Contraseña cambiada exitosamente");
      reset();
      setTimeout(() => {
        router.push("/");
      }, 3000);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Error al cambiar la contraseña",
      );
    },
  });

  const onSubmit = (data: FormData) => {
    const { confirmPassword, ...payload } = data;
    mutation.mutate(payload);
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email) || "Por favor ingresa un correo válido";
  };

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
            <CardDescription>¿No recuerdas tu contraseña?</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@correo.com"
                  {...register("email", {
                    required: "El correo es requerido",
                    validate: validateEmail,
                  })}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nuevaContrasena">Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    id="nuevaContrasena"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("nuevaContrasena", {
                      required: "La contraseña es requerida",
                      minLength: {
                        value: 6,
                        message:
                          "La contraseña debe tener al menos 6 caracteres",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.nuevaContrasena && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.nuevaContrasena.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      required: "Por favor confirma tu contraseña",
                      validate: (value) =>
                        value === watch("nuevaContrasena") ||
                        "Las contraseñas no coinciden",
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Procesando..." : "Restablecer"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-between items-center space-y-2">
            <Link href="/register" className="text-green-600 hover:underline">
              Registrate
            </Link>

            <Link href="/" className="text-green-600 hover:underline">
              Iniciar Sesion
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
