import { CrearSubCategoria } from "@/apis/subcategorias/accions/crear-subcategoria";
import { ActualizarSubCategoria } from "@/apis/subcategorias/accions/update-subcategoria";
import { CrearSubCatInterface } from "@/apis/subcategorias/interface/crear-subcategoria.interface";
import {
  ResponseSubcategorias,
  SubCategoria,
} from "@/apis/subcategorias/interface/get-subcategorias.interface";
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
import { Textarea } from "@/components/ui/textarea";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  editSubCategoria?: SubCategoria | null;
  isEdit?: boolean;
  onSucces: () => void;
  isMarket?: boolean;
}

const FormSubCategoria = ({
  onSucces,
  editSubCategoria,
  isEdit,
  isMarket,
}: Props) => {
  const queryClient = useQueryClient();
  const market = isMarket ? true : false;
  const { data: categorias } = useGetCategorias({ is_market: market });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearSubCatInterface>();

  useEffect(() => {
    if (editSubCategoria && isEdit) {
      reset({
        nombre: editSubCategoria.nombre,
        descripcion: editSubCategoria.descripcion,
        categoriaId: editSubCategoria.categoria?.id,
        is_active: editSubCategoria.is_active,
      });
    }
  }, [editSubCategoria, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: CrearSubCatInterface) => CrearSubCategoria(data),
    onSuccess: () => {
      toast.success("Sub Categoría creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["subcategorias"] });
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
            : "Hubo un error al crear la subcategoría";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear la subcategoría. Inténtalo de nuevo.",
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearSubCatInterface) =>
      ActualizarSubCategoria(editSubCategoria?.id ?? "", data),
    onSuccess: () => {
      toast.success("Sub Categoría actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["subcategorias"] });
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
            : "Hubo un error al actualizar la subcategoría";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar la subcategoría. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = (data: CrearSubCatInterface) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate({ ...data, is_market: market });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">Nombre de la Sub Categoría*</Label>
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
      </div>{" "}
      <div className="space-y-1">
        <Label className="font-bold">Categoria a la que pertenece*</Label>
        <Select
          onValueChange={(value) => setValue("categoriaId", value)}
          defaultValue={editSubCategoria?.categoria?.id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categorias</SelectLabel>
              {categorias && categorias.data.length > 0 ? (
                categorias.data.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </SelectItem>
                ))
              ) : (
                <p>No se encontraron categorias</p>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.categoriaId && (
          <p className="text-sm font-medium text-red-500">
            {errors.categoriaId.message as string}
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
            <span>
              {isEdit ? "Actualizar Sub Categoría" : "Crear Sub Categoría"}
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormSubCategoria;
