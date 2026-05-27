import { CrearInsumo } from "@/apis/insumos/accions/crear-insumo";
import { EditarInsumo } from "@/apis/insumos/accions/editar-insumo";
import { CrearInsumoInterface } from "@/apis/insumos/interfaces/crear-insumo.interface";
import { Insumo } from "@/apis/insumos/interfaces/response-insumos.interface";
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
import { UnidadMedida } from "@/helpers/data/unidadMedidas";
import useGetAllMarcas from "@/hooks/marcas/useGetAllMarcas";
import useGetProveedoresActivos from "@/hooks/proveedores/useGetProveedoresActivos";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  editInsumo?: Insumo | null;
  isEdit?: boolean;
  onSuccess: () => void;
}

const FormInsumos = ({ onSuccess, editInsumo, isEdit }: Props) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearInsumoInterface>();

  const { data: marcas } = useGetAllMarcas({
    limit: 100,
    offset: 0,
    is_market: false,
  });
  const { data: proveedores } = useGetProveedoresActivos();

  useEffect(() => {
    if (editInsumo && isEdit) {
      reset({
        nombre: editInsumo.nombre,
        codigo: editInsumo.codigo,
        costo: Number(editInsumo.costo),
        unidad_venta: editInsumo.unidad_venta,
        disponible: editInsumo.disponible,
        marcaId: editInsumo.marca?.id || "",
        proveedorId: editInsumo.proveedor?.id || "",
      });
    }
  }, [editInsumo, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: CrearInsumoInterface) => CrearInsumo(data),
    onSuccess: () => {
      toast.success("Insumo creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["insumos-admin"] });
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
            : "Hubo un error al crear el insumo";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el insumo. Inténtalo de nuevo.",
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearInsumoInterface) =>
      EditarInsumo(editInsumo?.id ?? "", data),
    onSuccess: () => {
      toast.success("Insumo actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["insumos-admin"] });
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
            : "Hubo un error al actualizar el insumo";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el insumo. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = (data: CrearInsumoInterface) => {
    const payload = {
      ...data,
      costo: Number(data.costo),
      disponible: data.disponible ?? true,
      paisId: user?.pais.id ?? "",
    };

    if (isEdit) {
      mutationUpdate.mutate(payload);
    } else {
      mutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">Codigo*</Label>
        <Input
          {...register("codigo", {
            required: "El codigo de insumo es requerido",
          })}
          placeholder="Ej: INS-100019"
        />
        {errors.codigo && (
          <p className="text-sm font-medium text-red-500">
            {errors.codigo.message as string}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label className="font-bold">Nombre del Insumo*</Label>
        <Input
          {...register("nombre", {
            required: "El nombre del insumo es requerido",
          })}
          placeholder="Ej: Antibiótico Bovino"
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="font-bold">Marca</Label>
          <Select
            defaultValue={isEdit ? editInsumo?.marca.id : ""}
            onValueChange={(value) => setValue("marcaId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una marca" />
            </SelectTrigger>
            <SelectContent>
              {marcas?.data.map((marca) => (
                <SelectItem key={marca.id} value={marca.id}>
                  {marca.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="font-bold">Proveedor</Label>
          <Select
            defaultValue={isEdit ? editInsumo?.proveedor.id : ""}
            onValueChange={(value) => setValue("proveedorId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un proveedor" />
            </SelectTrigger>
            <SelectContent>
              {proveedores?.map((proveedor) => (
                <SelectItem key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre_legal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <div className="space-y-1 w-full">
          <Label className="font-bold">Costo*</Label>
          <Input
            type="number"
            step="0.01"
            {...register("costo", {
              required: "El costo es requerido",
              min: { value: 0.01, message: "El costo debe ser mayor a 0" },
            })}
            placeholder="0.00"
          />
          {errors.costo && (
            <p className="text-sm font-medium text-red-500">
              {errors.costo.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1 w-full">
          <Label className="font-bold">Unidad de Venta*</Label>
          <Select
            defaultValue={isEdit ? editInsumo?.unidad_venta : ""}
            onValueChange={(value) => setValue("unidad_venta", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una unidad" />
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
      </div>

      {isEdit && (
        <div className="space-y-1">
          <Label className="font-bold">Estado</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="disponible"
              {...register("disponible")}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              defaultChecked={watch("disponible") ?? true}
            />
            <Label htmlFor="disponible">Disponible</Label>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
          className="min-w-[120px]"
        >
          {mutation.isPending || mutationUpdate.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEdit ? "Actualizando..." : "Creando..."}
            </>
          ) : (
            <>{isEdit ? "Actualizar Insumo" : "Crear Insumo"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormInsumos;
