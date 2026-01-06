"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useGetRangosFactura from "@/hooks/rangos-factura/useGetRangosFactura";
import TitlePages from "@/components/generics/TitlePages";
import { Plus } from "lucide-react";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormCrearRangosFactura from "./ui/FormCrearRangosFactura";
import TableRangosFactura from "./ui/TableRangosFactura";

const RangosFacturaPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const offset = (currentPage - 1) * pageSize;

  const { data, isLoading } = useGetRangosFactura(pageSize, offset);

  if (isLoading) {
    return <TableUsersSkeleton />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="block md:flex justify-between items-center">
        <div>
          <TitlePages title="Rangos de Factura" />
          <p className="text-muted-foreground">
            Gestiona los rangos de facturación del sistema
          </p>
        </div>
        <div>
          <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
            <Plus /> Agregar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Rangos</CardTitle>
          <CardDescription>
            Total de {data?.total} rangos de factura encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableRangosFactura data={data} />

          {data && data.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, data.totalPages)
                        )
                      }
                      className={
                        currentPage === data.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {data && (
        <div className="text-sm text-muted-foreground text-center">
          Mostrando {data.data.length} de {data.total} rangos - Página{" "}
          {currentPage} de {data.totalPages}
        </div>
      )}

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
            <AlertDialogTitle>Agregar Nuevo Rango</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agregar rangos para las facturas
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormCrearRangosFactura onSuccess={() => setIsOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RangosFacturaPage;
