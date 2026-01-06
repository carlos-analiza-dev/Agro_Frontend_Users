import { ProcesarFactura } from "@/apis/facturas/accions/procesar-factura";
import { VerificarExistencia } from "@/apis/facturas/accions/verificar-existencia";
import { CancelarFactura } from "@/apis/facturas/accions/cancelar-factura";
import {
  Factura,
  ResponseFacturasInterface,
} from "@/apis/facturas/interfaces/response-facturas.interface";
import { ResponseExistenciaInterface } from "@/apis/facturas/interfaces/verificar-existencia.interface";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import {
  Download,
  Edit,
  Eye,
  FileText,
  User2,
  CheckCircle,
  Package,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import FormEditFactura from "./FormEditFactura";
import { Badge } from "@/components/ui/badge";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/interfaces/auth/user";
import { AutorizarCancelacionFactura } from "@/apis/facturas/accions/autorizar-factura";
import { useFacturaDownload } from "@/helpers/funciones/useFacturaDownload";

interface Props {
  facturas: ResponseFacturasInterface | undefined;
  onFacturaActualizada?: () => void;
  user: User | undefined;
}

const TableFacturas = ({ facturas, onFacturaActualizada, user }: Props) => {
  const userId = user?.id || "";
  const rolUsuario = user?.role.name || "";
  const esAdministrador = rolUsuario === "Administrador";
  const queryClient = useQueryClient();
  const [descargandoId, setDescargandoId] = useState<string | null>(null);
  const [facturaPreview, setFacturaPreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [facturaEditando, setFacturaEditando] = useState<Factura | null>(null);
  const [procesandoId, setProcesandoId] = useState<string | null>(null);
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);
  const [autorizandoId, setAutorizandoId] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isAutorizarDialogOpen, setIsAutorizarDialogOpen] = useState(false);
  const [facturaAProcesar, setFacturaAProcesar] = useState<Factura | null>(
    null
  );
  const [facturaACancelar, setFacturaACancelar] = useState<Factura | null>(
    null
  );
  const [facturaAAutorizar, setFacturaAAutorizar] = useState<Factura | null>(
    null
  );
  const [verificandoExistencia, setVerificandoExistencia] = useState<
    string | null
  >(null);
  const [resultadoVerificacion, setResultadoVerificacion] =
    useState<ResponseExistenciaInterface | null>(null);
  const [isVerificacionDialogOpen, setIsVerificacionDialogOpen] =
    useState(false);
  const { descargarFactura, verFactura, loading } = useFacturaDownload();

  const handleDescargarFactura = async (factura: Factura) => {
    setDescargandoId(factura.id);
    try {
      const result = await descargarFactura(factura.id, factura.numero_factura);

      if (result.success) {
        toast.success("Factura descargada exitosamente");
      } else {
        toast.error(result.error || "Error al descargar la factura");
      }
    } catch (error) {
      toast.error("Error inesperado al descargar la factura");
    } finally {
      setDescargandoId(null);
    }
  };

  const handlePreviewFactura = async (factura: Factura) => {
    try {
      const objectUrl = await verFactura(factura.id, factura.numero_factura);
      setFacturaPreview(objectUrl);
    } catch (error) {
      toast.error("Error al obtener la vista previa de la factura");
    }
  };

  const handleAbrirAutorizacionCancelacion = (factura: Factura) => {
    setFacturaAAutorizar(factura);
    setIsAutorizarDialogOpen(true);
  };

  const handleEditFactura = (factura: Factura) => {
    setFacturaEditando(factura);
    setIsOpen(true);
  };

  const handleEditSuccess = () => {
    setIsOpen(false);
    setFacturaEditando(null);
    onFacturaActualizada?.();
  };

  const handleCancelEdit = () => {
    setIsOpen(false);
    setFacturaEditando(null);
  };

  const verificarExistencia = async (factura: Factura) => {
    setVerificandoExistencia(factura.id);

    try {
      const data = await VerificarExistencia(factura.id);

      setResultadoVerificacion(data);
      setIsVerificacionDialogOpen(true);

      if (!data.suficiente) {
        toast.warning("⚠️ Algunos productos no tienen stock suficiente.");
      } else {
        toast.success("✅ Stock suficiente para procesar la factura.");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Error al verificar existencia.";
        toast.error(message);
      } else {
        toast.error("Error inesperado al verificar existencia.");
      }
    } finally {
      setVerificandoExistencia(null);
    }
  };

  const handleAbrirConfirmacionProcesar = async (factura: Factura) => {
    setFacturaAProcesar(factura);

    setVerificandoExistencia(factura.id);
    try {
      const data = await VerificarExistencia(factura.id);

      if (data.suficiente) {
        setIsConfirmDialogOpen(true);
      } else {
        setResultadoVerificacion(data);
        setIsVerificacionDialogOpen(true);
        toast.warning("Existen productos con stock insuficiente");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Error al verificar existencia.";
        toast.error(message);
      } else {
        toast.error("Error inesperado al verificar existencia");
      }
    } finally {
      setVerificandoExistencia(null);
    }
  };

  const handleAbrirConfirmacionCancelar = (factura: Factura) => {
    setFacturaACancelar(factura);
    setIsCancelDialogOpen(true);
  };

  const handleCerrarConfirmacion = () => {
    setIsConfirmDialogOpen(false);
    setFacturaAProcesar(null);
  };

  const handleCerrarCancelacion = () => {
    setIsCancelDialogOpen(false);
    setFacturaACancelar(null);
  };

  const handleCerrarVerificacion = () => {
    setIsVerificacionDialogOpen(false);
    setResultadoVerificacion(null);
  };

  const mostrarBotonAutorizar = (factura: Factura) => {
    return (
      esAdministrador &&
      factura.estado === "Procesada" &&
      !factura.autorizada_cancelacion &&
      factura.usuario_id !== user?.id
    );
  };

  const handleProcesarFacturaConfirmada = async () => {
    if (!facturaAProcesar) return;

    setProcesandoId(facturaAProcesar.id);
    setIsConfirmDialogOpen(false);

    try {
      await ProcesarFactura(facturaAProcesar.id, {});
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["compras-admin"] });
      queryClient.invalidateQueries({ queryKey: ["lotes-producto"] });
      toast.success("✅ Factura procesada exitosamente");

      onFacturaActualizada?.();
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Error al procesar la factura";
        toast.error(message);
      } else {
        toast.error("Error inesperado al procesar la factura");
      }
    } finally {
      setProcesandoId(null);
      setFacturaAProcesar(null);
    }
  };

  const handleCancelarFacturaConfirmada = async () => {
    if (!facturaACancelar) return;

    setCancelandoId(facturaACancelar.id);
    setIsCancelDialogOpen(false);

    try {
      await CancelarFactura(facturaACancelar.id, {});
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["compras-admin"] });
      queryClient.invalidateQueries({ queryKey: ["lotes-producto"] });
      toast.success("✅ Factura cancelada exitosamente");

      onFacturaActualizada?.();
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Error al cancelar la factura";
        toast.error(message);
      } else {
        toast.error("Error inesperado al cancelar la factura");
      }
    } finally {
      setCancelandoId(null);
      setFacturaACancelar(null);
    }
  };

  const handleCerrarAutorizacion = () => {
    setIsAutorizarDialogOpen(false);
    setFacturaAAutorizar(null);
  };

  const handleAutorizarCancelacionConfirmada = async () => {
    if (!facturaAAutorizar) return;

    setAutorizandoId(facturaAAutorizar.id);
    setIsAutorizarDialogOpen(false);

    try {
      await AutorizarCancelacionFactura(facturaAAutorizar.id);
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      toast.success("✅ Cancelación autorizada exitosamente");

      onFacturaActualizada?.();
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Error al autorizar la cancelación";
        toast.error(message);
      } else {
        toast.error("Error inesperado al autorizar la cancelación");
      }
    } finally {
      setAutorizandoId(null);
      setFacturaAAutorizar(null);
    }
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Procesada":
        return "default";
      case "Emitida":
        return "secondary";
      case "Cancelada":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case "Procesada":
        return "bg-green-100 text-green-800 border-green-200";
      case "Emitida":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelada":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">N° Factura</TableHead>
            <TableHead className="text-center">Facturado</TableHead>
            <TableHead className="text-center">Cliente</TableHead>

            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Sub Total</TableHead>
            <TableHead className="text-center">Total</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facturas?.data?.map((factura) => (
            <TableRow key={factura.id}>
              <TableCell className="font-medium">
                <div className="flex justify-center items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  {factura.numero_factura}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center items-center gap-2">
                  <User2 className="h-4 w-4 text-gray-500" />
                  {factura.usuario && userId === factura.usuario.id ? (
                    <p className="font-medium">Tú</p>
                  ) : factura.usuario ? (
                    <div>
                      <p className="font-medium">{factura.usuario.name}</p>
                      <p className="text-sm text-gray-500">
                        {factura.usuario.identificacion}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Sin asignar</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center items-center gap-2">
                  <User2 className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{factura.cliente.nombre}</p>
                    <p className="text-sm text-gray-500">
                      {factura.cliente.identificacion}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex justify-center items-center gap-2">
                  <Badge
                    variant={getEstadoBadgeVariant(factura.estado)}
                    className={getEstadoBadgeClass(factura.estado)}
                  >
                    {factura.estado}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {formatCurrency(factura.sub_total, factura.pais.simbolo_moneda)}
              </TableCell>
              <TableCell className="text-center font-semibold">
                {formatCurrency(factura.total, factura.pais.simbolo_moneda)}
              </TableCell>

              <TableCell>
                <div className="flex gap-2 justify-center">
                  {factura.estado === "Emitida" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditFactura(factura)}
                        title="Editar Factura"
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        title="Verificar Stock"
                        onClick={() => verificarExistencia(factura)}
                        disabled={verificandoExistencia === factura.id}
                        className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:text-blue-800"
                      >
                        {verificandoExistencia === factura.id ? (
                          <>
                            <div className="h-3 w-3 animate-spin rounded-full border border-blue-300 border-t-blue-600" />
                            <span>Verificando...</span>
                          </>
                        ) : (
                          <>
                            <Package className="h-4 w-4" />
                            <span>Verificar Stock</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAbrirConfirmacionProcesar(factura)}
                        title="Procesar Factura"
                        disabled={
                          procesandoId === factura.id ||
                          verificandoExistencia === factura.id
                        }
                        className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:text-green-800"
                      >
                        {procesandoId === factura.id ? (
                          <>
                            <div className="h-3 w-3 animate-spin rounded-full border border-green-300 border-t-green-600" />
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Procesar</span>
                          </>
                        )}
                      </Button>
                    </>
                  )}

                  {factura.estado === "Procesada" && (
                    <>
                      {mostrarBotonAutorizar(factura) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAbrirAutorizacionCancelacion(factura)
                          }
                          title="Autorizar Cancelación"
                          disabled={autorizandoId === factura.id}
                          className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:text-purple-800"
                        >
                          {autorizandoId === factura.id ? (
                            <>
                              <div className="h-3 w-3 animate-spin rounded-full border border-purple-300 border-t-purple-600" />
                              <span>Autorizando...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="h-4 w-4" />
                              <span>Autorizar</span>
                            </>
                          )}
                        </Button>
                      )}

                      {(factura.autorizada_cancelacion || esAdministrador) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAbrirConfirmacionCancelar(factura)
                          }
                          title="Cancelar Factura"
                          disabled={cancelandoId === factura.id}
                          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:text-red-800"
                        >
                          {cancelandoId === factura.id ? (
                            <>
                              <div className="h-3 w-3 animate-spin rounded-full border border-red-300 border-t-red-600" />
                              <span>Cancelando...</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="h-4 w-4" />
                              <span>Cancelar</span>
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewFactura(factura)}
                    title="Ver Factura"
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDescargarFactura(factura)}
                    title="Descargar Factura"
                    disabled={descargandoId === factura.id}
                    className="flex items-center gap-1"
                  >
                    {descargandoId === factura.id ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-gray-900" />
                        <span>Descargando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>PDF</span>
                      </>
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={isAutorizarDialogOpen}
        onOpenChange={setIsAutorizarDialogOpen}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
              Autorizar Cancelación
            </AlertDialogTitle>

            <div className="text-sm text-muted-foreground space-y-3">
              <p>
                ¿Está seguro que desea autorizar la cancelación de la factura{" "}
                <strong>{facturaAAutorizar?.numero_factura}</strong>?
              </p>
              <div className="bg-purple-50 p-3 rounded-md text-sm border border-purple-200">
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                  <User2 className="h-4 w-4" />
                  <span className="font-medium">Información de la Factura</span>
                </div>
                <p>
                  <strong>Cliente:</strong> {facturaAAutorizar?.cliente.nombre}
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  {facturaAAutorizar &&
                    formatCurrency(
                      facturaAAutorizar.total,
                      facturaAAutorizar.pais.simbolo_moneda
                    )}
                </p>
                <p>
                  <strong>Creada por: </strong>{" "}
                  {facturaAAutorizar?.usuario.name}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Al autorizar, el usuario que creó esta factura podrá cancelarla.
                Esta autorización será válida por 24 horas.
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCerrarAutorizacion}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAutorizarCancelacionConfirmada}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Sí, Autorizar Cancelación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Confirmar Procesamiento
            </AlertDialogTitle>

            <div className="text-sm text-muted-foreground space-y-3">
              <p>
                ¿Está seguro que desea procesar la factura{" "}
                <strong>{facturaAProcesar?.numero_factura}</strong>?
              </p>
              <div className="bg-green-50 p-3 rounded-md text-sm border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">Stock verificado ✓</span>
                </div>
                <p>
                  <strong>Cliente:</strong> {facturaAProcesar?.cliente.nombre}
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  {facturaAProcesar &&
                    formatCurrency(
                      facturaAProcesar.total,
                      facturaAProcesar.pais.simbolo_moneda
                    )}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Esta acción descontará los productos de los lotes y cambiará el
                estado a "Procesada".
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCerrarConfirmacion}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProcesarFacturaConfirmada}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Sí, Procesar Factura
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Confirmar Cancelación
            </AlertDialogTitle>

            <div className="text-sm text-muted-foreground space-y-3">
              <p>
                ¿Está seguro que desea cancelar la factura{" "}
                <strong>{facturaACancelar?.numero_factura}</strong>?
              </p>
              <div className="bg-red-50 p-3 rounded-md text-sm border border-red-200">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <RotateCcw className="h-4 w-4" />
                  <span className="font-medium">Devolver productos ✓</span>
                </div>
                <p>
                  <strong>Cliente:</strong> {facturaACancelar?.cliente.nombre}
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  {facturaACancelar &&
                    formatCurrency(
                      facturaACancelar.total,
                      facturaACancelar.pais.simbolo_moneda
                    )}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Esta acción devolverá los productos a sus lotes originales y
                cambiará el estado a "Cancelada".
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCerrarCancelacion}>
              Mantener Factura
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelarFacturaConfirmada}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Sí, Cancelar Factura
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isVerificacionDialogOpen}
        onOpenChange={setIsVerificacionDialogOpen}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {resultadoVerificacion?.suficiente ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              )}
              Verificación de Stock
            </AlertDialogTitle>

            <div className="text-sm text-muted-foreground space-y-3">
              <p>
                Resultado de la verificación para la factura{" "}
                <strong>{facturaAProcesar?.numero_factura}</strong>
              </p>

              <div
                className={`p-3 rounded-md border ${
                  resultadoVerificacion?.suficiente
                    ? "bg-green-50 border-green-200"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {resultadoVerificacion?.suficiente ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-700">
                        Stock suficiente
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-700">
                        Stock insuficiente
                      </span>
                    </>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">Producto</th>
                        <th className="text-center py-1">Requerido</th>
                        <th className="text-center py-1">Disponible</th>
                        <th className="text-center py-1">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultadoVerificacion?.detalles.map((detalle, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-1">{detalle.productoNombre}</td>
                          <td className="text-center py-1">
                            {detalle.cantidadRequerida}
                          </td>
                          <td className="text-center py-1">
                            {detalle.existenciaDisponible !== null
                              ? detalle.existenciaDisponible
                              : "N/A"}
                          </td>
                          <td className="text-center py-1">
                            {detalle.suficiente ? (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-200 text-xs"
                              >
                                ✓
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800 border-red-200 text-xs"
                              >
                                ✗
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {!resultadoVerificacion?.suficiente && (
                <p className="text-orange-600 text-xs">
                  No se puede procesar la factura hasta que se resuelvan los
                  problemas de stock.
                </p>
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCerrarVerificacion}>
              Cerrar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {facturaPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                Vista Previa de la Factura
              </h2>
              <Button variant="ghost" onClick={() => setFacturaPreview(null)}>
                Cerrar
              </Button>
            </div>
            <iframe
              src={facturaPreview}
              className="w-full h-full"
              title="Vista previa de la factura"
            />
          </div>
        </div>
      )}

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="p-4 md:max-w-5xl h-full overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel onClick={handleCancelEdit}>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Edición de Factura {facturaEditando?.numero_factura}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Aquí puede editar las facturas que aún no están procesadas
            </AlertDialogDescription>
          </AlertDialogHeader>
          {facturaEditando && (
            <FormEditFactura
              factura={facturaEditando}
              onSuccess={handleEditSuccess}
              onCancel={handleCancelEdit}
            />
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableFacturas;
