"use client";
import useGetFacturas from "@/hooks/facturas/useGetFacturas";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Plus, Filter, Calendar, Building } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TableFacturas from "@/components/facturacion/TableFacturas";
import FormCreateFactura from "@/components/facturacion/FormCreateFactura";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CardIsvImportes from "./ui/CardIsvImportes";
import Paginacion from "@/components/generics/Paginacion";

const FacturacionPage = () => {
  const { user } = useAuthStore();
  const sucursalUsuario = user?.sucursal?.id || "default";
  const paisId = user?.pais?.id || "";
  const simbolo = user?.pais.simbolo_moneda || "";
  const [isOpen, setIsOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [sucursalSeleccionada, setSucursalSeleccionada] =
    useState(sucursalUsuario);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const limit = 10;

  const { data: sucursales } = useGetSucursalesPais(paisId);

  const { data: facturas, isLoading } = useGetFacturas({
    limit,
    offset,
    sucursal: sucursalSeleccionada,
    fechaInicio,
    fechaFin,
  });

  const totalPages = facturas ? Math.ceil(facturas.total / limit) : 0;
  const currentPage = Math.floor(offset / limit) + 1;

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit);
  };

  const limpiarFiltros = () => {
    setSucursalSeleccionada(sucursalUsuario);
    setFechaInicio("");
    setFechaFin("");
    setOffset(0);
  };

  const getNombreSucursal = () => {
    if (sucursalSeleccionada === sucursalUsuario) {
      return user?.sucursal?.nombre || "Mi Sucursal";
    }
    return (
      sucursales?.find((s) => s.id === sucursalSeleccionada)?.nombre ||
      "Sucursal"
    );
  };

  const sucursalesValidas =
    sucursales?.filter((s) => s.id?.trim() !== "") || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="block md:flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
        <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
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
              <Label htmlFor="sucursal" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Sucursal:
              </Label>
              <Select
                value={sucursalSeleccionada}
                onValueChange={(value) => {
                  setSucursalSeleccionada(value);
                  setOffset(0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sucursal">
                    {getNombreSucursal()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {sucursalUsuario && sucursalUsuario !== "default" && (
                    <SelectItem value={sucursalUsuario}>
                      Mi Sucursal ({user?.sucursal?.nombre || "Actual"})
                    </SelectItem>
                  )}

                  {sucursalesValidas
                    .filter((sucursal) => sucursal.id !== sucursalUsuario)
                    .map((sucursal) => (
                      <SelectItem key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

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
                  setOffset(0);
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
                  setOffset(0);
                }}
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={limpiarFiltros}
              disabled={!sucursalSeleccionada && !fechaInicio && !fechaFin}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {(sucursalSeleccionada !== sucursalUsuario ||
        fechaInicio ||
        fechaFin) && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            Filtros aplicados:{" "}
            <span className="font-medium">{getNombreSucursal()}</span>
            {fechaInicio && (
              <span className="ml-2">
                desde <span className="font-medium">{fechaInicio}</span>
              </span>
            )}
            {fechaFin && (
              <span className="ml-2">
                hasta <span className="font-medium">{fechaFin}</span>
              </span>
            )}
          </p>
        </div>
      )}

      <Badge variant="secondary" className="text-sm">
        Total: {facturas?.total || 0} facturas
        {(sucursalSeleccionada || fechaInicio || fechaFin) && " (filtradas)"}
      </Badge>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Facturas
            {sucursalSeleccionada && (
              <span className="text-sm font-normal text-gray-500">
                - {getNombreSucursal()}
              </span>
            )}
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
              <TableFacturas facturas={facturas} user={user} />

              {facturas && facturas.total > limit && (
                <div className="flex justify-center mt-6">
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

      {!isLoading && facturas && facturas.data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardIsvImportes
            title="ISV 15%"
            value={facturas.data.reduce(
              (sum, factura) => sum + parseFloat(factura.isv_15),
              0,
            )}
            currencySymbol={simbolo}
          />
          <CardIsvImportes
            title="ISV 18%"
            value={facturas.data.reduce(
              (sum, factura) => sum + parseFloat(factura.isv_18),
              0,
            )}
            currencySymbol={simbolo}
          />
          <CardIsvImportes
            title="Gravado 15%"
            value={facturas.data.reduce(
              (sum, factura) => sum + parseFloat(factura.importe_gravado_15),
              0,
            )}
            currencySymbol={simbolo}
          />
          <CardIsvImportes
            title="Gravado 18%"
            value={facturas.data.reduce(
              (sum, factura) => sum + parseFloat(factura.importe_gravado_18),
              0,
            )}
            currencySymbol={simbolo}
          />
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
          <div className="max-h-[70vh] overflow-y-auto">
            <FormCreateFactura
              onSuccess={() => setIsOpen(false)}
              simbolo={simbolo}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FacturacionPage;
