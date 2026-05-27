import { ActualizarMarca } from "@/apis/marcas/accions/actualizar-marcas";
import { CrearMarca } from "@/apis/marcas/accions/crear-marcas";
import { CreateMarcaInterface } from "@/apis/marcas/interface/crear-marca.interface";
import { Marca } from "@/apis/marcas/interface/response-marcas.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  editMarca?: Marca | null;
  isEdit?: boolean;
  onSucces: () => void;
  isMarket?: boolean;
}

const FormMarcas = ({ onSucces, editMarca, isEdit, isMarket }: Props) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMarcaInterface>();

  useEffect(() => {
    if (editMarca && isEdit) {
      reset({
        nombre: editMarca.nombre,
        pais_origen: editMarca.pais_origen,
        is_active: editMarca.is_active,
      });
    }
  }, [editMarca, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: CreateMarcaInterface) => CrearMarca(data),
    onSuccess: () => {
      toast.success("Marca creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["marcas"] });
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
            : "Hubo un error al crear la marca";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear la marca. Inténtalo de nuevo.",
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CreateMarcaInterface) =>
      ActualizarMarca(editMarca?.id ?? "", data),
    onSuccess: () => {
      toast.success("Marca actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["marcas"] });
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
            : "Hubo un error al actualizar la marca";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar la marca. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = (data: CreateMarcaInterface) => {
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
        <Label className="font-bold">Nombre de la Marca*</Label>
        <Input
          {...register("nombre", { required: "El campo nombre es requerido" })}
          placeholder="Escriba el nombre de la marca"
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">País de Origen*</Label>
        <Input
          {...register("pais_origen", {
            required: "El campo país de origen es requerido",
          })}
          placeholder="Escriba el país de origen de la marca"
        />
        {errors.pais_origen && (
          <p className="text-sm font-medium text-red-500">
            {errors.pais_origen.message as string}
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
            <Label htmlFor="is_active">Activa</Label>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
        >
          {isEdit ? "Actualizar Marca" : "Crear Marca"}
        </Button>
      </div>
    </form>
  );
};

export default FormMarcas;
