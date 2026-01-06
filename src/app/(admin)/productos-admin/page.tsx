"use client";
import React, { useState } from "react";
import useGetProductos from "@/hooks/productos/useGetProductos";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TitlePages from "@/components/generics/TitlePages";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/providers/store/useAuthStore";
import LoaderComponents from "@/components/generics/LoaderComponents";
import dynamic from "next/dynamic";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import useGetProveedoresActivos from "@/hooks/proveedores/useGetProveedoresActivos";
import Paginacion from "@/components/generics/Paginacion";
import useGetAllMarcas from "@/hooks/marcas/useGetAllMarcas";

const FormProductos = dynamic(() => import("./ui/FormProductos"), {
  loading: () => <LoaderComponents />,
});

const TableProducts = dynamic(() => import("./ui/TableProducts"), {
  loading: () => <TableUsersSkeleton />,
});

const PageProductosAdmin = () => {
  const { user } = useAuthStore();
  let pais = user?.pais.id || "";
  const [isOpenSubServicio, setIsOpenSubServicio] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState("");

  const proveedorId = selectedProveedor === "all" ? "" : selectedProveedor;
  const categoriaId = selectedCategoria === "all" ? "" : selectedCategoria;
  const marcaId = selectedMarca === "all" ? "" : selectedMarca;

  const offset = (currentPage - 1) * itemsPerPage;

  const { data, isLoading } = useGetProductos({
    limit: itemsPerPage,
    offset: offset,
    pais: pais,
    categoria: categoriaId,
    marca: marcaId,
    proveedor: proveedorId,
  });

  const { data: marcas } = useGetAllMarcas(10, 0);
  const { data: categorias } = useGetCategorias();
  const { data: proveedores } = useGetProveedoresActivos();

  const productos = data?.data.productos || [];

  const totalProductos = data?.data?.total || 0;
  const totalPages = Math.ceil(totalProductos / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCategoriaChange = (value: string) => {
    setSelectedCategoria(value);
    setCurrentPage(1);
  };

  const handleMarcaChange = (value: string) => {
    setSelectedMarca(value);
    setCurrentPage(1);
  };

  const handleProveedorChange = (value: string) => {
    setSelectedProveedor(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategoria("");
    setSelectedMarca("");
    setSelectedProveedor("");
    setCurrentPage(1);
  };

  if (isLoading) {
    return <TableUsersSkeleton />;
  }
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="block md:flex justify-between items-center gap-3">
        <div>
          <TitlePages title="Administración de Productos" />
          <p className="text-muted-foreground">
            Gestione los productos del inventario
          </p>
        </div>
        <Button
          onClick={() => setIsOpenSubServicio(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoría</label>
          <Select
            value={selectedCategoria}
            onValueChange={handleCategoriaChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categorias?.data.map((categoria) => (
                <SelectItem key={categoria.id} value={categoria.id.toString()}>
                  {categoria.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
            disabled={
              !selectedCategoria && !selectedMarca && !selectedProveedor
            }
          >
            Limpiar filtros
          </Button>
        </div>
      </div>

      <TableProducts productos={productos} />

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>

          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <AlertDialog open={isOpenSubServicio} onOpenChange={setIsOpenSubServicio}>
        <AlertDialogContent className="h-[600px] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Producto</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agregar nuevos productos
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormProductos onSuccess={() => setIsOpenSubServicio(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PageProductosAdmin;
