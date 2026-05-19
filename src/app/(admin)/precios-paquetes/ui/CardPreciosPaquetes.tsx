import { ResponsePreciosInterface } from "@/apis/precios-paquetes/interfaces/response-precios.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TipoPrecio } from "@/interfaces/enums/paquetes/paquetes.enum";
import {
  Calendar,
  Globe,
  Landmark,
  MapPinned,
  PawPrint,
  Users,
} from "lucide-react";

interface Props {
  precio: ResponsePreciosInterface;
  handleEditPrecio: (precio: ResponsePreciosInterface) => void;
}

const CardPreciosPaquetes = ({ precio, handleEditPrecio }: Props) => {
  return (
    <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{precio.paquete.nombre}</CardTitle>

            <CardDescription className="mt-1">
              {precio.paquete.tipo}
            </CardDescription>
          </div>
        </div>

        <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Mensual
            </div>

            <span className="text-lg font-bold">
              {precio.pais.simbolo_moneda}
              {precio.precioMensual}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Anual
            </div>

            <span className="text-lg font-bold">
              {precio.pais.simbolo_moneda}
              {precio.precioAnual}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Información del país</h4>

          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span>{precio.pais.nombre}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Landmark className="w-4 h-4 text-muted-foreground" />
              <span>Moneda: {precio.pais.nombre_moneda}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPinned className="w-4 h-4 text-muted-foreground" />
              <span>Código país: {precio.pais.code}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Límites del paquete</h4>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              🌾 {precio.paquete.maxFincas} fincas
            </Badge>

            <Badge variant="outline">
              <PawPrint className="w-3 h-3 mr-1" />
              {precio.paquete.maxAnimales} animales
            </Badge>

            <Badge variant="outline">
              <Users className="w-3 h-3 mr-1" />
              {precio.paquete.maxTrabajadores} trabajadores
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={precio.isActive ? "default" : "destructive"}>
            {precio.isActive ? "Activo" : "Inactivo"}
          </Badge>

          <Button onClick={() => handleEditPrecio(precio)} size="sm">
            Editar precio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardPreciosPaquetes;
