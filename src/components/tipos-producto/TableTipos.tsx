import { TipoProducto } from "@/apis/tipo-producto/interface/response-tipo-producto.interface";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Package } from "lucide-react";

interface Props {
  filteredTipos: TipoProducto[];
  isLoading: boolean;
  handleEditTipo: (tipo: TipoProducto) => void;
}

const TableTipos = ({ filteredTipos, isLoading, handleEditTipo }: Props) => {
  if (isLoading) {
    return <TableUsersSkeleton />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Subcategoría</TableHead>
            <TableHead>Estado</TableHead>

            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTipos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No se encontraron tipos de producto
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredTipos.map((tipo) => (
              <TableRow key={tipo.id}>
                <TableCell className="font-medium">{tipo.nombre}</TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {tipo.descripcion || "Sin descripción"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50">
                    {tipo.sub_categoria?.categoria?.nombre || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {tipo.sub_categoria?.nombre || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {tipo.is_active ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Inactivo</Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleEditTipo(tipo)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default TableTipos;
