import { CrearPaqueteInterface } from "@/apis/paquetes/interfaces/crear-paquete.interface";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";
import { Switch } from "@/components/ui/switch";
import { ResponsePaquetesInterface } from "@/apis/paquetes/interfaces/response-paquetes.interface";
import { EditarPaquete } from "@/apis/paquetes/accions/editar-paquete";
import { IngresarPaquetes } from "@/apis/paquetes/accions/crear-paquete";
import { getTipoText } from "@/helpers/funciones/paquetes/tipoPaquetes";

interface Props {
  paquete?: ResponsePaquetesInterface | null;
  setOpenModal: (open: boolean) => void;
  onSuccess: () => void;
}

const FormPaquete = ({ paquete, setOpenModal, onSuccess }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CrearPaqueteInterface>({
    defaultValues: {
      nombre: "",
      tipo: TipoPaquete.FREE,
      maxFincas: 1,
      maxAnimales: 5,
      maxTrabajadores: 1,
      isActive: true,
      ecommerce: true,
    },
  });

  const queryClient = useQueryClient();
  const isEditing = !!paquete;

  const selectedTipo = watch("tipo");

  useEffect(() => {
    if (paquete) {
      setValue("nombre", paquete.nombre || "");
      setValue("tipo", paquete.tipo as TipoPaquete);
      setValue("maxFincas", paquete.maxFincas || 1);
      setValue("maxAnimales", paquete.maxAnimales || 5);
      setValue("maxTrabajadores", paquete.maxTrabajadores || 1);
      setValue(
        "isActive",
        paquete.isActive !== undefined ? paquete.isActive : true,
      );
      setValue(
        "ecommerce",
        paquete.ecommerce !== undefined ? paquete.ecommerce : true,
      );
    } else {
      reset({
        nombre: "",
        tipo: TipoPaquete.FREE,
        maxFincas: 1,
        maxAnimales: 5,
        maxTrabajadores: 1,
        isActive: true,
        ecommerce: true,
      });
    }
    setIsLoading(false);
  }, [paquete, setValue, reset]);

  const onSubmit = async (data: CrearPaqueteInterface) => {
    try {
      if (isEditing && paquete) {
        await EditarPaquete(paquete.id, data);
        toast.success("Paquete actualizado correctamente");
      } else {
        await IngresarPaquetes(data);
        toast.success("Paquete registrado correctamente");
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["paquetes"] });

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
            : "Hubo un error al registrar el paquete";
        setErrorMessage(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            Error al {isEditing ? "actualizar" : "registrar"} el Paquete
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="nombre">
            Nombre del Paquete <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombre"
            {...register("nombre", {
              required: "El nombre del paquete es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "El nombre no puede exceder los 100 caracteres",
              },
            })}
            placeholder="Ej: Plan Básico, Plan Premium, Plan Empresarial"
            className={errors.nombre ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.nombre && (
            <p className="text-sm text-red-500 mt-1">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="tipo">
            Tipo de Paquete <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("tipo")}
            onValueChange={(value) => setValue("tipo", value as TipoPaquete)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors.tipo ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar tipo de paquete" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipos de Paquete</SelectLabel>
                {Object.values(TipoPaquete).map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    <div className="flex items-center gap-2">
                      <span>{getTipoText(tipo)}</span>
                      {tipo === TipoPaquete.FREE && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Gratis
                        </span>
                      )}
                      {tipo === TipoPaquete.BASICO && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                      {tipo === TipoPaquete.PREMIUM && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Recomendado
                        </span>
                      )}
                      {tipo === TipoPaquete.AGRO_GESTION && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Completo
                        </span>
                      )}
                      {tipo === TipoPaquete.AGRO_LIGHT && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Medio
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tipo && (
            <p className="text-sm text-red-500 mt-1">{errors.tipo.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {selectedTipo === TipoPaquete.FREE &&
              "Plan gratuito con características básicas"}
            {selectedTipo === TipoPaquete.BASICO &&
              "Plan básico para pequeños ganaderos"}
            {selectedTipo === TipoPaquete.PREMIUM &&
              "Plan premium para medianos y grandes productores"}
            {selectedTipo === TipoPaquete.AGRO_GESTION &&
              "Plan agro elite para grandes productores"}
            {selectedTipo === TipoPaquete.EMPRESARIAL &&
              "Plan empresarial con características avanzadas"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="maxFincas">
              Máximo de Fincas <span className="text-red-500">*</span>
            </Label>
            <Input
              id="maxFincas"
              type="number"
              {...register("maxFincas", {
                required: "El máximo de fincas es requerido",
                min: {
                  value: 1,
                  message: "Debe tener al menos 1 finca",
                },
                max: {
                  value: 1000,
                  message: "No puede exceder 1000 fincas",
                },
                valueAsNumber: true,
              })}
              className={errors.maxFincas ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.maxFincas && (
              <p className="text-sm text-red-500 mt-1">
                {errors.maxFincas.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="maxAnimales">
              Máximo de Animales <span className="text-red-500">*</span>
            </Label>
            <Input
              id="maxAnimales"
              type="number"
              {...register("maxAnimales", {
                required: "El máximo de animales es requerido",
                min: {
                  value: 1,
                  message: "Debe tener al menos 1 animal",
                },
                max: {
                  value: 100000,
                  message: "No puede exceder 50000 animales",
                },
                valueAsNumber: true,
              })}
              className={errors.maxAnimales ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.maxAnimales && (
              <p className="text-sm text-red-500 mt-1">
                {errors.maxAnimales.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="maxTrabajadores">
              Máximo de Trabajadores <span className="text-red-500">*</span>
            </Label>
            <Input
              id="maxTrabajadores"
              type="number"
              {...register("maxTrabajadores", {
                required: "El máximo de trabajadores es requerido",
                min: {
                  value: 1,
                  message: "Debe tener al menos 1 trabajador",
                },
                max: {
                  value: 100,
                  message: "No puede exceder 100 trabajadores",
                },
                valueAsNumber: true,
              })}
              className={errors.maxTrabajadores ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.maxTrabajadores && (
              <p className="text-sm text-red-500 mt-1">
                {errors.maxTrabajadores.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="space-y-0.5">
            <Label className="text-base">¿Incluye Ecommerce?</Label>
            <p className="text-sm text-muted-foreground">
              {watch("ecommerce")
                ? "El paquete incluye Ecommerce"
                : "El paquete no incluye Ecommerce"}
            </p>
          </div>
          <Switch
            checked={watch("ecommerce")}
            onCheckedChange={(checked) => setValue("ecommerce", checked)}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="space-y-0.5">
            <Label className="text-base">Estado del Paquete</Label>
            <p className="text-sm text-muted-foreground">
              {watch("isActive")
                ? "El paquete estará disponible para los clientes"
                : "El paquete no estará disponible para nuevos clientes"}
            </p>
          </div>
          <Switch
            checked={watch("isActive")}
            onCheckedChange={(checked) => setValue("isActive", checked)}
            disabled={isSubmitting}
          />
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
            "Actualizar Paquete"
          ) : (
            "Registrar Paquete"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormPaquete;
