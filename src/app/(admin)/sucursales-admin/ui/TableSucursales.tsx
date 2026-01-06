import { Sucursal } from "@/apis/sucursales/interfaces/response-sucursales.interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getTipoBadgeVariant,
  getTipoLabel,
} from "@/helpers/funciones/getTipos";
import {
  Building,
  CheckCircle,
  Edit,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import FormSucursal from "./FormSucursal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CrearSucursaleInterface } from "@/apis/sucursales/interfaces/crear-sucursale.interface";
import { EditarSucursal } from "@/apis/sucursales/accions/editar-sucursal";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { StatusMessage } from "@/components/generics/StatusMessage";

interface Props {
  isLoading: boolean;
  filteredSucursales: Sucursal[] | undefined;
}

const TableSucursales = ({ filteredSucursales, isLoading }: Props) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editSucursal, setEditSucursal] = useState<Sucursal | null>(null);
  const [sucursalEstado, setSucursalEstado] = useState<Sucursal | null>(null);
  const [isOpenEstadoDialog, setIsOpenEstadoDialog] = useState(false);

  const handleEditSucursal = (sucursal: Sucursal) => {
    setIsEdit(true);
    setIsOpen(true);
    setEditSucursal(sucursal);
  };

  const handleCambiarEstado = (sucursal: Sucursal) => {
    setSucursalEstado(sucursal);
    setIsOpenEstadoDialog(true);
  };

  const mutationCambiarEstado = useMutation({
    mutationFn: async (nuevoEstado: boolean) => {
      if (!sucursalEstado) return;

      const datosActualizacion: CrearSucursaleInterface = {
        nombre: sucursalEstado.nombre,
        tipo: sucursalEstado.tipo,
        direccion_complemento: sucursalEstado.direccion_complemento,
        municipioId: sucursalEstado.municipio.id,
        departamentoId: sucursalEstado.departamento.id,
        paisId: sucursalEstado.pais.id,
        gerenteId: sucursalEstado.gerente.id,
        isActive: nuevoEstado,
      };

      return await EditarSucursal(sucursalEstado.id, datosActualizacion);
    },
    onSuccess: () => {
      const accion = sucursalEstado?.isActive ? "desactivada" : "activada";
      toast.success(`Sucursal ${accion} exitosamente`);
      queryClient.invalidateQueries({ queryKey: ["sucursales"] });
      setIsOpenEstadoDialog(false);
      setSucursalEstado(null);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al cambiar el estado de la sucursal";
        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de cambiar el estado de la sucursal. Inténtalo de nuevo."
        );
      }
    },
  });

  const confirmarCambioEstado = () => {
    if (sucursalEstado) {
      mutationCambiarEstado.mutate(!sucursalEstado.isActive);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">Nombre</TableHead>
            <TableHead className="text-center font-bold">Tipo</TableHead>
            <TableHead className="text-center font-bold">Ubicación</TableHead>
            <TableHead className="text-center font-bold">Gerente</TableHead>
            <TableHead className="text-center font-bold">Contacto</TableHead>
            <TableHead className="text-center font-bold">Estado</TableHead>
            <TableHead className="text-center font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : filteredSucursales?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                <div className="flex justify-center py-4">
                  <StatusMessage type="empty" />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredSucursales?.map((sucursal) => (
              <TableRow key={sucursal.id}>
                <TableCell className="text-center">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    {sucursal.nombre}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={getTipoBadgeVariant(sucursal.tipo)}>
                    {getTipoLabel(sucursal.tipo)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div>{sucursal.municipio.nombre}</div>
                      <div className="text-muted-foreground">
                        {sucursal.departamento.nombre}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{sucursal.gerente.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="space-y-1 text-sm text-center">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {sucursal.gerente.telefono}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {sucursal.gerente.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={sucursal.isActive ? "default" : "secondary"}>
                    {sucursal.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-center items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Editar Sucursal"
                    onClick={() => handleEditSucursal(sucursal)}
                  >
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    title={
                      sucursal.isActive
                        ? "Desactivar Sucursal"
                        : "Activar Sucursal"
                    }
                    className="h-8 w-8"
                    onClick={() => handleCambiarEstado(sucursal)}
                    disabled={mutationCambiarEstado.isPending}
                  >
                    {sucursal.isActive ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent
          className="
    w-[95vw]
    max-w-lg
    max-h-[90vh]
    overflow-y-auto
    p-4
    sm:p-6
  "
        >
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Sucursal</AlertDialogTitle>
            <AlertDialogDescription>
              En esta sección podrás editar sucursales
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormSucursal
            onSucces={() => setIsOpen(false)}
            editSucursal={editSucursal}
            isEdit={isEdit}
            paisId={editSucursal?.pais.id || ""}
          />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isOpenEstadoDialog}
        onOpenChange={setIsOpenEstadoDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {sucursalEstado?.isActive ? "Desactivar" : "Activar"} Sucursal
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas{" "}
              {sucursalEstado?.isActive ? "desactivar" : "activar"} la sucursal{" "}
              <strong>{sucursalEstado?.nombre}</strong>?
              {sucursalEstado?.isActive && (
                <span className="block mt-2 text-amber-600">
                  Al desactivarla, no estará disponible para nuevas operaciones.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutationCambiarEstado.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarCambioEstado}
              disabled={mutationCambiarEstado.isPending}
              className={
                sucursalEstado?.isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {mutationCambiarEstado.isPending ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </span>
              ) : sucursalEstado?.isActive ? (
                "Desactivar"
              ) : (
                "Activar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableSucursales;
