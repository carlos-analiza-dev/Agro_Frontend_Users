import { Lote } from "@/apis/lotes/interfaces/response-lotes-sucursal.interface";
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
import { ArrowLeftRight } from "lucide-react";

interface Props {
  filteredLotes: Lote[];
  moneda: string;
  handleTransferir: (lote: Lote) => void;
}

const TableLotes = ({ filteredLotes, moneda, handleTransferir }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Producto</TableHead>
          <TableHead className="text-center">Código</TableHead>
          <TableHead className="text-center">Sucursal</TableHead>
          <TableHead className="text-center">Cantidad</TableHead>
          <TableHead className="text-center">Costo Unitario</TableHead>
          <TableHead className="text-center">Costo Total</TableHead>
          <TableHead className="text-center">Estado</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredLotes.map((lote) => (
          <TableRow key={lote.id}>
            <TableCell className="font-medium text-center">
              {lote.nombre_producto}
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className="font-mono">
                {lote.codigo_producto}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              {lote.nombre_sucursal}
            </TableCell>
            <TableCell className="text-center font-semibold">
              {lote.cantidad}
            </TableCell>
            <TableCell className="text-center">
              {moneda}
              {lote.costo_por_unidad?.toFixed(2) || "0.00"}
            </TableCell>
            <TableCell className="text-center">
              {moneda}
              {lote.costo?.toFixed(2) || "0.00"}
            </TableCell>
            <TableCell className="text-center">
              <Badge
                variant={lote.cantidad <= 5 ? "destructive" : "default"}
                className={
                  lote.cantidad <= 10 && lote.cantidad > 5
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : ""
                }
              >
                {lote.cantidad <= 5
                  ? "Stock Bajo"
                  : lote.cantidad <= 10
                    ? "Stock Limitado"
                    : "Stock Suficiente"}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <Button
                onClick={() => handleTransferir(lote)}
                variant={"outline"}
              >
                <ArrowLeftRight /> Traslados
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableLotes;
