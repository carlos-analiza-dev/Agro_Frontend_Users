"use client";
import useGetPedidos from "@/hooks/pedidos/useGetPedidos";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";
import useGetCountPedidosPorEstado from "@/hooks/pedidos/useGetCountPedidosPorEstado";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Building, Filter } from "lucide-react";
import { EstadoPedido } from "@/apis/pedidos/interface/crear-pedido.interface";
import PedidosSkeleton from "@/components/pedidos/PedidosSkeleton";
import PedidoCard from "@/components/pedidos/PedidoCard";
import { PedidosPagination } from "@/components/pedidos/PedidosPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 5;

const PedididosPendientesAdmin = () => {
  const { user } = useAuthStore();
  const sucursalUsuario = user?.sucursal?.id || "default";
  const paisId = user?.pais?.id || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [tipoPedido, setTipoPedido] = useState<EstadoPedido>(
    EstadoPedido.PENDIENTE,
  );
  const [sucursalSeleccionada, setSucursalSeleccionada] =
    useState(sucursalUsuario);

  const { data: sucursalesPais, isLoading: isLoadingSucursales } =
    useGetSucursalesPais(paisId);

  const {
    data: pedidosData,
    isLoading: isLoadingPedidos,
    isError,
  } = useGetPedidos(
    sucursalSeleccionada,
    ITEMS_PER_PAGE,
    (currentPage - 1) * ITEMS_PER_PAGE,
    tipoPedido,
  );

  const { data: countsPorEstado, isLoading: isLoadingCounts } =
    useGetCountPedidosPorEstado(sucursalSeleccionada);

  useEffect(() => {
    setCurrentPage(1);
  }, [sucursalSeleccionada, tipoPedido]);

  useEffect(() => {
    if (
      pedidosData?.pedidos?.length === 0 &&
      currentPage > 1 &&
      pedidosData?.total !== undefined
    ) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  }, [pedidosData?.pedidos?.length, pedidosData?.total, currentPage]);

  const isLoading = isLoadingPedidos || isLoadingSucursales || isLoadingCounts;
  const totalPages = Math.ceil((pedidosData?.total || 0) / ITEMS_PER_PAGE);

  const getNombreSucursal = () => {
    if (sucursalSeleccionada === sucursalUsuario) {
      return user?.sucursal?.nombre || "Mi Sucursal";
    }
    return (
      sucursalesPais?.find((s) => s.id === sucursalSeleccionada)?.nombre ||
      "Sucursal"
    );
  };

  const sucursalesValidas =
    sucursalesPais?.filter(
      (sucursal) => sucursal.id && sucursal.id.trim() !== "",
    ) || [];

  if (isLoading) {
    return <PedidosSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Building className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pedidos {tipoPedido.toLowerCase()} - {getNombreSucursal()}
            </h1>
            <p className="text-gray-600">
              Administración de pedidos de la sucursal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">
                Sucursal:
              </label>
            </div>
            <Select
              value={sucursalSeleccionada}
              onValueChange={setSucursalSeleccionada}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar sucursal">
                  {sucursalSeleccionada === sucursalUsuario
                    ? `Mi Sucursal (${user?.sucursal?.nombre || ""})`
                    : sucursalesPais?.find((s) => s.id === sucursalSeleccionada)
                        ?.nombre}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sucursalUsuario && sucursalUsuario !== "default" && (
                  <SelectItem value={sucursalUsuario}>
                    <div className="flex justify-between items-center w-full">
                      <span>Mi Sucursal</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {user?.sucursal?.nombre}
                      </span>
                    </div>
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

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">
                Estado del Pedido:
              </label>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.values(EstadoPedido).map((estado) => (
                <Button
                  key={estado}
                  variant={tipoPedido === estado ? "default" : "outline"}
                  onClick={() => setTipoPedido(estado)}
                  className="capitalize relative flex-1 min-w-[120px]"
                >
                  {estado.toLowerCase()}
                  {countsPorEstado && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        tipoPedido === estado
                          ? "bg-white text-blue-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {countsPorEstado[estado] || 0}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {pedidosData?.total !== undefined && pedidosData.total > 0 && (
          <p className="text-gray-600">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, pedidosData.total)} de{" "}
            {pedidosData.total} pedidos
          </p>
        )}
      </div>

      {!pedidosData?.pedidos?.length ? (
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No hay pedidos {tipoPedido.toLowerCase()}
          </h2>
          <p className="text-gray-600">
            No se encontraron pedidos con estado {tipoPedido.toLowerCase()} para{" "}
            {sucursalSeleccionada === sucursalUsuario
              ? "tu sucursal"
              : "esta sucursal"}
            .
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {pedidosData.pedidos.map((pedido) => (
              <PedidoCard key={pedido.id} pedido={pedido} user={user} />
            ))}
          </div>

          {totalPages > 1 && (
            <PedidosPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PedididosPendientesAdmin;
