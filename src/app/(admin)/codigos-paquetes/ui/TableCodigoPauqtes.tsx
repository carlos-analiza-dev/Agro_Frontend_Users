"use client";

import { useState } from "react";
import { eliminarCodigoPaquete } from "@/apis/codigos-paquetes/accions/eliminar-codigo-paquete";
import { CodigosPaquetes } from "@/apis/codigos-paquetes/interfaces/response-codigos-paquetes.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";
import {
  CheckCircle,
  Copy,
  Edit,
  MoreHorizontal,
  Trash2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@/components/generics/Modal";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  codigos: CodigosPaquetes[];
  isLoading: boolean;
  handleEditCodigo: (codigo: CodigosPaquetes) => void;
  onDeleteSuccess?: () => void;
}

const TableCodigoPaquetes = ({
  codigos,
  isLoading,
  handleEditCodigo,
  onDeleteSuccess,
}: Props) => {
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [selectedPaquete, setSelectedPaquete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyCode = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    toast.success(`Código "${codigo}" copiado al portapapeles`);
  };

  const handleDeleteClick = (
    id: string,
    codigo: string,
    paqueteNombre: string,
  ) => {
    setSelectedCodeId(id);
    setSelectedCode(codigo);
    setSelectedPaquete(paqueteNombre);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCodeId) return;

    setIsDeleting(true);
    try {
      await eliminarCodigoPaquete(selectedCodeId);
      queryClient.invalidateQueries({ queryKey: ["codigos-paquetes"] });
      toast.success(`Código "${selectedCode}" eliminado exitosamente`);
      setIsDeleteModalOpen(false);
      setSelectedCodeId(null);
      setSelectedCode("");
      setSelectedPaquete("");

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      toast.error(
        "Ocurrió un error al momento de eliminar el código del paquete",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedCodeId(null);
    setSelectedCode("");
    setSelectedPaquete("");
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-700">
                Código
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Paquete
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Tipo
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Estado
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Fecha Expiración
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : codigos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-medium">
                      No hay códigos registrados
                    </p>
                    <p className="text-sm">
                      Comienza creando un nuevo código de paquete
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              codigos.map((item: any) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="font-mono font-medium">
                    <span className="bg-slate-100 px-2 py-1 rounded-md text-xs">
                      {item.codigo}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.paquete?.nombre || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {item.paquete?.tipo || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.activo ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactivo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.fechaExpiracion ? (
                      formatDateLocal(item.fechaExpiracion)
                    ) : (
                      <span className="text-slate-400">Sin fecha</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleCopyCode(item.codigo)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar código
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditCodigo(item)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteClick(
                                item.id,
                                item.codigo,
                                item.paquete?.nombre || "N/A",
                              )
                            }
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Eliminar código"
        description={`¿Estás seguro de que deseas eliminar el código "${selectedCode}"?`}
        size="sm"
        showCloseButton={true}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-semibold">¡Acción irreversible!</p>
              <p className="mt-1">
                Esta acción no se puede deshacer. El código será eliminado
                permanentemente del sistema.
              </p>
            </div>
          </div>

          <div className="space-y-2 p-3 bg-slate-50 rounded-lg border">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Código:</span>
              <span className="text-sm font-mono font-medium">
                {selectedCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Paquete:</span>
              <span className="text-sm font-medium">{selectedPaquete}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">⚡</span>
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TableCodigoPaquetes;
