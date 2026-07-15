import { ResponsePermisosRolesAgro } from "@/apis/agroservicio/permisos_rol/interface/response-permisos-roles.interface";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FolderOpen } from "lucide-react";

interface Props {
  modulo: string;
  permisosDelModulo: ResponsePermisosRolesAgro[];
  permisos_roles: ResponsePermisosRolesAgro[];
}

const CardByModulo = ({ modulo, permisosDelModulo, permisos_roles }: Props) => {
  return (
    <Card className="overflow-hidden border-2 hover:border-purple-200 transition-colors">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-purple-600" />
              {modulo}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {permisosDelModulo.length} permisos en{" "}
              {new Set(permisosDelModulo.map((p) => p.rol.id)).size} roles
            </p>
          </div>
          <Badge variant="outline" className="text-sm bg-purple-50">
            {new Set(permisosDelModulo.map((p) => p.rol.name)).size} roles
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {permisosDelModulo.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-medium text-sm">
                      {item.permiso.nombre}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {permisos_roles
                        .filter((p) => p.permiso.nombre === item.permiso.nombre)
                        .map((p) => (
                          <Badge
                            key={p.rol.id}
                            variant="outline"
                            className="text-xs bg-gray-50"
                          >
                            {p.rol.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.permiso.descripcion}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    URL: {item.permiso.url}
                  </p>
                </div>
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardByModulo;
