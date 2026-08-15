import {
  Permiso,
  Rol,
} from "@/apis/agroservicio/permisos_rol/interface/response-permisos-roles.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import TablePermisosRoles from "./TablePermisosRoles";

interface Props {
  moduloKeys: string[];
  rol: Rol;
  permisos: Permiso[];
  permisosByModulo: Record<string, Permiso[]>;
  handleEditPermisos: (rolId: string) => void;
}

const CardByRol = ({
  moduloKeys,
  rol,
  permisos,
  permisosByModulo,
  handleEditPermisos,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(moduloKeys.length / itemsPerPage);

  const getCurrentModulos = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return moduloKeys.slice(startIndex, endIndex);
  };

  const currentModulos = getCurrentModulos();

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-white rounded-lg border-2 hover:border-primary/20 transition-colors">
      <div className="bg-gradient-to-r from-gray-50 to-white border-b p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-semibold">{rol.name}</h3>
              <Badge
                variant={rol.isActive ? "default" : "secondary"}
                className="text-xs"
              >
                {rol.isActive ? "Activo" : "Inactivo"}
              </Badge>
              <Badge variant="outline" className="text-xs bg-blue-50">
                {permisos.length} permisos
              </Badge>
              {moduloKeys.length > 0 && (
                <Badge variant="outline" className="text-xs bg-purple-50">
                  {moduloKeys.length} módulos
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{rol.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditPermisos(rol.id)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      {moduloKeys.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay permisos asignados a este rol
        </div>
      ) : (
        <div className="p-4">
          <div className="border rounded-lg ">
            <TablePermisosRoles
              currentModulos={currentModulos}
              permisosByModulo={permisosByModulo}
            />
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t">
              <div className="text-sm text-gray-500">
                {currentPage} de {totalPages} páginas
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Anterior</span>
                </Button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;

                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - currentPage) <= 1
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                          className="h-8 w-8"
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (pageNum === 2 || pageNum === totalPages - 1) {
                      return (
                        <span key={pageNum} className="px-1 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Siguiente</span>
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                Mostrando{" "}
                {Math.min(
                  itemsPerPage,
                  moduloKeys.length - (currentPage - 1) * itemsPerPage,
                )}{" "}
                de {moduloKeys.length} módulos
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardByRol;
