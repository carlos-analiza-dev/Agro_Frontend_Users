"use client";

import { useState } from "react";
import TitlePages from "@/components/generics/TitlePages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus } from "lucide-react";
import useGetCodigosPaquetes from "@/hooks/codigos-paquetes/useGetCodigosPaquetes";
import Paginacion from "@/components/generics/Paginacion";
import Modal from "@/components/generics/Modal";
import FormCodigosPaquetes from "./ui/FormCodigosPaquetes";
import TableCodigoPauqtes from "./ui/TableCodigoPauqtes";
import { CodigosPaquetes } from "@/apis/codigos-paquetes/interfaces/response-codigos-paquetes.interface";

const CodigosClientesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCodigo, setSelectedCodigo] = useState<CodigosPaquetes | null>(
    null,
  );
  const [isEdit, setIsEdit] = useState(false);
  const [limit] = useState(10);

  const { data, isLoading } = useGetCodigosPaquetes({
    limit,
    offset: (currentPage - 1) * limit,
  });

  const codigos = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleEditCodigo = (codigo: CodigosPaquetes) => {
    setOpenModal(true);
    setSelectedCodigo(codigo);
    setIsEdit(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="block md:flex justify-between items-center gap-4">
        <TitlePages title="Control de códigos de los paquetes." />

        <Button
          onClick={() => setOpenModal(true)}
          className="w-full sm:w-auto mt-4 md:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ingresar Nuevo Código
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-0 overflow-x-auto">
          <TableCodigoPauqtes
            codigos={codigos}
            isLoading={isLoading}
            handleEditCodigo={handleEditCodigo}
          />
        </CardContent>

        {!isLoading && codigos.length > 0 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium">{codigos.length}</span> de{" "}
              <span className="font-medium">{total}</span> códigos
            </div>
            <Paginacion
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardFooter>
        )}
      </Card>
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title={selectedCodigo ? "Editar Codigo" : "Agregar Nuevo Codigo"}
        description={
          selectedCodigo
            ? "Aqui podras editar el codigo para el paquete seleccionado"
            : "Aqui podras agregar codigos para los paquetes de los clientes"
        }
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <FormCodigosPaquetes
          onSuccess={() => {
            setOpenModal(false);
            setSelectedCodigo(null);
            setIsEdit(false);
          }}
          editCodigo={selectedCodigo}
          isEdit={isEdit}
        />
      </Modal>
    </div>
  );
};

export default CodigosClientesPage;
