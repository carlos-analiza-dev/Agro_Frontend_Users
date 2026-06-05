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
import { useState } from "react";
import FormCategorias from "./FormCategorias";
import { Calendar, Pencil, Star, Tag } from "lucide-react";

interface Props {
  categoria: Categoria;
  isMarket?: boolean;
}

const CardCategorias = ({ categoria, isMarket }: Props) => {
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
      <Card className="group flex flex-col justify-between border-muted/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg md:text-xl line-clamp-1">
                {categoria.nombre}
              </CardTitle>

              <CardDescription className="mt-1 line-clamp-2">
                {categoria.descripcion}
              </CardDescription>
            </div>

            <Badge
              variant={categoria.is_active ? "default" : "secondary"}
              className="shrink-0"
            >
              {categoria.is_active ? "Activa" : "Inactiva"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tipo:</span>

            <Badge variant="outline">{categoria.tipo}</Badge>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Creada: {new Date(categoria.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 border-t pt-4">
          <div>
            {categoria.destacada && (
              <Badge className="gap-1">
                <Star className="h-3 w-3" />
                Destacada
              </Badge>
            )}
          </div>

          <Button
            onClick={() => handleEditCategoria(categoria)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Pencil className="h-4 w-4" />
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
            isMarket={isMarket}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CardCategorias;
