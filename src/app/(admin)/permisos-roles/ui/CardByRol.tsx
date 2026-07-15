import {
  Permiso,
  Rol,
} from "@/apis/agroservicio/permisos_rol/interface/response-permisos-roles.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

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
  return (
    <Card className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-xl font-semibold">
                {rol.name}
              </CardTitle>
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
      </CardHeader>
      <CardContent className="p-6">
        {moduloKeys.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No hay permisos asignados a este rol
          </div>
        ) : (
          <div className="space-y-4">
            {moduloKeys.map((modulo, index) => (
              <div key={modulo} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-sm uppercase tracking-wider text-gray-500">
                      {modulo}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {permisosByModulo[modulo].length}
                    </Badge>
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-4">
                  {permisosByModulo[modulo].map((permiso) => (
                    <div
                      key={permiso.id}
                      className="group flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-all cursor-default border border-transparent hover:border-gray-200"
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                          {permiso.nombre}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {permiso.descripcion}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {index < moduloKeys.length - 1 && (
                  <Separator className="my-3" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardByRol;
