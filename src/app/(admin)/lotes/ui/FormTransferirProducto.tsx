"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircleIcon,
  ArrowRightLeft,
  Package,
  Warehouse,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lote } from "@/apis/lotes/interfaces/response-lotes-sucursal.interface";
import { TransferirProductoInterface } from "@/apis/lotes/interfaces/tranfsferir-producto.interface";
import { transferirProducto } from "@/apis/lotes/accions/transferir-producto";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";

interface Props {
  paisId: string;
  onSucces: () => void;
  lote: Lote | null;
}

const FormTransferirProducto = ({ lote, onSucces, paisId }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [maxCantidad, setMaxCantidad] = useState(0);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransferirProductoInterface>({
    defaultValues: {
      productoId: lote?.id_producto || "",
      sucursalOrigenId: lote?.id_sucursal || "",
      sucursalDestinoId: "",
      cantidad: 1,
    },
  });

  const { data: sucursales, isLoading: cargandoSucursales } =
    useGetSucursalesPais(paisId);
  const queryClient = useQueryClient();

  const sucursalDestinoId = watch("sucursalDestinoId");
  const cantidad = watch("cantidad");

  useEffect(() => {
    if (lote) {
      setValue("productoId", lote.id_producto);
      setValue("sucursalOrigenId", lote.id_sucursal);
      setMaxCantidad(lote.cantidad);
      setValue("cantidad", 1);
    }
    setIsLoading(false);
  }, [lote, setValue]);

  const sucursalesDestino =
    sucursales?.filter((sucursal) => sucursal.id !== lote?.id_sucursal) || [];

  const onSubmit = async (data: TransferirProductoInterface) => {
    try {
      const response = await transferirProducto({
        ...data,
        cantidad: Number(data.cantidad),
      });

      toast.success(
        `Producto transferido exitosamente: ${response.data.message || `${data.cantidad} unidades transferidas`}`,
      );

      queryClient.invalidateQueries({ queryKey: ["lotes-sucursal"] });
      queryClient.invalidateQueries({ queryKey: ["lotes"] });

      reset();
      if (onSucces) {
        onSucces();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al transferir el producto";
        setErrorMessage(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  if (isLoading || cargandoSucursales) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lote) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se ha seleccionado ningún producto para transferir.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Error al transferir el producto</AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-lg">Producto a Transferir</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-500">
                Nombre del Producto
              </Label>
              <p className="font-medium mt-1">{lote.nombre_producto}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Código</Label>
              <Badge variant="outline" className="mt-1">
                {lote.codigo_producto}
              </Badge>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Sucursal Origen</Label>
              <div className="flex items-center gap-2 mt-1">
                <Warehouse className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{lote.nombre_sucursal}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-500">
                Cantidad Disponible
              </Label>
              <p className="font-medium text-green-600 mt-1">
                {lote.cantidad} unidades
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRightLeft className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg">Datos de Transferencia</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sucursalOrigenId" className="text-sm font-semibold">
              Sucursal Origen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sucursalOrigenId"
              value={lote.nombre_sucursal}
              disabled
              className="bg-gray-50 mt-1"
            />
            <input
              type="hidden"
              {...register("sucursalOrigenId")}
              value={lote.id_sucursal}
            />
          </div>

          <div>
            <Label
              htmlFor="sucursalDestinoId"
              className="text-sm font-semibold"
            >
              Sucursal Destino <span className="text-red-500">*</span>
            </Label>
            <Select
              value={sucursalDestinoId}
              onValueChange={(value) => setValue("sucursalDestinoId", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar sucursal destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sucursales Disponibles</SelectLabel>
                  {sucursalesDestino.length > 0 ? (
                    sucursalesDestino.map((sucursal) => (
                      <SelectItem key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-gray-500">
                      No hay sucursales disponibles
                    </div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.sucursalDestinoId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.sucursalDestinoId.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="cantidad" className="text-sm font-semibold">
              Cantidad a Transferir <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex-1">
                <Input
                  id="cantidad"
                  type="number"
                  step="1"
                  min={1}
                  max={maxCantidad}
                  {...register("cantidad", {
                    required: "La cantidad es requerida",
                    min: {
                      value: 1,
                      message: "La cantidad mínima es 1",
                    },
                    max: {
                      value: maxCantidad,
                      message: `La cantidad máxima disponible es ${maxCantidad}`,
                    },
                    valueAsNumber: true,
                  })}
                  className={errors.cantidad ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
              </div>
              <div className="text-sm text-gray-500">
                Disponible:{" "}
                <span className="font-semibold text-green-600">
                  {maxCantidad}
                </span>{" "}
                unidades
              </div>
            </div>
            {errors.cantidad && (
              <p className="text-sm text-red-500 mt-1">
                {errors.cantidad.message}
              </p>
            )}
          </div>

          {sucursalDestinoId && cantidad > 0 && cantidad <= maxCantidad && (
            <div className="md:col-span-2 mt-2">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Resumen de Transferencia
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Producto:</span>
                      <span className="font-medium">
                        {lote.nombre_producto}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Desde:</span>
                      <span className="font-medium">
                        {lote.nombre_sucursal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hacia:</span>
                      <span className="font-medium">
                        {
                          sucursales?.find((s) => s.id === sucursalDestinoId)
                            ?.nombre
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cantidad:</span>
                      <span className="font-bold text-blue-700">
                        {cantidad} unidades
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Stock restante en origen:
                      </span>
                      <span className="font-medium text-orange-600">
                        {maxCantidad - cantidad} unidades
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {maxCantidad - cantidad < 5 && maxCantidad - cantidad > 0 && (
            <div className="md:col-span-2">
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircleIcon className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">
                  Stock bajo en origen
                </AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Después de la transferencia, quedarán solo{" "}
                  {maxCantidad - cantidad} unidades en la sucursal origen.
                  Considera reabastecer pronto.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSucces()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !sucursalDestinoId ||
            cantidad <= 0 ||
            cantidad > maxCantidad
          }
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Transferiendo...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Transferir Producto
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormTransferirProducto;
