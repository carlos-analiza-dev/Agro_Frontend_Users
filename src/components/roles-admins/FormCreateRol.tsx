import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Role } from "@/apis/roles/interfaces/response-roles-filters.interface";
import { CreateRolI } from "@/apis/roles/interfaces/crear-rol.interface";
import { AddRol, AddRolAgro } from "@/apis/roles/accions/create-rol";
import { UpdateRol, UpdateRolAgro } from "@/apis/roles/accions/update-rol";

interface Props {
  editRol?: Role | null;
  isEdit?: boolean;
  onSuccess: () => void;
  isOpen: boolean;
  isAgro?: boolean;
}

const FormCreateRol = ({
  onSuccess,
  editRol,
  isEdit,
  isOpen,
  isAgro,
}: Props) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateRolI>();

  useEffect(() => {
    if (isOpen) {
      if (isEdit && editRol) {
        reset({
          name: editRol.name,
          description: editRol.description,
          isActive: editRol.isActive,
        });
      } else {
        reset({
          name: "",
          description: "",
          isActive: true,
        });
      }
    }
  }, [isOpen, isEdit, editRol, reset]);

  const mutation = useMutation({
    mutationFn: (data: CreateRolI) =>
      isAgro ? AddRolAgro(data) : AddRol(data),
    onSuccess: () => {
      toast.success("Rol creado exitosamente");
      if (isAgro) {
        queryClient.invalidateQueries({ queryKey: ["roles-agro"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["roles-filters"] });
      }
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
            : "Hubo un error al crear el rol";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el rol. Inténtalo de nuevo.",
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CreateRolI) =>
      isAgro
        ? UpdateRolAgro(editRol?.id ?? "", data)
        : UpdateRol(editRol?.id ?? "", data),
    onSuccess: () => {
      toast.success("Rol actualizado exitosamente");
      if (isAgro) {
        queryClient.invalidateQueries({ queryKey: ["roles-agro"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["roles-filters"] });
      }
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
            : "Hubo un error al actualizar el rol";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el rol. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = (data: CreateRolI) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="font-bold">
          Nombre del Rol*
        </Label>
        <Input
          id="name"
          {...register("name", {
            required: "El nombre del rol es requerido",
            minLength: {
              value: 3,
              message: "El nombre debe tener al menos 3 caracteres",
            },
          })}
          placeholder="Ej: Administrador, Usuario, etc."
        />
        {errors.name && (
          <p className="text-sm font-medium text-red-500">
            {errors.name.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-bold">
          Descripción*
        </Label>
        <Input
          id="description"
          {...register("description", {
            required: "La descripción es requerida",
            minLength: {
              value: 10,
              message: "La descripción debe tener al menos 10 caracteres",
            },
          })}
          placeholder="Describe las funciones y permisos de este rol"
        />
        {errors.description && (
          <p className="text-sm font-medium text-red-500">
            {errors.description.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-bold">Estado</Label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            {...register("isActive")}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            defaultChecked
          />
          <Label htmlFor="isActive" className="text-sm font-normal">
            Rol activo
          </Label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={() => {}}>
          Cancelar
        </Button>
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
            <>{isEdit ? "Actualizar Rol" : "Crear Rol"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormCreateRol;
