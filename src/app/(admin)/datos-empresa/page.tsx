"use client";
import useGetDatosEmpresa from "@/hooks/datos-empresa/useGetDatosEmpresa";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, X } from "lucide-react";
import DatosEmpresaSkeleton from "./ui/DatosEmpresaSkeleton";
import { CreatDatosEmpresaInterface } from "@/apis/datos-empresa/interfaces/crear-datos-empresa.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CrearDatosEmpresa } from "@/apis/datos-empresa/accions/crear-datos-empresa";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { ActualizarDatosEmpresa } from "@/apis/datos-empresa/accions/editar-datos-empresa";

const DatosEmpresaPage = () => {
  const { data: datos_empresa, isLoading } = useGetDatosEmpresa();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreatDatosEmpresaInterface>({
    defaultValues: {
      nombre_empresa: "",
      rtn: "",
      propietario: "",
      correo: "",
      telefono: "",
      direccion: "",
    },
  });

  useEffect(() => {
    if (datos_empresa) {
      reset({
        nombre_empresa: datos_empresa.nombre_empresa || "",
        rtn: datos_empresa.rtn || "",
        propietario: datos_empresa.propietario || "",
        correo: datos_empresa.correo || "",
        telefono: datos_empresa.telefono || "",
        direccion: datos_empresa.direccion || "",
      });
    }
  }, [datos_empresa, reset]);

  const [isEditing, setIsEditing] = React.useState(false);

  const create_mutation = useMutation({
    mutationFn: (data: CreatDatosEmpresaInterface) => CrearDatosEmpresa(data),
    onSuccess: () => {
      toast.success("Datos Creados Exitosamente");
      queryClient.invalidateQueries({ queryKey: ["datos-empresa"] });
      setIsEditing(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear los datos de la empresa";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear los datos de la empresa. Inténtalo de nuevo."
        );
      }
    },
  });

  const update_datos_mutation = useMutation({
    mutationFn: (data: CreatDatosEmpresaInterface) =>
      ActualizarDatosEmpresa(datos_empresa?.id ?? "", data),
    onSuccess: () => {
      toast.success("Datos Actualizados Exitosamente");
      queryClient.invalidateQueries({ queryKey: ["datos-empresa"] });
      setIsEditing(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar los datos de la empresa";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar los datos de la empresa. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = async (data: CreatDatosEmpresaInterface) => {
    if (!datos_empresa?.id) {
      await create_mutation.mutateAsync(data);
    } else {
      await update_datos_mutation.mutateAsync(data);
    }
  };

  const handleCancel = () => {
    if (datos_empresa) {
      reset({
        nombre_empresa: datos_empresa.nombre_empresa || "",
        rtn: datos_empresa.rtn || "",
        propietario: datos_empresa.propietario || "",
        correo: datos_empresa.correo || "",
        telefono: datos_empresa.telefono || "",
        direccion: datos_empresa.direccion || "",
      });
    }
    setIsEditing(false);
  };

  const isMutationPending =
    create_mutation.isPending || update_datos_mutation.isPending;

  const getButtonText = () => {
    if (create_mutation.isPending) return "Creando...";
    if (update_datos_mutation.isPending) return "Guardando...";
    return !datos_empresa?.id ? "Crear Datos" : "Guardar Cambios";
  };

  if (isLoading) {
    return <DatosEmpresaSkeleton />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="block md:flex justify-between items-center">
        <h1 className="text-3xl font-bold">Datos de la Empresa</h1>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="gap-2 w-full sm:w-auto"
          >
            <Pencil className="h-4 w-4" />
            {!datos_empresa?.id ? "Crear Datos" : "Editar Datos"}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="gap-2"
              disabled={isMutationPending}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              className="gap-2"
              disabled={isMutationPending || (!isDirty && !!datos_empresa?.id)}
            >
              <Save className="h-4 w-4" />
              {getButtonText()}
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>
              {isEditing
                ? !datos_empresa?.id
                  ? "Completa los datos de tu empresa"
                  : "Modifica los datos de tu empresa"
                : "Información básica de la empresa"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre_empresa">Nombre de la Empresa</Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="nombre_empresa"
                      {...register("nombre_empresa", {
                        required: "El nombre de la empresa es requerido",
                        minLength: {
                          value: 2,
                          message: "El nombre debe tener al menos 2 caracteres",
                        },
                      })}
                      placeholder="Ingrese el nombre de la empresa"
                    />
                    {errors.nombre_empresa && (
                      <p className="text-sm text-red-500">
                        {errors.nombre_empresa.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                    {datos_empresa?.nombre_empresa || "No especificado"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rtn">RTN</Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="rtn"
                      {...register("rtn", {
                        required: "El RTN es requerido",
                        pattern: {
                          value: /^[0-9]{14}$/,
                          message: "El RTN debe tener 14 dígitos",
                        },
                      })}
                      placeholder="Ingrese el RTN"
                    />
                    {errors.rtn && (
                      <p className="text-sm text-red-500">
                        {errors.rtn.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                    {datos_empresa?.rtn || "No especificado"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="propietario">Propietario</Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="propietario"
                      {...register("propietario", {
                        required: "El nombre del propietario es requerido",
                        minLength: {
                          value: 2,
                          message: "El nombre debe tener al menos 2 caracteres",
                        },
                      })}
                      placeholder="Ingrese el nombre del propietario"
                    />
                    {errors.propietario && (
                      <p className="text-sm text-red-500">
                        {errors.propietario.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                    {datos_empresa?.propietario || "No especificado"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="correo"
                      type="email"
                      {...register("correo", {
                        required: "El correo electrónico es requerido",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Correo electrónico inválido",
                        },
                      })}
                      placeholder="Ingrese el correo electrónico"
                    />
                    {errors.correo && (
                      <p className="text-sm text-red-500">
                        {errors.correo.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                    {datos_empresa?.correo || "No especificado"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="telefono"
                      {...register("telefono", {
                        required: "El teléfono es requerido",
                        pattern: {
                          value: /^[0-9+-\s()]{8,}$/,
                          message: "Número de teléfono inválido",
                        },
                      })}
                      placeholder="Ingrese el número de teléfono"
                    />
                    {errors.telefono && (
                      <p className="text-sm text-red-500">
                        {errors.telefono.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                    {datos_empresa?.telefono || "No especificado"}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              {isEditing ? (
                <div className="space-y-1">
                  <Textarea
                    id="direccion"
                    {...register("direccion", {
                      required: "La dirección es requerida",
                      minLength: {
                        value: 10,
                        message:
                          "La dirección debe tener al menos 10 caracteres",
                      },
                    })}
                    placeholder="Ingrese la dirección completa"
                    rows={3}
                  />
                  {errors.direccion && (
                    <p className="text-sm text-red-500">
                      {errors.direccion.message}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                  {datos_empresa?.direccion || "No especificado"}
                </p>
              )}
            </div>

            {!isEditing && datos_empresa && datos_empresa.id && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Creado
                  </Label>
                  <p className="text-sm">
                    {new Date(datos_empresa.created_at).toLocaleDateString(
                      "es-HN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Última actualización
                  </Label>
                  <p className="text-sm">
                    {new Date(datos_empresa.updated_at).toLocaleDateString(
                      "es-HN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default DatosEmpresaPage;
