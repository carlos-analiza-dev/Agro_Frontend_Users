import { Badge } from "@/components/ui/badge";
import { TipoMovimientoInventario } from "@/interfaces/enums/movimientos-inventario/tipos_movimientos.enum";

export const getTipoBadge = (tipo: TipoMovimientoInventario) => {
  switch (tipo) {
    case TipoMovimientoInventario.TRANSFERENCIA:
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">Transferencia</Badge>
      );
    case TipoMovimientoInventario.ENTRADA:
      return <Badge className="bg-green-500 hover:bg-green-600">Entrada</Badge>;
    case TipoMovimientoInventario.SALIDA:
      return <Badge className="bg-red-500 hover:bg-red-600">Salida</Badge>;
    default:
      return <Badge variant="outline">{tipo}</Badge>;
  }
};
