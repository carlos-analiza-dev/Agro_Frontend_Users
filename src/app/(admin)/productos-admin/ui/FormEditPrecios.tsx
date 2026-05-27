import { Producto } from "@/apis/productos/interfaces/response-productos.interface";
import { updateServicioPrecio } from "@/apis/servicios_precios/accions/update-servicios-price";
import { CrearServicePrecio } from "@/apis/servicios_precios/interfaces/crear-servicio-precio.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  editSubServicio?: Producto | null;
  isEdit?: boolean;
  onSuccess: () => void;
}

const FormEditPrecios = ({ onSuccess, editSubServicio, isEdit }: Props) => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,

    formState: { errors },
  } = useForm<CrearServicePrecio>();

  useEffect(() => {
    if (isEdit && editSubServicio) {
      reset({
        precio: Number(editSubServicio.preciosPorPais?.[0]?.precio),
        costo: Number(editSubServicio.preciosPorPais?.[0]?.costo),
      });
    } else {
      reset({
        precio: undefined,
        costo: undefined,
      });
    }
  }, [isEdit, editSubServicio, reset, setValue]);

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearServicePrecio) =>
      updateServicioPrecio(editSubServicio?.preciosPorPais[0].id ?? "", data),
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

  const onSubmit = (data: CrearServicePrecio) => {
    const payload = {
      ...data,
      precio: Number(data.precio),
      costo: Number(data.costo),
      paisId: paisId,
    };
    if (isEdit) {
      mutationUpdate.mutate(payload);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <>
        <div className="flex justify-between">
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
              defaultValue={
                isEdit ? editSubServicio?.preciosPorPais?.[0]?.precio : ""
              }
            />
            {errors.precio && (
              <p className="text-sm font-medium text-red-500">
                {errors.precio.message as string}
              </p>
            )}
          </div>

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
              defaultValue={
                isEdit ? editSubServicio?.preciosPorPais?.[0]?.costo : ""
              }
            />
            {errors.costo && (
              <p className="text-sm font-medium text-red-500">
                {errors.costo.message as string}
              </p>
            )}
          </div>
        </div>
      </>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" disabled={mutationUpdate.isPending}>
          {mutationUpdate.isPending ? (
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
            <>{isEdit ? "Actualizar Precios" : "Crear Precios"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormEditPrecios;
