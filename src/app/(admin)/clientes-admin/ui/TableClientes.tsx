import { actualizarCliente } from "@/apis/clientes/accions/actualizar-cliente";
import { ResponseClientesInterface } from "@/apis/clientes/interfaces/response-clientes.interface";
import { CrearPermisoClienteInterface } from "@/apis/permisos-clientes/interfaces/crear-permiso-cliente.interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Edit, XCircle, Plus, Package, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormClientes from "./FormClientes";
import useGetPermisosByCliente from "@/hooks/permisos-clientes/useGetPermisosByCliente";
import useGetPermisosActivos from "@/hooks/permisos-clientes/useGetPermisosActivos";
import { EditarPermisoByCliente } from "@/apis/permisos-clientes/accions/editar-permiso_by_cliente";
import { CrearPermisoByCliente } from "@/apis/permisos-clientes/accions/crear-permiso_by_cliente";
import { EliminarPermisoByCliente } from "@/apis/permisos-clientes/accions/eliminar-permiso_by_cliente";
import TablePermisosCliente from "@/components/permisos/TablePermisosCliente";
import ResumenPermiso from "@/components/permisos/ResumenPermiso";
import TablePermisosAsignados from "@/components/permisos/TablePermisosAsignados";
import { Badge } from "@/components/ui/badge";
import { TipoCliente } from "@/interfaces/enums/clientes.enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useGetObtenerPaquetes from "@/hooks/paquetes/useGetObtenerPaquetes";
import { asignarPaqueteCliente } from "@/apis/paquetes/accions/asignar-paquete-cliente";
import { ComprarPaqueteInterface } from "@/apis/paquetes/interfaces/comprar-paquete.interface";
import { Input } from "@/components/ui/input";
import {
  formatearFechaFin,
  formatearFechaInicio,
} from "@/helpers/funciones/paquetes/fechasFormater";

interface Props {
  data: {
    pages: { data: ResponseClientesInterface | undefined }[];
    pageParams: number[];
  };
  isLoading: boolean;
}

