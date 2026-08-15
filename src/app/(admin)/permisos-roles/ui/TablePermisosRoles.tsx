import { Permiso } from "@/apis/agroservicio/permisos_rol/interface/response-permisos-roles.interface";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  currentModulos: string[];
  permisosByModulo: Record<string, Permiso[]>;
}

const TablePermisosRoles = ({ currentModulos, permisosByModulo }: Props) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-1/4 font-semibold text-gray-700">
              Módulo
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Permisos
            </TableHead>
            <TableHead className="w-24 text-right font-semibold text-gray-700">
              Cantidad
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentModulos.map((modulo, index) => {
            const permisosDelModulo = permisosByModulo[modulo] || [];
            return (
              <TableRow
                key={modulo}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <TableCell className="font-medium align-top py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm uppercase tracking-wider text-gray-600">
                      {modulo}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {permisosDelModulo.map((permiso) => (
                      <Badge
                        key={permiso.id}
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors text-xs py-1 px-2"
                      >
                        <span className="flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                          {permiso.nombre}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right align-top py-3">
                  <Badge variant="secondary" className="text-xs">
                    {permisosDelModulo.length}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablePermisosRoles;
