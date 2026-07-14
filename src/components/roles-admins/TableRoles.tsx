import { Role } from "@/apis/roles/interfaces/response-roles-filters.interface";
import { Badge } from "@/components/ui/badge";
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
import { Pencil } from "lucide-react";
import React from "react";

interface Props {
  isLoading: boolean;
  limit: number;
  filteredRoles: Role[];
  searchTerm: string;
  handleEditRol: (rol: Role) => void;
}

const TableRoles = ({
  filteredRoles,
  isLoading,
  limit,
  searchTerm,
  handleEditRol,
}: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: limit }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 ml-auto" />
              </TableCell>
            </TableRow>
          ))
        ) : filteredRoles.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              {searchTerm
                ? "No se encontraron roles que coincidan con la búsqueda"
                : "No hay roles registrados"}
            </TableCell>
          </TableRow>
        ) : (
          filteredRoles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>
                <Badge variant={role.isActive ? "default" : "destructive"}>
                  {role.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => handleEditRol(role)}
                  variant="ghost"
                  size="sm"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TableRoles;
