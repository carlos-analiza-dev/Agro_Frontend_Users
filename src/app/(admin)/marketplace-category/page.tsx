"use client";
import LoaderComponents from "@/components/generics/LoaderComponents";
import Modal from "@/components/generics/Modal";
import SkeletonCategorias from "@/components/generics/SkeletonCategorias";
import TitlePages from "@/components/generics/TitlePages";
import { Button } from "@/components/ui/button";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import Paginacion from "@/components/generics/Paginacion";

const FormCategorias = dynamic(
  () => import("@/components/categorias/FormCategorias"),
  {
    loading: () => <LoaderComponents />,
  },
);

const CardCategorias = dynamic(
  () => import("@/components/categorias/CardCategorias"),
  {
    loading: () => <SkeletonCategorias />,
  },
);

const MarketPlaceCategoriasPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const offset = (currentPage - 1) * itemsPerPage;

  const { data: categorias, isLoading } = useGetCategorias({
    is_market: true,
    limit: itemsPerPage,
    offset: offset,
  });

  const totalPages = Math.ceil((categorias?.total || 0) / itemsPerPage);

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
        <TitlePages title="MarketPlace Categorías" />
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

      {totalPages > 1 && (
        <div className="mt-8">
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Agregar Categoria"
        description="En esta sección podrás agregar nuevas categorías"
      >
        <FormCategorias onSucces={() => setIsOpen(false)} isMarket={true} />
      </Modal>
    </div>
  );
};

export default MarketPlaceCategoriasPage;
