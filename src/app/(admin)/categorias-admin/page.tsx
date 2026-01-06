"use client";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TitlePages from "@/components/generics/TitlePages";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SkeletonCategorias from "@/components/generics/SkeletonCategorias";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";

const FormCategorias = dynamic(() => import("./ui/FormCategorias"), {
  loading: () => <LoaderComponents />,
});

const CardCategorias = dynamic(() => import("./ui/CardCategorias"), {
  loading: () => <SkeletonCategorias />,
});

const CategoriasPageAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categorias, isLoading } = useGetCategorias();

  if (isLoading) {
    return <SkeletonCategorias />;
  }

  return (
    <div className="p-3  mx-auto">
      <div className="block md:flex justify-between items-center mb-8">
        <TitlePages title="Administrar Categorías" />
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categorias && categorias.data.length > 0 ? (
          categorias.data.map((categoria) => (
            <CardCategorias key={categoria.id} categoria={categoria} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground mb-4">
              No hay categorías registradas
            </div>
          </div>
        )}
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agrear nuevas categorias
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormCategorias onSucces={() => setIsOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoriasPageAdmin;
