import { CrearFactura } from "@/apis/facturas/accions/crear-factura";
import { CrearFacturaInterface } from "@/apis/facturas/interfaces/crear-factura.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Trash2,
  Plus,
  AlertTriangle,
  Search,
  Eye,
  DollarSign,
} from "lucide-react";
import useGetProductosDisponibles from "@/hooks/productos/useGetProductosDisponibles";
import useGetServiciosDisponibles from "@/hooks/servicios/useGetServiciosDisponibles";
import { toast } from "react-toastify";
import useGetClientesActivos from "@/hooks/clientes/useGetClientesActivos";
import { useAuthStore } from "@/providers/store/useAuthStore";
import LoaderComponents from "@/components/generics/LoaderComponents";
import { obtenerExistenciaProductos } from "@/apis/existencia_productos/accions/obtener-existencia-productos";
import { PreciosPorPai } from "@/apis/productos/interfaces/response-productos.interface";
import ResumenFactura from "./ResumenFactura";
import ExistenciaBadge from "./ExistenciaBadge";
import SelectorProductoServicio from "./SelectorProductoServicio";
import BuscadorClientes from "./BuscadorClientes";
import useGetDescuentosClientes from "@/hooks/descuentos-clientes/useGetDescuentosClientes";
import { Descuento } from "@/apis/facturas/interfaces/response-facturas.interface";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormProductosNoVendidos from "./FormProductosNoVendidos";
import { FormaPago } from "@/helpers/data/formaPago";
import useGetAllCategorias from "@/hooks/categorias/useGetAllCategorias";
import useGetSubCategoriaByCat from "@/hooks/subcategorias/useGetSubCategoriaByCat";
import useGetTipoProductoBySubCategoria from "@/hooks/tipo-producto/useGetTipoProductoBySubCategoria";
import { useDebounceFacturas } from "@/hooks/facturas/useDebounceFacturas";
interface Props {
  onSuccess: () => void;
  simbolo: string;
}

interface ProductoServicioUnificado {
  id: string;
  nombre: string;
  tipo: "producto" | "servicio";
  precio?: number;
  preciosPorPais: PreciosPorPai[];
  tipo_uso?: string[];
  indicaciones?: string[];
  componentes?: {
    nombre: string;
    cantidad?: string;
    unidad?: string;
  }[];
  cantidadMin?: number;
  cantidadMax?: number;
}

