"use client";
import useGetSucursales from "@/hooks/sucursales/useGetSucursales";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Building } from "lucide-react";
import useGetDepartamentosByPais from "@/hooks/departamentos/useGetDepartamentosByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import TitlePages from "@/components/generics/TitlePages";
import PaginacionSucursales from "./ui/PaginacionSucursales";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LoaderComponents from "@/components/generics/LoaderComponents";
import dynamic from "next/dynamic";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import usePaises from "@/hooks/paises/usePaises";

const FormSucursal = dynamic(() => import("./ui/FormSucursal"), {
  loading: () => <LoaderComponents />,
});

const TableSucursales = dynamic(() => import("./ui/TableSucursales"), {
  loading: () => <TableUsersSkeleton />,
});

const SucursalesAdminPage = () => {
  const { user } = useAuthStore();
  const { data: paises, isLoading: cargando_paises } = usePaises();

  const [paisSeleccionado, setPaisSeleccionado] = useState<string>(
    user?.pais.id || ""
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [departamentoId, setDepartamentoId] = useState<string>("all");
  const [municipioId, setMunicipioId] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const offset = (page - 1) * limit;

  const departament = departamentoId === "all" ? "" : departamentoId;
  const municipio = municipioId === "all" ? "" : municipioId;

  const { data: sucursales, isLoading } = useGetSucursales(
    limit,
    offset,
    paisSeleccionado,
    departament,
    municipio
  );

  const { data: departamentos } = useGetDepartamentosByPais(paisSeleccionado);

  const { data: municipios } = useGetMunicipiosActivosByDepto(departament);

  const totalPages = Math.ceil((sucursales?.total || 0) / limit);

  const handlePaisChange = (value: string) => {
    setPaisSeleccionado(value);
    setDepartamentoId("all");
    setMunicipioId("all");
    setPage(1);
  };

  const handleDepartamentoChange = (value: string) => {
    setDepartamentoId(value);
    if (value === "all") {
      setMunicipioId("all");
    } else {
      setMunicipioId("all");
    }
    setPage(1);
  };

  const handleMunicipioChange = (value: string) => {
    setMunicipioId(value);
    setPage(1);
  };

  const clearFilters = () => {
    setPaisSeleccionado(user?.pais.id || "");
    setDepartamentoId("all");
    setMunicipioId("all");
    setPage(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="block md:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="h-8 w-8" />
          <TitlePages title="Gestión de Sucursales" />
        </div>
        <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sucursal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Sucursales</CardTitle>
              <CardDescription>
                Gestiona todas las sucursales de tu empresa
              </CardDescription>
            </div>

            {(departamentoId !== "all" ||
              municipioId !== "all" ||
              paisSeleccionado !== (user?.pais.id || "")) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="sm:self-end"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">País</label>
              <Select
                value={paisSeleccionado}
                onValueChange={handlePaisChange}
                disabled={cargando_paises}
              >
                <SelectTrigger>
                  {cargando_paises ? (
                    <SelectValue placeholder="Cargando..." />
                  ) : (
                    <SelectValue placeholder="Seleccionar país" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {paises?.data.map((pais) => (
                    <SelectItem key={pais.id} value={pais.id}>
                      {pais.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Departamento</label>
              <Select
                value={departamentoId}
                onValueChange={handleDepartamentoChange}
                disabled={!paisSeleccionado || cargando_paises}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departamentos?.data?.departamentos?.map((depto) => (
                    <SelectItem key={depto.id} value={depto.id}>
                      {depto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Municipio</label>
              <Select
                value={municipioId}
                onValueChange={handleMunicipioChange}
                disabled={
                  !departamentoId ||
                  departamentoId === "all" ||
                  !paisSeleccionado
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      departamentoId && departamentoId !== "all"
                        ? "Todos los municipios"
                        : "Selecciona un departamento primero"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los municipios</SelectItem>
                  {municipios?.data?.map((mun) => (
                    <SelectItem key={mun.id} value={mun.id}>
                      {mun.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TableSucursales
            isLoading={isLoading}
            filteredSucursales={sucursales?.data}
          />

          {(sucursales?.total || 0) > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 space-y-4 sm:space-y-0">
              <div className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, sucursales?.total || 0)} de{" "}
                {sucursales?.total} sucursales
              </div>

              <PaginacionSucursales
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent
          className="
    w-[95vw]
    max-w-lg
    max-h-[90vh]
    overflow-y-auto
    p-4
    sm:p-6
  "
        >
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Sucursal</AlertDialogTitle>
            <AlertDialogDescription>
              En esta sección podrás agregar nuevas sucursales
            </AlertDialogDescription>
          </AlertDialogHeader>

          <FormSucursal
            onSucces={() => setIsOpen(false)}
            paisId={paisSeleccionado}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SucursalesAdminPage;
