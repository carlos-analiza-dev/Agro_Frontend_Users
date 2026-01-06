import {
  RangoFactura,
  ResponseRangosFacturaInterface,
} from "@/apis/rangos-factura/interfaces/response-rangos-factura.interface";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Edit, XCircle } from "lucide-react";
import React, { useState } from "react";
import FormCrearRangosFactura from "./FormCrearRangosFactura";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { ActuralizarRangoFactura } from "@/apis/rangos-factura/accions/editar-rango-factura";
import { CrearRangoFacturaInterface } from "@/apis/rangos-factura/interfaces/crear-rango-factura.interface";

interface Props {
  data: ResponseRangosFacturaInterface | undefined;
}

const TableRangosFactura = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [editRango, setEditRango] = useState<RangoFactura | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [rangoSeleccionado, setRangoSeleccionado] =
    useState<RangoFactura | null>(null);

  const queryClient = useQueryClient();

  const mutationEstado = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CrearRangoFacturaInterface;
    }) => ActuralizarRangoFactura(id, data),
    onSuccess: () => {
      toast.success("Estado del rango actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["rangos-factura"] });
      setIsOpen2(false);
      setRangoSeleccionado(null);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al cambiar el estado del rango";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al cambiar el estado del rango. Inténtalo de nuevo."
        );
      }
      setIsOpen2(false);
      setRangoSeleccionado(null);
    },
  });

  const confirmarCambioEstado = () => {
    if (rangoSeleccionado) {
      const nuevoEstado = !rangoSeleccionado.is_active;

      const datosActualizados: CrearRangoFacturaInterface = {
        cai: rangoSeleccionado.cai,
        prefijo: rangoSeleccionado.prefijo,
        rango_inicial: rangoSeleccionado.rango_inicial,
        rango_final: rangoSeleccionado.rango_final,
        fecha_recepcion: rangoSeleccionado.fecha_recepcion,
        fecha_limite_emision: rangoSeleccionado.fecha_limite_emision,
        is_active: nuevoEstado,
      };

      mutationEstado.mutate({
        id: rangoSeleccionado.id,
        data: datosActualizados,
      });
    }
  };

  const handleEditRango = (rango: RangoFactura) => {
    setIsOpen(true);
    setIsEdit(true);
    setEditRango(rango);
  };

  const handleCambiarEstado = (rango: RangoFactura) => {
    setRangoSeleccionado(rango);
    setIsOpen2(true);
  };

  const obtenerTextoEstado = (rango: RangoFactura) => {
    return rango.is_active ? "desactivar" : "activar";
  };
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CAI</TableHead>
            <TableHead>Prefijo</TableHead>
            <TableHead>Rango Inicial</TableHead>
            <TableHead>Rango Final</TableHead>
            <TableHead>Correlativo Actual</TableHead>
            <TableHead>Fecha Recepción</TableHead>
            <TableHead>Fecha Límite</TableHead>
            <TableHead>Estado</TableHead>

            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map((rango) => (
            <TableRow key={rango.id}>
              <TableCell className="font-mono text-sm">{rango.cai}</TableCell>
              <TableCell className="font-mono">{rango.prefijo}</TableCell>
              <TableCell className="font-mono">{rango.rango_inicial}</TableCell>
              <TableCell className="font-mono">{rango.rango_final}</TableCell>
              <TableCell className="font-mono">
                {rango.correlativo_actual}
              </TableCell>
              <TableCell>{rango.fecha_recepcion}</TableCell>
              <TableCell>{rango.fecha_limite_emision}</TableCell>
              <TableCell>
                <Badge>{rango.is_active ? "Activo" : "Inactivo"}</Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditRango(rango)}
                    title="Editar Rango"
                  >
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCambiarEstado(rango)}
                    title="Cambiar Estado"
                  >
                    {rango.is_active ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!data?.data?.length && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No se encontraron rangos de factura
              </TableCell>
            </TableRow>
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
            <AlertDialogTitle>Editar Rango</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar el rango seleccionado
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormCrearRangosFactura
            onSuccess={() => setIsOpen(false)}
            editRango={editRango}
            isEdit={isEdit}
          />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isOpen2}
        onOpenChange={(open) => {
          if (!open) {
            setRangoSeleccionado(null);
          }
          setIsOpen2(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {rangoSeleccionado
                ? `¿Estás seguro de ${obtenerTextoEstado(rangoSeleccionado)} este rango?`
                : "Cambiar Estado del Rango"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {rangoSeleccionado && (
                <>
                  Estás a punto de{" "}
                  <strong>{obtenerTextoEstado(rangoSeleccionado)}</strong> el
                  rango con CAI:
                  <br />
                  <code className="font-mono bg-gray-100 p-1 rounded">
                    {rangoSeleccionado.cai}
                  </code>
                  <br />
                  {rangoSeleccionado.is_active
                    ? "Al desactivarlo, no podrá ser utilizado para nuevas facturas."
                    : "Al activarlo, estará disponible para generar nuevas facturas."}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutationEstado.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarCambioEstado}
              disabled={mutationEstado.isPending}
              className={
                rangoSeleccionado?.is_active
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {mutationEstado.isPending
                ? "Procesando..."
                : rangoSeleccionado
                  ? rangoSeleccionado.is_active
                    ? "Desactivar"
                    : "Activar"
                  : "Continuar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableRangosFactura;
