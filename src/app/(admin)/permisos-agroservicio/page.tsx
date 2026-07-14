"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { CrearPermisoInterface } from "@/apis/permisos-clientes/interfaces/crear-permiso.interface";
import {
  CrearPermisoAgro,
  CrearPermisoCliente,
} from "@/apis/permisos-clientes/accions/crear-permiso";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  EditarPermisoAgro,
  EditarPermisoCliente,
} from "@/apis/permisos-clientes/accions/editar-permiso";
import Paginacion from "@/components/generics/Paginacion";
import { Permiso } from "@/apis/permisos-clientes/interfaces/response-permisos-cliente";
import CardPermisos from "@/components/permisos/CardPermisos";
import useGetPermisosAgro from "@/hooks/permisos-clientes/useGetPermisosAgro";
import FormPermisosClientes from "@/components/permisos/FormPermisosClientes";

const PermisosAgroservicioPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermiso, setEditingPermiso] = useState<Permiso | null>(null);
  const [formData, setFormData] = useState<CrearPermisoInterface>({
    nombre: "",
    descripcion: "",
    url: "",
    modulo: "",
    isActive: true,
  });

  const offset = (currentPage - 1) * itemsPerPage;

  const { data: permisosData, isLoading } = useGetPermisosAgro(
    itemsPerPage,
    offset,
  );
  const queryClient = useQueryClient();

  const permisos_clientes = permisosData?.data || [];
  const totalPermisos = permisosData?.total || 0;
  const totalPages = Math.ceil(totalPermisos / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const openModal = (permiso?: Permiso) => {
    if (permiso) {
      setEditingPermiso(permiso);
      setFormData({
        nombre: permiso.nombre,
        descripcion: permiso.descripcion,
        url: permiso.url,
        modulo: permiso.modulo,
        isActive: permiso.isActive,
      });
    } else {
      setEditingPermiso(null);
      setFormData({
        nombre: "",
        descripcion: "",
        url: "",
        modulo: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPermiso(null);
    setFormData({
      nombre: "",
      descripcion: "",
      url: "",
      modulo: "",
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPermiso) {
        await EditarPermisoAgro(editingPermiso.id, formData);
        toast.success("Permiso Actualizado Exitosamente");
      } else {
        await CrearPermisoAgro(formData);
        toast.success("Permiso Creado Exitosamente");
      }

      queryClient.invalidateQueries({ queryKey: ["permisos-agro"] });
      closeModal();
    } catch (error) {
      toast.error("Error al procesar la solicitud");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredPermisos = permisos_clientes.filter(
    (permiso) =>
      permiso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permiso.modulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permiso.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const permisosToShow = searchTerm ? filteredPermisos : permisos_clientes;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Permisos de Agroservicio
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona los permisos y accesos del sistema
          </p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Permiso
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar permisos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Total: {totalPermisos} permisos</span>
          <span>
            Activos: {permisos_clientes.filter((p) => p.isActive).length}
          </span>
          {searchTerm && (
            <span className="text-blue-600">
              {filteredPermisos.length} resultado(s) encontrado(s)
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {permisosToShow.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-gray-500 text-lg">
                  No se encontraron permisos
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda"
                    : "Agrega el primer permiso"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          permisosToShow.map((permiso) => (
            <CardPermisos
              key={permiso.id}
              permiso={permiso}
              openModal={openModal}
            />
          ))
        )}
      </div>

      {!searchTerm && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {editingPermiso ? "Editar Permiso" : "Agregar Nuevo Permiso"}
            </DialogTitle>
            <DialogDescription>
              {editingPermiso
                ? "Modifica la información del permiso existente."
                : "Completa la información para crear un nuevo permiso."}
            </DialogDescription>
          </DialogHeader>

          <FormPermisosClientes
            handleSubmit={handleSubmit}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSwitchChange={handleSwitchChange}
            closeModal={closeModal}
            editingPermiso={editingPermiso}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermisosAgroservicioPage;
