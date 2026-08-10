"use client";

import useGetObtenerPaquetes from "@/hooks/paquetes/useGetObtenerPaquetes";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ResponsePaquetesInterface } from "@/apis/paquetes/interfaces/response-paquetes.interface";
import PaquetesCard from "./ui/PaquetesCard";
import Modal from "@/components/generics/Modal";
import { useState } from "react";
import FormPaquete from "./ui/FormPaquete";
import useGetPermisosActivos from "@/hooks/permisos-clientes/useGetPermisosActivos";
import useGetPermisosByPaquete from "@/hooks/permisos-clientes/useGetPermisosByPaquete";
import ResumenPermiso from "@/components/permisos/ResumenPermiso";
import TablePermisosAsignados from "@/components/permisos/TablePermisosAsignados";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import TablePermisosCliente from "@/components/permisos/TablePermisosCliente";
import { CrearPermisoByPaquete } from "@/apis/permisos-clientes/accions/crear-permiso_by_paquete";
import { CrearPermisoPaqueteInterface } from "@/apis/permisos-clientes/interfaces/crear-permiso-paquete.interface";
import { EditarPermisoByPaquete } from "@/apis/permisos-clientes/accions/editar-permiso_by_paquete";
import { EliminarPermisoByPaquete } from "@/apis/permisos-clientes/accions/eliminar-permiso_by_paquete";

