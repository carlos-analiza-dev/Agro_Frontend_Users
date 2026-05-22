"use client";

import useGetMovimientosInventario from "@/hooks/movimientos-inventario/useGetMovimientosInventario";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";
import { ValidRoles } from "@/interfaces/auth/valid-roles.type";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  Search,
  Filter,
  Package,
  Building,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Paginacion from "@/components/generics/Paginacion";
import CardDetails from "@/components/lotes-movimientos/CardDetails";
import TableTraslados from "./ui/TableTraslados";

const LotesTrasladosPage = () => {
  const { user } = useAuthStore();
  const moneda = user?.pais.simbolo_moneda ?? "$";
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSucursal, setSelectedSucursal] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const itemsPerPage = 10;
  const paisId = user?.pais.id ?? "";
  const rol = user?.role.name;
  const esAdmin = rol === ValidRoles.Administrador;
  const sucursalIdUsuario = user?.sucursal.id ?? "";

  const sucursalFiltro = esAdmin ? selectedSucursal : sucursalIdUsuario;
  const offset = (currentPage - 1) * itemsPerPage;

  const { data: sucursales, isLoading: cargandoSucursales } =
    useGetSucursalesPais(paisId);

  const {
    data: trasladosData,
    isLoading,
    refetch,
  } = useGetMovimientosInventario({
    limit: itemsPerPage,
    offset: offset,
    sucursal: sucursalFiltro || undefined,
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
  });

  const movimientos = trasladosData?.movimientos || [];
  const totalItems = trasladosData?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const handleAplicarFiltros = () => {
    setCurrentPage(1);
    refetch();
  };

  const handleLimpiarFiltros = () => {
    setSelectedSucursal("");
    setFechaInicio("");
    setFechaFin("");
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  const filteredMovimientos = searchTerm
    ? movimientos.filter((mov) => {
        const productoNombre = mov.lote?.producto?.nombre || "";
        const productoCodigo = mov.lote?.producto?.codigo || "";
        return (
          productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          productoCodigo.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : movimientos;

  const totalProductosTransferidos = movimientos.reduce(
    (sum, m) => sum + Number(m.cantidad),
    0,
  );

  const sucursalesUnicas = new Set<string>();
  movimientos.forEach((m) => {
    if (m.sucursalOrigen?.nombre) sucursalesUnicas.add(m.sucursalOrigen.nombre);
    if (m.sucursalDestino?.nombre)
      sucursalesUnicas.add(m.sucursalDestino.nombre);
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Traslados de Inventario
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Historial de transferencias de productos entre sucursales
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o código de producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">
          <Search className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </form>

      {mostrarFiltros && (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {esAdmin && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Sucursal</Label>
                  {cargandoSucursales ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      value={selectedSucursal || "todas"}
                      onValueChange={(value) => {
                        setSelectedSucursal(value === "todas" ? "" : value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las sucursales" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">
                          Todas las sucursales
                        </SelectItem>
                        {sucursales?.map((sucursal) => (
                          <SelectItem key={sucursal.id} value={sucursal.id}>
                            {sucursal.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Fecha Inicio</Label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Fecha Fin</Label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleLimpiarFiltros}>
                Limpiar filtros
              </Button>
              <Button onClick={handleAplicarFiltros}>Aplicar filtros</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardDetails
          title="Total Traslados"
          total={totalItems}
          Icon={Truck}
          color="blue"
        />

        <CardDetails
          title="Productos Transferidos"
          total={totalProductosTransferidos}
          Icon={Package}
          color="green"
        />

        <CardDetails
          title="Sucursales Involucradas"
          total={sucursalesUnicas.size}
          Icon={Building}
          color="purple"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Historial de Traslados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredMovimientos.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No se encontraron traslados de inventario con los filtros
                seleccionados.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <TableTraslados
                filteredMovimientos={filteredMovimientos}
                moneda={moneda}
              />
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6">
              <Paginacion
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
        Mostrando {filteredMovimientos.length} de {totalItems} traslados
      </div>
    </div>
  );
};

export default LotesTrasladosPage;
