import type { Metadata } from "next";
import "./globals.css";
import TanStackProvider from "@/providers/TanStackProvider";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { Raleway } from "next/font/google";
import ToastProvider from "@/components/generics/ToastProvider";

const poppins = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "El Sembrador | Agroservicios y Veterinaria",
    template: "%s | El Sembrador",
  },
  description:
    "Sistema de agroservicios y veterinaria para control de ganado, productos agropecuarios, razas, pesos promedio y gestión agrícola.",
  keywords: [
    "agroservicios",
    "veterinaria",
    "ganado",
    "razas bovinas",
    "peso promedio ganado",
    "agricultura",
    "agro veterinaria",
  ],
  authors: [{ name: "Carlos Alcerro" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={poppins.className}>
      <body>
        <TanStackProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
