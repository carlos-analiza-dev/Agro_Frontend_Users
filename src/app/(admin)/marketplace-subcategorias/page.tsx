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
import { useState } from "react";
import SkeletonCategorias from "@/components/generics/SkeletonCategorias";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";
import Paginacion from "@/components/generics/Paginacion";

const FormSubCategoria = dynamic(
  () => import("@/components/sub-categorias/FormSubCategoria"),
  {
    loading: () => <LoaderComponents />,
  },
);

const CardSubcategorias = dynamic(
  () => import("@/components/sub-categorias/CardSubcategorias"),
  {
    loading: () => <SkeletonCategorias />,
  },
);

const SubCategoriasPageAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const {
    data: subcategoriasData,
    isLoading,
    refetch,
  } = useGetSubCategorias({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    is_market: true,
  });

  const subcategorias = subcategoriasData?.data || [];
  const total = subcategoriasData?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <SkeletonCategorias />;
  }

  return (
    <div className="p-3 mx-auto">
      <div className="block md:flex justify-between items-center mb-8">
        <TitlePages title="Market Place Sub Categorías" />
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nueva Sub Categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subcategorias.length > 0 ? (
          subcategorias.map((subcate) => (
            <CardSubcategorias key={subcate.id} subcategoria={subcate} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground mb-4">
              No hay subcategorías registradas
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-between items-center">
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Sub Categoría</AlertDialogTitle>
            <AlertDialogDescription>
              En esta sección podrás agregar nuevas subcategorías
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormSubCategoria
            onSucces={() => {
              setIsOpen(false);
              refetch();
            }}
            isMarket={true}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubCategoriasPageAdmin;
