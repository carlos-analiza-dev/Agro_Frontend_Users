"use client";
import useGetInsumos from "@/hooks/insumos/useGetInsumos";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TitlePages from "@/components/generics/TitlePages";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LoaderComponents from "@/components/generics/LoaderComponents";
import dynamic from "next/dynamic";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import useGetProveedoresActivos from "@/hooks/proveedores/useGetProveedoresActivos";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Paginacion from "@/components/generics/Paginacion";
import useGetAllMarcas from "@/hooks/marcas/useGetAllMarcas";

const FormInsumos = dynamic(() => import("./ui/FormInsumos"), {
  loading: () => <LoaderComponents />,
});

const TableInsumos = dynamic(() => import("./ui/TableInsumos"), {
  loading: () => <TableUsersSkeleton />,
});

const InsumosAdminPage = () => {
  const { user } = useAuthStore();
  let paisId = user?.pais.id;
  const [isOopen, setIsOopen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState("");

  const proveedorId = selectedProveedor === "all" ? "" : selectedProveedor;

  const marcaId = selectedMarca === "all" ? "" : selectedMarca;

  const { data: marcas } = useGetAllMarcas(10, 0);
  const { data: proveedores } = useGetProveedoresActivos();

  const offset = (currentPage - 1) * itemsPerPage;

  const { data: insumos, isLoading } = useGetInsumos(
    itemsPerPage,
    offset,
    paisId,
    proveedorId,
    marcaId
  );

  const insumos_total = insumos?.data.data || [];
  const totalInsumos = insumos?.data?.total || 0;
  const totalPages = Math.ceil(totalInsumos / itemsPerPage);

  const handleMarcaChange = (value: string) => {
    setSelectedMarca(value);
    setCurrentPage(1);
  };

  const handleProveedorChange = (value: string) => {
    setSelectedProveedor(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedMarca("");
    setSelectedProveedor("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <TitlePages title="Gestión de Insumos" />
          <p className="text-muted-foreground text-sm">
            Administra los insumos y medicamentos del sistema
          </p>
        </div>

        <Button onClick={() => setIsOopen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Insumo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Marca</label>
          <Select value={selectedMarca} onValueChange={handleMarcaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {marcas?.data.map((marca) => (
                <SelectItem key={marca.id} value={marca.id.toString()}>
                  {marca.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Proveedor</label>
          <Select
            value={selectedProveedor}
            onValueChange={handleProveedorChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los proveedores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proveedores</SelectItem>
              {proveedores?.map((proveedor) => (
                <SelectItem key={proveedor.id} value={proveedor.id.toString()}>
                  {proveedor.nombre_legal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!selectedMarca && !selectedProveedor}
          >
            Limpiar filtros
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="space-y-2">
              <CardTitle>Lista de Insumos</CardTitle>
              <CardDescription>
                {totalInsumos} insumo{totalInsumos !== 1 ? "s" : ""} encontrado
                {totalInsumos !== 1 ? "s" : ""}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : insumos_total.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No se encontraron insumos
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "No hay insumos registrados"}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <TableInsumos filteredInsumos={insumos_total} />
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {Math.min(itemsPerPage, insumos_total.length)} de{" "}
                    {totalInsumos} insumos
                  </div>

                  <Paginacion
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isOopen} onOpenChange={setIsOopen}>
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
            <AlertDialogTitle>Agregar Insumo</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agregar insumos
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormInsumos onSuccess={() => setIsOopen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InsumosAdminPage;
