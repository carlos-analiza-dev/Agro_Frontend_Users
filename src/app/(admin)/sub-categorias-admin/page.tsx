"use client";

import TitlePages from "@/components/generics/TitlePages";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useGetSubCategorias from "@/hooks/subcategorias/useGetSubCategorias";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import SkeletonCategorias from "@/components/generics/SkeletonCategorias";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";

const FormSubCategoria = dynamic(() => import("./ui/FormSubCategoria"), {
  loading: () => <LoaderComponents />,
});

const CardSubcategorias = dynamic(() => import("./ui/CardSubcategorias"), {
  loading: () => <SkeletonCategorias />,
});

const SubCategoriasPageAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: subcategorias, isLoading } = useGetSubCategorias();

  if (isLoading) {
    return <SkeletonCategorias />;
  }

  return (
    <div className="p-3  mx-auto">
      <div className="block md:flex justify-between items-center mb-8">
        <TitlePages title="Administrar Sub Categorías" />
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nueva Sub Categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subcategorias && subcategorias.data.length > 0 ? (
          subcategorias.data.map((subcate) => (
            <CardSubcategorias key={subcate.id} subcategoria={subcate} />
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
            <AlertDialogTitle>Agregar Sub Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agrear nuevas subcategorias
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormSubCategoria onSucces={() => setIsOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubCategoriasPageAdmin;
