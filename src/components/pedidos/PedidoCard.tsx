import {
  EditarAdminPedido,
  EditarPedido,
} from "@/apis/pedidos/accions/editar-pedido";
import {
  CrearPedidoInterface,
  EstadoPedido,
  TipoEntrega,
} from "@/apis/pedidos/interface/crear-pedido.interface";
import { Pedido } from "@/apis/pedidos/interface/response-pedidos.interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { formatDate } from "@/helpers/funciones/formatDate";
import { User } from "@/interfaces/auth/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Calendar,
  MapPin,
  Package,
  CheckCircle,
  FileText,
  XCircle,
  Receipt,
  Info,
  User as UserIcon,
  Phone,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import MapaUbicacion from "./MapaUbicacion";
import FormFacturarDesdePedido from "./FormFacturarDesdePedido";

interface Props {
  pedido: Pedido;
  user: User | undefined;
}

type DialogType = "procesar" | "facturar" | "cancelar" | null;

const PedidoCard = ({ pedido, user }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [mostrarImpuestos, setMostrarImpuestos] = useState(false);
  const [showFacturaForm, setShowFacturaForm] = useState(false);
  const simbolo = user?.pais.simbolo_moneda || "$";

  const getEstadoBadge = (estado: string) => {
    const estados = {
      pendiente: { label: "Pendiente", variant: "secondary" as const },
      procesado: { label: "Procesado", variant: "default" as const },
      facturado: { label: "Facturado", variant: "default" as const },
      cancelado: { label: "Cancelado", variant: "destructive" as const },
    };

    const estadoConfig =
      estados[estado as keyof typeof estados] || estados.pendiente;

    return <Badge variant={estadoConfig.variant}>{estadoConfig.label}</Badge>;
  };

  const mutationEdit = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EstadoPedido }) =>
      EditarAdminPedido(id, estado),
  });

  const openDialog = (type: DialogType) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
  };

  const handleCambiarEstado = () => {
    if (!pedido.id) return;

    let nuevoEstado: EstadoPedido;
    let mensajeExito = "";

    switch (dialogType) {
      case "procesar":
        nuevoEstado = EstadoPedido.PROCESADO;
        mensajeExito = "Pedido procesado correctamente";
        break;
      case "facturar":
        nuevoEstado = EstadoPedido.FACTURADO;
        mensajeExito = "Pedido facturado correctamente";
        break;
      case "cancelar":
        nuevoEstado = EstadoPedido.CANCELADO;
        mensajeExito = "Pedido cancelado correctamente";
        break;
      default:
        return;
    }

    mutationEdit.mutate(
      { id: pedido.id, estado: nuevoEstado },
      {
        onSuccess: () => {
          toast.success(mensajeExito);
          closeDialog();

          setTimeout(() => {
            window.location.reload();
          }, 500);
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error?.response?.data?.message ||
                `Error al ${dialogType} el pedido`,
            );
          }
        },
      },
    );
  };

  const getDialogConfig = () => {
    const configs = {
      procesar: {
        title: "¿Procesar pedido?",
        description:
          "El pedido pasará a estado 'Procesado'. ¿Deseas continuar?",
        icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
        buttonText: "Sí, procesar",
        variant: "default" as const,
      },
      facturar: {
        title: "¿Facturar pedido?",
        description:
          "El pedido pasará a estado 'Facturado'. ¿Deseas continuar?",
        icon: <FileText className="h-6 w-6 text-green-600" />,
        buttonText: "Sí, facturar",
        variant: "default" as const,
      },
      cancelar: {
        title: "¿Cancelar pedido?",
        description:
          "Esta acción no se puede deshacer. Si cancelas este pedido, se perderán todos los detalles asociados. ¿Deseas continuar?",
        icon: <XCircle className="h-6 w-6 text-red-600" />,
        buttonText: "Sí, cancelar",
        variant: "destructive" as const,
      },
    };

    return dialogType ? configs[dialogType] : configs.cancelar;
  };

  const totalImpuestos =
    (parseFloat(pedido.isv_15) || 0) + (parseFloat(pedido.isv_18) || 0);

  const baseGravableTotal =
    (parseFloat(pedido.importe_gravado_15) || 0) +
    (parseFloat(pedido.importe_gravado_18) || 0);

  const dialogConfig = getDialogConfig();

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">
                  Pedido #{pedido.id.slice(-8)}
                </CardTitle>
                {getEstadoBadge(pedido.estado)}
              </div>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(pedido.created_at)}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(pedido.total, simbolo)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMostrarImpuestos(!mostrarImpuestos)}
                className="mt-1 text-xs"
              >
                <Receipt className="h-3 w-3 mr-1" />
                {mostrarImpuestos ? "Ocultar" : "Ver"} impuestos
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Información del Cliente
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-blue-700">Nombre:</span>
                    <p className="text-blue-900">{pedido.cliente.nombre}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">
                      Identificación:
                    </span>
                    <p className="text-blue-900">
                      {pedido.cliente.identificacion}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-blue-600" />
                    <span className="text-blue-900">
                      {pedido.cliente.telefono}
                    </span>
                  </div>
                  {pedido.cliente.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-900">
                        {pedido.cliente.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Sucursal</h3>
                  <p className="text-sm text-gray-600">
                    {pedido.sucursal.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    {pedido.sucursal.direccion_complemento}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Entrega</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {pedido.tipo_entrega}
                  </p>
                  {pedido.direccion_entrega && (
                    <p className="text-sm text-gray-500">
                      {pedido.direccion_entrega}
                    </p>
                  )}
                  {pedido.nombre_finca && (
                    <p className="text-sm text-gray-500">
                      Finca: {pedido.nombre_finca}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 text-sm flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Resumen Fiscal
                </h4>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Subtotal:</span>
                    <span className="font-medium">
                      {formatCurrency(pedido.sub_total, simbolo)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Impuestos:</span>
                    <span className="font-medium text-red-600">
                      +{formatCurrency(totalImpuestos.toString(), simbolo)}
                    </span>
                  </div>
                  {pedido.tipo_entrega === TipoEntrega.DELIVERY && (
                    <div className="flex justify-between">
                      <span className="text-blue-700">Delivery:</span>
                      <span className="font-medium text-orange-600">
                        +{formatCurrency(pedido.costo_delivery, simbolo)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {pedido.latitud && pedido.longitud && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    Ubicación de Entrega
                  </h3>

                  {pedido.direccion_entrega && (
                    <div>
                      <span className="font-medium text-gray-600">
                        Dirección:
                      </span>
                      <p className="text-gray-500 text-sm mt-1">
                        {pedido.direccion_entrega}
                      </p>
                    </div>
                  )}

                  <MapaUbicacion
                    latitud={pedido.latitud}
                    longitud={pedido.longitud}
                    direccion={pedido.direccion_entrega}
                    titulo={`Ubicación del pedido #${pedido.id.slice(-8)}`}
                    className="w-full h-48 rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos ({pedido.detalles.length})
              </h3>

              <div className="space-y-3">
                {pedido.detalles.map((detalle: any) => (
                  <div
                    key={detalle.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {detalle.producto.nombre}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {detalle.producto.atributos && (
                          <span className="block text-xs">
                            {detalle.producto.atributos}
                          </span>
                        )}
                        <span>Código: {detalle.producto.codigo}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          {detalle.cantidad} x{" "}
                          {formatCurrency(detalle.precio, simbolo)}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(detalle.total, simbolo)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {mostrarImpuestos && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Desglose de Impuestos
                  </h4>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          Base Gravable 15%:
                        </span>
                        <div className="font-medium">
                          {formatCurrency(pedido.importe_gravado_15, simbolo)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Base Gravable 18%:
                        </span>
                        <div className="font-medium">
                          {formatCurrency(pedido.importe_gravado_18, simbolo)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Importe Exento:</span>
                        <div className="font-medium text-green-600">
                          {formatCurrency(pedido.importe_exento, simbolo)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Importe Exonerado:
                        </span>
                        <div className="font-medium text-green-600">
                          {formatCurrency(pedido.importe_exonerado, simbolo)}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">ISV 15%:</span>
                        <div className="font-medium text-red-600">
                          +{formatCurrency(pedido.isv_15, simbolo)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">ISV 18%:</span>
                        <div className="font-medium text-red-600">
                          +{formatCurrency(pedido.isv_18, simbolo)}
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-yellow-800 font-medium">
                          Total Impuestos:
                        </span>
                        <span className="text-red-600 font-bold">
                          +{formatCurrency(totalImpuestos.toString(), simbolo)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(pedido.sub_total, simbolo)}
                    </span>
                  </div>

                  {totalImpuestos > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Impuestos</span>
                      <span className="text-red-600 font-medium">
                        +{formatCurrency(totalImpuestos.toString(), simbolo)}
                      </span>
                    </div>
                  )}

                  {pedido.tipo_entrega === TipoEntrega.DELIVERY && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Costo de Delivery
                      </span>
                      <span className="text-orange-600 font-medium">
                        +{formatCurrency(pedido.costo_delivery, simbolo)}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total General
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(pedido.total, simbolo)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            {pedido.estado === "pendiente" && (
              <>
                <Button
                  onClick={() => openDialog("procesar")}
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Procesar Pedido
                </Button>
                <Button
                  onClick={() => openDialog("cancelar")}
                  variant="destructive"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar Pedido
                </Button>
              </>
            )}

            {pedido.estado === "procesado" && (
              <>
                <Button
                  onClick={() => setShowFacturaForm(true)}
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Marcar como Facturado
                </Button>
                <Button
                  onClick={() => openDialog("cancelar")}
                  variant="destructive"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar Pedido
                </Button>
              </>
            )}

            {pedido.estado === "facturado" && (
              <div className="text-sm text-gray-500 italic">
                Este pedido ya ha sido facturado
              </div>
            )}

            {pedido.estado === "cancelado" && (
              <div className="text-sm text-red-500 italic">
                Este pedido ha sido cancelado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <div className="flex justify-end">
            <AlertDialogCancel
              className="rounded-full p-1 hover:bg-muted"
              onClick={closeDialog}
            >
              ✕
            </AlertDialogCancel>
          </div>

          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {dialogConfig.icon}
              <AlertDialogTitle
                className={`text-xl font-semibold ${
                  dialogType === "cancelar"
                    ? "text-destructive"
                    : "text-foreground"
                }`}
              >
                {dialogConfig.title}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground">
              {dialogConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 flex justify-end gap-3">
            <AlertDialogCancel
              className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition"
              onClick={closeDialog}
            >
              No, volver
            </AlertDialogCancel>
            <AlertDialogAction
              className={`px-4 py-2 rounded-md transition ${
                dialogType === "cancelar"
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : dialogType === "procesar"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-green-600 text-white hover:bg-green-700"
              }`}
              onClick={handleCambiarEstado}
              disabled={mutationEdit.isPending}
            >
              {mutationEdit.isPending
                ? "Procesando..."
                : dialogConfig.buttonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showFacturaForm} onOpenChange={setShowFacturaForm}>
        <AlertDialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel onClick={() => setShowFacturaForm(false)}>
              ✕
            </AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Generar Factura desde Pedido</AlertDialogTitle>
            <AlertDialogDescription>
              Complete los detalles de la factura. Los datos del pedido se han
              precargado automáticamente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <FormFacturarDesdePedido
            pedido={pedido}
            onSuccess={() => {
              setShowFacturaForm(false);
              // Opcional: Actualizar el estado del pedido a facturado
              // Podrías llamar a la mutación para actualizar el estado aquí
            }}
            onCancel={() => setShowFacturaForm(false)}
            simbolo={simbolo}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PedidoCard;