const PaquetesPage = () => {
  const { data: paquetes, isLoading } = useGetObtenerPaquetes();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [selectPaquete, setSelectPaquete] =
    useState<ResponsePaquetesInterface | null>(null);
  const handleEditPaquete = (paquete: ResponsePaquetesInterface) => {
    setOpenModal(true);
    setSelectPaquete(paquete);
  };
  const [open4, setOpen4] = useState(false);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>(
    [],
  );
  const [open3, setOpen3] = useState(false);
  const [paqueteId, setPaqueteId] = useState("");
  const { data: permisos_paquete } = useGetPermisosByPaquete(paqueteId);

  const { data: permisos_activos } = useGetPermisosActivos();

  const handleAgregarPermiso = () => {
    setOpen4(true);
  };

  const handlePermisoChange = async (
    permisoId: string,
    campo: string,
    valor: boolean,
  ) => {
    try {
      const datosActualizacion = { [campo]: valor };
      await EditarPermisoByPaquete(permisoId, datosActualizacion);

      queryClient.invalidateQueries({
        queryKey: ["permisos-paqueteId", paqueteId],
      });
      queryClient.invalidateQueries({
        queryKey: ["paquetes"],
      });

      toast.success("Permiso actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el permiso");
    }
  };

  const handleEliminarPermiso = async (permisoId: string) => {
    try {
      await EliminarPermisoByPaquete(permisoId);

      queryClient.invalidateQueries({
        queryKey: ["permisos-paqueteId", paqueteId],
      });
      queryClient.invalidateQueries({
        queryKey: ["paquetes"],
      });
      toast.success("Permiso eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el permiso");
    }
  };

  const handleSeleccionarPermiso = (permisoId: string) => {
    setPermisosSeleccionados((prev) => {
      if (prev.includes(permisoId)) {
        return prev.filter((id) => id !== permisoId);
      } else {
        return [...prev, permisoId];
      }
    });
  };

  const handleConfirmarAgregarPermiso = async () => {
    if (permisosSeleccionados.length === 0) {
      toast.error("Por favor selecciona al menos un permiso");
      return;
    }

    try {
      const nuevoPermiso: CrearPermisoPaqueteInterface = {
        paqueteId: paqueteId,
        permisosIds: permisosSeleccionados,
      };

      await CrearPermisoByPaquete(nuevoPermiso);

      queryClient.invalidateQueries({
        queryKey: ["permisos-paqueteId", paqueteId],
      });
      queryClient.invalidateQueries({
        queryKey: ["paquetes"],
      });

      toast.success(
        `${permisosSeleccionados.length} permiso(s) agregado(s) correctamente`,
      );
      setOpen4(false);
      setPermisosSeleccionados([]);
    } catch (error) {
      toast.error("Error al agregar los permisos");
    }
  };

  const handleSeleccionarTodos = () => {
    if (permisosDisponibles && permisosDisponibles.length > 0) {
      const todosLosIds = permisosDisponibles.map((permiso) => permiso.id);
      setPermisosSeleccionados(todosLosIds);
    }
  };

  const handleDeseleccionarTodos = () => {
    setPermisosSeleccionados([]);
  };

  const permisosDisponibles = permisos_activos?.filter(
    (permisoActivo) =>
      !permisos_paquete?.some(
        (permisoCliente) => permisoCliente.permiso.id === permisoActivo.id,
      ),
  );

  const handleAddPermisos = (paqueteId: string) => {
    setOpen3(true);
    setPaqueteId(paqueteId);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Paquetes disponibles</h1>
          <p className="text-muted-foreground">
            Elige el plan que mejor se adapte a tu operación
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <Plus /> Agregar Paquete
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {paquetes?.map((paquete: ResponsePaquetesInterface) => (
            <PaquetesCard
              key={paquete.id}
              paquete={paquete}
              handleEditPaquete={handleEditPaquete}
              handleAddPermisos={handleAddPermisos}
            />
          ))}
        </div>
      )}
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title={selectPaquete ? "Editar Paquete" : "Agregar Nuevo Paquete"}
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <FormPaquete
          setOpenModal={setOpenModal}
          onSuccess={() => {
            setOpenModal(false);
            setSelectPaquete(null);
          }}
          paquete={selectPaquete}
        />
      </Modal>

      <Modal
        open={open3}
        onOpenChange={setOpen3}
        title="Permisos del Paquete"
        size="4xl"
        height="auto"
        showCloseButton={false}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              Aquí puedes observar y gestionar los permisos del paquete
              seleccionado
            </p>

            <Button variant="ghost" size="icon" onClick={() => setOpen3(false)}>
              X
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Permisos Asignados</h3>

              <Button
                onClick={handleAgregarPermiso}
                size="sm"
                className="flex items-center gap-2"
                disabled={
                  !permisosDisponibles || permisosDisponibles.length === 0
                }
              >
                <Plus className="h-4 w-4" />
                Agregar Permiso
              </Button>
            </div>

            {permisos_paquete && permisos_paquete.length > 0 ? (
              <div className="border rounded-lg">
                <TablePermisosAsignados
                  permisos_cliente={permisos_paquete}
                  handlePermisoChange={handlePermisoChange}
                  handleEliminarPermiso={handleEliminarPermiso}
                />
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-gray-500">
                  No hay permisos asignados para este paquete
                </p>

                <Button
                  onClick={handleAgregarPermiso}
                  variant="outline"
                  className="mt-4"
                  disabled={
                    !permisosDisponibles || permisosDisponibles.length === 0
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Permiso
                </Button>
              </div>
            )}

            {permisos_paquete && permisos_paquete.length > 0 && (
              <ResumenPermiso permisos_cliente={permisos_paquete} />
            )}
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t">
            <Button onClick={() => setOpen3(false)}>Cerrar</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={open4}
        onOpenChange={setOpen4}
        title="Agregar Permisos al Paquete"
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              Selecciona uno o múltiples permisos para agregar
            </p>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setOpen4(false);
                setPermisosSeleccionados([]);
              }}
            >
              X
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {permisosDisponibles && permisosDisponibles.length > 0 ? (
              <>
                <div className="flex justify-between items-center bg-white sticky top-0 z-10 py-2">
                  <span className="text-sm text-gray-600 font-medium">
                    {permisosSeleccionados.length} de{" "}
                    {permisosDisponibles.length} seleccionados
                  </span>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSeleccionarTodos}
                    >
                      Seleccionar Todos
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeseleccionarTodos}
                    >
                      Deseleccionar Todos
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="max-h-64 overflow-y-auto">
                    <TablePermisosCliente
                      permisosDisponibles={permisosDisponibles}
                      permisosSeleccionados={permisosSeleccionados}
                      handleSeleccionarPermiso={handleSeleccionarPermiso}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-gray-500">
                  No hay permisos disponibles para agregar
                </p>
              </div>
            )}

            {permisosSeleccionados.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg">
                <div className="p-4 border-b border-blue-200">
                  <h4 className="font-semibold text-blue-800">
                    Permisos Seleccionados ({permisosSeleccionados.length})
                  </h4>
                </div>

                <div className="max-h-48 overflow-y-auto">
                  <div className="p-4 space-y-3">
                    {permisosSeleccionados.map((permisoId) => {
                      const permiso = permisosDisponibles?.find(
                        (p) => p.id === permisoId,
                      );

                      return permiso ? (
                        <div
                          key={permisoId}
                          className="flex justify-between items-start bg-white p-3 rounded-lg border border-blue-100"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-blue-700 font-medium truncate">
                              {permiso.modulo}
                            </p>

                            <p className="text-sm text-blue-600 line-clamp-2">
                              {permiso.descripcion}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSeleccionarPermiso(permisoId)}
                            className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                          >
                            Quitar
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setOpen4(false);
                setPermisosSeleccionados([]);
              }}
            >
              Cancelar
            </Button>

            <Button
              onClick={handleConfirmarAgregarPermiso}
              disabled={permisosSeleccionados.length === 0}
            >
              Agregar {permisosSeleccionados.length} Permiso(s)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaquetesPage;
