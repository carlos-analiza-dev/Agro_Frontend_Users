"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import TitlePages from "@/components/generics/TitlePages";
import { Role } from "@/apis/roles/interfaces/response-roles-filters.interface";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import useGetRolesAgro from "@/hooks/roles/useGetRolesAgro";

const FormCreateRol = dynamic(
  () => import("@/components/roles-admins/FormCreateRol"),
  {
    loading: () => <LoaderComponents />,
  },
);

const TableRoles = dynamic(
  () => import("@/components/roles-admins/TableRoles"),
  {
    loading: () => <TableUsersSkeleton />,
  },
);

const RolesPageAdmin = () => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editRol, setEditRol] = useState<Role | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const {
    data: rolesData,
    isLoading,
    isError,
  } = useGetRolesAgro(limit, offset);

  const filteredRoles =
    rolesData?.data.roles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const totalRoles = rolesData?.data.total || 0;
  const totalPages = Math.ceil(totalRoles / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const generatePaginationItems = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit);
  };

  const handleEditRol = (rol: Role) => {
    setEditRol(rol);
    setIsEdit(true);
    setIsFormOpen(true);
  };

  const handleAddRol = () => {
    setEditRol(null);
    setIsEdit(false);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="block md:flex justify-between items-center">
        <TitlePages title="Administración de Roles AgroServicio" />

        <Button onClick={handleAddRol} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Crear Rol
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Mostrar
          </span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              setLimit(Number(value));
              setOffset(0);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            registros
          </span>
        </div>
      </div>

      <div className="rounded-md border">
        <TableRoles
          isLoading={isLoading}
          limit={limit}
          filteredRoles={filteredRoles}
          searchTerm={searchTerm}
          handleEditRol={handleEditRol}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredRoles.length} de {totalRoles} roles
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {generatePaginationItems().map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => handlePageChange(page as number)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <AlertDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEdit ? "Editar Rol" : "Agregar Nuevo Rol"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEdit
                ? "En esta sección podrás editar el rol seleccionado"
                : "En esta sección podrás agregar un nuevo rol para usuarios"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <FormCreateRol
            isOpen={isFormOpen}
            editRol={editRol}
            isEdit={isEdit}
            onSuccess={() => setIsFormOpen(false)}
            isAgro={true}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RolesPageAdmin;
