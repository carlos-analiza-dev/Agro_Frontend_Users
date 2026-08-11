import { CrearPermisoInterfaceClientes } from "@/apis/permisos-clientes/interfaces/crear-permiso.interface";
import { Permiso } from "@/apis/permisos-clientes/interfaces/response-permisos-cliente";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChangeEvent, FormEvent } from "react";

interface Props {
  handleSubmit: (e: FormEvent<Element>) => void;
  formData: CrearPermisoInterfaceClientes;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (checked: boolean) => void;
  closeModal: () => void;
  editingPermiso: Permiso | null;
}

const FormPermisosClientes = ({
  formData,
  handleInputChange,
  handleSubmit,
  handleSwitchChange,
  closeModal,
  editingPermiso,
}: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Permiso</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: animales"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modulo">Módulo</Label>
            <Input
              id="modulo"
              name="modulo"
              value={formData.modulo}
              onChange={handleInputChange}
              placeholder="Ej: Animales"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="Ej: /animales"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción del permiso"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isActive">Permiso activo</Label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={closeModal}>
          Cancelar
        </Button>
        <Button type="submit">
          {editingPermiso ? "Guardar Cambios" : "Crear Permiso"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default FormPermisosClientes;
