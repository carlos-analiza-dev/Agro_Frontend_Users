import { CrearPrecioPaqueteInterface } from "@/apis/precios-paquetes/interfaces/crear-precio-paquete.interface";
import useGetPaisesActivos from "@/hooks/paises/useGetPaisesActivos";
import useGetObtenerPaquetes from "@/hooks/paquetes/useGetObtenerPaquetes";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { EditarPrecioPaquete } from "@/apis/precios-paquetes/accions/editar-precio-paquete";
import { IngresarPrecioPaquete } from "@/apis/precios-paquetes/accions/crear-precio-paquete";
import { ResponsePreciosInterface } from "@/apis/precios-paquetes/interfaces/response-precios.interface";

interface Props {
  precioPaquete?: ResponsePreciosInterface | null;
  setOpenModal: (open: boolean) => void;
  onSuccess: () => void;
}

const FormPreciosPaquetes = ({
  precioPaquete,
  setOpenModal,
  onSuccess,
}: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPaquete, setSelectedPaquete] = useState<any>(null);

  const { data: paquetes, isLoading: isLoadingPaquetes } =
    useGetObtenerPaquetes();
  const { data: paises, isLoading: isLoadingPaises } = useGetPaisesActivos();

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CrearPrecioPaqueteInterface>({
    defaultValues: {
      paqueteId: "",
      paisId: "",
      precioMensual: 0,
      precioAnual: 0,
      isActive: true,
    },
  });

  const queryClient = useQueryClient();
  const isEditing = !!precioPaquete;
  const selectedPaqueteId = watch("paqueteId");

  useEffect(() => {
    if (selectedPaqueteId && paquetes) {
      const paquete = paquetes.find((p: any) => p.id === selectedPaqueteId);
      setSelectedPaquete(paquete);
    } else {
      setSelectedPaquete(null);
    }
  }, [selectedPaqueteId, paquetes]);

  useEffect(() => {
    if (precioPaquete) {
      setValue("paqueteId", precioPaquete.paquete?.id || "");

      setValue("paisId", precioPaquete.pais?.id || "");
      setValue("precioMensual", Number(precioPaquete.precioMensual) || 0);
      setValue("precioAnual", Number(precioPaquete.precioAnual) || 0);
      setValue(
        "isActive",
        precioPaquete.isActive !== undefined ? precioPaquete.isActive : true,
      );
    } else {
      reset({
        paqueteId: "",

        paisId: "",
        precioMensual: 0,
        precioAnual: 0,
        isActive: true,
      });
      setSelectedPaquete(null);
    }
    setIsLoading(false);
  }, [precioPaquete, setValue, reset]);

  const onSubmit = async (data: CrearPrecioPaqueteInterface) => {
    try {
      if (isEditing && precioPaquete) {
        await EditarPrecioPaquete(precioPaquete.id, data);
        toast.success("Precio del paquete actualizado correctamente");
      } else {
        await IngresarPrecioPaquete(data);
        toast.success("Precio del paquete registrado correctamente");
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["precios-paquetes"] });
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
            : "Hubo un error al registrar el precio del paquete";
        setErrorMessage(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  if (isLoading || isLoadingPaquetes || isLoadingPaises) {
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
            Error al {isEditing ? "actualizar" : "registrar"} el Precio del
            Paquete
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="paqueteId">
            Paquete <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("paqueteId")}
            onValueChange={(value) => setValue("paqueteId", value)}
            disabled={isSubmitting || isEditing}
          >
            <SelectTrigger className={errors.paqueteId ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar paquete" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Paquetes Disponibles</SelectLabel>
                {paquetes?.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No hay paquetes disponibles
                  </div>
                ) : (
                  paquetes?.map((paquete: any) => (
                    <SelectItem key={paquete.id} value={paquete.id}>
                      <div className="flex flex-col">
                        <span>{paquete.nombre}</span>
                        <span className="text-xs text-muted-foreground">
                          {paquete.tipo} | {paquete.maxFincas} fincas |{" "}
                          {paquete.maxAnimales} animales
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.paqueteId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.paqueteId.message}
            </p>
          )}
        </div>

        {selectedPaquete && (
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="font-semibold">Tipo:</span>{" "}
                  <span className="text-blue-700 dark:text-blue-300">
                    {selectedPaquete.tipo}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Máx. Fincas:</span>{" "}
                  {selectedPaquete.maxFincas}
                </div>
                <div>
                  <span className="font-semibold">Máx. Animales:</span>{" "}
                  {selectedPaquete.maxAnimales}
                </div>
                <div>
                  <span className="font-semibold">Máx. Trabajadores:</span>{" "}
                  {selectedPaquete.maxTrabajadores}
                </div>
                <div>
                  <span className="font-semibold">Estado:</span>{" "}
                  {selectedPaquete.isActive ? "Activo" : "Inactivo"}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <Label htmlFor="paisId">
            País <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("paisId")}
            onValueChange={(value) => setValue("paisId", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors.paisId ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar país" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Países Activos</SelectLabel>
                {paises?.data.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No hay países disponibles
                  </div>
                ) : (
                  paises?.data.map((pais: any) => (
                    <SelectItem key={pais.id} value={pais.id}>
                      <div className="flex items-center gap-2">
                        <span>{pais.nombre}</span>
                        <span className="text-xs text-muted-foreground">
                          ({pais.simbolo_moneda} {pais.nombre_moneda})
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.paisId && (
            <p className="text-sm text-red-500 mt-1">{errors.paisId.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="precioMensual">
              Precio Mensual <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {paises?.data.find((p: any) => p.id === watch("paisId"))
                  ?.simbolo_moneda || "$"}
              </span>
              <Input
                id="precioMensual"
                type="number"
                step="0.01"
                {...register("precioMensual", {
                  required: "El precio mensual es requerido",
                  min: {
                    value: 0,
                    message: "El precio debe ser mayor o igual a 0",
                  },
                  valueAsNumber: true,
                })}
                className={`pl-8 ${errors.precioMensual ? "border-red-500" : ""}`}
                placeholder="0.00"
                disabled={isSubmitting}
              />
            </div>
            {errors.precioMensual && (
              <p className="text-sm text-red-500 mt-1">
                {errors.precioMensual.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="precioAnual">
              Precio Anual <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {paises?.data.find((p: any) => p.id === watch("paisId"))
                  ?.simbolo_moneda || "$"}
              </span>
              <Input
                id="precioAnual"
                type="number"
                step="0.01"
                {...register("precioAnual", {
                  required: "El precio anual es requerido",
                  min: {
                    value: 0,
                    message: "El precio debe ser mayor o igual a 0",
                  },
                  valueAsNumber: true,
                })}
                className={`pl-8 ${errors.precioAnual ? "border-red-500" : ""}`}
                placeholder="0.00"
                disabled={isSubmitting}
              />
            </div>
            {errors.precioAnual && (
              <p className="text-sm text-red-500 mt-1">
                {errors.precioAnual.message}
              </p>
            )}
          </div>
        </div>

        {watch("precioMensual") > 0 && watch("precioAnual") > 0 && (
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 dark:text-green-200">
              💰 Ahorro anual:{" "}
              <span className="font-bold">
                {Math.round(
                  ((watch("precioMensual") * 12 - watch("precioAnual")) /
                    (watch("precioMensual") * 12)) *
                    100,
                )}
                %
              </span>{" "}
              ({(watch("precioMensual") * 12 - watch("precioAnual")).toFixed(2)}{" "}
              {paises?.data.find((p: any) => p.id === watch("paisId"))
                ?.simbolo_moneda || "$"}{" "}
              de ahorro)
            </p>
          </div>
        )}

        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="space-y-0.5">
            <Label className="text-base">Estado del Precio</Label>
            <p className="text-sm text-muted-foreground">
              {watch("isActive")
                ? "Este precio estará disponible para los clientes"
                : "Este precio no estará disponible para nuevos clientes"}
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
            "Actualizar Precio"
          ) : (
            "Registrar Precio"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormPreciosPaquetes;
