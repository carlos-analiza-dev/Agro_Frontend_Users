"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircleIcon } from "lucide-react";

interface ModalMotivoCancelacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  isLoading?: boolean;
  citaCodigo?: string;
}

const ModalMotivoCancelacion = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  citaCodigo,
}: ModalMotivoCancelacionProps) => {
  const [motivo, setMotivo] = useState("");

  const handleConfirm = () => {
    if (!motivo.trim()) {
      return;
    }
    onConfirm(motivo);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircleIcon className="h-5 w-5" />
            Cancelar Cita
          </DialogTitle>
          <DialogDescription>
            {citaCodigo && (
              <span className="block mt-1 text-sm font-medium text-gray-700">
                Cita: {citaCodigo}
              </span>
            )}
            Por favor, indique el motivo de cancelación. Esta información será
            enviada al cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="motivo" className="text-sm font-semibold">
              Motivo de cancelación <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="motivo"
              placeholder="Ej: El veterinario no está disponible, falta de insumos, el cliente solicitó reprogramar, etc."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Este motivo será notificado al cliente por correo electrónico.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Volver
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!motivo.trim() || isLoading}
          >
            {isLoading ? "Cancelando..." : "Confirmar Cancelación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalMotivoCancelacion;
