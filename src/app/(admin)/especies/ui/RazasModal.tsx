import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit2 } from "lucide-react";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import Modal from "@/components/generics/Modal";
import RazaFormModal from "./RazaFormModal";
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
  especieId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RazasModal = ({ especieId, open, onOpenChange }: Props) => {
  const { data, isLoading } = useGetRazasByEspecie(especieId);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedRaza, setSelectedRaza] = useState<any>(null);

  const handleCreate = () => {
    setSelectedRaza(null);
    setFormOpen(true);
  };

  const handleEdit = (raza: any) => {
    setSelectedRaza(raza);
    setFormOpen(true);
  };

  return (
    <>
      <Modal
        title="Razas de la Especie"
        description="Gestiona las razas asociadas"
        open={open}
        onOpenChange={onOpenChange}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Lista de Razas</h3>
              <p className="text-sm text-muted-foreground">
                Gestiona las razas asociadas a esta especie
              </p>
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Raza
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold">Abreviatura</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-muted-foreground">
                            No hay razas registradas
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCreate}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Crear primera raza
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data.map((raza: any) => (
                      <TableRow key={raza.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          {raza.nombre}
                        </TableCell>
                        <TableCell>
                          {raza.abreviatura ? (
                            <Badge variant="outline">{raza.abreviatura}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={raza.isActive ? "default" : "secondary"}
                            className={
                              raza.isActive
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                            }
                          >
                            {raza.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(raza)}
                            className="hover:bg-primary/10"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Modal>

      <RazaFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        especieId={especieId}
        raza={selectedRaza}
      />
    </>
  );
};

export default RazasModal;
