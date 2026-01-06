import { CrearSucursal } from "@/apis/sucursales/accions/crear-sucursal";
import { EditarSucursal } from "@/apis/sucursales/accions/editar-sucursal";
import { CrearSucursaleInterface } from "@/apis/sucursales/interfaces/crear-sucursale.interface";
import { Sucursal } from "@/apis/sucursales/interfaces/response-sucursales.interface";
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
import { tiposSucursal } from "@/helpers/data/tiposSucursales";
import useGetDepartamentosByPais from "@/hooks/departamentos/useGetDepartamentosByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import useGetVeterinarios from "@/hooks/users/useGetVeterinarios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import usePaises from "@/hooks/paises/usePaises";

interface Props {
  editSucursal?: Sucursal | null;
  isEdit?: boolean;
  onSucces: () => void;
  paisId: string;
}

const FormSucursal = ({ onSucces, editSucursal, isEdit, paisId }: Props) => {
  const queryClient = useQueryClient();
  const { data: paises, isLoading: cargandoPaises } = usePaises();
  const [paisSeleccionado, setPaisSeleccionado] = React.useState(paisId);
  const { data: departamentos, isLoading: cargandoDepartamentos } =
    useGetDepartamentosByPais(paisSeleccionado || "");
  const { data: gerentes } = useGetVeterinarios();
  const [departamentoSeleccionado, setDepartamentoSeleccionado] =
    React.useState("");
  const { data: municipios, isLoading: cargandoMunicipios } =
    useGetMunicipiosActivosByDepto(departamentoSeleccionado);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearSucursaleInterface>();

  const departamentoId = watch("departamentoId");
  const paisFormId = watch("paisId");

  useEffect(() => {
    if (departamentoId) {
      setDepartamentoSeleccionado(departamentoId);
    }
  }, [departamentoId]);

  useEffect(() => {
    if (paisSeleccionado) {
      setValue("paisId", paisSeleccionado);
    }
  }, [paisSeleccionado, setValue]);

  useEffect(() => {
    if (editSucursal && isEdit) {
      reset({
        nombre: editSucursal.nombre,
        tipo: editSucursal.tipo,
        direccion_complemento: editSucursal.direccion_complemento,
        municipioId: editSucursal.municipio.id,
        departamentoId: editSucursal.departamento.id,
        paisId: editSucursal.pais.id,
        gerenteId: editSucursal.gerente?.id || "",
      });
      setPaisSeleccionado(editSucursal.pais.id);
      setDepartamentoSeleccionado(editSucursal.departamento.id);
    } else {
      setValue("paisId", paisId);
      setPaisSeleccionado(paisId);
    }
  }, [editSucursal, isEdit, reset, setValue, paisId]);

  const handlePaisChange = (value: string) => {
    setPaisSeleccionado(value);
    setValue("paisId", value);

    setValue("departamentoId", "");
    setValue("municipioId", "");
    setDepartamentoSeleccionado("");
  };

  const mutation = useMutation({
    mutationFn: (data: CrearSucursaleInterface) => CrearSucursal(data),
    onSuccess: () => {
      toast.success("Sucursal creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["sucursales"] });
      queryClient.invalidateQueries({ queryKey: ["sucursales-pais"] });
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
            : "Hubo un error al crear la sucursal";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear la sucursal. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearSucursaleInterface) =>
      EditarSucursal(editSucursal?.id ?? "", data),
    onSuccess: () => {
      toast.success("Sucursal actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["sucursales"] });
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
            : "Hubo un error al actualizar la sucursal";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar la sucursal. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CrearSucursaleInterface) => {
    data.paisId = paisSeleccionado || paisId || "";

    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">Nombre de la Sucursal*</Label>
        <Input
          {...register("nombre", { required: "El campo nombre es requerido" })}
          placeholder="Escriba el nombre de la sucursal"
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Tipo de Sucursal*</Label>
        <Select
          onValueChange={(value) => setValue("tipo", value)}
          defaultValue={editSucursal?.tipo}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de sucursal" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipos de Sucursal</SelectLabel>
              {tiposSucursal.map((tipo) => (
                <SelectItem value={tipo.value} key={tipo.id}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.tipo && (
          <p className="text-sm font-medium text-red-500">
            {errors.tipo.message as string}
          </p>
        )}
      </div>

      {!isEdit && (
        <div className="space-y-1">
          <Label className="font-bold">País*</Label>
          <Select
            value={paisSeleccionado}
            onValueChange={handlePaisChange}
            disabled={cargandoPaises}
          >
            <SelectTrigger>
              {cargandoPaises ? (
                <SelectValue placeholder="Cargando países..." />
              ) : (
                <SelectValue placeholder="Selecciona un país" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Países</SelectLabel>
                {paises?.data.map((pais) => (
                  <SelectItem key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.paisId && (
            <p className="text-sm font-medium text-red-500">
              {errors.paisId.message as string}
            </p>
          )}
        </div>
      )}

      {isEdit && editSucursal && (
        <div className="space-y-1">
          <Label className="font-bold">País</Label>
          <Input
            value={editSucursal.pais.nombre}
            disabled
            className="bg-gray-50"
          />
          <input
            type="hidden"
            {...register("paisId")}
            value={editSucursal.pais.id}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="font-bold">Departamento*</Label>
          <Select
            onValueChange={(value) => setValue("departamentoId", value)}
            defaultValue={editSucursal?.departamento?.id}
            disabled={!paisSeleccionado || cargandoDepartamentos}
          >
            <SelectTrigger>
              {cargandoDepartamentos ? (
                <SelectValue placeholder="Cargando..." />
              ) : (
                <SelectValue placeholder="Selecciona un departamento" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Departamentos</SelectLabel>
                {departamentos?.data?.departamentos?.map((depto) => (
                  <SelectItem key={depto.id} value={depto.id}>
                    {depto.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.departamentoId && (
            <p className="text-sm font-medium text-red-500">
              {errors.departamentoId.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Municipio*</Label>
          <Select
            onValueChange={(value) => setValue("municipioId", value)}
            defaultValue={editSucursal?.municipio?.id}
            disabled={!departamentoId || cargandoMunicipios}
          >
            <SelectTrigger>
              {cargandoMunicipios ? (
                <SelectValue placeholder="Cargando..." />
              ) : (
                <SelectValue
                  placeholder={
                    departamentoId
                      ? "Selecciona un municipio"
                      : "Primero selecciona un departamento"
                  }
                />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Municipios</SelectLabel>
                {municipios?.data?.map((mun) => (
                  <SelectItem key={mun.id} value={mun.id}>
                    {mun.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.municipioId && (
            <p className="text-sm font-medium text-red-500">
              {errors.municipioId.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Dirección*</Label>
        <Textarea
          {...register("direccion_complemento", {
            required: "El campo dirección es requerido",
          })}
          placeholder="Escriba la dirección completa de la sucursal"
          rows={3}
        />
        {errors.direccion_complemento && (
          <p className="text-sm font-medium text-red-500">
            {errors.direccion_complemento.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Gerente</Label>
        <Select
          onValueChange={(value) => setValue("gerenteId", value)}
          defaultValue={editSucursal?.gerente?.id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un gerente (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Gerentes</SelectLabel>
              {gerentes?.map((gerente) => (
                <SelectItem key={gerente.id} value={gerente.id}>
                  {gerente.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

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
            <span>{isEdit ? "Actualizar Sucursal" : "Crear Sucursal"}</span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormSucursal;
