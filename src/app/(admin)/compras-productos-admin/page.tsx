"use client";
import TitlePages from "@/components/generics/TitlePages";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { useState } from "react";
import useGetCompras from "@/hooks/compras/useGetCompras";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetProveedoresActivos from "@/hooks/proveedores/useGetProveedoresActivos";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { tiposPagos } from "@/helpers/data/tiposPagos";
import FormCompraProductos from "@/app/(admin)/compras-productos-admin/ui/FormCompraProductos";
import TableCompras from "@/components/generics/TableCompras";
import Paginacion from "@/components/generics/Paginacion";

const ComprasProductosPage = () => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const [isOpen, setIsOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [proveedor, setProveedor] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [tipoPago, setTipoPago] = useState("");
  const { data: proveedores } = useGetProveedoresActivos();
  const { data: sucursales } = useGetSucursalesPais(paisId);

  const proveedorId = proveedor === "all" ? "" : proveedor;
  const sucursalId = sucursal === "all" ? "" : sucursal;
  const todosPagos = tipoPago === "all" ? "" : tipoPago;

  const { data: comprasData, isLoading } = useGetCompras(
    limit,
    offset,
    proveedorId,
    sucursalId,
    todosPagos,
  );

  const totalPages = comprasData ? Math.ceil(comprasData.total / limit) : 1;
  const currentPage = Math.floor(offset / limit) + 1;

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit);
  };

  const clearFilters = () => {
    setProveedor("");
    setSucursal("");
    setTipoPago("");
    setOffset(0);
  };
  return (
    <div className="container mx-auto py-6">
      <div className="block md:flex justify-between items-center mt-5">
        <TitlePages title="Gestión de Compras - Productos" />
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Agregar Compra
          </Button>
        </div>
      </div>

      <div className="mt-5 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Select value={proveedor} onValueChange={setProveedor}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {proveedores && proveedores.length > 0 ? (
                  proveedores.map((prov) => (
                    <SelectItem value={prov.id} key={prov.id}>
                      {prov.nombre_legal} - {prov.nit_rtn}
                    </SelectItem>
                  ))
                ) : (
                  <p>No se encontraron proveedores</p>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={sucursal} onValueChange={setSucursal}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {sucursales && sucursales.length > 0 ? (
                  sucursales.map((suc) => (
                    <SelectItem value={suc.id} key={suc.id}>
                      {suc.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <p>No se encontraron sucursales</p>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={tipoPago} onValueChange={setTipoPago}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {tiposPagos.map((tipo) => (
                  <SelectItem value={tipo.value} key={tipo.id}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={clearFilters}>
            <Filter className="mr-2 h-4 w-4" /> Limpiar
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <div className="rounded-md border">
          <TableCompras comprasData={comprasData} isLoading={isLoading} />
        </div>

        {comprasData && comprasData.total > limit && (
          <div className="mt-4 flex justify-center">
            <Paginacion
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="p-4 md:max-w-5xl h-full overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Nueva Compra</AlertDialogTitle>
            <AlertDialogDescription>
              En esta sección ingresarás las compras de productos
            </AlertDialogDescription>
            <div>
              <FormCompraProductos onSuccess={() => setIsOpen(false)} />
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ComprasProductosPage;
