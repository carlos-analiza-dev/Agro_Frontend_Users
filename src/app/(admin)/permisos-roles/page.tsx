"use client";

import TitlePages from "@/components/generics/TitlePages";
import { Button } from "@/components/ui/button";
import useGetPermisosRoles from "@/hooks/agroservicio/permisos-roles/useGetPermisosRoles";
import { Plus, Shield, Key, Loader2, Users, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import Modal from "@/components/generics/Modal";
import FormAddPermisosByRol from "./ui/FormAddPermisosByRol";
import CardByRol from "./ui/CardByRol";
import { StatCard } from "@/components/generics/StatCard";
import {
  getPermisosByModulo,
  getRolesByPermiso,
  getUniqueModulos,
  groupByModulo,
  groupByRol,
} from "@/helpers/funciones/roles-permisos/permisos-agro";

const PermisosAgroRolesPage = () => {
  const { data: permisos_roles, isLoading } = useGetPermisosRoles();

  const [openModalForm, setOpenModalForm] = useState(false);
  const [selectedRol, setSelectedRol] = useState<string | null>(null);

  const handleEditPermisos = (rolId: string) => {
    setOpenModalForm(true);
    setSelectedRol(rolId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">Cargando permisos...</p>
        </div>
      </div>
    );
  }

  if (!permisos_roles || permisos_roles.length === 0) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <TitlePages title="Asignación de permisos por rol agroservicios" />
            <p className="text-gray-600 mt-2">
              Gestiona los permisos y accesos del sistema de agroservicio por
              rol
            </p>
          </div>
          <Button
            onClick={() => setOpenModalForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Permiso
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-12 w-12 text-gray-300" />
              <p className="text-gray-500">No hay permisos asignados a roles</p>
              <Button
                variant="outline"
                onClick={() => setOpenModalForm(true)}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear primera asignación
              </Button>
            </div>
          </CardContent>
        </Card>
        <Modal
          open={openModalForm}
          onOpenChange={setOpenModalForm}
          title="Agregar Permisos a roles"
          description="En este formulario podras agregar permisos a los roles de los empleados del agroservicio"
        >
          <FormAddPermisosByRol
            setOpenModal={setOpenModalForm}
            onSuccess={() => {
              setOpenModalForm;
            }}
          />
        </Modal>
      </div>
    );
  }

  const rolesGrouped = groupByRol(permisos_roles);
  const totalPermisos = permisos_roles.length;
  const totalModulos = getUniqueModulos(permisos_roles);
  const permisosByModulo = getPermisosByModulo(permisos_roles);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <TitlePages title="Asignación de permisos por rol agroservicios" />
          <p className="text-gray-600 mt-2">
            Gestiona los permisos y accesos del sistema de agroservicio por rol
          </p>
        </div>
        <Button
          onClick={() => setOpenModalForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Permiso
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Roles"
          value={rolesGrouped.length}
          icon={Shield}
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
          iconColor="text-white"
          textColor="text-white"
        />

        <StatCard
          title="Total de Permisos"
          value={totalPermisos}
          icon={Key}
          gradientFrom="from-green-500"
          gradientTo="to-green-600"
          iconColor="text-white"
          textColor="text-white"
        />

        <StatCard
          title="Módulos Activos"
          value={totalModulos.length}
          icon={FolderOpen}
          gradientFrom="from-purple-500"
          gradientTo="to-purple-600"
          iconColor="text-white"
          textColor="text-white"
        />

        <StatCard
          title="Permisos Compartidos"
          value={Object.values(permisosByModulo).reduce((acc, permisos) => {
            const shared = permisos.filter(
              (p) => getRolesByPermiso(permisos_roles, p).length > 1,
            );
            return acc + shared.length;
          }, 0)}
          icon={Users}
          gradientFrom="from-orange-500"
          gradientTo="to-orange-600"
          iconColor="text-white"
          textColor="text-white"
        />
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="roles">Vista por Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-6">
          <div className="space-y-6">
            {rolesGrouped.map(({ rol, permisos }) => {
              const permisosByModulo = groupByModulo(permisos);
              const moduloKeys = Object.keys(permisosByModulo);

              return (
                <CardByRol
                  key={rol.id}
                  moduloKeys={moduloKeys}
                  rol={rol}
                  permisos={permisos}
                  permisosByModulo={permisosByModulo}
                  handleEditPermisos={handleEditPermisos}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
      <Modal
        open={openModalForm}
        onOpenChange={setOpenModalForm}
        title={
          selectedRol ? "Editar Permisos al rol" : "Agregar Permisos a roles"
        }
        description={
          selectedRol
            ? "En este formulario podras editar permisos al rol seleccionado"
            : "En este formulario podras agregar permisos a los roles de los empleados del agroservicio"
        }
        size="2xl"
        showCloseButton={false}
      >
        <FormAddPermisosByRol
          setOpenModal={setOpenModalForm}
          onSuccess={() => {
            setOpenModalForm(false);
            setSelectedRol(null);
          }}
          rolId={selectedRol}
        />
      </Modal>
    </div>
  );
};

export default PermisosAgroRolesPage;
