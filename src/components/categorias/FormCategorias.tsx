import { CrearCategoria } from "@/apis/categorias/accions/crear-categoria";
import { ActualizarCategoria } from "@/apis/categorias/accions/update-categoria";
import { CrearCatInterface } from "@/apis/categorias/interface/crear-categoria.interface";
import {
  Categoria,
  ResponseCategoriasInterface,
} from "@/apis/categorias/interface/response-categorias.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  editCategoria?: Categoria | null;
  isEdit?: boolean;
  onSucces: () => void;
  isMarket?: boolean;
}

const FormCategorias = ({
  onSucces,
  editCategoria,
  isEdit,
  isMarket,
}: Props) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearCatInterface>();

  useEffect(() => {
    if (editCategoria && isEdit) {
      reset({
        nombre: editCategoria.nombre,
        descripcion: editCategoria.descripcion,
        is_active: editCategoria.is_active,
        destacada: editCategoria.destacada,
        tipo: editCategoria.tipo,
      });
    }
  }, [editCategoria, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: CrearCatInterface) => CrearCategoria(data),
    onSuccess: () => {
      toast.success("Categoría creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      reset();
      onSucces();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear la categoría";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear la categoría. Inténtalo de nuevo.",
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearCatInterface) =>
      ActualizarCategoria(editCategoria?.id ?? "", data),
    onSuccess: () => {
      toast.success("Categoría actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      reset();
      onSucces();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar la categoría";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar la categoría. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = (data: CrearCatInterface) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      const market = isMarket ? true : false;
      mutation.mutate({ ...data, is_market: market });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">Nombre de la Categoría*</Label>
        <Input
          {...register("nombre", { required: "El campo nombre es requerido" })}
          placeholder="Escriba el nombre de la categoría"
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Descripción*</Label>
        <Textarea
          {...register("descripcion", {
            required: "El campo descripción es requerido",
          })}
          placeholder="Escriba la descripción de la categoría"
          rows={4}
        />
        {errors.descripcion && (
          <p className="text-sm font-medium text-red-500">
            {errors.descripcion.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Tipo de Categoría*</Label>
        <Select
          defaultValue={editCategoria?.tipo}
          onValueChange={(value) =>
            setValue("tipo", value as "Ganaderia" | "Agricultura")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ganaderia">Ganadería</SelectItem>
            <SelectItem value="Agricultura">Agricultura</SelectItem>
          </SelectContent>
        </Select>
        {errors.tipo && (
          <p className="text-sm font-medium text-red-500">
            {errors.tipo.message as string}
          </p>
        )}
      </div>

      {isEdit && (
        <div className="space-y-1">
          <Label className="font-bold">Estado</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              {...register("is_active")}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Activa
            </Label>
          </div>
        </div>
      )}

      {isMarket && isEdit && (
        <div className="space-y-1">
          <Label className="font-bold">Destacada</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="destacada"
              {...register("destacada")}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="destacada" className="cursor-pointer">
              Destacada
            </Label>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
        >
          {mutation.isPending || mutationUpdate.isPending ? (
            <span className="flex items-center">
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
            </span>
          ) : (
            <span>{isEdit ? "Actualizar Categoría" : "Crear Categoría"}</span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormCategorias;
