import { Insumo } from "@/apis/insumos/interfaces/response-insumos.interface";
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
import { Barcode, Edit, Eye, Package, Settings } from "lucide-react";
import React, { useState } from "react";
import FormInsumos from "./FormInsumos";
import OptionsInsumos from "./OptionsInsumos";
import { useAuthStore } from "@/providers/store/useAuthStore";
import LotesByInsumo from "./LotesByInsumo";

interface Props {
  filteredInsumos: Insumo[];
}

const TableInsumos = ({ filteredInsumos }: Props) => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editInsumo, setEditInsumo] = useState<Insumo | null>(null);
  const [isOpenLotes, setIsOpenLotes] = useState(false);
  const [insumoId, setInsumoId] = useState("");
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);

  const handleEditInsumo = (insumo: Insumo) => {
    setIsEdit(true);
    setIsOpen(true);
    setEditInsumo(insumo);
  };

  const handleOpenSettings = (insumo: Insumo) => {
    setIsOpenSettings(true);
    setSelectedInsumo(insumo);
  };

  const handleViewLotes = (insumoId: string) => {
    setIsOpenLotes(true);
    setInsumoId(insumoId);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">Producto</TableHead>
            <TableHead className="text-center font-bold">Código</TableHead>
            <TableHead className="text-center font-bold">Marca</TableHead>
            <TableHead className="text-center font-bold">Proveedor</TableHead>
            <TableHead className="text-center font-bold">Costo</TableHead>
            <TableHead className="text-center font-bold">Estado</TableHead>
            <TableHead className="text-center font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInsumos.map((insumo) => (
            <TableRow key={insumo.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">{insumo.nombre}</div>
                    {insumo.descripcion && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {insumo.descripcion}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Barcode className="h-3 w-3" />
                      {insumo.unidad_venta}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <Badge variant="secondary" className="font-mono">
                  {insumo.codigo}
                </Badge>
              </TableCell>

              <TableCell className="text-center">
                {insumo.marca ? (
                  <Badge variant="outline">{insumo.marca.nombre}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>

              <TableCell className="flex justify-center">
                {insumo.proveedor ? (
                  <div className="max-w-[120px]">
                    <div className="text-sm font-medium truncate">
                      {insumo.proveedor.nombre_legal}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {insumo.proveedor.nit_rtn}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>

              <TableCell className="text-center">
                <div className="font-semibold text-green-600">
                  {insumo.pais?.simbolo_moneda || "L"}{" "}
                  {Number(insumo.costo).toFixed(2)}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={insumo.disponible ? "default" : "secondary"}
                  className={
                    insumo.disponible
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : ""
                  }
                >
                  {insumo.disponible ? "Disponible" : "No disponible"}
                </Badge>
              </TableCell>

              <TableCell className="text-center">
                <div className="flex justify-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Editar Insumos"
                    onClick={() => handleEditInsumo(insumo)}
                  >
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    title="Lotes"
                    className="h-8 w-8 p-0"
                    onClick={() => handleViewLotes(insumo.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    title="Mas opciones"
                    className="h-8 w-8 p-0"
                    onClick={() => handleOpenSettings(insumo)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
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
            <AlertDialogTitle>Editar Insumo</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar insumos
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormInsumos
            onSuccess={() => setIsOpen(false)}
            editInsumo={editInsumo}
            isEdit={isEdit}
          />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpenSettings} onOpenChange={setIsOpenSettings}>
        <AlertDialogContent className="max-w-6xl h-full overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Gestionar Datos del Insumo - {selectedInsumo?.nombre}
            </AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras gestionar diferentes datos de los insumos
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex-1">
            <OptionsInsumos user={user} selectedInsumo={selectedInsumo} />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpenLotes} onOpenChange={setIsOpenLotes}>
        <AlertDialogContent className="max-w-6xl h-full overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Lotes de Insumo</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras observar los lotes del Insumo seleccionado
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex-1">
            <LotesByInsumo insumoId={insumoId} user={user} />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableInsumos;
