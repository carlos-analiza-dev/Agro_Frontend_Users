import {
  ResponseSubcategorias,
  SubCategoria,
} from "@/apis/subcategorias/interface/get-subcategorias.interface";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import FormSubCategoria from "./FormSubCategoria";
import { Calendar, Layers, Tag } from "lucide-react";

interface Props {
  subcategoria: SubCategoria;
}

const CardSubcategorias = ({ subcategoria }: Props) => {
  const [editSubCategoria, setSubEditCategoria] = useState<SubCategoria | null>(
    null
  );
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleEditSubcategoria = (subcategoria: SubCategoria) => {
    setIsOpen(true);
    setIsEdit(true);
    setSubEditCategoria(subcategoria);
  };

  return (
    <>
      <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl flex items-center gap-2">
                {subcategoria.nombre}
                <Badge
                  variant={subcategoria.is_active ? "default" : "secondary"}
                  className="text-xs"
                >
                  {subcategoria.is_active ? "Activa" : "Inactiva"}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-2 line-clamp-2">
                {subcategoria.descripcion}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Código:</span>
              <Badge variant="outline" className="font-mono">
                {subcategoria.codigo}
              </Badge>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <Layers className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="font-medium">Categoría:</span>
                <p className="text-muted-foreground">
                  {subcategoria.categoria?.nombre}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              Creada: {new Date(subcategoria.created_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span>
              Actualizada:{" "}
              {new Date(subcategoria.updated_at).toLocaleDateString()}
            </span>
          </div>
        </CardFooter>
        <div className="flex justify-end p-3">
          <Button
            onClick={() => handleEditSubcategoria(subcategoria)}
            variant="outline"
            size="sm"
          >
            Editar
          </Button>
        </div>
      </Card>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Sub Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar una subcategoria
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormSubCategoria
            onSucces={() => setIsOpen(false)}
            editSubCategoria={editSubCategoria}
            isEdit={isEdit}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CardSubcategorias;