const FormCreateFactura = ({ onSuccess, simbolo }: Props) => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const sucursal_id = user?.sucursal.id || "";
  const queryClient = useQueryClient();
  const [categoriaId, setCategoriaId] = useState("");
  const [subcategoriaId, setSubcategoriaId] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [tipo_uso, setTipo_uso] = useState("");
  const [tipoId, setTipoId] = useState("");
  const debouncedIndicaciones = useDebounceFacturas(indicaciones, 1000);
  const debouncedTipoUso = useDebounceFacturas(tipo_uso, 1000);
  const { data: productos, isLoading: loadingProductos } =
    useGetProductosDisponibles({
      categoria: categoriaId,
      subcategoria: subcategoriaId,
      tipo_producto: tipoId,
      indicaciones: debouncedIndicaciones,
      tipo_uso: debouncedTipoUso,
    });

  const { data: categorias } = useGetAllCategorias();
  const { data: subcategorias } = useGetSubCategoriaByCat(categoriaId);

  const { data: tipo_producto } =
    useGetTipoProductoBySubCategoria(subcategoriaId);
  const { data: servicios, isLoading: loadingServicios } =
    useGetServiciosDisponibles();
  const { data: clientes, isLoading: loadingClientes } =
    useGetClientesActivos();
  const { data: descuentos_clientes } = useGetDescuentosClientes();
  const [productosYServicios, setProductosYServicios] = useState<
    ProductoServicioUnificado[]
  >([]);
  const [preciosServicioSeleccionados, setPreciosServicioSeleccionados] =
    useState<{ [key: string]: PreciosPorPai[] }>({});

  const [isOpen, setIsOpen] = useState(false);
  const [productoNoVendido, setProductoNoVendido] = useState<
    ProductoServicioUnificado | undefined
  >(undefined);

  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    if (productos && servicios) {
      const productosFormateados =
        productos.data?.productos.map((p: any) => ({
          ...p,
          tipo: "producto",
          nombre: p.nombre,
          preciosPorPais: p.preciosPorPais || [],
        })) || [];

      const serviciosFormateados =
        servicios.data?.servicios.map((s: any) => ({
          ...s,
          tipo: "servicio",
          nombre: s.nombre,
          preciosPorPais: s.preciosPorPais || [],
        })) || [];

      setProductosYServicios([
        ...productosFormateados,
        ...serviciosFormateados,
      ]);
    }
  }, [productos, servicios]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CrearFacturaInterface & { cantidadAnimales?: number }>({
    defaultValues: {
      detalles: [{ id_producto_servicio: "", cantidad: 1, precio: 0 }],
      sub_total: 0,
      descuentos_rebajas: 0,
      importe_exento: 0,
      importe_exonerado: 0,
      cargos_extra: 0,
      descuento_id: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  const detalles = watch("detalles") ?? [];

  const descuentos = watch("descuentos_rebajas") || 0;
  const importeExento = watch("importe_exento") || 0;
  const importeExonerado = watch("importe_exonerado") || 0;
  const cargosExtra = watch("cargos_extra") || 0;

  const actualizarExistencias = () => {
    setForceUpdate((prev) => prev + 1);
  };

  const productosSeleccionados = useMemo(() => {
    return detalles
      .filter((detalle) => detalle.id_producto_servicio)
      .map((detalle) => detalle.id_producto_servicio);
  }, [JSON.stringify(detalles)]);

  const hayProductosDuplicados = useMemo(() => {
    const productosIds = detalles
      .filter((detalle) => detalle.id_producto_servicio)
      .map((detalle) => detalle.id_producto_servicio);

    return new Set(productosIds).size !== productosIds.length;
  }, [JSON.stringify(detalles)]);

  const productosDuplicados = useMemo(() => {
    const counts: { [key: string]: number } = {};
    const duplicates: string[] = [];

    detalles.forEach((detalle) => {
      if (detalle.id_producto_servicio) {
        counts[detalle.id_producto_servicio] =
          (counts[detalle.id_producto_servicio] || 0) + 1;
      }
    });

    Object.keys(counts).forEach((productoId) => {
      if (counts[productoId] > 1) {
        duplicates.push(productoId);
      }
    });

    return duplicates;
  }, [JSON.stringify(detalles)]);

  const obtenerPreciosServicio = (servicioId: string): PreciosPorPai[] => {
    const servicio = productosYServicios.find(
      (p) => p.id === servicioId && p.tipo === "servicio",
    );
    return servicio?.preciosPorPais || [];
  };

  const formatearRangoAnimales = (precio: PreciosPorPai): string => {
    if (precio.cantidadMin === null && precio.cantidadMax === null) {
      return "Cantidad estándar";
    }
    if (precio.cantidadMin !== null && precio.cantidadMax !== null) {
      return `${precio.cantidadMin} - ${precio.cantidadMax} animales`;
    }
    if (precio.cantidadMin !== null) {
      return `Mínimo ${precio.cantidadMin} animales`;
    }
    if (precio.cantidadMax !== null) {
      return `Máximo ${precio.cantidadMax} animales`;
    }
    return "Cantidad estándar";
  };

  const handleProductoChange = (index: number, value: string) => {
    const itemSeleccionado = productosYServicios.find((p) => p.id === value);

    if (itemSeleccionado) {
      setValue(`detalles.${index}.id_producto_servicio`, value);

      if (itemSeleccionado.tipo === "servicio") {
        const preciosServicio = obtenerPreciosServicio(value);
        setPreciosServicioSeleccionados((prev) => ({
          ...prev,
          [index]: preciosServicio,
        }));

        if (preciosServicio.length > 0) {
          setValue(
            `detalles.${index}.precio`,
            Number(preciosServicio[0].precio),
          );
        }
      } else {
        setValue(
          `detalles.${index}.precio`,
          Number(itemSeleccionado.preciosPorPais[0]?.precio || 0),
        );

        setPreciosServicioSeleccionados((prev) => {
          const newPrecios = { ...prev };
          delete newPrecios[index];
          return newPrecios;
        });
      }
    }

    setTimeout(actualizarExistencias, 100);
  };

  const handlePrecioServicioChange = (index: number, precioId: string) => {
    const preciosDisponibles = preciosServicioSeleccionados[index];
    if (preciosDisponibles) {
      const precioSeleccionado = preciosDisponibles.find(
        (p) => p.id === precioId,
      );
      if (precioSeleccionado) {
        setValue(`detalles.${index}.precio`, Number(precioSeleccionado.precio));
      }
    }
  };

  const useCantidadChange = (index: number) => {
    const { onChange, ...rest } = register(`detalles.${index}.cantidad`, {
      required: "La cantidad es requerida",
      min: { value: 1, message: "Mínimo 1" },
      valueAsNumber: true,
    });

    return {
      ...rest,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);

        setTimeout(actualizarExistencias, 300);
      },
    };
  };

  const productosParaVerificar = useMemo(() => {
    return detalles
      .filter((detalle) => {
        const producto = productosYServicios.find(
          (p) => p.id === detalle.id_producto_servicio,
        );
        return producto?.tipo === "producto" && detalle.id_producto_servicio;
      })
      .map((detalle) => ({
        productoId: detalle.id_producto_servicio,
        cantidad: detalle.cantidad || 0,

        forceUpdate: forceUpdate,
      }));
  }, [detalles, productosYServicios, forceUpdate]);

  const existenciasQueries = useQueries({
    queries: productosParaVerificar.map((producto) => ({
      queryKey: [
        "existencia-productos",
        producto.productoId,
        sucursal_id,
        producto.cantidad,
        producto.forceUpdate,
      ],
      queryFn: () =>
        obtenerExistenciaProductos(producto.productoId, sucursal_id),
      enabled: !!producto.productoId && !!sucursal_id,
      retry: false,
      staleTime: 0,
      cacheTime: 0,
    })),
  });

  const mapaExistencias = useMemo(() => {
    const mapa: { [key: string]: number } = {};
    existenciasQueries.forEach((query, index) => {
      const productoId = productosParaVerificar[index]?.productoId;
      if (productoId && query.data && query.data.length > 0) {
        const existenciaData = query.data[0];
        mapa[productoId] = parseInt(existenciaData.existenciaTotal) || 0;
      }
    });
    return mapa;
  }, [existenciasQueries, productosParaVerificar]);

  const productosSinExistencia = useMemo(() => {
    return detalles.filter((detalle) => {
      const producto = productosYServicios.find(
        (p) => p.id === detalle.id_producto_servicio,
      );
      if (producto?.tipo === "producto") {
        const existencia = mapaExistencias[detalle.id_producto_servicio] || 0;
        const cantidadRequerida = detalle.cantidad || 0;
        return existencia < cantidadRequerida;
      }
      return false;
    });
  }, [detalles, productosYServicios, mapaExistencias]);

  const tieneExistenciaSuficiente = productosSinExistencia.length === 0;

  const infoProductosSinExistencia = useMemo(() => {
    return productosSinExistencia.map((detalle) => {
      const producto = productosYServicios.find(
        (p) => p.id === detalle.id_producto_servicio,
      );
      const existencia = mapaExistencias[detalle.id_producto_servicio] || 0;

      return {
        nombre: producto?.nombre || "Producto desconocido",
        cantidadRequerida: detalle.cantidad || 0,
        existenciaActual: existencia,
        productoId: detalle.id_producto_servicio,
      };
    });
  }, [productosSinExistencia, productosYServicios, mapaExistencias]);

  const subTotal = useMemo(() => {
    return (
      detalles?.reduce((total, detalle) => {
        const cantidad = Number(detalle.cantidad) || 0;
        const precio = Number(detalle.precio) || 0;
        return total + cantidad * precio;
      }, 0) || 0
    );
  }, [JSON.stringify(detalles)]);

  const totalGeneral = useMemo(() => {
    return (
      subTotal - descuentos + importeExento + importeExonerado + cargosExtra
    );
  }, [subTotal, descuentos, importeExento, importeExonerado, cargosExtra]);

  useEffect(() => {
    setValue("sub_total", subTotal);
  }, [subTotal, setValue]);

  useEffect(() => {
    const descuentoId = watch("descuento_id");

    if (descuentoId && descuentoId !== "ninguno") {
      const descuentoSeleccionado = descuentos_clientes?.find(
        (d: Descuento) => d.id === descuentoId,
      );

      if (descuentoSeleccionado) {
        const descuento_calculado =
          Number(descuentoSeleccionado.porcentaje) / 100;
        const descuento_final = subTotal * descuento_calculado;
        setValue("descuentos_rebajas", descuento_final);
      }
    }
  }, [subTotal, watch("descuento_id"), descuentos_clientes, setValue]);

  const handleDescuentoChange = (value: string) => {
    if (value === "ninguno") {
      setValue("descuentos_rebajas", 0);
      setValue("descuento_id", null);
    } else {
      const descuentoSeleccionado = descuentos_clientes?.find(
        (d: Descuento) => d.id === value,
      );
      if (descuentoSeleccionado) {
        const descuento_calculado =
          Number(descuentoSeleccionado.porcentaje) / 100;
        const descuento_final = subTotal * descuento_calculado;
        setValue("descuentos_rebajas", descuento_final);
        setValue("descuento_id", descuentoSeleccionado.id);
      } else {
        setValue("descuentos_rebajas", 0);
        setValue("descuento_id", null);
      }
    }
  };

  const calcularTotalLinea = (cantidad: number, precio: number) => {
    return (Number(cantidad) || 0) * (Number(precio) || 0);
  };

  const mutation = useMutation({
    mutationFn: (data: CrearFacturaInterface) => CrearFactura(data),
    onSuccess: () => {
      toast.success("Factura creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      reset();
      onSuccess();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear la factura";
        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear la factura. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = (data: CrearFacturaInterface) => {
    if (!data.detalles || data.detalles.length === 0) {
      toast.error("Debe agregar al menos un producto o servicio");
      return;
    }

    const detallesInvalidos = data.detalles.some(
      (detalle) => !detalle.id_producto_servicio,
    );
    if (detallesInvalidos) {
      toast.error("Todos los productos/servicios deben estar seleccionados");
      return;
    }

    if (hayProductosDuplicados) {
      const productosDuplicadosNombres = productosDuplicados
        .map((productoId) => {
          const producto = productosYServicios.find((p) => p.id === productoId);
          return producto?.nombre || "Producto desconocido";
        })
        .join(", ");

      toast.error(
        `No puede agregar el mismo producto más de una vez: ${productosDuplicadosNombres}`,
      );
      return;
    }

    if (!tieneExistenciaSuficiente) {
      const productosLista = infoProductosSinExistencia
        .map(
          (p) =>
            `${p.nombre} (necesita: ${p.cantidadRequerida}, tiene: ${p.existenciaActual})`,
        )
        .join(", ");

      toast.error(`Productos con existencia insuficiente: ${productosLista}`);
      return;
    }

    mutation.mutate({ ...data, pais_id: paisId, sucursal_id: sucursal_id });
  };

  const eliminarDetalle = (index: number) => {
    remove(index);

    setPreciosServicioSeleccionados((prev) => {
      const newPrecios = { ...prev };
      delete newPrecios[index];
      return newPrecios;
    });

    setTimeout(actualizarExistencias, 100);
  };

  const hanldeViewFormProductoNoVendido = (
    producto: ProductoServicioUnificado,
  ) => {
    if (producto.tipo !== "producto") {
      toast.warning(
        "Solo se pueden registrar productos no vendidos, no servicios",
      );
      return;
    }

    setIsOpen(true);
    setProductoNoVendido(producto);
  };

  if (loadingProductos || loadingServicios || loadingClientes) {
    return <LoaderComponents />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input type="hidden" {...register("descuento_id")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Cliente*</Label>
                <BuscadorClientes
                  value={watch("id_cliente") || ""}
                  onValueChange={(value) => setValue("id_cliente", value)}
                  clientes={clientes?.data?.clientes || []}
                  placeholder="Buscar cliente por nombre o identificación..."
                  className={errors.id_cliente ? "border-red-300" : ""}
                />
                {errors.id_cliente && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.id_cliente.message as string}
                  </p>
                )}
                {watch("id_cliente") && (
                  <div className="text-xs text-gray-500 mt-1">
                    Cliente seleccionado:{" "}
                    {
                      clientes?.data?.clientes.find(
                        (c) => c.id === watch("id_cliente"),
                      )?.nombre
                    }
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-bold">Forma de Pago*</Label>
                <Select
                  onValueChange={(value) => setValue("forma_pago", value)}
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
              <CardTitle className="text-lg">Totales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-bold">Sub Total</Label>
                  <Input
                    value={subTotal.toFixed(2)}
                    disabled
                    className="font-bold text-lg text-right bg-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    Cargos Extra
                  </Label>
                  <Input
                    type="number"
                    min="0.0"
                    step="1"
                    {...register("cargos_extra", {
                      min: { value: 0, message: "No puede ser negativo" },
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    className="text-right border-blue-200 bg-blue-50"
                  />
                  {errors.cargos_extra && (
                    <p className="text-sm text-red-500">
                      {errors.cargos_extra.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Importe Exento</Label>
                  <Input
                    type="number"
                    min="0.0"
                    step="1"
                    {...register("importe_exento", {
                      min: { value: 0, message: "No puede ser negativo" },
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    className="text-right"
                  />
                  {errors.importe_exento && (
                    <p className="text-sm text-red-500">
                      {errors.importe_exento.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Importe Exonerado</Label>
                  <Input
                    type="number"
                    min="0.0"
                    step="1"
                    {...register("importe_exonerado", {
                      min: { value: 0, message: "No puede ser negativo" },
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    className="text-right"
                  />
                  {errors.importe_exonerado && (
                    <p className="text-sm text-red-500">
                      {errors.importe_exonerado.message}
                    </p>
                  )}
                </div>

                <div className="border-t pt-4 md:col-span-2">
                  <Label className="font-bold">Total General</Label>
                  <Input
                    value={totalGeneral.toFixed(2)}
                    disabled
                    className="font-bold text-2xl text-green-600 text-right bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descuentos y Rebajas</Label>
                <Select
                  onValueChange={handleDescuentoChange}
                  disabled={
                    !productosSeleccionados ||
                    productosSeleccionados.length === 0
                  }
                  value={watch("descuento_id") || "ninguno"}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !productosSeleccionados ||
                        productosSeleccionados.length === 0
                          ? "Agregue productos primero"
                          : "Seleccione un descuento"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ninguno">Sin descuento</SelectItem>
                    {descuentos_clientes?.map((descuento: Descuento) => (
                      <SelectItem key={descuento.id} value={descuento.id}>
                        {descuento.nombre} - {descuento.porcentaje}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(!productosSeleccionados ||
                  productosSeleccionados.length === 0) && (
                  <p className="text-sm text-gray-500">
                    Debe agregar al menos un producto/servicio para aplicar
                    descuentos
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Productos y Servicios</CardTitle>
            <div className="flex items-center gap-2">
              {(hayProductosDuplicados || !tieneExistenciaSuficiente) && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Problemas detectados
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <SelectorProductoServicio
              onAgregar={(productoId) => {
                const emptyFieldIndex = fields.findIndex(
                  (field, index) =>
                    !watch(`detalles.${index}.id_producto_servicio`),
                );

                if (emptyFieldIndex !== -1) {
                  handleProductoChange(emptyFieldIndex, productoId);
                } else {
                  append({ id_producto_servicio: "", cantidad: 1, precio: 0 });
                  setTimeout(() => {
                    const newIndex = fields.length;
                    handleProductoChange(newIndex, productoId);
                  }, 100);
                }
              }}
              productosYServicios={productosYServicios}
              productosSeleccionados={productosSeleccionados}
              disabled={
                productosYServicios.length === productosSeleccionados.length ||
                hayProductosDuplicados
              }
              categorias={categorias}
              subcategorias={subcategorias}
              tipo_producto={tipo_producto}
              setCategoriaId={setCategoriaId}
              setSubcategoriaId={setSubcategoriaId}
              categoriaId={categoriaId}
              subcategoriaId={subcategoriaId}
              setTipoId={setTipoId}
              tipoId={tipoId}
              simbolo={simbolo}
              setIndicaciones={setIndicaciones}
              setTipo_uso={setTipo_uso}
              tipo_uso={tipo_uso}
              indicaciones={indicaciones}
              isLoading={loadingProductos}
            />

            {hayProductosDuplicados && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">
                    Productos duplicados detectados:
                  </span>
                </div>
                <ul className="mt-1 text-sm text-red-600">
                  {productosDuplicados.map((productoId) => {
                    const producto = productosYServicios.find(
                      (p) => p.id === productoId,
                    );
                    return (
                      <li key={productoId}>
                        • {producto?.nombre || "Producto desconocido"}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {!tieneExistenciaSuficiente && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">
                    Productos con existencia insuficiente:
                  </span>
                </div>
                <ul className="mt-1 text-sm text-orange-600">
                  {infoProductosSinExistencia.map((p, index) => (
                    <li key={index}>
                      • {p.nombre} (necesita: {p.cantidadRequerida}, tiene:{" "}
                      {p.existenciaActual})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto/Servicio</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Rango de Animales</TableHead>
                  <TableHead>Existencia</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const productoId = watch(
                    `detalles.${index}.id_producto_servicio`,
                  );
                  const cantidad = watch(`detalles.${index}.cantidad`) || 0;
                  const precio = watch(`detalles.${index}.precio`) || 0;
                  const item = productosYServicios.find(
                    (p) => p.id === productoId,
                  );
                  const esServicio = item?.tipo === "servicio";
                  const preciosDisponibles =
                    preciosServicioSeleccionados[index];
                  const existencia = mapaExistencias[productoId];
                  const sinSuficienteExistencia =
                    item?.tipo === "producto" &&
                    existencia !== undefined &&
                    existencia < cantidad;
                  const esDuplicado = productosDuplicados.includes(productoId);

                  const cantidadInputProps = useCantidadChange(index);

                  if (!productoId) return null;

                  return (
                    <TableRow
                      key={field.id}
                      className={
                        sinSuficienteExistencia || esDuplicado
                          ? "bg-red-300"
                          : ""
                      }
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item?.nombre}</span>
                            <Badge
                              variant={
                                item?.tipo === "producto"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item?.tipo === "producto"
                                ? "Producto"
                                : "Servicio"}
                            </Badge>
                          </div>
                          <ExistenciaBadge
                            productoId={productoId}
                            cantidad={cantidad}
                            productosYServicios={productosYServicios}
                            mapaExistencias={mapaExistencias}
                            existenciasQueries={existenciasQueries}
                          />
                          {esDuplicado && (
                            <Badge variant="destructive" className="mt-1 w-fit">
                              Producto duplicado
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min="1"
                          className={
                            sinSuficienteExistencia ? "border-red-300" : ""
                          }
                          {...cantidadInputProps}
                          onKeyDown={(e) => {
                            if (
                              !/[0-9]/.test(e.key) &&
                              e.key !== "Backspace" &&
                              e.key !== "Tab"
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {esServicio && preciosDisponibles ? (
                          <Select
                            onValueChange={(value) =>
                              handlePrecioServicioChange(index, value)
                            }
                            value={
                              preciosDisponibles.find(
                                (p) => Number(p.precio) === precio,
                              )?.id || ""
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione precio" />
                            </SelectTrigger>
                            <SelectContent>
                              {preciosDisponibles.map((precioItem) => (
                                <SelectItem
                                  key={precioItem.id}
                                  value={precioItem.id}
                                >
                                  L. {precioItem.precio} -{" "}
                                  {formatearRangoAnimales(precioItem)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type="number"
                            step="0.01"
                            readOnly
                            value={precio}
                            {...register(`detalles.${index}.precio`, {
                              required: "El precio es requerido",
                              valueAsNumber: true,
                            })}
                          />
                        )}
                      </TableCell>

                      <TableCell>
                        {esServicio && preciosDisponibles ? (
                          <div className="text-sm text-gray-600">
                            {preciosDisponibles.find(
                              (p) => Number(p.precio) === precio,
                            )
                              ? formatearRangoAnimales(
                                  preciosDisponibles.find(
                                    (p) => Number(p.precio) === precio,
                                  )!,
                                )
                              : "Seleccione un precio"}
                          </div>
                        ) : (
                          <Badge variant="outline">Producto</Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        {item?.tipo === "producto" &&
                          existencia !== undefined && (
                            <div className="flex flex-col">
                              <span
                                className={
                                  sinSuficienteExistencia
                                    ? "text-red-600 font-medium"
                                    : "text-green-600 font-medium"
                                }
                              >
                                {existencia} unidades
                              </span>
                              {sinSuficienteExistencia && (
                                <span className="text-xs text-red-500">
                                  Faltan {cantidad - existencia}
                                </span>
                              )}
                            </div>
                          )}
                        {item?.tipo === "servicio" && (
                          <Badge variant="outline">Servicio</Badge>
                        )}
                      </TableCell>

                      <TableCell className="font-medium">
                        L. {calcularTotalLinea(cantidad, precio).toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-around gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            title="Eliminar"
                            onClick={() => eliminarDetalle(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {item?.tipo === "producto" && (
                            <Button
                              type="button"
                              variant="outline"
                              title="Registrar como no vendido"
                              size="sm"
                              onClick={() =>
                                hanldeViewFormProductoNoVendido(item)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {productosSeleccionados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No hay productos/servicios seleccionados</p>
                <p className="text-sm">
                  Use el buscador arriba para agregar items
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <ResumenFactura
          subTotal={subTotal}
          fields={fields}
          totalGeneral={totalGeneral}
          cargosExtra={cargosExtra}
        />
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={
              mutation.isPending ||
              hayProductosDuplicados ||
              !tieneExistenciaSuficiente
            }
            className="flex items-center gap-2"
            size="lg"
          >
            {mutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
                Creando Factura...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Crear Factura
              </>
            )}
          </Button>
        </div>
      </form>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              X
            </AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Producto No Vendido</AlertDialogTitle>
            <AlertDialogDescription>
              En esta sección podrás ingresar los productos que no se pudieron
              vender por falta de stock o porque la venta del producto no se
              hizo completamente
            </AlertDialogDescription>
          </AlertDialogHeader>

          {productoNoVendido && (
            <FormProductosNoVendidos
              productoId={productoNoVendido.id}
              nombreProducto={productoNoVendido.nombre}
              precioUnitario={Number(
                productoNoVendido.preciosPorPais[0]?.precio || 0,
              )}
              onSuccess={() => {
                setIsOpen(false);
              }}
            />
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FormCreateFactura;
