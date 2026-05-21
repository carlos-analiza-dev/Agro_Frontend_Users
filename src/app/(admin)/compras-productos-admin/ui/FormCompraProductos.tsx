"use client";

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
import { tiposPagos } from "@/helpers/data/tiposPagos";
import useGetProductosDisponibles from "@/hooks/productos/useGetProductosDisponibles";
import useGetProveedoresActivos from "@/hooks/proveedores/useGetProveedoresActivos";
import { useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Plus,
  Trash2,
  Search,
  Package,
  Filter,
  X,
  CheckCircle2Icon,
  AlertCircleIcon,
} from "lucide-react";
import useGetTaxesPais from "@/hooks/impuestos/useGetTaxesPais";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { CrearCompra } from "@/apis/compras_productos/accions/crear-compra";
import { toast } from "react-toastify";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
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
import { ProductoCompra } from "@/apis/compras_productos/interface/productos_compra.interface";
import ResumenCompra from "@/components/generics/ResumenCompra";
import DetailsCompra from "@/components/generics/DetailsCompra";
import DetailsConfirmCompra from "@/components/generics/DetailsConfirmCompra";
import { ObtenerDescuentoProveedorAndProducto } from "@/apis/descuentos_producto/accions/descuentos-proveedor-producto";
import { ObtenerEscalasProveedorAndProducto } from "@/apis/escala-producto/accions/escalas-proveedor-producto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormCompra {
  sucursalId: string;
  proveedorId: string;
  tipoPago: string;
  numero_factura: string;
  productos: ProductoCompra[];
}

interface Props {
  onSuccess: () => void;
}

