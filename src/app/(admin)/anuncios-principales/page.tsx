"use client";
import Paginacion from "@/components/generics/Paginacion";
import useGetAnuncios from "@/hooks/anuncios/useGetAnuncios";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ImageOff, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import AnunciosCard from "@/components/anuncios/AnunciosCard";
import { Anuncio } from "@/apis/anuncios/interfaces/response-anuncios.interface";
import CardSkeleton from "@/components/generics/CardSkeleton";
import Modal from "@/components/generics/Modal";
import AnunciosForm from "@/components/anuncios/AnunciosForm";

const AnunciosPrincipalesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [IsOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = useGetAnuncios({
    principal: true,
    offset: currentPage - 1,
    limit: limit,
  });
  const [editAnuncio, setEditAnuncio] = useState<Anuncio | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const anuncios = data?.anuncios || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditAnuncio = (anuncio: Anuncio) => {
    setIsOpen(true);
    setIsEdit(true);
    setEditAnuncio(anuncio);
  };

  if (isLoading) {
    return <CardSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los anuncios. Por favor, intenta de nuevo más tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Anuncios Principales</h1>
        <Button onClick={() => setIsOpen(true)}>
          <Plus /> Agregar Anuncio
        </Button>
      </div>

      {anuncios.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <ImageOff className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No hay anuncios principales disponibles
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {anuncios.map((anuncio: Anuncio) => (
              <AnunciosCard
                key={anuncio.id}
                anuncio={anuncio}
                handleEditAnuncio={handleEditAnuncio}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Paginacion
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}

          <div className="text-center text-sm text-muted-foreground mt-4">
            Mostrando {anuncios.length} de {total} anuncios
          </div>
        </>
      )}
      <Modal
        open={IsOpen}
        onOpenChange={setIsOpen}
        title={isEdit ? "Editar Anuncio" : "Agregar Anuncio"}
        description={
          isEdit
            ? "Aqui podras editar los anuncios"
            : "Aqui podras ingresar nuevos anuncios"
        }
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <AnunciosForm
          onSuccess={() => {
            setIsOpen(false);
            setEditAnuncio(null);
            setIsEdit(false);
          }}
          editAnuncio={editAnuncio}
          isEdit={isEdit}
        />
      </Modal>
    </div>
  );
};

export default AnunciosPrincipalesPage;
