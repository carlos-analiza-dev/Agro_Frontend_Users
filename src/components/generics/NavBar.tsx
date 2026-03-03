import React, { useState } from "react";
import { Button } from "../ui/button";
import { Bell, LogOut, Menu, User } from "lucide-react";
import { navItems, navItemsVete } from "@/helpers/data/sidebarData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetNotificacionesAdmin from "@/hooks/notificaciones-admin/useGetNotificacionesAdmin";
import { Skeleton } from "../ui/skeleton";
import { ValidRoles } from "@/interfaces/auth/valid-roles.type";
import { useQueryClient } from "@tanstack/react-query";
import { checkNotification } from "@/apis/notificaciones_admins/acciones/recived-notificacion";
import { toast } from "react-toastify";
import { ResponseNotificacionesAdminInterface } from "@/apis/notificaciones_admins/interfaces/response-notififaciones-admin.interface";

interface Props {
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
}

const NavBar = ({ handleLogout, setMobileSidebarOpen }: Props) => {
  const { data: notificaciones = [], isLoading } = useGetNotificacionesAdmin();
  const queryClient = useQueryClient();
  const [visibleCount, setVisibleCount] = useState(5);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { user } = useAuthStore();

  const handleMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      setUpdatingId(id);
      await checkNotification(id);

      queryClient.setQueryData(
        ["notificaciones-admin"],
        (oldData: ResponseNotificacionesAdminInterface[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif,
          );
        },
      );

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["notificaciones-admin"] });
      }, 100);

      toast.success("Notificación marcada como leída");
    } catch (error) {
      toast.error("Ocurrió un error al marcar la notificación");
      queryClient.invalidateQueries({ queryKey: ["notificaciones-admin"] });
    } finally {
      setUpdatingId(null);
    }
  };

  const getNotificacionesNoLeidas = () => {
    return notificaciones.filter((n) => !n.read);
  };

  let menuItems = navItems;
  if (user?.role?.name === "Veterinario") {
    menuItems = navItemsVete;
  }
  const pathname = usePathname();

  const noLeidas = getNotificacionesNoLeidas().length;

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h2 className="ml-4 text-lg font-medium text-gray-900">
          {menuItems
            .flatMap((category) => category.items)
            .find((item) => item.href === pathname)?.name || "Dashboard"}
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        {user?.role.name === ValidRoles.Administrador &&
          (isLoading ? (
            <Skeleton className="size-6 shrink-0 rounded-full" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Bell className="h-4 w-4" />
                  {noLeidas > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                      {noLeidas > 99 ? "99+" : noLeidas}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-96 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div>
                    <p className="font-semibold text-sm">Notificaciones</p>
                    {noLeidas > 0 && (
                      <p className="text-xs text-gray-500">
                        {noLeidas} nueva{noLeidas !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>

                {noLeidas === 0 ? (
                  <div className="p-6 text-sm text-gray-500 text-center">
                    No tienes notificaciones nuevas
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {getNotificacionesNoLeidas()
                      .slice(0, visibleCount)
                      .map((notificacion) => (
                        <div
                          key={notificacion.id}
                          className="relative px-4 py-3 border-b last:border-b-0 bg-blue-50/40 hover:bg-gray-50 transition-colors"
                        >
                          <span className="absolute left-2 top-5 h-2 w-2 rounded-full bg-blue-600" />

                          <div className="ml-4">
                            <p className="text-sm font-semibold">
                              {notificacion.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {notificacion.message}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-2">
                              {new Date(notificacion.createdAt).toLocaleString(
                                "es-ES",
                              )}
                            </p>

                            <div className="mt-3 flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() =>
                                  handleMarkAsRead(notificacion.id)
                                }
                                disabled={updatingId === notificacion.id}
                              >
                                {updatingId === notificacion.id ? (
                                  <span className="flex items-center gap-1">
                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                                    Actualizando...
                                  </span>
                                ) : (
                                  "Marcar como Recibida"
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                    {getNotificacionesNoLeidas().length > visibleCount && (
                      <div className="border-t p-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 w-full"
                          onClick={handleMore}
                        >
                          Ver más (
                          {getNotificacionesNoLeidas().length - visibleCount}{" "}
                          restantes)
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {user && user?.profileImages?.length > 0 ? (
                  <AvatarImage
                    src={user.profileImages[0].url}
                    alt={`Perfil ${user.name}`}
                  />
                ) : (
                  <>
                    <AvatarImage src="/avatars/user.png" alt="Usuario" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.role.name}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default NavBar;
