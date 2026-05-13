"use client";
import useGetTiposProducto from "@/hooks/tipo-producto/useGetTiposProducto";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Tag, FolderTree, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Paginacion from "@/components/generics/Paginacion";
import TableTipos from "./ui/TableTipos";
import DetailsCard from "./ui/DetailsCard";
import Modal from "@/components/generics/Modal";
import FormTiposProductos from "./ui/FormTiposProductos";
import { TipoProducto } from "@/apis/tipo-producto/interface/response-tipo-producto.interface";

const TiposProductosPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [openModal, setOpenModal] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoProducto | null>(null);
  const {
    data: tiposData,
    isLoading,
    error,
  } = useGetTiposProducto({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  });

  const tipos = tiposData?.tipos || [];
  const total = tiposData?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const filteredTipos = tipos.filter(
    (tipo) =>
      tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tipo.sub_categoria?.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditTipo = (tipo: TipoProducto) => {
    setOpenModal(true);
    setSelectedTipo(tipo);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los tipos de producto. Por favor, intenta de nuevo.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tipos de Producto
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los tipos de producto y su clasificación por categorías y
            subcategorías
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Tipo de Producto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DetailsCard
          title="Total Tipos"
          descripcion="Tipos de producto registrados"
          Icon={Tag}
          total={total}
        />

        <DetailsCard
          title="Subcategorías Activas"
          descripcion="Subcategorías con tipos asociados"
          Icon={FolderTree}
          total={new Set(tipos.map((t) => t.sub_categoria?.id)).size}
        />

        <DetailsCard
          title="Categorías"
          descripcion="Categorías principales"
          Icon={FolderTree}
          total={new Set(tipos.map((t) => t.sub_categoria?.categoria?.id)).size}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredTipos.length} de {total} tipos
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Producto</CardTitle>
          <CardDescription>
            Todos los tipos de producto organizados por categoría y subcategoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <TableTipos
              filteredTipos={filteredTipos}
              isLoading={isLoading}
              handleEditTipo={handleEditTipo}
            />
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, total)} de {total} tipos
              </p>
              <Paginacion
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title={
          selectedTipo ? "Editar Tipo de Producto" : "Agregar Tipo de Producto"
        }
        description={
          selectedTipo
            ? "Aqui podras editar todos los tipos de producto necesarios"
            : "Aqui podras agregar todos los tipos de producto necesarios"
        }
        showCloseButton={false}
        size="xl"
        height="auto"
      >
        <FormTiposProductos
          onSuccess={() => {
            (setOpenModal(false), setSelectedTipo(null));
          }}
          setOpenModal={setOpenModal}
          tipoProducto={selectedTipo}
        />
      </Modal>
    </div>
  );
};

export default TiposProductosPage;
