"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/helpers/funciones/useDebounce";
import dynamic from "next/dynamic";
import useGetRoles from "@/hooks/roles/useGetRoles";
import useGetUsersPagination from "@/hooks/users/useGetUsersInfinityScroll";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoaderComponents from "@/components/generics/LoaderComponents";
import TitlePages from "@/components/generics/TitlePages";
import { Skeleton } from "@/components/ui/skeleton";
import usePaises from "@/hooks/paises/usePaises";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import PaginacionUsers from "@/components/users/PaginacionUsers";

const TableUsers = dynamic(() => import("./ui/TableUsers"), {
  loading: () => <TableUsersSkeleton />,
});

const FormUsers = dynamic(() => import("./ui/FormUsers"), {
  loading: () => <LoaderComponents />,
});

const UsersAdminPage = () => {
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [paisFilter, setPaisFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const filterValue = roleFilter === "all" ? "" : roleFilter;
  const filterPais = paisFilter === "all" ? "" : paisFilter;

  const { data, isLoading } = useGetUsersPagination(
    debouncedSearchTerm,
    filterValue,
    filterPais,
    limit,
    currentPage
  );

  const { data: roles } = useGetRoles();

  const { data: paises } = usePaises();

  const totalPages = data?.data?.total ? Math.ceil(data.data.total / limit) : 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-10 p-8">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        <div className="block md:flex justify-between">
          <TitlePages title="Administración de Usuarios" />

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full sm:w-auto"
                onClick={() => setOpen(true)}
              >
                Agregar +
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-full md:max-w-3xl h-[600px] overflow-y-auto">
              <div className="flex justify-end">
                <AlertDialogCancel onClick={() => setOpen(false)}>
                  X
                </AlertDialogCancel>
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle>Agregar usuario</AlertDialogTitle>
                <AlertDialogDescription>
                  En esta sección podrás agregar nuevos usuarios
                </AlertDialogDescription>
                <div>
                  <FormUsers
                    onSuccess={() => {
                      setOpen(false);
                    }}
                  />
                </div>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-md"
          />

          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {roles && roles.data.length > 0 ? (
                roles.data.map((rol) => (
                  <SelectItem key={rol.id} value={rol.name}>
                    {rol.name}
                  </SelectItem>
                ))
              ) : (
                <p>No hay roles disponibles</p>
              )}
            </SelectContent>
          </Select>

          <Select
            value={paisFilter}
            onValueChange={(value) => {
              setPaisFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por pais" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {paises && paises.data.length > 0 ? (
                paises.data.map((pais) => (
                  <SelectItem key={pais.id} value={pais.nombre}>
                    {pais.nombre}
                  </SelectItem>
                ))
              ) : (
                <p>No hay paises disponibles</p>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <TableUsers
            data={{
              pages: [{ data: data?.data }],
              pageParams: [currentPage - 1],
            }}
            isLoading={isLoading}
          />
        </div>

        {!isLoading && data && data?.data?.users?.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Mostrando {(currentPage - 1) * limit + 1} -{" "}
              {Math.min(currentPage * limit, data?.data?.total || 0)} de{" "}
              {data?.data?.total || 0} usuarios
            </div>

            <PaginacionUsers
              handlePreviousPage={handlePreviousPage}
              currentPage={currentPage}
              totalPages={totalPages}
              handleNextPage={handleNextPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersAdminPage;
