import {
  PreciosPorPai,
  ResponsePaquetesInterface,
} from "@/apis/paquetes/interfaces/response-paquetes.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";

interface Props {
  paquete: ResponsePaquetesInterface;
  handleEditPaquete: (paquete: ResponsePaquetesInterface) => void;
  handleAddPermisos: (paqueteId: string) => void;
}

const PaquetesCard = ({
  paquete,
  handleEditPaquete,
  handleAddPermisos,
}: Props) => {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>{paquete.nombre}</CardTitle>
          <div className="flex gap-3">
            <Badge variant="outline">{paquete.tipo}</Badge>
            <Button
              onClick={() => handleEditPaquete(paquete)}
              variant={"ghost"}
            >
              <Edit />
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">Límites del plan:</div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">🐄 Fincas: {paquete.maxFincas}</Badge>
          <Badge variant="secondary">🐑 Animales: {paquete.maxAnimales}</Badge>
          <Badge variant="secondary">
            👷 Trabajadores: {paquete.maxTrabajadores}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Precios disponibles</h4>

          {paquete.preciosPorPais?.length > 0 ? (
            paquete.preciosPorPais.map((precio: PreciosPorPai) => (
              <div key={precio.id} className="border rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{precio.pais.nombre}</span>
                  <Badge variant="outline">{precio.tipo}</Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  Mensual:{" "}
                  <span className="font-semibold">
                    {precio.precioMensual} {precio.pais.simbolo_moneda}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground">
                  Anual:{" "}
                  <span className="font-semibold">
                    {precio.precioAnual} {precio.pais.simbolo_moneda}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Sin precios configurados
            </p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Permisos</h4>

          {paquete.permisos?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {paquete.permisos.map((p: any) => (
                <Badge key={p.id} variant="secondary">
                  {p.permiso.nombre}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sin permisos incluidos
            </p>
          )}
        </div>
        <Button
          onClick={() => handleAddPermisos(paquete.id)}
          className="w-full"
        >
          Agregar Permisos
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaquetesCard;
