"use client";

import useGetPreciosPaquetes from "@/hooks/paquetes-precios/useGetPreciosPaquetes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import CardPreciosPaquetes from "./ui/CardPreciosPaquetes";
import Modal from "@/components/generics/Modal";
import { useState } from "react";
import FormPreciosPaquetes from "./ui/FormPreciosPaquetes";
import { ResponsePreciosInterface } from "@/apis/precios-paquetes/interfaces/response-precios.interface";

const PrecioPaquetesPage = () => {
  const { data: precios_paquetes, isLoading } = useGetPreciosPaquetes();
  const [openModal, setOpenModal] = useState(false);
  const [selectedPrecio, setSelectedPrecio] =
    useState<ResponsePreciosInterface | null>(null);

  const handleEditPrecio = (precio: ResponsePreciosInterface) => {
    setOpenModal(true);
    setSelectedPrecio(precio);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-2 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Precios de paquetes
          </h1>

          <p className="text-muted-foreground">
            Administra los precios de cada paquete según el país y el tipo de
            suscripción.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <Plus /> Agregar Precio
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="rounded-2xl">
              <CardHeader className="space-y-3">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>

              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-5">
          {precios_paquetes?.map((precio) => (
            <CardPreciosPaquetes
              precio={precio}
              key={precio.id}
              handleEditPrecio={handleEditPrecio}
            />
          ))}
        </div>
      )}
      <Modal
        onOpenChange={setOpenModal}
        open={openModal}
        title="Agregar Precios"
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <FormPreciosPaquetes
          setOpenModal={setOpenModal}
          onSuccess={() => {
            setOpenModal(false);
            setSelectedPrecio(null);
          }}
          precioPaquete={selectedPrecio}
        />
      </Modal>
    </div>
  );
};

export default PrecioPaquetesPage;
