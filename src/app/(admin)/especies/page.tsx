"use client";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { createEspecie } from "@/apis/especies/accions/crear-especie";
import { useQueryClient } from "@tanstack/react-query";
import { updateEspecie } from "@/apis/especies/accions/actualizar-especie";
import EspeciesCard from "./ui/EspeciesCard";
import { ResponseEspecies } from "@/apis/especies/interfaces/response-especies.interface";
import Modal from "@/components/generics/Modal";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";

const EspeciesPage = () => {
  const queryClient = useQueryClient();
  const { data: especies, isLoading, refetch } = useGetEspecies();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEspecie, setSelectedEspecie] =
    useState<ResponseEspecies | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", isActive: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredEspecies = especies?.data.filter((especie: ResponseEspecies) =>
    especie.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = async () => {
    if (!formData.nombre.trim()) {
      toast.warning("El nombre de la especie es requerido");
      return;
    }

    setIsSubmitting(true);
    try {
      await createEspecie(formData);
      queryClient.invalidateQueries({ queryKey: ["obtener-especies"] });
      toast.success("Especie creada correctamente");
      setIsCreateDialogOpen(false);
      setFormData({ nombre: "", isActive: true });
      refetch();
    } catch (error) {
      toast.error("Error al crear la especie");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.nombre.trim()) {
      toast.warning("El nombre de la especie es requerido");
      return;
    }

    if (!selectedEspecie) {
      toast.error("No se ha seleccionado ninguna especie");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateEspecie(selectedEspecie.id, formData);
      queryClient.invalidateQueries({ queryKey: ["obtener-especies"] });
      toast.success("Especie actualizada correctamente");
      setIsEditDialogOpen(false);
      setSelectedEspecie(null);
      refetch();
    } catch (error) {
      toast.error("Error al actualizar la especie");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (especie: ResponseEspecies) => {
    setSelectedEspecie(especie);
    setFormData({ nombre: especie.nombre, isActive: especie.isActive });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando especies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gestión de Especies
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las especies animales de tu finca
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Especie
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar especie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <EspeciesCard
        activeEspecies={filteredEspecies ?? []}
        openEditDialog={openEditDialog}
      />

      <Modal
        title="Crear Nueva Especie"
        description="Ingresa los datos de la nueva especie animal"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        size="xl"
        height="auto"
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Especie</Label>
            <Input
              id="nombre"
              placeholder="Ej: Bovino, Equino, Porcino..."
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Activo</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>
        </div>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Especie
          </Button>
        </AlertDialogFooter>
      </Modal>

      <Modal
        title="Editar Especie"
        description="Modifica los datos de la especie"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        size="xl"
        height="auto"
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nombre">Nombre de la Especie</Label>
            <Input
              id="edit-nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-isActive">Activo</Label>
            <Switch
              id="edit-isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>
        </div>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </AlertDialogFooter>
      </Modal>
    </div>
  );
};

export default EspeciesPage;
