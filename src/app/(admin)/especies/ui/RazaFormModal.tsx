import { useEffect, useState } from "react";
import Modal from "@/components/generics/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Raza } from "@/apis/pesos-promedio-raza/interface/response-pesos-prom.interface";
import { createRaza } from "@/apis/razas/accions/crear-raza";
import { updateRaza } from "@/apis/razas/accions/actualizar-raza";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  especieId: string;
  raza?: Raza;
}

const RazaFormModal = ({ open, onOpenChange, especieId, raza }: Props) => {
  const queryClient = useQueryClient();
  const isEdit = !!raza;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    abreviatura: "",
    isActive: true,
  });

  useEffect(() => {
    if (raza) {
      setFormData({
        nombre: raza.nombre,
        abreviatura: raza.abreviatura || "",
        isActive: raza.isActive,
      });
    } else {
      setFormData({
        nombre: "",
        abreviatura: "",
        isActive: true,
      });
    }
  }, [raza]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (isEdit) {
        await updateRaza(raza.id, {
          ...formData,
          abreviatura: formData.abreviatura.toUpperCase(),
        });
        queryClient.invalidateQueries({ queryKey: ["obtener-especies"] });
        queryClient.invalidateQueries({ queryKey: ["razas-especie"] });
        toast.success("Raza Actualizada Exitosamente");
      } else {
        await createRaza({
          ...formData,
          especieId,
          abreviatura: formData.abreviatura.toUpperCase(),
        });
        queryClient.invalidateQueries({ queryKey: ["obtener-especies"] });
        queryClient.invalidateQueries({ queryKey: ["razas-especie"] });
        toast.success("Raza Creada Exitosamente");
      }

      onOpenChange(false);
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al ejecutar la accion";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de realizar la accion. Inténtalo de nuevo.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Editar Raza" : "Nueva Raza"}
      description="Completa los datos de la raza"
      open={open}
      onOpenChange={onOpenChange}
      size="2xl"
      height="auto"
    >
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Nombre</Label>
          <Input
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Abreviatura</Label>
          <Input
            value={formData.abreviatura}
            onChange={(e) =>
              setFormData({ ...formData, abreviatura: e.target.value })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Activo</Label>
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar
        </Button>
      </div>
    </Modal>
  );
};

export default RazaFormModal;
