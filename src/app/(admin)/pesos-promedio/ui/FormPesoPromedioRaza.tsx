import { CrearPesoRaza } from "@/apis/pesos-promedio-raza/accions/crear-peso-raza";
import { EditarPesoRaza } from "@/apis/pesos-promedio-raza/accions/editar-peso-raza";
import { CrearPesoRazaInterface } from "@/apis/pesos-promedio-raza/interface/crear-peso-raza.interface";
import { PesosPromedioRazasInterface } from "@/apis/pesos-promedio-raza/interface/response-pesos-prom.interface";
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
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  pesoPromedio?: PesosPromedioRazasInterface | null;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

const FormPesoPromedioRaza = ({
  pesoPromedio,
  openModal,
  setOpenModal,
}: Props) => {
  const [especieId, setEspecieId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CrearPesoRazaInterface>({
    defaultValues: {
      edadMinMeses: pesoPromedio?.edadMinMeses || 1,
      edadMaxMeses: pesoPromedio?.edadMaxMeses || 1,
      pesoEsperadoMin: pesoPromedio?.pesoEsperadoMin
        ? Number(pesoPromedio.pesoEsperadoMin)
        : 0,
      pesoEsperadoMax: pesoPromedio?.pesoEsperadoMax
        ? Number(pesoPromedio.pesoEsperadoMax)
        : 0,
      razaId: pesoPromedio?.raza?.id || "",
    },
  });

  const { data: especies } = useGetEspecies();
  const { data: razas, isLoading: isLoadingRazas } =
    useGetRazasByEspecie(especieId);
  const queryClient = useQueryClient();
  const isEditing = !!pesoPromedio;

  useEffect(() => {
    if (openModal && pesoPromedio) {
      setValue("edadMinMeses", pesoPromedio.edadMinMeses);
      setValue("edadMaxMeses", pesoPromedio.edadMaxMeses);
      setValue("pesoEsperadoMin", Number(pesoPromedio.pesoEsperadoMin));
      setValue("pesoEsperadoMax", Number(pesoPromedio.pesoEsperadoMax));
      setValue("razaId", pesoPromedio.raza.id);
    }
  }, [openModal, pesoPromedio, setValue]);

  useEffect(() => {
    if (!isEditing) {
      setValue("razaId", "");
    }
  }, [especieId, setValue, isEditing]);

  const onSubmit = async (data: CrearPesoRazaInterface) => {
    try {
      if (data.edadMinMeses >= data.edadMaxMeses) {
        toast.error("La edad mínima debe ser menor que la edad máxima");
        return;
      }

      if (data.pesoEsperadoMin >= data.pesoEsperadoMax) {
        toast.error("El peso mínimo debe ser menor que el peso máximo");
        return;
      }

      const dataToSend = {
        ...data,
        edadMinMeses: Number(data.edadMinMeses),
        edadMaxMeses: Number(data.edadMaxMeses),
        pesoEsperadoMin: Number(data.pesoEsperadoMin),
        pesoEsperadoMax: Number(data.pesoEsperadoMax),
      };

      if (isEditing && pesoPromedio) {
        await EditarPesoRaza(pesoPromedio.id, dataToSend);
        toast.success("Peso promedio actualizado correctamente");
      } else {
        await CrearPesoRaza(dataToSend);
        toast.success("Peso promedio agregado correctamente");
      }

      reset();
      setEspecieId("");
      queryClient.invalidateQueries({ queryKey: ["pesos-promedio-razas"] });
      setOpenModal(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            `Error al ${isEditing ? "actualizar" : "agregar"} el peso promedio`,
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
      {!pesoPromedio && (
        <>
          <div className="space-y-2">
            <Label htmlFor="especie">
              Especie <span className="text-red-500">*</span>
            </Label>
            <Select
              value={especieId}
              onValueChange={setEspecieId}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una especie" />
              </SelectTrigger>
              <SelectContent>
                {especies?.data.map((especie: any) => (
                  <SelectItem key={especie.id} value={especie.id}>
                    {especie.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!especieId && !isEditing && (
              <p className="text-sm text-amber-500">
                Debes seleccionar una especie primero
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="razaId">
              Raza <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="razaId"
              control={control}
              rules={{ required: "La raza es requerida" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!especieId || isLoadingRazas || isEditing}
                >
                  <SelectTrigger
                    className={errors.razaId ? "border-red-500" : ""}
                  >
                    <SelectValue
                      placeholder={
                        !especieId
                          ? "Primero selecciona una especie"
                          : isLoadingRazas
                            ? "Cargando razas..."
                            : "Selecciona una raza"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {razas?.data.map((raza: any) => (
                      <SelectItem key={raza.id} value={raza.id}>
                        {raza.nombre} ({raza.abreviatura})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.razaId && (
              <p className="text-sm text-red-500">{errors.razaId.message}</p>
            )}
            {!isEditing &&
              especieId &&
              razas?.data.length === 0 &&
              !isLoadingRazas && (
                <p className="text-sm text-amber-500">
                  No hay razas disponibles para esta especie
                </p>
              )}
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edadMinMeses">
            Edad Mínima (meses) <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("edadMinMeses", {
              required: "La edad mínima es requerida",
              min: { value: 1, message: "La edad mínima debe ser mayor a 0" },
              valueAsNumber: true,
            })}
            type="number"
            min={1}
            placeholder="Ej: 1"
            className={errors.edadMinMeses ? "border-red-500" : ""}
          />
          {errors.edadMinMeses && (
            <p className="text-sm text-red-500">
              {errors.edadMinMeses.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edadMaxMeses">
            Edad Máxima (meses) <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("edadMaxMeses", {
              required: "La edad máxima es requerida",
              min: { value: 1, message: "La edad máxima debe ser mayor a 0" },
              valueAsNumber: true,
            })}
            type="number"
            min={1}
            placeholder="Ej: 6"
            className={errors.edadMaxMeses ? "border-red-500" : ""}
          />
          {errors.edadMaxMeses && (
            <p className="text-sm text-red-500">
              {errors.edadMaxMeses.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pesoEsperadoMin">
            Peso Mínimo (kg) <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("pesoEsperadoMin", {
              required: "El peso mínimo es requerido",
              min: { value: 0.1, message: "El peso debe ser mayor a 0" },
              valueAsNumber: true,
            })}
            type="number"
            step="0.01"
            min={0.1}
            placeholder="Ej: 50.50"
            className={errors.pesoEsperadoMin ? "border-red-500" : ""}
          />
          {errors.pesoEsperadoMin && (
            <p className="text-sm text-red-500">
              {errors.pesoEsperadoMin.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pesoEsperadoMax">
            Peso Máximo (kg) <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("pesoEsperadoMax", {
              required: "El peso máximo es requerido",
              min: { value: 0.1, message: "El peso debe ser mayor a 0" },
              valueAsNumber: true,
            })}
            type="number"
            step="0.01"
            min={0.1}
            placeholder="Ej: 70.75"
            className={errors.pesoEsperadoMax ? "border-red-500" : ""}
          />
          {errors.pesoEsperadoMax && (
            <p className="text-sm text-red-500">
              {errors.pesoEsperadoMax.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            reset();
            setEspecieId("");
            setOpenModal(false);
          }}
        >
          Cancelar
        </Button>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? "Actualizando..."
              : "Guardando..."
            : isEditing
              ? "Actualizar Peso"
              : "Guardar Peso"}
        </Button>
      </div>
    </form>
  );
};

export default FormPesoPromedioRaza;