const TableClientes = ({ data, isLoading }: Props) => {
  const queryClient = useQueryClient();
  const [clienteId, setClienteId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [activo, setActivo] = useState(false);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>(
    [],
  );
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const { data: permisos_cliente } = useGetPermisosByCliente(clienteId);
  const { data: permisos_activos } = useGetPermisosActivos();
  const { data: paquetes } = useGetObtenerPaquetes();

  const handleEditUser = (clienteId: string) => {
    setClienteId(clienteId);
    setOpen(true);
  };

  useEffect(() => {
    if (open5) {
      const hoy = new Date();
      const fin = new Date();
      fin.setDate(fin.getDate() + 30);

      setFechaInicio(hoy.toISOString().split("T")[0]);
      setFechaFin(fin.toISOString().split("T")[0]);
    }
  }, [open5]);

  const handleToggleActive = async (isActive: boolean) => {
    try {
      await actualizarCliente(clienteId, { isActive });
      queryClient.invalidateQueries({ queryKey: ["clientes-admin"] });
      toast.success("Estado del usuario actualizado");
      setClienteId("");
      setOpen2(false);
    } catch (error) {
      toast.error(
        "Ocurrio un error al momento de actualizar el estado del usuario",
      );
    }
  };

  const handleActiveUser = (actividad: boolean, usuarioId: string) => {
    setOpen2(true);
    setActivo(actividad);
    setClienteId(usuarioId);
  };

  const handleViewClienteId = (clienteId: string) => {
    setOpen3(true);
    setClienteId(clienteId);
  };

  const handleAsignarPaquete = (clienteId: string) => {
    setClienteId(clienteId);
    setPaqueteSeleccionado("");
    setOpen5(true);
  };

  const handleConfirmarAsignarPaquete = async () => {
    if (!paqueteSeleccionado) {
      toast.error("Por favor selecciona un paquete");
      return;
    }

    try {
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaFin.setDate(fechaFin.getDate() + 30);

      const data: ComprarPaqueteInterface = {
        paqueteId: paqueteSeleccionado,
        fechaInicio: formatearFechaInicio(fechaInicio),
        fechaFin: formatearFechaFin(fechaFin),
      };

      await asignarPaqueteCliente(clienteId, data);
      queryClient.invalidateQueries({ queryKey: ["clientes-admin"] });
      toast.success("Paquete asignado correctamente");
      setOpen5(false);
      setPaqueteSeleccionado("");
    } catch (error) {
      toast.error("Error al asignar el paquete");
    }
  };

  const handlePermisoChange = async (
    permisoId: string,
    campo: string,
    valor: boolean,
  ) => {
    try {
      const datosActualizacion = { [campo]: valor };
      await EditarPermisoByCliente(permisoId, datosActualizacion);

      queryClient.invalidateQueries({
        queryKey: ["permisos-clienteId", clienteId],
      });
      toast.success("Permiso actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el permiso");
    }
  };

  const handleAgregarPermiso = () => {
    setOpen4(true);
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

  const handleSeleccionarTodos = () => {
    if (permisosDisponibles && permisosDisponibles.length > 0) {
      const todosLosIds = permisosDisponibles.map((permiso) => permiso.id);
      setPermisosSeleccionados(todosLosIds);
    }
  };

  const handleDeseleccionarTodos = () => {
    setPermisosSeleccionados([]);
  };

  const handleConfirmarAgregarPermiso = async () => {
    if (permisosSeleccionados.length === 0) {
      toast.error("Por favor selecciona al menos un permiso");
      return;
    }

    try {
      const promesas = permisosSeleccionados.map((permisoId) => {
        const nuevoPermiso: CrearPermisoClienteInterface = {
          clienteId: clienteId,
          permisoId: permisoId,
          ver: true,
          crear: false,
          editar: false,
          eliminar: false,
        };
        return CrearPermisoByCliente(nuevoPermiso);
      });

      await Promise.all(promesas);

      queryClient.invalidateQueries({
        queryKey: ["permisos-clienteId", clienteId],
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

  const handleEliminarPermiso = async (permisoId: string) => {
    try {
      await EliminarPermisoByCliente(permisoId);

      queryClient.invalidateQueries({
        queryKey: ["permisos-clienteId", clienteId],
      });
      toast.success("Permiso eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el permiso");
    }
  };

  const permisosDisponibles = permisos_activos?.filter(
    (permisoActivo) =>
      !permisos_cliente?.some(
        (permisoCliente) => permisoCliente.permiso.id === permisoActivo.id,
      ),
  );

  const paquetesDisponibles = paquetes?.filter((paquete) => paquete.isActive);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Nombre</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Identificación</TableHead>
            <TableHead className="text-center">Dirección</TableHead>
            <TableHead className="text-center">Rol</TableHead>
            <TableHead className="text-center">Activo</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={`skeleton-cell-${i}-${j}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data?.pages?.flatMap((page, i) =>
                page.data?.clientes?.map((user) => (
                  <TableRow key={`${user.id}-${i}`}>
                    <TableCell className="text-center">{user.nombre}</TableCell>
                    <TableCell className="text-center">{user.email}</TableCell>
                    <TableCell className="text-center">
                      {user.identificacion}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.direccion}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="block space-y-2">
                        <p>{user.rol.toLocaleLowerCase()}</p>
                        {user.rol === TipoCliente.PROPIETARIO && (
                          <>
                            {user.tienePaqueteActivo ? (
                              <Badge>{user.paqueteActivo.nombre}</Badge>
                            ) : (
                              <Badge variant="destructive">Sin Paquete</Badge>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Sí" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditUser(user.id)}
                              >
                                <Edit className="h-4 w-4 text-blue-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar Cliente</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleActiveUser(user.isActive, user.id)
                                }
                              >
                                {user.isActive ? (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {user.isActive
                                  ? "Desactivar Cliente"
                                  : "Activar Cliente"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          {user.rol === TipoCliente.PROPIETARIO &&
                            !user.tienePaqueteActivo && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleAsignarPaquete(user.id)
                                    }
                                  >
                                    <Package className="h-4 w-4 text-purple-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {user.tienePaqueteActivo
                                      ? "Cambiar Paquete"
                                      : "Asignar Paquete"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                )),
              )}
        </TableBody>
      </Table>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="w-full md:max-w-3xl h-[600px] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel onClick={() => setOpen(false)}>
              X
            </AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Aquí puedes editar los datos del cliente
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormClientes
            clienteId={clienteId}
            onSuccess={() => {
              setOpen(false);
            }}
          />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={open2} onOpenChange={setOpen2}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel onClick={() => setOpen2(false)}>
              X
            </AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Actividad Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Aquí puedes editar el estado activo del cliente
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => handleToggleActive(!activo)}>
              {!activo ? "Activar" : "Desactivar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={open5} onOpenChange={setOpen5}>
        <AlertDialogContent className="max-w-md">
          <div className="flex justify-between items-center">
            <AlertDialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-500" />
              Asignar Paquete
            </AlertDialogTitle>
            <AlertDialogCancel
              onClick={() => {
                setOpen5(false);
                setPaqueteSeleccionado("");
              }}
            >
              X
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            Selecciona un paquete y las fechas para asignar al cliente
            propietario
          </AlertDialogDescription>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paquete">Paquete</Label>
              <Select
                value={paqueteSeleccionado}
                onValueChange={setPaqueteSeleccionado}
              >
                <SelectTrigger id="paquete" className="w-full">
                  <SelectValue placeholder="Selecciona un paquete" />
                </SelectTrigger>
                <SelectContent>
                  {paquetesDisponibles && paquetesDisponibles.length > 0 ? (
                    paquetesDisponibles.map((paquete) => (
                      <SelectItem key={paquete.id} value={paquete.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{paquete.nombre}</span>
                          <span className="text-xs text-gray-500">
                            {paquete.tipo}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-disponible" disabled>
                      No hay paquetes disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  min={fechaInicio || new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {paqueteSeleccionado && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">
                      {
                        paquetes?.find((p) => p.id === paqueteSeleccionado)
                          ?.nombre
                      }
                    </h4>
                    <p className="text-sm text-purple-600">
                      {
                        paquetes?.find((p) => p.id === paqueteSeleccionado)
                          ?.tipo
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpen5(false);
                setPaqueteSeleccionado("");
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarAsignarPaquete}
              disabled={!paqueteSeleccionado || !fechaInicio || !fechaFin}
            >
              Asignar Paquete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={open3} onOpenChange={setOpen3}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <AlertDialogTitle>Permisos del Cliente</AlertDialogTitle>
            <AlertDialogCancel onClick={() => setOpen3(false)}>
              X
            </AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogDescription>
              Aquí puedes observar y gestionar los permisos a los cuales tiene
              acceso el cliente
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
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

            {permisos_cliente && permisos_cliente.length > 0 ? (
              <div className="border rounded-lg">
                <TablePermisosAsignados
                  permisos_cliente={permisos_cliente}
                  handlePermisoChange={handlePermisoChange}
                  handleEliminarPermiso={handleEliminarPermiso}
                />
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-gray-500">
                  No hay permisos asignados para este cliente
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

            {permisos_cliente && permisos_cliente.length > 0 && (
              <ResumenPermiso permisos_cliente={permisos_cliente} />
            )}
          </div>

          <AlertDialogFooter className="mt-6">
            <AlertDialogAction onClick={() => setOpen3(false)}>
              Cerrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={open4} onOpenChange={setOpen4}>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center">
            <AlertDialogTitle>Agregar Permisos al Cliente</AlertDialogTitle>
            <AlertDialogCancel
              onClick={() => {
                setOpen4(false);
                setPermisosSeleccionados([]);
              }}
            >
              X
            </AlertDialogCancel>
          </div>

          <AlertDialogHeader>
            <AlertDialogDescription>
              Selecciona uno o múltiples permisos para agregar al cliente
            </AlertDialogDescription>
          </AlertDialogHeader>

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

          <AlertDialogFooter className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
            <AlertDialogCancel
              onClick={() => {
                setOpen4(false);
                setPermisosSeleccionados([]);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarAgregarPermiso}
              disabled={permisosSeleccionados.length === 0}
            >
              Agregar {permisosSeleccionados.length} Permiso(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableClientes;
