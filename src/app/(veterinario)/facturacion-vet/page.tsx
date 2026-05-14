"use client";

import FormCreateFactura from "@/components/facturacion/FormCreateFactura";
import TableFacturas from "@/components/facturacion/TableFacturas";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import useGetFacturas from "@/hooks/facturas/useGetFacturas";

import { useAuthStore } from "@/providers/store/useAuthStore";
import { Calendar, FileText, Filter, Plus } from "lucide-react";
import React, { useState } from "react";

const FacturacionVeterinarioPage = () => {
  const { user } = useAuthStore();

  const simbolo = user?.pais.simbolo_moneda || "";
  const sucursalUsuario = user?.sucursal.id || "";
  const [isOpen, setIsOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const limit = 10;

  const { data: facturas, isLoading } = useGetFacturas({
    limit,
    offset,
    sucursal: sucursalUsuario,
    fechaInicio,
    fechaFin,
  });

  const totalPages = facturas ? Math.ceil(facturas.total / limit) : 0;
  const currentPage = Math.floor(offset / limit) + 1;

  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * limit;
    setOffset(newOffset);
  };

  const handleFiltroChange = () => {
    setOffset(0);
  };

  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    setOffset(0);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Generar Factura
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha Inicio:
              </Label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => {
                  setFechaInicio(e.target.value);
                  handleFiltroChange();
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaFin" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha Fin:
              </Label>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => {
                  setFechaFin(e.target.value);
                  handleFiltroChange();
                }}
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={limpiarFiltros}
              disabled={!fechaInicio && !fechaFin}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Badge variant="secondary" className="text-sm">
        Total: {facturas?.total || 0} facturas
        {(fechaInicio || fechaFin) && " (filtradas)"}
      </Badge>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Facturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <TableFacturas
                facturas={facturas}
                user={user}
                simbolo={simbolo}
              />

              {facturas && facturas.total > limit && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Mostrando {offset + 1} -{" "}
                    {Math.min(offset + limit, facturas.total)} de{" "}
                    {facturas.total} facturas
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {getPageNumbers()[0] > 1 && (
                        <>
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(1)}
                              className="cursor-pointer"
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                          {getPageNumbers()[0] > 2 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                        </>
                      )}

                      {getPageNumbers().map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {getPageNumbers()[getPageNumbers().length - 1] <
                        totalPages && (
                        <>
                          {getPageNumbers()[getPageNumbers().length - 1] <
                            totalPages - 1 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(totalPages)}
                              className="cursor-pointer"
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {!isLoading && facturas && facturas.data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">ISV 15%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  facturas.data
                    .reduce(
                      (sum, factura) => sum + parseFloat(factura.isv_15),
                      0,
                    )
                    .toString(),
                  facturas.data[0]?.pais.simbolo_moneda || "L",
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">ISV 18%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  facturas.data
                    .reduce(
                      (sum, factura) => sum + parseFloat(factura.isv_18),
                      0,
                    )
                    .toString(),
                  facturas.data[0]?.pais.simbolo_moneda || "L",
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gravado 15%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  facturas.data
                    .reduce(
                      (sum, factura) =>
                        sum + parseFloat(factura.importe_gravado_15),
                      0,
                    )
                    .toString(),
                  facturas.data[0]?.pais.simbolo_moneda || "L",
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gravado 18%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  facturas.data
                    .reduce(
                      (sum, factura) =>
                        sum + parseFloat(factura.importe_gravado_18),
                      0,
                    )
                    .toString(),
                  facturas.data[0]?.pais.simbolo_moneda || "L",
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="p-4 md:max-w-5xl h-full overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Generación de Factura</AlertDialogTitle>
            <AlertDialogDescription>
              Aquí puede generar las facturas de ventas realizadas
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormCreateFactura
            onSuccess={() => setIsOpen(false)}
            simbolo={simbolo}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FacturacionVeterinarioPage;
