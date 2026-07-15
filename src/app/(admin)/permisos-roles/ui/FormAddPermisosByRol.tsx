import { IngresarPermisoByRolInterface } from "@/apis/agroservicio/permisos_rol/interface/ingresar-permiso-rol.interface";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { AlertCircleIcon, Loader2, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import useGetRolesAllAgro from "@/hooks/roles/useGetRolesAllAgro";
import { ingresarPermisosRolesAgro } from "@/apis/agroservicio/permisos_rol/accions/ingresar-permisos-by-rol";
import {
  editarPermisosRolesAgro,
  EditarPermisoByRolInterface,
} from "@/apis/agroservicio/permisos_rol/accions/editar-permisos-by-rol";
import useGetPermisosRoles from "@/hooks/agroservicio/permisos-roles/useGetPermisosRoles";
import useGetPermisosNoRol from "@/hooks/agroservicio/permisos-roles/useGetPermisosNoRol";

interface Props {
  setOpenModal: (open: boolean) => void;
  onSuccess: () => void;
  rolId?: string | null;
}

interface PermisoConEstado {
  id: string;
  nombre: string;
  descripcion: string;
  url: string;
  modulo: string;
  isActive: boolean;
  createdAt: Date;
  isAssigned: boolean;
}

const FormAddPermisosByRol = ({
  setOpenModal,
  onSuccess,
  rolId = null,
}: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedRolId, setSelectedRolId] = useState<string>(rolId || "");
  const [selectedPermisos, setSelectedPermisos] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(!!rolId);
  const [todosLosPermisos, setTodosLosPermisos] = useState<PermisoConEstado[]>(
    [],
  );

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IngresarPermisoByRolInterface>({
    defaultValues: {
      roleId: rolId || "",
      permisosIds: [],
    },
  });

  const { data: roles_agro, isLoading: isLoadingRoles } = useGetRolesAllAgro();
  const {
    data: permisos_no_asignados,
    isLoading: isLoadingPermisos,
    refetch,
  } = useGetPermisosNoRol(selectedRolId);

  const { data: permisos_roles_actuales } = useGetPermisosRoles();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      isEditMode &&
      rolId &&
      permisos_roles_actuales &&
      permisos_no_asignados
    ) {
      const permisosAsignadosIds = permisos_roles_actuales
        .filter((item) => item.rol.id === rolId)
        .map((item) => item.permiso.id);

      const permisosAsignados = permisos_roles_actuales
        .filter((item) => item.rol.id === rolId)
        .map((item) => item.permiso);

      const todos = [
        ...permisosAsignados.map((p) => ({
          ...p,
          isAssigned: true,
        })),
        ...permisos_no_asignados.map((p) => ({
          ...p,
          isAssigned: false,
        })),
      ];

      todos.sort((a, b) => {
        if (a.modulo !== b.modulo) {
          return a.modulo.localeCompare(b.modulo);
        }
        return a.nombre.localeCompare(b.nombre);
      });

      setTodosLosPermisos(todos);
      setSelectedPermisos(permisosAsignadosIds);
      setValue("permisosIds", permisosAsignadosIds);
    }
  }, [
    isEditMode,
    rolId,
    permisos_roles_actuales,
    permisos_no_asignados,
    setValue,
  ]);

  useEffect(() => {
    if (!isEditMode && permisos_no_asignados) {
      setTodosLosPermisos(
        permisos_no_asignados.map((p) => ({
          ...p,
          isAssigned: false,
        })),
      );
    }
  }, [isEditMode, permisos_no_asignados]);

  useEffect(() => {
    if (selectedRolId) {
      setValue("roleId", selectedRolId);

      if (!isEditMode) {
        setSelectedPermisos([]);
        setSelectAll(false);
      }

      refetch();
    }
  }, [selectedRolId, setValue, refetch, isEditMode]);

  useEffect(() => {
    setValue("permisosIds", selectedPermisos);
  }, [selectedPermisos, setValue]);

  useEffect(() => {
    if (
      !isEditMode &&
      permisos_no_asignados &&
      permisos_no_asignados.length > 0
    ) {
      if (selectAll) {
        const allPermisosIds = permisos_no_asignados.map((p) => p.id);
        setSelectedPermisos(allPermisosIds);
      } else {
        setSelectedPermisos([]);
      }
    }
  }, [selectAll, permisos_no_asignados, isEditMode]);

  const handlePermisoToggle = (permisoId: string) => {
    setSelectedPermisos((prev) => {
      if (prev.includes(permisoId)) {
        return prev.filter((id) => id !== permisoId);
      } else {
        return [...prev, permisoId];
      }
    });
  };

  const onSubmit = async (data: IngresarPermisoByRolInterface) => {
    try {
      if (isEditMode && rolId) {
        const editData: EditarPermisoByRolInterface = {
          permisosIds: data.permisosIds,
        };
        await editarPermisosRolesAgro(rolId, editData);
        toast.success("Permisos actualizados correctamente");
      } else {
        await ingresarPermisosRolesAgro(data);
        toast.success("Permisos asignados correctamente al rol");
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["permisos-roles"] });
      queryClient.invalidateQueries({ queryKey: ["permisos-no-roles"] });

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
            : "Hubo un error al asignar los permisos";
        setErrorMessage(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  const isLoading = isLoadingRoles || isLoadingPermisos;

  if (isLoadingRoles) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            Error al {isEditMode ? "actualizar" : "asignar"} permisos
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="roleId">
            Seleccionar Rol <span className="text-red-500">*</span>
          </Label>
          <Select
            value={selectedRolId}
            onValueChange={(value) => {
              setSelectedRolId(value);
              setIsEditMode(false);
            }}
            disabled={isSubmitting || isEditMode}
          >
            <SelectTrigger className={errors.roleId ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles Disponibles</SelectLabel>
                {roles_agro?.map((rol) => (
                  <SelectItem key={rol.id} value={rol.id}>
                    <div className="flex items-center gap-2">
                      <span>{rol.name}</span>
                      <Badge
                        variant={rol.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {rol.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.roleId && (
            <p className="text-sm text-red-500 mt-1">{errors.roleId.message}</p>
          )}
          {selectedRolId && roles_agro && (
            <p className="text-sm text-muted-foreground mt-1">
              {roles_agro.find((r) => r.id === selectedRolId)?.description}
            </p>
          )}
        </div>

        {selectedRolId && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                {isEditMode ? "Todos los Permisos" : "Permisos Disponibles"}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({selectedPermisos.length} seleccionados de{" "}
                  {todosLosPermisos.length})
                </span>
              </Label>
              {!isEditMode &&
                permisos_no_asignados &&
                permisos_no_asignados.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={selectAll}
                      onCheckedChange={setSelectAll}
                      disabled={isSubmitting || isLoadingPermisos}
                    />
                    <span className="text-sm text-muted-foreground">
                      Seleccionar todos
                    </span>
                  </div>
                )}
            </div>

            {isLoadingPermisos ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {isEditMode && (
                  <Alert className="mb-4 bg-blue-50 border-blue-200">
                    <AlertCircleIcon className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-900">
                      Modo Edición
                    </AlertTitle>
                    <AlertDescription className="text-blue-700">
                      <strong>✓</strong> Permisos marcados con
                      &quot;Asignado&quot; son los que tiene el rol actualmente.
                      <br />
                      <strong>✗</strong> Desmarca un permiso para eliminarlo o
                      márcalo para agregarlo.
                    </AlertDescription>
                  </Alert>
                )}

                {todosLosPermisos.length > 0 ? (
                  <Card>
                    <CardContent className="p-4">
                      <ScrollArea className="h-[350px]">
                        <div className="space-y-2">
                          {todosLosPermisos.map((permiso) => {
                            const isChecked = selectedPermisos.includes(
                              permiso.id,
                            );

                            let estadoBadge = null;
                            if (isEditMode && permiso.isAssigned && isChecked) {
                              estadoBadge = (
                                <Badge
                                  variant="default"
                                  className="text-xs bg-green-500"
                                >
                                  ✓ Asignado
                                </Badge>
                              );
                            } else if (
                              isEditMode &&
                              permiso.isAssigned &&
                              !isChecked
                            ) {
                              estadoBadge = (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  ✗ Eliminar
                                </Badge>
                              );
                            } else if (
                              isEditMode &&
                              !permiso.isAssigned &&
                              isChecked
                            ) {
                              estadoBadge = (
                                <Badge
                                  variant="default"
                                  className="text-xs bg-yellow-500"
                                >
                                  + Nuevo
                                </Badge>
                              );
                            }

                            return (
                              <div key={permiso.id}>
                                <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={() =>
                                      handlePermisoToggle(permiso.id)
                                    }
                                    disabled={isSubmitting}
                                    id={`permiso-${permiso.id}`}
                                  />
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Label
                                        htmlFor={`permiso-${permiso.id}`}
                                        className="font-medium cursor-pointer"
                                      >
                                        {permiso.nombre}
                                      </Label>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {permiso.modulo}
                                      </Badge>
                                      {estadoBadge}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {permiso.descripcion}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      URL: {permiso.url}
                                    </p>
                                  </div>
                                </div>
                                <Separator className="my-1" />
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ) : (
                  <Alert>
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>No hay permisos disponibles</AlertTitle>
                    <AlertDescription>
                      {isEditMode
                        ? "No se encontraron permisos en el sistema."
                        : "Este rol ya tiene todos los permisos asignados o no hay permisos disponibles en el sistema."}
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {selectedPermisos.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {selectedPermisos.length} permiso(s) seleccionado(s)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (isEditMode && rolId) {
                        const originalPermisos =
                          permisos_roles_actuales
                            ?.filter((item) => item.rol.id === rolId)
                            .map((item) => item.permiso.id) || [];
                        setSelectedPermisos(originalPermisos);
                      } else {
                        setSelectedPermisos([]);
                        setSelectAll(false);
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-1" />
                    {isEditMode ? "Restaurar" : "Limpiar"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {todosLosPermisos
                    ?.filter((p) => selectedPermisos.includes(p.id))
                    .map((p) => (
                      <Badge key={p.id} variant="secondary" className="text-xs">
                        {p.nombre}
                        {isEditMode && p.isAssigned && " ✓"}
                        {isEditMode && !p.isAssigned && " +"}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpenModal(false)}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting || !selectedRolId || selectedPermisos.length === 0
          }
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditMode ? "Actualizando..." : "Asignando..."}
            </span>
          ) : isEditMode ? (
            "Actualizar Permisos"
          ) : (
            "Asignar Permisos"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormAddPermisosByRol;
