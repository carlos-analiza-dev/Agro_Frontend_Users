import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import useGetObtenerPaquetes from "@/hooks/paquetes/useGetObtenerPaquetes";
import { CrearCodigoInterface } from "@/apis/codigos-paquetes/interfaces/crear-codigo.interface";
import { crearCodigoPaquete } from "@/apis/codigos-paquetes/accions/crear-codigo-paquete";
import { editarCodigoPaquete } from "@/apis/codigos-paquetes/accions/editar-codigo-paquete";
import {
  CodigosPaquetes,
  Paquete,
} from "@/apis/codigos-paquetes/interfaces/response-codigos-paquetes.interface";

interface Props {
  editCodigo: CodigosPaquetes | null;
  isEdit?: boolean;
  onSuccess: () => void;
}

const FormCodigosPaquetes = ({ onSuccess, editCodigo, isEdit }: Props) => {
  const queryClient = useQueryClient();
  const { data: paquetes, isLoading: isLoadingPaquetes } =
    useGetObtenerPaquetes();
  const [isPaquetesReady, setIsPaquetesReady] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearCodigoInterface>({
    defaultValues: {
      codigo: "",
      paqueteId: "",
      activo: true,
      fechaExpiracion: "",
    },
  });

  useEffect(() => {
    if (editCodigo && isEdit) {
      reset({
        codigo: editCodigo.codigo,
        paqueteId: editCodigo.paqueteId,
        activo: editCodigo.activo,
        fechaExpiracion: editCodigo.fechaExpiracion?.split("T")[0] || "",
      });

      setIsPaquetesReady(false);
    }
  }, [editCodigo, isEdit, reset]);

  useEffect(() => {
    if (
      editCodigo &&
      isEdit &&
      !isLoadingPaquetes &&
      paquetes &&
      !isPaquetesReady
    ) {
      const paqueteExiste = paquetes.some(
        (p: Paquete) => p.id === editCodigo.paqueteId,
      );

      if (paqueteExiste) {
        setTimeout(() => {
          setValue("paqueteId", editCodigo.paqueteId, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setIsPaquetesReady(true);
        }, 0);
      }
    }
  }, [
    editCodigo,
    isEdit,
    isLoadingPaquetes,
    paquetes,
    setValue,
    isPaquetesReady,
  ]);

  const mutationCreate = useMutation({
    mutationFn: (data: CrearCodigoInterface) => crearCodigoPaquete(data),
    onSuccess: () => {
      toast.success("Código de paquete creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["codigos-paquetes"] });
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
            : "Hubo un error al crear el código del paquete";
        toast.error(errorMessage);
      } else {
        toast.error("Error al crear el código del paquete.");
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearCodigoInterface) =>
      editarCodigoPaquete(editCodigo?.id ?? "", data),
    onSuccess: () => {
      toast.success("Código de paquete actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["codigos-paquetes"] });
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
            : "Hubo un error al actualizar el código del paquete";
        toast.error(errorMessage);
      } else {
        toast.error("Error al actualizar el código del paquete.");
      }
    },
  });

  const onSubmit = (data: CrearCodigoInterface) => {
    const formattedData = {
      ...data,
      codigo: data.codigo.toUpperCase().trim(),
      fechaExpiracion: data.fechaExpiracion
        ? new Date(data.fechaExpiracion).toISOString()
        : undefined,
    };

    if (isEdit) {
      mutationUpdate.mutate(formattedData);
    } else {
      mutationCreate.mutate(formattedData);
    }
  };

  const isPending = mutationCreate.isPending || mutationUpdate.isPending;
  const currentPaqueteId = watch("paqueteId");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="codigo" className="font-semibold">
          Código del Paquete *
        </Label>
        <Input
          id="codigo"
          placeholder="Ej: PREMIUM2024, VIP25"
          className="uppercase"
          {...register("codigo", {
            required: "El código del paquete es requerido",
            minLength: {
              value: 2,
              message: "El código debe tener al menos 2 caracteres",
            },
            maxLength: {
              value: 20,
              message: "El código no debe exceder los 20 caracteres",
            },
            pattern: {
              value: /^[A-Z0-9_-]+$/i,
              message:
                "El código solo puede contener letras, números, guiones (-) y guiones bajos (_)",
            },
          })}
          disabled={isPending}
        />
        {errors.codigo && (
          <p className="text-sm text-red-500">{errors.codigo.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          El código se guardará en mayúsculas automáticamente
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paqueteId" className="font-semibold">
          Paquete *
        </Label>
        <Select
          value={currentPaqueteId}
          onValueChange={(value) => {
            setValue("paqueteId", value);
          }}
          disabled={isPending || isLoadingPaquetes}
        >
          <SelectTrigger id="paqueteId" className="w-full">
            <SelectValue placeholder="Selecciona un paquete" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingPaquetes ? (
              <SelectItem value="loading" disabled>
                Cargando paquetes...
              </SelectItem>
            ) : paquetes && paquetes.length > 0 ? (
              paquetes.map((paquete: Paquete) => (
                <SelectItem key={paquete.id} value={paquete.id}>
                  {paquete.nombre} - {paquete.tipo} ({paquete.maxFincas} fincas)
                </SelectItem>
              ))
            ) : (
              <SelectItem value="empty" disabled>
                No hay paquetes disponibles
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.paqueteId && (
          <p className="text-sm text-red-500">{errors.paqueteId.message}</p>
        )}

        <p className="text-xs text-muted-foreground">
          Valor seleccionado: {currentPaqueteId || "Ninguno"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fechaExpiracion" className="font-semibold">
          Fecha de Expiración
        </Label>
        <Input
          id="fechaExpiracion"
          type="date"
          {...register("fechaExpiracion", {
            validate: (value) => {
              if (!value) return true;
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return selectedDate >= today || "La fecha debe ser futura";
            },
          })}
          disabled={isPending}
        />
        {errors.fechaExpiracion && (
          <p className="text-sm text-red-500">
            {errors.fechaExpiracion.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Dejar en blanco para que nunca expire
        </p>
      </div>

      {isEdit && (
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="activo"
            checked={watch("activo")}
            onCheckedChange={(checked) => {
              setValue("activo", checked as boolean);
            }}
            disabled={isPending}
          />
          <Label
            htmlFor="activo"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Código activo
          </Label>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            onSuccess();
          }}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEdit
              ? "Actualizando código..."
              : "Creando código..."
            : isEdit
              ? "Actualizar Código"
              : "Crear Código"}
        </Button>
      </div>
    </form>
  );
};

export default FormCodigosPaquetes;
