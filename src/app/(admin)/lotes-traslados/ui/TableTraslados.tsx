import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/helpers/funciones/formatDate";
import { ArrowRight } from "lucide-react";
import { getTipoBadge } from "./getTipoBadge";
import { Movimiento } from "@/apis/movimientos-inventario/interface/obtener-movimientos-inventario.interface";

interface Props {
  filteredMovimientos: Movimiento[];
  moneda: string;
}

const TableTraslados = ({ filteredMovimientos, moneda }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center"> Producto</TableHead>

          <TableHead className="text-center">Cantidad</TableHead>
          <TableHead className="text-center">Origen</TableHead>
          <TableHead className="text-center" />
          <TableHead className="text-center">Destino</TableHead>
          <TableHead className="text-center">Costo Unitario</TableHead>
          <TableHead className="text-center">Fecha</TableHead>
          <TableHead className="text-center">Tipo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredMovimientos.map((mov) => (
          <TableRow key={mov.id}>
            <TableCell className="text-center">
              <div>
                <p>{mov.lote.producto.nombre}</p>
                <Badge variant="outline" className="font-mono">
                  {mov.lote?.producto.codigo || "N/A"}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="text-center font-semibold">
              {Number(mov.cantidad).toFixed(0)} unidades
            </TableCell>
            <TableCell className="text-center">
              <div className="flex flex-col items-center">
                <span className="font-medium text-sm">
                  {mov.sucursalOrigen?.nombre || "N/A"}
                </span>
                <span className="text-xs text-gray-500">
                  {mov.sucursalOrigen?.tipo || ""}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <ArrowRight className="h-4 w-4 text-gray-400 mx-auto" />
            </TableCell>
            <TableCell className="text-center">
              <div className="flex flex-col items-center">
                <span className="font-medium text-sm">
                  {mov.sucursalDestino?.nombre || "N/A"}
                </span>
                <span className="text-xs text-gray-500">
                  {mov.sucursalDestino?.tipo || ""}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              {moneda} {Number(mov.lote?.costo_por_unidad || 0).toFixed(2)}
            </TableCell>
            <TableCell className="text-center text-sm">
              {formatDate(mov.created_at)}
            </TableCell>
            <TableCell className="text-center">
              {getTipoBadge(mov.tipo)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableTraslados;
