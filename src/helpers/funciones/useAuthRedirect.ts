"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";

export function useAuthRedirect() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (token && user) {
      switch (user.role?.name) {
        case "Administrador":
          router.replace("/dashboard-admin");
          break;
        case "Secretario":
          router.replace("/secretary/dashboard");
          break;
        case "Veterinario":
          router.replace("/citas-veterinario");
          break;
        default:
          router.replace("/");
          break;
      }
    } else {
      setIsChecking(false);
    }
  }, [user, token, router]);

  return { isChecking };
}
