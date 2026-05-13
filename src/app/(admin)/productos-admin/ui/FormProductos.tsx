import { Producto } from "@/apis/productos/interfaces/response-productos.interface";
import { AddProducto } from "@/apis/sub-servicio/accions/crear-sub-servicio";
import { UpdateProducto } from "@/apis/sub-servicio/accions/update-sub-servicio";
import { CrearSubServicio } from "@/apis/sub-servicio/interface/crear-producto.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UnidadMedida } from "@/helpers/data/unidadMedidas";
import { getUnidadesFraccionamiento } from "@/helpers/funciones/getUnidadesFraccionamiento";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import useGetTaxesPais from "@/hooks/impuestos/useGetTaxesPais";
import useGetAllMarcas from "@/hooks/marcas/useGetAllMarcas";
import useGetProveedoresActivos from "@/hooks/proveedores/useGetProveedoresActivos";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { X, Plus } from "lucide-react";
import useGetSubCategoriaByCat from "@/hooks/subcategorias/useGetSubCategoriaByCat";
import useGetTipoProductoBySubCategoria from "@/hooks/tipo-producto/useGetTipoProductoBySubCategoria";

interface Props {
  editSubServicio?: Producto | null;
  isEdit?: boolean;
  onSuccess: () => void;
}

const FormProductos = ({ onSuccess, editSubServicio, isEdit }: Props) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [unidadVentaSeleccionada, setUnidadVentaSeleccionada] = useState("");
  const [nuevoTipoUso, setNuevoTipoUso] = useState("");
  const [nuevaIndicacion, setNuevaIndicacion] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] =
    useState<string>("");

  const { data: marcasActivas } = useGetAllMarcas(10, 0);
  const { data: proveedoresActivos } = useGetProveedoresActivos();
  const { data: categorias } = useGetCategorias();
  const { data: impuestos } = useGetTaxesPais();

  const { data: subcategorias, refetch: refetchSubcategorias } =
    useGetSubCategoriaByCat(categoriaSeleccionada);
  const { data: tiposProducto, refetch: refetchTiposProducto } =
    useGetTipoProductoBySubCategoria(subcategoriaSeleccionada);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CrearSubServicio>({
    defaultValues: {
      componentes: [],
      tipos_uso: [],
      indicaciones: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "componentes",
  });

  const unidadVenta = watch("unidad_venta");
  const tiposUso = watch("tipos_uso");
  const indicaciones = watch("indicaciones");
  const categoriaId = watch("categoriaId");
  const subcategoriaId = watch("subcategoriaId");

  useEffect(() => {
    if (categoriaId) {
      setCategoriaSeleccionada(categoriaId);
    } else {
      setCategoriaSeleccionada("");
      setSubcategoriaSeleccionada("");
      setValue("subcategoriaId", undefined);
      setValue("tipo_producto_id", undefined);
    }
  }, [categoriaId, setValue]);

  useEffect(() => {
    if (subcategoriaId) {
      setSubcategoriaSeleccionada(subcategoriaId);
    } else {
      setSubcategoriaSeleccionada("");
      setValue("tipo_producto_id", undefined);
    }
  }, [subcategoriaId, setValue]);

  useEffect(() => {
    if (categoriaSeleccionada) {
      refetchSubcategorias();
    }
  }, [categoriaSeleccionada, refetchSubcategorias]);

  useEffect(() => {
    if (subcategoriaSeleccionada) {
      refetchTiposProducto();
    }
  }, [subcategoriaSeleccionada, refetchTiposProducto]);

  useEffect(() => {
    setUnidadVentaSeleccionada(unidadVenta || "");
  }, [unidadVenta]);

  useEffect(() => {
    if (isEdit && editSubServicio) {
      if (editSubServicio.categoria?.id) {
        setCategoriaSeleccionada(editSubServicio.categoria.id);
      }
      if (editSubServicio.subcategoria?.id) {
        setSubcategoriaSeleccionada(editSubServicio.subcategoria.id);
      }

      reset({
        nombre: editSubServicio.nombre,
        tipo: editSubServicio.tipo,
        unidad_venta: editSubServicio.unidad_venta,
        unidad_fraccionamiento: editSubServicio.unidad_fraccionamiento || 1,
        tipo_fraccionamiento: editSubServicio.tipo_fraccionamiento,
        contenido: editSubServicio.contenido || 1,
        disponible: editSubServicio.disponible,
        isActive: editSubServicio.isActive,
        marcaId: editSubServicio.marca?.id,
        proveedorId: editSubServicio.proveedor?.id,
        categoriaId: editSubServicio.categoria?.id,
        subcategoriaId: editSubServicio.subcategoria?.id,
        tipo_producto_id:
          editSubServicio.tipo_producto?.id || editSubServicio.tipo_producto_id,
        atributos: editSubServicio.atributos,
        codigo_barra: editSubServicio.codigo_barra,
        precio: Number(editSubServicio.preciosPorPais?.[0]?.precio),
        costo: Number(editSubServicio.preciosPorPais?.[0]?.costo),
        taxId: editSubServicio.tax?.id,
        compra_minima: editSubServicio.compra_minima || 1,
        distribucion_minima: editSubServicio.distribucion_minima || 1,
        venta_minima: editSubServicio.venta_minima || 1,
        es_compra_bodega: editSubServicio.es_compra_bodega || false,
        componentes: editSubServicio.componentes || [],
        tipos_uso: editSubServicio.tipos_uso || [],
        forma_uso: editSubServicio.forma_uso || "",
        indicaciones: editSubServicio.indicaciones || [],
      });
      setUnidadVentaSeleccionada(editSubServicio.unidad_venta);
    } else {
      reset({
        nombre: "",
        tipo: "producto",
        unidad_venta: "unidad",
        unidad_fraccionamiento: 1,
        tipo_fraccionamiento: undefined,
        contenido: 1,
        disponible: true,
        isActive: true,
        marcaId: undefined,
        proveedorId: undefined,
        categoriaId: undefined,
        subcategoriaId: undefined,
        tipo_producto_id: undefined,
        atributos: undefined,
        codigo_barra: undefined,
        precio: undefined,
        costo: undefined,
        taxId: undefined,
        compra_minima: 1,
        distribucion_minima: 1,
        venta_minima: 1,
        es_compra_bodega: false,
        componentes: [],
        tipos_uso: [],
        forma_uso: "",
        indicaciones: [],
      });
      setCategoriaSeleccionada("");
      setSubcategoriaSeleccionada("");
    }
  }, [isEdit, editSubServicio, reset]);

  const mutation = useMutation({
    mutationFn: (data: CrearSubServicio) => AddProducto(data),
    onSuccess: () => {
      toast.success("Producto creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
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
            : "Hubo un error al crear el producto";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el producto. Inténtalo de nuevo.",
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearSubServicio) =>
      UpdateProducto(editSubServicio?.id ?? "", data),
    onSuccess: () => {
      toast.success("Producto actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
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
            : "Hubo un error al actualizar el producto";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el producto. Inténtalo de nuevo.",
        );
      }
    },
  });

  const agregarTipoUso = () => {
    if (nuevoTipoUso.trim() && !tiposUso?.includes(nuevoTipoUso.trim())) {
      const nuevosTipos = [...(tiposUso || []), nuevoTipoUso.trim()];
      setValue("tipos_uso", nuevosTipos);
      setNuevoTipoUso("");
    }
  };

  const eliminarTipoUso = (tipoUso: string) => {
    const nuevosTipos = (tiposUso || []).filter((t) => t !== tipoUso);
    setValue("tipos_uso", nuevosTipos);
  };

  const agregarIndicacion = () => {
    if (
      nuevaIndicacion.trim() &&
      !indicaciones?.includes(nuevaIndicacion.trim())
    ) {
      const nuevasIndicaciones = [
        ...(indicaciones || []),
        nuevaIndicacion.trim(),
      ];
      setValue("indicaciones", nuevasIndicaciones);
      setNuevaIndicacion("");
    }
  };

  const eliminarIndicacion = (indicacion: string) => {
    const nuevasIndicaciones = (indicaciones || []).filter(
      (i) => i !== indicacion,
    );
    setValue("indicaciones", nuevasIndicaciones);
  };

  const onSubmit = (data: CrearSubServicio) => {
    const payload = {
      ...data,
      tipo: "producto",
      precio: Number(data.precio),
      costo: Number(data.costo),
      compra_minima: Number(data.compra_minima),
      distribucion_minima: Number(data.distribucion_minima),
      venta_minima: Number(data.venta_minima),
      contenido: Number(data.contenido) || 1,
      paisId: user?.pais.id,
    };
    if (isEdit) {
      mutationUpdate.mutate(payload);
    } else {
      mutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre" className="font-bold">
          Nombre del Producto*
        </Label>
        <Input
          id="nombre"
          {...register("nombre", {
            required: "El nombre del servicio es requerido",
            minLength: {
              value: 3,
              message: "El nombre debe tener al menos 3 caracteres",
            },
            maxLength: {
              value: 100,
              message: "El nombre no puede tener más de 100 caracteres",
            },
          })}
          placeholder="Ej: Fertilizantes, Herbicidas, Desparasitantes, etc."
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="codigo_barra" className="font-bold">
          Código de Barra*
        </Label>
        <Input
          id="codigo_barra"
          {...register("codigo_barra", {
            required: "El código de barra es requerido",
            maxLength: {
              value: 20,
              message: "El código de barra no puede tener más de 20 caracteres",
            },
          })}
          placeholder="Ej: 7501031311309"
        />
        {errors.codigo_barra && (
          <p className="text-sm font-medium text-red-500">
            {errors.codigo_barra.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="marcaId" className="font-bold">
          Marca
        </Label>
        <Select
          onValueChange={(value) => setValue("marcaId", value)}
          defaultValue={isEdit ? editSubServicio?.marca?.id : ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una marca" />
          </SelectTrigger>
          <SelectContent>
            {marcasActivas?.data.map((marca) => (
              <SelectItem key={marca.id} value={marca.id}>
                {marca.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoriaId" className="font-bold">
          Categoría*
        </Label>
        <Select
          onValueChange={(value) => {
            setValue("categoriaId", value);
            setValue("subcategoriaId", undefined);
            setValue("tipo_producto_id", undefined);
          }}
          defaultValue={isEdit ? editSubServicio?.categoria?.id : ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categorias?.data.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoriaId && (
          <p className="text-sm font-medium text-red-500">
            {errors.categoriaId.message as string}
          </p>
        )}
      </div>

      {categoriaSeleccionada && (
        <div className="space-y-2">
          <Label htmlFor="subcategoriaId" className="font-bold">
            Subcategoría
          </Label>
          <Select
            onValueChange={(value) => {
              setValue("subcategoriaId", value);
              setValue("tipo_producto_id", undefined);
            }}
            defaultValue={isEdit ? editSubServicio?.subcategoria?.id : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una subcategoría" />
            </SelectTrigger>
            <SelectContent>
              {subcategorias?.map((subcat) => (
                <SelectItem key={subcat.id} value={subcat.id}>
                  {subcat.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {subcategoriaSeleccionada && (
        <div className="space-y-2">
          <Label htmlFor="tipo_producto_id" className="font-bold">
            Tipo de Producto
          </Label>
          <Select
            onValueChange={(value) => setValue("tipo_producto_id", value)}
            defaultValue={
              isEdit
                ? editSubServicio?.tipo_producto?.id ||
                  editSubServicio?.tipo_producto_id
                : ""
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo de producto" />
            </SelectTrigger>
            <SelectContent>
              {tiposProducto?.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="unidad_venta" className="font-bold">
          Unidad de Venta*
        </Label>
        <Select
          defaultValue={isEdit ? editSubServicio?.unidad_venta : "unidad"}
          onValueChange={(value) => {
            setValue("unidad_venta", value);
            setUnidadVentaSeleccionada(value);
            setValue("unidad_fraccionamiento", undefined);
            setValue("contenido", 1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la unidad" />
          </SelectTrigger>
          <SelectContent>
            {UnidadMedida.map((unidad) => (
              <SelectItem key={unidad.value} value={unidad.value}>
                {unidad.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.unidad_venta && (
          <p className="text-sm font-medium text-red-500">
            {errors.unidad_venta.message as string}
          </p>
        )}
      </div>

      {unidadVentaSeleccionada && unidadVentaSeleccionada !== "unidad" && (
        <div className="block gap-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="col-span-full font-bold text-lg">Fraccionamiento</h3>

          <div className="space-y-2">
            <Label htmlFor="tipo_fraccionamiento" className="font-bold">
              Tipo de Fraccionamiento
            </Label>
            <Select
              defaultValue={
                isEdit && editSubServicio?.tipo_fraccionamiento
                  ? editSubServicio.tipo_fraccionamiento
                  : undefined
              }
              onValueChange={(value) => setValue("tipo_fraccionamiento", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona unidad de fraccionamiento" />
              </SelectTrigger>
              <SelectContent>
                {getUnidadesFraccionamiento(unidadVentaSeleccionada).map(
                  (unidad) => (
                    <SelectItem key={unidad.value} value={unidad.value}>
                      {unidad.label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidad_fraccionamiento" className="font-bold">
              Unidad de Fraccionamiento
            </Label>
            <Input
              id="unidad_fraccionamiento"
              type="number"
              step="0.0001"
              {...register("unidad_fraccionamiento", {
                min: {
                  value: 0.0001,
                  message: "La unidad de fraccionamiento debe ser mayor a 0",
                },
              })}
              placeholder="Ej: 1000 (para kg a gramos)"
            />
            {errors.unidad_fraccionamiento && (
              <p className="text-sm font-medium text-red-500">
                {errors.unidad_fraccionamiento.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contenido" className="font-bold">
              Contenido
            </Label>
            <Input
              id="contenido"
              type="number"
              step="0.0001"
              {...register("contenido", {
                min: {
                  value: 0.0001,
                  message: "El contenido debe ser mayor a 0",
                },
              })}
              placeholder="Ej: 1000 (para kg a gramos)"
            />
            {errors.contenido && (
              <p className="text-sm font-medium text-red-500">
                {errors.contenido.message as string}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Cuántas unidades de fraccionamiento equivalen a 1 unidad principal
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-bold text-lg">Componentes del Producto</h3>
        <p className="text-sm text-gray-500">
          Lista de ingredientes/activos con cantidad o porcentaje
        </p>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-3 border rounded"
          >
            <div className="col-span-2">
              <Label>Nombre del Componente</Label>
              <Input
                {...register(`componentes.${index}.nombre`, {
                  required: "El nombre es obligatorio",
                })}
                placeholder="Ej: Proteína cruda"
              />
            </div>
            <div>
              <Label>Cantidad</Label>
              <Input
                {...register(`componentes.${index}.cantidad`)}
                placeholder="Ej: 18"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label>Unidad</Label>
                <Input
                  {...register(`componentes.${index}.unidad`)}
                  placeholder="Ej: %, mg, g"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ nombre: "", cantidad: "", unidad: "" })}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Componente
        </Button>
      </div>

      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-bold text-lg">Tipos de Uso</h3>
        <p className="text-sm text-gray-500">
          ¿Para qué sirve este producto? (Ej: cochinilla, mastitis, engorde)
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {tiposUso?.map((tipo, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tipo}
              <button
                type="button"
                onClick={() => eliminarTipoUso(tipo)}
                className="hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={nuevoTipoUso}
            onChange={(e) => setNuevoTipoUso(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), agregarTipoUso())
            }
            placeholder="Escribe un tipo de uso y presiona Agregar"
            className="flex-1"
          />
          <Button type="button" onClick={agregarTipoUso}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="forma_uso" className="font-bold">
          Forma de Uso
        </Label>
        <Textarea
          id="forma_uso"
          {...register("forma_uso")}
          placeholder="Ej: Aplicar 20cc por bomba de 20 litros. Usar en horas de baja temperatura. Agitar antes de usar."
          className="min-h-[100px]"
        />
        <p className="text-xs text-gray-500">
          Instrucciones de aplicación del producto
        </p>
      </div>

      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-bold text-lg">Indicaciones / Padecimientos</h3>
        <p className="text-sm text-gray-500">
          Condición que trata el producto (Ej: cochinilla, sarna, mastitis,
          heridas)
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {indicaciones?.map((indicacion, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              {indicacion}
              <button
                type="button"
                onClick={() => eliminarIndicacion(indicacion)}
                className="hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={nuevaIndicacion}
            onChange={(e) => setNuevaIndicacion(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), agregarIndicacion())
            }
            placeholder="Escribe una indicación y presiona Agregar"
            className="flex-1"
          />
          <Button type="button" onClick={agregarIndicacion}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="compra_minima" className="font-bold">
            Compra Mínima*
          </Label>
          <Input
            id="compra_minima"
            type="number"
            min="1"
            step="1"
            {...register("compra_minima", {
              required: "La compra mínima es requerida",
              min: {
                value: 1,
                message: "La compra mínima debe ser al menos 1",
              },
            })}
            placeholder="Ej: 100"
          />
          {errors.compra_minima && (
            <p className="text-sm font-medium text-red-500">
              {errors.compra_minima.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="distribucion_minima" className="font-bold">
            Distribución Mínima*
          </Label>
          <Input
            id="distribucion_minima"
            type="number"
            min="1"
            step="1"
            {...register("distribucion_minima", {
              required: "La distribución mínima es requerida",
              min: {
                value: 1,
                message: "La distribución mínima debe ser al menos 1",
              },
            })}
            placeholder="Ej: 50"
          />
          {errors.distribucion_minima && (
            <p className="text-sm font-medium text-red-500">
              {errors.distribucion_minima.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="venta_minima" className="font-bold">
            Venta Mínima*
          </Label>
          <Input
            id="venta_minima"
            type="number"
            min="1"
            step="1"
            {...register("venta_minima", {
              required: "La venta mínima es requerida",
              min: { value: 1, message: "La venta mínima debe ser al menos 1" },
            })}
            placeholder="Ej: 10"
          />
          {errors.venta_minima && (
            <p className="text-sm font-medium text-red-500">
              {errors.venta_minima.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-bold">Tipo de Compra</Label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="es_compra_bodega"
            {...register("es_compra_bodega")}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <Label htmlFor="es_compra_bodega" className="text-sm font-normal">
            Compra directa a bodega
          </Label>
        </div>
        <p className="text-sm text-gray-500">
          Marque esta opción si el producto se compra directamente a bodega en
          lugar de por unidad
        </p>
      </div>

      {!isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="costo" className="font-bold">
              Costo*
            </Label>
            <Input
              id="costo"
              type="number"
              step="0.01"
              {...register("costo", {
                required: "El costo es requerido",
                min: { value: 0, message: "El costo no puede ser negativo" },
              })}
              placeholder="0.00"
            />
            {errors.costo && (
              <p className="text-sm font-medium text-red-500">
                {errors.costo.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="precio" className="font-bold">
              Precio*
            </Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              {...register("precio", {
                required: "El precio es requerido",
                min: { value: 0, message: "El precio no puede ser negativo" },
              })}
              placeholder="0.00"
            />
            {errors.precio && (
              <p className="text-sm font-medium text-red-500">
                {errors.precio.message as string}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tax_rate" className="font-bold">
          Impuesto (Tax Rate %)
        </Label>
        <Select
          onValueChange={(value) => setValue("taxId", value)}
          defaultValue={isEdit ? editSubServicio?.tax?.id : ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un impuesto" />
          </SelectTrigger>
          <SelectContent>
            {impuestos?.map((imp) => (
              <SelectItem key={imp.id} value={imp.id}>
                {imp.nombre} - {imp.porcentaje}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="atributos" className="font-bold">
          Atributos*
        </Label>
        <Textarea
          id="atributos"
          {...register("atributos", {
            required: "Los atributos son requeridos",
            maxLength: {
              value: 250,
              message: "Los atributos no pueden tener más de 250 caracteres",
            },
          })}
          placeholder="Ej: Presentación 1L, Color verde, Uso agrícola..."
          className="min-h-[80px]"
        />
        {errors.atributos && (
          <p className="text-sm font-medium text-red-500">
            {errors.atributos.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="proveedorId" className="font-bold">
          Proveedor
        </Label>
        <Select
          onValueChange={(value) => setValue("proveedorId", value)}
          defaultValue={isEdit ? editSubServicio?.proveedor?.id : ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un proveedor" />
          </SelectTrigger>
          <SelectContent>
            {proveedoresActivos?.map((proveedor) => (
              <SelectItem key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre_legal} - {proveedor.nit_rtn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isEdit && (
        <>
          <div className="space-y-2">
            <Label className="font-bold">Estado</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="disponible"
                {...register("disponible")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="disponible" className="text-sm font-normal">
                Producto disponible
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Actividad</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="actividad"
                {...register("isActive")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="actividad" className="text-sm font-normal">
                Producto activo
              </Label>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
        >
          {mutation.isPending || mutationUpdate.isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isEdit ? "Actualizando..." : "Creando..."}
            </>
          ) : (
            <>{isEdit ? "Actualizar Producto" : "Crear Producto"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormProductos;
