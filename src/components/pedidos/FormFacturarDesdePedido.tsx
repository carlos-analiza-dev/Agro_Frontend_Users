import { CrearFactura } from "@/apis/facturas/accions/crear-factura";
import { CrearFacturaInterface } from "@/apis/facturas/interfaces/crear-factura.interface";
import { EstadoPedido } from "@/apis/pedidos/interface/crear-pedido.interface";
import { Pedido } from "@/apis/pedidos/interface/response-pedidos.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { FormaPago } from "@/helpers/data/formaPago";
import { EditarAdminPedido } from "@/apis/pedidos/accions/editar-pedido";

interface Props {
  pedido: Pedido;
  onSuccess: () => void;
  onCancel: () => void;
  simbolo: string;
}

const FormFacturarDesdePedido = ({
  pedido,
  onSuccess,
  onCancel,
  simbolo,
}: Props) => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const sucursal_id = user?.sucursal.id || "";
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearFacturaInterface>({
    defaultValues: {
      id_cliente: pedido.id_cliente,
      sucursal_id: sucursal_id,
      pais_id: paisId,
      detalles: pedido.detalles.map((detalle) => ({
        id_producto_servicio: detalle.id_producto,
        cantidad: detalle.cantidad,
        precio: parseFloat(detalle.precio),
      })),
      sub_total: parseFloat(pedido.sub_total),
      descuentos_rebajas: 0,
      importe_exento: parseFloat(pedido.importe_exento),
      importe_exonerado: parseFloat(pedido.importe_exonerado),
      cargos_extra:
        pedido.tipo_entrega === "delivery"
          ? parseFloat(pedido.costo_delivery)
          : 0,
      descuento_id: null,
      forma_pago: FormaPago.CONTADO,
    },
  });

  const descuentos = watch("descuentos_rebajas") || 0;
  const importeExento = watch("importe_exento") || 0;
  const importeExonerado = watch("importe_exonerado") || 0;
  const cargosExtra = watch("cargos_extra") || 0;
  const subTotal = parseFloat(pedido.sub_total);

  const totalGeneral = useMemo(() => {
    return (
      subTotal - descuentos + importeExento + importeExonerado + cargosExtra
    );
  }, [subTotal, descuentos, importeExento, importeExonerado, cargosExtra]);

  const isvTotal = useMemo(() => {
    const isv15 = parseFloat(pedido.isv_15) || 0;
    const isv18 = parseFloat(pedido.isv_18) || 0;
    return isv15 + isv18;
  }, [pedido.isv_15, pedido.isv_18]);

  const mutationFactura = useMutation({
    mutationFn: (data: CrearFacturaInterface) => CrearFactura(data),
  });

  const mutationUpdatePedido = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EstadoPedido }) =>
      EditarAdminPedido(id, estado),
  });

  const handleSubmitFactura = async (data: CrearFacturaInterface) => {
    if (!data.detalles || data.detalles.length === 0) {
      toast.error("Debe agregar al menos un producto o servicio");
      return;
    }

    const loadingToast = toast.loading(
      "Creando factura y actualizando pedido...",
    );

    try {
      await mutationFactura.mutateAsync({
        ...data,
        pais_id: paisId,
        sucursal_id: sucursal_id,
      });

      await mutationUpdatePedido.mutateAsync({
        id: pedido.id,
        estado: EstadoPedido.FACTURADO,
      });

      toast.update(loadingToast, {
        render: "Factura creada y pedido actualizado exitosamente",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      setTimeout(() => {
        window.location.reload();
      }, 500);

      onSuccess();
    } catch (error) {
      let errorMessage = "Hubo un error al procesar la factura";

      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Error al crear la factura o actualizar el pedido";
      }

      toast.update(loadingToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const onSubmit = (data: CrearFacturaInterface) => {
    handleSubmitFactura(data);
  };

  const calcularTotalLinea = (cantidad: number, precio: number) => {
    return (Number(cantidad) || 0) * (Number(precio) || 0);
  };

  const isLoading = mutationFactura.isPending || mutationUpdatePedido.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("descuento_id")} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">Cliente</Label>
              <Input
                value={pedido.cliente.nombre}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">
                ID: {pedido.cliente.identificacion} | Tel:{" "}
                {pedido.cliente.telefono}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Forma de Pago*</Label>
              <Select
                onValueChange={(value) => setValue("forma_pago", value)}
                defaultValue={FormaPago.CONTADO}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione forma de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FormaPago.CONTADO}>Contado</SelectItem>
                  <SelectItem value={FormaPago.CREDITO}>Crédito</SelectItem>
                  <SelectItem value={FormaPago.TRANSFERENCIA}>
                    Transferencia
                  </SelectItem>
                  <SelectItem value={FormaPago.NOTA_CREDITO}>
                    Nota de Crédito
                  </SelectItem>
                  <SelectItem value={FormaPago.COMBINACION}>
                    Combinación
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.forma_pago && (
                <p className="text-sm font-medium text-red-500">
                  {errors.forma_pago?.message as string}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Factura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Sub Total:</span>
                <span className="font-medium">
                  {simbolo} {subTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">ISV (15% + 18%):</span>
                <span className="font-medium text-red-600">
                  +{simbolo} {isvTotal.toFixed(2)}
                </span>
              </div>

              {pedido.tipo_entrega === "delivery" && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Costo Delivery:</span>
                  <span className="font-medium text-orange-600">
                    +{simbolo} {parseFloat(pedido.costo_delivery).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Importe Exento:</span>
                <Input
                  type="number"
                  step="0.01"
                  className="w-32 text-right"
                  {...register("importe_exento", {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">
                  Importe Exonerado:
                </span>
                <Input
                  type="number"
                  step="0.01"
                  className="w-32 text-right"
                  {...register("importe_exonerado", {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Descuentos:</span>
                <Input
                  type="number"
                  step="0.01"
                  className="w-32 text-right"
                  {...register("descuentos_rebajas", {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <Label className="font-bold text-lg">Total General</Label>
                  <div className="text-2xl font-bold text-green-600">
                    {simbolo} {totalGeneral.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Productos del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio Unitario</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedido.detalles.map((detalle, index) => (
                <TableRow key={detalle.id}>
                  <TableCell>
                    <div>
                      <span className="font-medium">
                        {detalle.producto.nombre}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {detalle.producto.codigo}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      className="w-24"
                      defaultValue={detalle.cantidad}
                      {...register(`detalles.${index}.cantidad`, {
                        valueAsNumber: true,
                        min: 1,
                      })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      className="w-32"
                      defaultValue={parseFloat(detalle.precio)}
                      {...register(`detalles.${index}.precio`, {
                        valueAsNumber: true,
                      })}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {simbolo}{" "}
                    {calcularTotalLinea(
                      watch(`detalles.${index}.cantidad`) || detalle.cantidad,
                      watch(`detalles.${index}.precio`) ||
                        parseFloat(detalle.precio),
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          size="lg"
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
              Procesando...
            </>
          ) : (
            <>
              <DollarSign className="h-5 w-5" />
              Generar Factura y Actualizar Pedido
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormFacturarDesdePedido;
