import { useState } from "react";
import { ResponseEspecies } from "@/apis/especies/interfaces/response-especies.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, PawPrint } from "lucide-react";
import RazasModal from "./RazasModal";

interface Props {
  activeEspecies: ResponseEspecies[];
  openEditDialog: (especie: ResponseEspecies) => void;
}

const EspeciesCard = ({ activeEspecies, openEditDialog }: Props) => {
  const [isRazasModalOpen, setIsRazasModalOpen] = useState(false);
  const [selectedEspecie, setSelectedEspecie] =
    useState<ResponseEspecies | null>(null);

  const handleOpenRazas = (especie: ResponseEspecies) => {
    setSelectedEspecie(especie);
    setIsRazasModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-green-600" />
            Especies Activas
            <Badge variant="secondary" className="ml-2">
              {activeEspecies.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Lista de especies animales activas en el sistema
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Razas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {activeEspecies.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No se encontraron especies activas
                  </TableCell>
                </TableRow>
              ) : (
                activeEspecies.map((especie) => (
                  <TableRow key={especie.id}>
                    <TableCell className="font-medium">
                      {especie.nombre}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => handleOpenRazas(especie)}
                      >
                        Ver Razas
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="default"
                        className={
                          especie.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {especie.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(especie)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedEspecie && (
        <RazasModal
          especieId={selectedEspecie.id}
          open={isRazasModalOpen}
          onOpenChange={(open) => {
            setIsRazasModalOpen(open);
            if (!open) setSelectedEspecie(null);
          }}
        />
      )}
    </>
  );
};

export default EspeciesCard;