const FormCompraProductos = ({ onSuccess }: Props) => {
  const { user } = useAuthStore();
  const [isConfirmCompra, setIsConfirmCompra] = useState(false);
  const [compraDataToSubmit, setCompraDataToSubmit] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [tempSelectedIndex, setTempSelectedIndex] = useState<number | null>(
    null,
  );
  const paisId = user?.pais.id || "";
  const sucursalId = user?.sucursal.id || "";
  const queryClient = useQueryClient();

  const crearCompraMutation = useMutation({
    mutationFn: CrearCompra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras-admin"] });
      queryClient.invalidateQueries({ queryKey: ["existencia-productos"] });
      toast.success("Compra creada exitosamente");
      onSuccess();
      reset();
      setIsConfirmCompra(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al ejecutar la compra";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de ejecutar la compra. Inténtalo de nuevo.",
        );
      }
      setIsConfirmCompra(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormCompra>({
    defaultValues: {
      productos: [
        {
          productoId: "",
          cantidad: 0,
          bonificacion: 0,
          costoUnitario: 0,
          descuento: 0,
          impuesto: 0,
        },
      ],
      proveedorId: "",
      tipoPago: "",
      numero_factura: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productos",
  });

  const { data: proveedores } = useGetProveedoresActivos();
  const { data: productosData } = useGetProductosDisponibles();
  const { data: impuestos } = useGetTaxesPais();
  const productos = productosData?.data.productos || [];

  const productosWatch = watch("productos");
  const proveedorId = watch("proveedorId");
  const tipoPago = watch("tipoPago");
  const numero_factura = watch("numero_factura");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    productos.forEach((prod) => {
      if (prod.categoria?.nombre) {
        cats.add(prod.categoria.nombre);
      }
    });
    return Array.from(cats);
  }, [productos]);

  const filteredProducts = useMemo(() => {
    return productos.filter((prod) => {
      const matchesSearch =
        searchTerm === "" ||
        prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.codigo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        prod.categoria?.nombre === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [productos, searchTerm, selectedCategory]);

  const descuentosQueries = useQueries({
    queries: productosWatch.map((producto) => ({
      queryKey: [
        "descuento-proveedor-producto",
        proveedorId,
        producto.productoId,
      ],
      queryFn: () =>
        ObtenerDescuentoProveedorAndProducto(proveedorId, producto.productoId),
      enabled: !!proveedorId && !!producto.productoId,
    })),
  });

  const escalasQueries = useQueries({
    queries: productosWatch.map((producto) => ({
      queryKey: [
        "escalas-proveedor-producto",
        proveedorId,
        producto.productoId,
      ],
      queryFn: () =>
        ObtenerEscalasProveedorAndProducto(proveedorId, producto.productoId),
      enabled: !!proveedorId && !!producto.productoId,
    })),
  });

  const handleProveedorChange = (value: string) => {
    setValue("proveedorId", value);
    const proveedorSeleccionado = proveedores?.find((p) => p.id === value);

    if (proveedorSeleccionado && proveedorSeleccionado.tipo_pago_default) {
      const tipoPagoFromAPI = proveedorSeleccionado.tipo_pago_default
        .toUpperCase()
        .trim();

      const tipoPagoMatch = tiposPagos.find(
        (tipo) => tipo.value.toUpperCase() === tipoPagoFromAPI,
      );

      if (tipoPagoMatch) {
        setValue("tipoPago", tipoPagoMatch.value);
      } else {
        toast.warning(
          `Tipo de pago "${proveedorSeleccionado.tipo_pago_default}" no coincide con los valores disponibles`,
        );
        setValue("tipoPago", "");
      }
    } else {
      setValue("tipoPago", "");
    }
  };

  const getTipoPagoLabel = (value: string) => {
    const tipo = tiposPagos.find((t) => t.value === value);
    return tipo ? tipo.label : "";
  };

  const proveedorSeleccionado = proveedores?.find((p) => p.id === proveedorId);
  const tipoPagoSeleccionado = tiposPagos?.find((t) => t.value === tipoPago);

  const isFormValid = () => {
    if (!proveedorId || !tipoPago || !sucursalId || !numero_factura)
      return false;

    return productosWatch.every(
      (producto) =>
        producto.productoId &&
        producto.cantidad > 0 &&
        producto.costoUnitario > 0,
    );
  };

  const getProductosDisponibles = (currentIndex: number) => {
    return productos.filter((producto) => {
      if (productosWatch?.[currentIndex]?.productoId === producto.id) {
        return true;
      }
      const estaSeleccionado = productosWatch?.some(
        (p, index) => index !== currentIndex && p.productoId === producto.id,
      );
      return !estaSeleccionado;
    });
  };

  const openProductSelector = (index: number) => {
    setTempSelectedIndex(index);
    setIsProductDialogOpen(true);
  };

  const selectProduct = (productId: string) => {
    if (tempSelectedIndex !== null) {
      handleProductoChange(tempSelectedIndex, productId);
      setIsProductDialogOpen(false);
      setTempSelectedIndex(null);
      setSearchTerm("");
      setSelectedCategory("all");
    }
  };

  const calcularTotales = () => {
    let subtotal = 0;
    let totalImpuestos = 0;
    let totalDescuentos = 0;
    let total = 0;

    productosWatch?.forEach((producto) => {
      const cantidadTotal = producto.cantidad;
      const subtotalProducto = cantidadTotal * (producto.costoUnitario || 0);
      const descuentoProducto =
        subtotalProducto * ((producto.descuento || 0) / 100);
      const subtotalConDescuento = subtotalProducto - descuentoProducto;
      const impuestoProducto =
        subtotalConDescuento * ((producto.impuesto || 0) / 100);

      subtotal += subtotalProducto;
      totalDescuentos += descuentoProducto;
      totalImpuestos += impuestoProducto;
      total += subtotalConDescuento + impuestoProducto;
    });

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalImpuestos: parseFloat(totalImpuestos.toFixed(2)),
      totalDescuentos: parseFloat(totalDescuentos.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  };

  const { subtotal, totalImpuestos, totalDescuentos, total } =
    calcularTotales();

  const prepareCompraData = (data: FormCompra) => {
    const detalles = data.productos.map((producto) => {
      const subtotalProducto = producto.cantidad * producto.costoUnitario;
      const descuentoProducto = subtotalProducto * (producto.descuento / 100);
      const subtotalConDescuento = subtotalProducto - descuentoProducto;
      const impuestoProducto = subtotalConDescuento * (producto.impuesto / 100);

      return {
        productoId: producto.productoId,
        costo_por_unidad: producto.costoUnitario,
        cantidad: producto.cantidad,
        bonificacion: producto.bonificacion || 0,
        descuentos: parseFloat(descuentoProducto.toFixed(2)),
        impuestos: parseFloat(impuestoProducto.toFixed(2)),
      };
    });

    return {
      proveedorId: data.proveedorId,
      sucursalId: sucursalId,
      paisId: paisId,
      tipo_pago: data.tipoPago.toUpperCase(),
      numero_factura: data.numero_factura,
      subtotal: subtotal,
      descuentos: totalDescuentos,
      impuestos: totalImpuestos,
      total: total,
      detalles: detalles,
    };
  };

  const onSubmit = (data: FormCompra) => {
    if (!isFormValid()) {
      toast.error("Por favor, complete todos los campos requeridos");
      return;
    }

    const compraData = prepareCompraData(data);
    setCompraDataToSubmit(compraData);
    setIsConfirmCompra(true);
  };

  const confirmCompra = () => {
    if (compraDataToSubmit) {
      crearCompraMutation.mutate(compraDataToSubmit);
    }
  };

  const handleProductoChange = (index: number, productoId: string) => {
    setValue(`productos.${index}.productoId`, productoId);

    const productoSeleccionado = productos.find((p) => p.id === productoId);
    if (productoSeleccionado) {
      const impuestoPorcentaje = productoSeleccionado.tax?.porcentaje
        ? parseFloat(productoSeleccionado.tax.porcentaje)
        : 0;

      setValue(`productos.${index}.costoUnitario`, 0);
      setValue(`productos.${index}.impuesto`, impuestoPorcentaje);
      setValue(`productos.${index}.cantidad`, 1);
    } else {
      setValue(`productos.${index}.costoUnitario`, 0);
      setValue(`productos.${index}.impuesto`, 0);
      setValue(`productos.${index}.cantidad`, 0);
    }
  };

  const handleImpuestoChange = (index: number, value: string) => {
    setValue(`productos.${index}.impuesto`, Number(value));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Proveedor *</Label>
                <Select
                  value={proveedorId}
                  onValueChange={handleProveedorChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Proveedor</SelectLabel>
                      {proveedores?.map((prov) => (
                        <SelectItem value={prov.id} key={prov.id}>
                          {prov.nombre_legal} - {prov.nit_rtn}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.proveedorId && (
                  <p className="text-sm text-red-500">
                    {errors.proveedorId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Número de Factura *</Label>
                <Input
                  type="text"
                  placeholder="Ej: FAC-00123"
                  {...register("numero_factura", {
                    required: "El número de factura es obligatorio",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  })}
                />
                {errors.numero_factura && (
                  <p className="text-sm text-red-500">
                    {errors.numero_factura.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Tipo de Pago *</Label>
                <Input
                  type="text"
                  readOnly
                  value={
                    getTipoPagoLabel(tipoPago) || "Seleccione un proveedor"
                  }
                  className="bg-gray-100 cursor-not-allowed"
                />
                {errors.tipoPago && (
                  <p className="text-sm text-red-500">
                    {errors.tipoPago.message}
                  </p>
                )}
                {proveedorSeleccionado?.tipo_pago_default && tipoPago && (
                  <p className="text-sm text-green-600">
                    Tipo de pago por defecto del proveedor
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          {!proveedorId && (
            <div className="flex justify-center p-4">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircleIcon />
                <AlertTitle>Proveedor</AlertTitle>
                <AlertDescription>
                  Selecciona un proveedor para poder ingresar productos
                </AlertDescription>
              </Alert>
            </div>
          )}
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Productos de la Compra</CardTitle>
              {proveedorSeleccionado && proveedorSeleccionado.tipo_escala && (
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700"
                  >
                    Escala: {proveedorSeleccionado.tipo_escala}
                  </Badge>
                  {proveedorSeleccionado?.tipo_pago_default === "CREDITO" && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700"
                    >
                      Plazo: {proveedorSeleccionado.plazo || 30} días
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={() =>
                append({
                  productoId: "",
                  cantidad: 0,
                  bonificacion: 0,
                  costoUnitario: 0,
                  descuento: 0,
                  impuesto: 0,
                  paisId: "",
                })
              }
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Agregar Producto
            </Button>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-600">
                  No hay productos agregados
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Comienza agregando productos a tu compra
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      productoId: "",
                      cantidad: 0,
                      bonificacion: 0,
                      costoUnitario: 0,
                      descuento: 0,
                      impuesto: 0,
                      paisId: "",
                    })
                  }
                  className="mt-4"
                >
                  <Plus size={16} className="mr-2" />
                  Agregar primer producto
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {fields.map((field, index) => {
                  const descuentos = descuentosQueries[index]?.data;
                  const escalas = escalasQueries[index]?.data;
                  const productoSeleccionado = productos.find(
                    (p) => p.id === productosWatch?.[index]?.productoId,
                  );
                  const cantidadPagada = productosWatch?.[index]?.cantidad || 0;
                  const bonificacion =
                    productosWatch?.[index]?.bonificacion || 0;
                  const subtotalProducto =
                    cantidadPagada *
                    (productosWatch?.[index]?.costoUnitario || 0);
                  const descuentoProducto =
                    subtotalProducto *
                    ((productosWatch?.[index]?.descuento || 0) / 100);
                  const subtotalConDescuento =
                    subtotalProducto - descuentoProducto;
                  const impuestoProducto =
                    subtotalConDescuento *
                    ((productosWatch?.[index]?.impuesto || 0) / 100);
                  const totalProducto = subtotalConDescuento + impuestoProducto;

                  const productosDisponibles = getProductosDisponibles(index);

                  return (
                    <Card key={field.id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              Producto #{index + 1}
                            </Badge>
                            {productoSeleccionado && (
                              <Badge variant="outline">
                                {productoSeleccionado.codigo}
                              </Badge>
                            )}
                          </div>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="font-semibold">Producto *</Label>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Select
                                value={
                                  productosWatch?.[index]?.productoId || ""
                                }
                                onValueChange={(value) =>
                                  handleProductoChange(index, value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar producto" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="p-2 border-b">
                                    <div className="relative">
                                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                      <Input
                                        placeholder="Buscar producto..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) =>
                                          setSearchTerm(e.target.value)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  </div>
                                  <ScrollArea className="h-64">
                                    <SelectGroup>
                                      <SelectLabel>
                                        Productos Disponibles
                                      </SelectLabel>
                                      {productosDisponibles
                                        .filter(
                                          (p) =>
                                            searchTerm === "" ||
                                            p.nombre
                                              .toLowerCase()
                                              .includes(
                                                searchTerm.toLowerCase(),
                                              ) ||
                                            p.codigo
                                              .toLowerCase()
                                              .includes(
                                                searchTerm.toLowerCase(),
                                              ),
                                        )
                                        .map((prod) => (
                                          <SelectItem
                                            value={prod.id}
                                            key={prod.id}
                                          >
                                            <div className="flex flex-col">
                                              <span className="font-medium">
                                                {prod.nombre}
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                Código: {prod.codigo}
                                              </span>
                                            </div>
                                          </SelectItem>
                                        ))}
                                    </SelectGroup>
                                  </ScrollArea>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => openProductSelector(index)}
                              title="Buscar producto"
                            >
                              <Search size={16} />
                            </Button>
                          </div>
                          {errors.productos?.[index]?.productoId && (
                            <p className="text-sm text-red-500">
                              {errors.productos[index]?.productoId?.message}
                            </p>
                          )}
                        </div>

                        {productoSeleccionado && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-blue-50 rounded-lg">
                            <div>
                              <p className="text-xs text-gray-500">Código</p>
                              <p className="text-sm font-medium">
                                {productoSeleccionado.codigo}
                              </p>
                            </div>
                            {productoSeleccionado.marca && (
                              <div>
                                <p className="text-xs text-gray-500">Marca</p>
                                <p className="text-sm">
                                  {productoSeleccionado.marca.nombre}
                                </p>
                              </div>
                            )}
                            {productoSeleccionado.categoria && (
                              <div>
                                <p className="text-xs text-gray-500">
                                  Categoría
                                </p>
                                <p className="text-sm">
                                  {productoSeleccionado.categoria.nombre}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-gray-500">Impuesto</p>
                              <p className="text-sm">
                                {productoSeleccionado.tax?.porcentaje || 0}%
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          <div className="space-y-2">
                            <Label className="font-semibold">Cantidad *</Label>
                            <Select
                              value={
                                productosWatch?.[index]?.cantidad?.toString() ||
                                ""
                              }
                              onValueChange={(value) => {
                                const cantidad = Number(value);
                                if (
                                  proveedorSeleccionado?.tipo_escala ===
                                  "ESCALA"
                                ) {
                                  const escala = escalas?.find(
                                    (d) => d.cantidad_comprada === cantidad,
                                  );
                                  setValue(
                                    `productos.${index}.cantidad`,
                                    cantidad,
                                  );
                                  setValue(
                                    `productos.${index}.bonificacion`,
                                    escala?.bonificacion ?? 0,
                                  );
                                  setValue(
                                    `productos.${index}.costoUnitario`,
                                    escala?.costo ?? 0,
                                  );
                                } else {
                                  const descuento = descuentos?.find(
                                    (d) => d.cantidad_comprada === cantidad,
                                  );
                                  setValue(
                                    `productos.${index}.cantidad`,
                                    cantidad,
                                  );
                                  setValue(
                                    `productos.${index}.descuento`,
                                    descuento?.descuentos ?? 0,
                                  );
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Cantidades</SelectLabel>
                                  {proveedorSeleccionado?.tipo_escala ===
                                    "ESCALA" &&
                                    escalas?.map((escala) => (
                                      <SelectItem
                                        value={escala.cantidad_comprada.toString()}
                                        key={escala.id}
                                      >
                                        {escala.cantidad_comprada} unidades →{" "}
                                        {escala.bonificacion} bonus
                                      </SelectItem>
                                    ))}
                                  {proveedorSeleccionado?.tipo_escala ===
                                    "DESCUENTO" &&
                                    descuentos?.map((desc) => (
                                      <SelectItem
                                        value={desc.cantidad_comprada.toString()}
                                        key={desc.id}
                                      >
                                        {desc.cantidad_comprada} unidades →{" "}
                                        {desc.descuentos}% descuento
                                      </SelectItem>
                                    ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-semibold">
                              Costo Unitario
                            </Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              {...register(
                                `productos.${index}.costoUnitario` as const,
                                {
                                  valueAsNumber: true,
                                  min: { value: 0, message: "Mínimo 0" },
                                },
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="font-semibold">Descuento %</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              placeholder="0"
                              {...register(
                                `productos.${index}.descuento` as const,
                                {
                                  valueAsNumber: true,
                                },
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="font-semibold">
                              Bonificación
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...register(
                                `productos.${index}.bonificacion` as const,
                                {
                                  valueAsNumber: true,
                                },
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="font-semibold">Impuesto %</Label>
                            <Select
                              value={productosWatch?.[
                                index
                              ]?.impuesto?.toString()}
                              onValueChange={(value) =>
                                handleImpuestoChange(index, value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Impuestos</SelectLabel>
                                  {impuestos?.map((imp) => (
                                    <SelectItem
                                      value={String(parseFloat(imp.porcentaje))}
                                      key={imp.id}
                                    >
                                      {imp.nombre} -{" "}
                                      {parseFloat(imp.porcentaje)}%
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <ResumenCompra
                          user={user}
                          descuentoProducto={descuentoProducto}
                          bonificacion={bonificacion}
                          cantidadPagada={cantidadPagada}
                          impuestoProducto={impuestoProducto}
                          subtotalProducto={subtotalProducto}
                          totalProducto={totalProducto}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <DetailsCompra
          user={user}
          subtotal={subtotal}
          totalDescuentos={totalDescuentos}
          totalImpuestos={totalImpuestos}
          total={total}
        />

        <div className="flex justify-end pt-4 gap-4">
          <Button type="button" variant="outline" onClick={() => onSuccess()}>
            Cancelar
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid() || crearCompraMutation.isPending}
          >
            {crearCompraMutation.isPending
              ? "Procesando..."
              : "Ingresar Compra"}
          </Button>
        </div>
      </form>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Seleccionar Producto</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o código..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem value={cat} key={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={16} />
                </Button>
              )}
            </div>

            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:border-blue-500 transition-all hover:shadow-md"
                    onClick={() => selectProduct(product.id)}
                  >
                    <CardContent className="p-3">
                      <h4 className="font-semibold text-sm line-clamp-2">
                        {product.nombre}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Código: {product.codigo}
                      </p>
                      {product.marca && (
                        <p className="text-xs text-gray-500">
                          Marca: {product.marca.nombre}
                        </p>
                      )}
                      {product.categoria && (
                        <p className="text-xs text-gray-500">
                          Categoría: {product.categoria.nombre}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron productos
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmCompra} onOpenChange={setIsConfirmCompra}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">
              Confirmación de Compra
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <DetailsConfirmCompra
                proveedorSeleccionado={proveedorSeleccionado}
                tipoPagoSeleccionado={tipoPagoSeleccionado}
                productosWatch={productosWatch}
                productos={productos}
                user={user}
                subtotal={subtotal}
                totalDescuentos={totalDescuentos}
                totalImpuestos={totalImpuestos}
                total={total}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-between">
            <AlertDialogCancel
              onClick={() => setIsConfirmCompra(false)}
              disabled={crearCompraMutation.isPending}
            >
              Revisar Compra
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCompra}
              disabled={crearCompraMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {crearCompraMutation.isPending
                ? "Procesando..."
                : "Confirmar Compra"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FormCompraProductos;
