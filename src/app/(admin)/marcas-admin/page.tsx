"use client";
import useGetAllMarcas from "@/hooks/marcas/useGetAllMarcas";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import Paginacion from "@/components/generics/Paginacion";

const FormMarcas = dynamic(() => import("./ui/FormMarcas"), {
  loading: () => <LoaderComponents />,
});

const TableMarcas = dynamic(() => import("./ui/TableMarcas"), {
  loading: () => <TableUsersSkeleton />,
});

const MarcasAdminPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortField, setSortField] = useState("nombre");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isOpen, setIsOpen] = useState(false);

  const offset = (currentPage - 1) * itemsPerPage;
  const { data: marcas, isLoading } = useGetAllMarcas(itemsPerPage, offset);

  const totalPages = marcas ? Math.ceil(marcas.total / itemsPerPage) : 0;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-x-hidden">
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={() => setIsOpen(true)}
                size="sm"
                className="h-8 gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Agregar Marca
                </span>
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Marcas</CardTitle>
              <CardDescription>
                Administra las marcas disponibles en el sistema. Total:{" "}
                {marcas?.total || 0} marcas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-x-auto">
                <div className="rounded-md border min-w-full">
                  <TableMarcas
                    marcas={marcas}
                    sortField={sortField}
                    setSortDirection={setSortDirection}
                    setSortField={setSortField}
                    sortDirection={sortDirection}
                    isLoading={isLoading}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando{" "}
                  <strong>
                    {offset + 1}-
                    {Math.min(offset + itemsPerPage, marcas?.total || 0)}
                  </strong>{" "}
                  de <strong>{marcas?.total || 0}</strong> marcas
                </div>
                <Paginacion
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Marca</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agregar nuevas marcas
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormMarcas onSucces={() => setIsOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MarcasAdminPage;
