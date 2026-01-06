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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TitlePages from "@/components/generics/TitlePages";
import { Skeleton } from "@/components/ui/skeleton";
import usePaises from "@/hooks/paises/usePaises";
import useGetClientesPagination from "@/hooks/clientes/useGetClientes";
import TableClientes from "./ui/TableClientes";
import FormClientes from "./ui/FormClientes";
import PaginacionUsers from "@/components/users/PaginacionUsers";

const ClientesAdminPage = () => {
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [paisFilter, setPaisFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const filterPais = paisFilter === "all" ? "" : paisFilter;

  const { data, isLoading } = useGetClientesPagination(
    debouncedSearchTerm,
    filterPais,
    limit,
    currentPage
  );

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
          <TitlePages title="Administración de Clientes" />

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
                <AlertDialogTitle>Agregar Cliente</AlertDialogTitle>
                <AlertDialogDescription>
                  En esta sección podrás agregar nuevos clientes
                </AlertDialogDescription>
                <div>
                  <FormClientes
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
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-md"
          />

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
          <TableClientes
            data={{
              pages: [{ data: data?.data }],
              pageParams: [currentPage - 1],
            }}
            isLoading={isLoading}
          />
        </div>

        {!isLoading && data && data?.data?.clientes?.length > 0 && (
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

export default ClientesAdminPage;
