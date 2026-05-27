import { Categoria } from "@/apis/categorias/interface/response-categorias.interface";
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
import FormCategorias from "./FormCategorias";

interface Props {
  categoria: Categoria;
}

const CardCategorias = ({ categoria }: Props) => {
  const [editCategoria, setEditCategoria] = useState<Categoria | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleEditCategoria = (categoria: Categoria) => {
    setIsOpen(true);
    setIsEdit(true);
    setEditCategoria(categoria);
  };

  return (
    <>
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{categoria.nombre}</CardTitle>
            <Badge variant={categoria.is_active ? "default" : "secondary"}>
              {categoria.is_active ? "Activa" : "Inactiva"}
            </Badge>
          </div>
          <CardDescription>{categoria.descripcion}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              <span className="font-medium">Tipo:</span>{" "}
              <Badge>{categoria.tipo}</Badge>
            </div>
            <p>
              <span className="font-medium">Creada:</span>{" "}
              {new Date(categoria.created_at).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Actualizada:</span>{" "}
              {new Date(categoria.updated_at).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => handleEditCategoria(categoria)}
            variant="outline"
            size="sm"
          >
            Editar
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar una categoria
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormCategorias
            onSucces={() => setIsOpen(false)}
            editCategoria={editCategoria}
            isEdit={isEdit}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CardCategorias;
