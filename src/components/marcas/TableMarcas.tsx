import {
  Marca,
  ResponseMarcas,
} from "@/apis/marcas/interface/response-marcas.interface";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Edit,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import FormMarcas from "./FormMarcas";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";

interface Props {
  marcas: ResponseMarcas | undefined;
  sortField: string;
  setSortDirection: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  setSortField: React.Dispatch<React.SetStateAction<string>>;
  sortDirection: "asc" | "desc";
  isLoading: boolean;
}

const TableMarcas = ({
  marcas,
  sortField,
  setSortDirection,
  setSortField,
  sortDirection,
  isLoading,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editMarca, setEditMarca] = useState<Marca | null>(null);

  const handleEditMarca = (marca: Marca) => {
    setIsOpen(true);
    setIsEdit(true);
    setEditMarca(marca);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field)
      return <ChevronDown className="h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  if (isLoading) {
    return <TableUsersSkeleton />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("nombre")}
            >
              <div className="flex justify-center items-center">
                Nombre
                <SortIcon field="nombre" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("pais_origen")}
            >
              <div className="flex justify-center items-center">
                País de Origen
                <SortIcon field="pais_origen" />
              </div>
            </TableHead>
            <TableHead className="text-center">Estado</TableHead>

            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("created_at")}
            >
              <div className="flex justify-center items-center">
                Fecha Creación
                <SortIcon field="created_at" />
              </div>
            </TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {marcas?.data?.length ? (
            marcas.data.map((marca) => (
              <TableRow key={marca.id}>
                <TableCell>
                  <div className="text-center">{marca.nombre}</div>
                </TableCell>
                <TableCell className="text-center">
                  {marca.pais_origen}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={marca.is_active ? "default" : "secondary"}
                    className={marca.is_active ? "bg-green-500" : "bg-gray-500"}
                  >
                    {marca.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  {new Date(marca.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditMarca(marca)}
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar Marca</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No se encontraron marcas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Marca</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar las marcas
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormMarcas
            onSucces={() => setIsOpen(false)}
            isEdit={isEdit}
            editMarca={editMarca}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableMarcas;
