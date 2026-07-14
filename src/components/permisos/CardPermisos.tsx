import { Permiso } from "@/apis/permisos-clientes/interfaces/response-permisos-cliente";
import { PermisosClientes } from "@/apis/permisos-clientes/interfaces/response-permisos.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit } from "lucide-react";

interface Props {
  permiso: PermisosClientes;
  openModal: (permiso?: Permiso | undefined) => void;
}

const CardPermisos = ({ permiso, openModal }: Props) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">
                {permiso.nombre}
              </h3>
              <Badge
                variant={permiso.isActive ? "default" : "secondary"}
                className={
                  permiso.isActive
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : ""
                }
              >
                {permiso.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            <p className="text-gray-600 mb-2">{permiso.descripcion}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <strong>Módulo:</strong> {permiso.modulo}
              </span>
              <span className="flex items-center gap-1">
                <strong>URL:</strong> {permiso.url}
              </span>
              <span className="flex items-center gap-1">
                <strong>Creado:</strong>{" "}
                {new Date(permiso.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => openModal(permiso)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardPermisos;
