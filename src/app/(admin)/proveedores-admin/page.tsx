"use client";
import useGetAllProveedores from "@/hooks/proveedores/useGetAllProveedores";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import TitlePages from "@/components/generics/TitlePages";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import Paginacion from "@/components/generics/Paginacion";
import { useAuthStore } from "@/providers/store/useAuthStore";

const FormProveedor = dynamic(() => import("./ui/FormProveedor"), {
  loading: () => <LoaderComponents />,
});

const TableProveedores = dynamic(() => import("./ui/TableProveedores"), {
  loading: () => <TableUsersSkeleton />,
});

const ProveedoresAdmin = () => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const offset = (currentPage - 1) * itemsPerPage;
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetAllProveedores(
    paisId,
    itemsPerPage,
    offset
  );

  const totalPages = data ? Math.ceil(data.total / itemsPerPage) : 0;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      <div className="block md:flex items-center justify-between mb-6">
        <TitlePages title="Gestión de Proveedores" />
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button className="w-full sm:w-auto">Nuevo Proveedor</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="h-[600px] overflow-y-auto">
            <div className="flex justify-end">
              <AlertDialogCancel>X</AlertDialogCancel>
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Agregar Proveedor</AlertDialogTitle>
              <AlertDialogDescription>
                En esta seccion podras agregar los proveedores
              </AlertDialogDescription>
            </AlertDialogHeader>
            <FormProveedor onSucces={() => setIsOpen(false)} />
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="rounded-md border">
        <TableProveedores isLoading={isLoading} data={data} />
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {data && (
        <div className="mt-4 text-sm text-muted-foreground">
          Mostrando {data.data.length} de {data.total} proveedores
        </div>
      )}
    </div>
  );
};

export default ProveedoresAdmin;
