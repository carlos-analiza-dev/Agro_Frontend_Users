import { PesosPromedioRazasInterface } from "@/apis/pesos-promedio-raza/interface/response-pesos-prom.interface";
import Modal from "@/components/generics/Modal";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays } from "lucide-react";
import FormPesoPromedioRaza from "./FormPesoPromedioRaza";
import { useState } from "react";

interface Props {
  pesosData: PesosPromedioRazasInterface[];
}

const TablePesosPromedioRazas = ({ pesosData }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [pesoSelected, setPesoSelected] =
    useState<PesosPromedioRazasInterface | null>(null);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const editPeso = (peso: PesosPromedioRazasInterface) => {
    setPesoSelected(peso);
    setOpenModal(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Raza</TableHead>
            <TableHead className="font-semibold">Abreviatura</TableHead>
            <TableHead className="font-semibold">Edad (meses)</TableHead>
            <TableHead className="font-semibold">Peso Mínimo (kg)</TableHead>
            <TableHead className="font-semibold">Peso Máximo (kg)</TableHead>
            <TableHead className="font-semibold">Rango</TableHead>
            <TableHead className="font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pesosData.map((peso: PesosPromedioRazasInterface) => (
            <TableRow
              key={peso.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">{peso.raza.nombre}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {peso.raza.abreviatura}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {peso.edadMinMeses} - {peso.edadMaxMeses} meses
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-semibold text-blue-600 dark:text-blue-400">
                {Number(peso.pesoEsperadoMin).toFixed(1)} kg
              </TableCell>
              <TableCell className="font-semibold text-green-600 dark:text-green-400">
                {Number(peso.pesoEsperadoMax).toFixed(1)} kg
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {(
                    Number(peso.pesoEsperadoMax) - Number(peso.pesoEsperadoMin)
                  ).toFixed(1)}{" "}
                  kg
                </Badge>
              </TableCell>
              <TableCell>
                <span
                  onClick={() => editPeso(peso)}
                  className="hover:underline hover:cursor-pointer"
                >
                  Editar
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        title="Editar Peso Promedio"
        description="En esta sección podrás editar pesos promedio según la edad para cada raza"
        open={openModal}
        onOpenChange={handleCloseModal}
        showCloseButton={false}
      >
        <FormPesoPromedioRaza
          pesoPromedio={pesoSelected}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      </Modal>
    </>
  );
};

export default TablePesosPromedioRazas;
