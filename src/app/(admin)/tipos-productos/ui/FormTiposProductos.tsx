import { CrearTipoProductoInterface } from "@/apis/tipo-producto/interface/crear-tipo.interface";
import { TipoProducto } from "@/apis/tipo-producto/interface/response-tipo-producto.interface";
import useGetSubCategorias from "@/hooks/subcategorias/useGetSubCategorias";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { EditarTipoProducto } from "@/apis/tipo-producto/accions/editar-tipo-producto";
import { CrearTipoProducto } from "@/apis/tipo-producto/accions/crear-tipo-producto";

interface Props {
  tipoProducto?: TipoProducto | null;
  setOpenModal: (open: boolean) => void;
  onSuccess?: () => void;
}

const FormTiposProductos = ({
  tipoProducto,
  setOpenModal,
  onSuccess,
}: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [subcategoriaOffset, setSubcategoriaOffset] = useState(0);
  const [allSubcategorias, setAllSubcategorias] = useState<any[]>([]);
  const [totalSubcategorias, setTotalSubcategorias] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: subcategoriasData,
    isLoading: isLoadingSubcategorias,
    refetch,
  } = useGetSubCategorias({
    limit: 10,
    offset: subcategoriaOffset,
  });

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CrearTipoProductoInterface>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      subcategoriaId: "",
    },
  });

  const queryClient = useQueryClient();
  const isEditing = !!tipoProducto;

  const loadMoreSubcategorias = () => {
    setIsLoadingMore(true);
    setSubcategoriaOffset((prev) => prev + 10);
  };

  useEffect(() => {
    if (subcategoriasData?.data) {
      if (subcategoriaOffset === 0) {
        setAllSubcategorias(subcategoriasData.data);
      } else {
        setAllSubcategorias((prev) => [...prev, ...subcategoriasData.data]);
      }

      setTotalSubcategorias(subcategoriasData.total);
      setIsLoadingMore(false);
    }
  }, [subcategoriasData, subcategoriaOffset]);

  useEffect(() => {
    if (tipoProducto) {
      setValue("nombre", tipoProducto.nombre || "");
      setValue("descripcion", tipoProducto.descripcion || "");
      setValue("subcategoriaId", tipoProducto.sub_categoria?.id || "");
    } else {
      reset({
        nombre: "",
        descripcion: "",
        subcategoriaId: "",
      });
    }
    setIsLoading(false);
  }, [tipoProducto, setValue, reset]);

  const onSubmit = async (data: CrearTipoProductoInterface) => {
    try {
      if (isEditing && tipoProducto) {
        await EditarTipoProducto(tipoProducto.id, data);
        toast.success("Tipo de producto actualizado correctamente");
      } else {
        await CrearTipoProducto(data);
        toast.success("Tipo de producto registrado correctamente");
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["tipos-producto"] });

      if (onSuccess) {
        onSuccess();
        setErrorMessage("");
      }

      setOpenModal(false);
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al registrar el tipo de producto";
        setErrorMessage(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  const hasMore = allSubcategorias.length < totalSubcategorias;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            Error al {isEditing ? "actualizar" : "registrar"} el Tipo de
            Producto
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="nombre">
            Nombre del Tipo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombre"
            {...register("nombre", {
              required: "El nombre del tipo es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "El nombre no puede exceder los 100 caracteres",
              },
            })}
            placeholder="Ej: Postura, Engorde, Leche, Cría"
            className={errors.nombre ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.nombre && (
            <p className="text-sm text-red-500 mt-1">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="subcategoriaId">
            Subcategoría <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("subcategoriaId")}
            onValueChange={(value) => setValue("subcategoriaId", value)}
            disabled={isSubmitting || isLoadingSubcategorias}
          >
            <SelectTrigger
              className={errors.subcategoriaId ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Seleccionar subcategoría" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectGroup>
                <SelectLabel>Subcategorías</SelectLabel>
                {isLoadingSubcategorias && allSubcategorias.length === 0 ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : allSubcategorias.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No se encontraron subcategorías
                  </div>
                ) : (
                  <>
                    {allSubcategorias.map((subcategoria) => (
                      <SelectItem key={subcategoria.id} value={subcategoria.id}>
                        <div className="flex flex-col">
                          <span>{subcategoria.nombre}</span>
                          <span className="text-xs text-muted-foreground">
                            {subcategoria.categoria?.nombre}
                          </span>
                        </div>
                      </SelectItem>
                    ))}

                    {hasMore && (
                      <div className="sticky bottom-0 bg-white border-t pt-2 pb-1 px-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={loadMoreSubcategorias}
                          disabled={isLoadingMore}
                          className="w-full"
                        >
                          {isLoadingMore ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Cargando...
                            </>
                          ) : (
                            `Ver más (${allSubcategorias.length} de ${totalSubcategorias})`
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.subcategoriaId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.subcategoriaId.message}
            </p>
          )}
          {!isLoadingSubcategorias && allSubcategorias.length === 0 && (
            <p className="text-sm text-yellow-600 mt-1">
              * No hay subcategorías disponibles. Crea una subcategoría primero.
            </p>
          )}
          {allSubcategorias.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Mostrando {allSubcategorias.length} de {totalSubcategorias}{" "}
              subcategorías
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            {...register("descripcion", {
              maxLength: {
                value: 500,
                message: "La descripción no puede exceder los 500 caracteres",
              },
            })}
            placeholder="Describe el tipo de producto (opcional)..."
            rows={4}
            className={errors.descripcion ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-500 mt-1">
              {errors.descripcion.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpenModal(false)}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditing ? "Actualizando..." : "Guardando..."}
            </span>
          ) : isEditing ? (
            "Actualizar Tipo"
          ) : (
            "Registrar Tipo"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormTiposProductos;
