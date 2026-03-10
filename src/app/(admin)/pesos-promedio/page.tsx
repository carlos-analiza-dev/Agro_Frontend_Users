"use client";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import TitlePages from "@/components/generics/TitlePages";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetPesosPromedioRazas from "@/hooks/pesos-promedio/useGetPesosPromedioRazas";
import TablePesosPromedioRazas from "./ui/TablePesosPromedioRazas";
import { PesosPromedioRazasInterface } from "@/apis/pesos-promedio-raza/interface/response-pesos-prom.interface";
import CardDetails from "./ui/CardDetails";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Modal from "@/components/generics/Modal";
import FormPesoPromedioRaza from "./ui/FormPesoPromedioRaza";

const PesosPromedioRaza = () => {
  const { data: pesos_promedio, isLoading } = useGetPesosPromedioRazas();
  const [openModal, setOpenModal] = useState(false);

  const pesosData = pesos_promedio || [];

  const pesosPorRaza = pesosData.reduce(
    (acc: any, item: PesosPromedioRazasInterface) => {
      const razaNombre = item.raza.nombre;
      if (!acc[razaNombre]) {
        acc[razaNombre] = [];
      }
      acc[razaNombre].push(item);
      return acc;
    },
    {},
  );

  const totalRegistros = pesosData.length;
  const totalRazas = Object.keys(pesosPorRaza).length;

  const edadMinima =
    pesosData.length > 0
      ? Math.min(
          ...pesosData.map((p: PesosPromedioRazasInterface) => p.edadMinMeses),
        )
      : 0;
  const edadMaxima =
    pesosData.length > 0
      ? Math.max(
          ...pesosData.map((p: PesosPromedioRazasInterface) => p.edadMaxMeses),
        )
      : 0;

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-start mb-8">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <TableUsersSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <TitlePages title="Pesos Promedio Por Razas" />
          <p className="text-muted-foreground mt-2">
            Tabla de pesos esperados según la edad y raza del ganado
          </p>
        </div>
        <div>
          <Button onClick={() => setOpenModal(true)}>Agregar Peso +</Button>
        </div>
      </div>

      {pesosData.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-lg mb-2">
              No hay datos disponibles
            </p>
            <p className="text-sm text-muted-foreground">
              No se encontraron registros de pesos promedio
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Tabla de Pesos Promedio
            </CardTitle>
            <CardDescription>
              Pesos esperados en kilogramos según rango de edad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <TablePesosPromedioRazas pesosData={pesosData} />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <CardDetails
                title="Total de Registros"
                description={`${totalRegistros}`}
              />
              <CardDetails
                title="Razas Registradas"
                description={`${totalRazas}`}
              />
              <CardDetails
                title="Rango de Edad Total"
                description={`${edadMinima} - ${edadMaxima} meses`}
              />
            </div>
          </CardContent>
        </Card>
      )}
      <Modal
        title="Agregar Peso Promedio"
        description="En esta sección podrás agregar pesos promedio según la edad para cada raza"
        open={openModal}
        onOpenChange={handleCloseModal}
        showCloseButton={false}
      >
        <FormPesoPromedioRaza
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      </Modal>
    </div>
  );
};

export default PesosPromedioRaza;
