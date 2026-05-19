import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface PermisoActivo {
  id: string;
  nombre: string;
  descripcion: string;
  url: string;
  modulo: string;
  isActive: boolean;
  createdAt: string;
}

interface TablePermisosClienteProps {
  permisosDisponibles: PermisoActivo[];
  permisosSeleccionados: string[];
  handleSeleccionarPermiso: (permisoId: string) => void;
}

const TablePermisosCliente = ({
  permisosDisponibles,
  permisosSeleccionados,
  handleSeleccionarPermiso,
}: TablePermisosClienteProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Seleccionar</TableHead>
          <TableHead>Módulo</TableHead>
          <TableHead>Descripción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permisosDisponibles.map((permiso) => (
          <TableRow key={permiso.id}>
            <TableCell>
              <Checkbox
                checked={permisosSeleccionados.includes(permiso.id)}
                onCheckedChange={() => handleSeleccionarPermiso(permiso.id)}
              />
            </TableCell>
            <TableCell>
              <p className="font-medium">{permiso.modulo}</p>
            </TableCell>
            <TableCell>
              <p className="text-sm text-gray-600">{permiso.descripcion}</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablePermisosCliente;
