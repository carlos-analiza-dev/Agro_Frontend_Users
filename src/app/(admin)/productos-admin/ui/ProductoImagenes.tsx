"use client";

import { ImageneProductos } from "@/apis/productos/interfaces/response-productos.interface";
import Image from "next/image";
import React, { useState } from "react";
import { ImageIcon, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubirImagenProductos } from "@/apis/upload-images-products/accions/subir-imagen-producto";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { EliminarImagenProducto } from "@/apis/upload-images-products/accions/eliminar-imagen-producto";

interface Props {
  imagenes?: ImageneProductos[];
  productoId: string;
  onUploadSuccess?: () => void;
}

type FormValues = {
  file: FileList;
};

const CONTAINER_SIZE = {
  width: 70,
  height: 50,
};

const ProductoImagenes = ({ imagenes, productoId, onUploadSuccess }: Props) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<FormValues>();

  const fileWatch = watch("file");

  React.useEffect(() => {
    if (fileWatch && fileWatch.length > 0) {
      const file = fileWatch[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [fileWatch]);

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) =>
      SubirImagenProductos(productoId, formData),
    onSuccess: () => {
      toast.success("Imagen del producto subida");
      queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al subir la imagen";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de subir la imagen. Inténtalo de nuevo."
        );
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => EliminarImagenProducto(id),
    onSuccess: () => {
      toast.success("Imagen eliminada con éxito");
      queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al eliminar la imagen";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de eliminar la imagen. Inténtalo de nuevo."
        );
      }
      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.file || data.file.length === 0) return;

    const formData = new FormData();
    formData.append("file", data.file[0]);

    try {
      uploadMutation.mutate(formData);

      if (onUploadSuccess) onUploadSuccess();
      reset();
      setPreview(null);
      setIsOpen(false);
    } catch (err) {
      toast.success("Error al procesar la imahgen");
    }
  };

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (imageToDelete) {
      deleteMutation.mutate(imageToDelete);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  return (
    <div
      className="relative flex justify-center"
      style={{ width: CONTAINER_SIZE.width, height: CONTAINER_SIZE.height }}
    >
      {imagenes && imagenes.length > 0 ? (
        <Carousel className="w-full h-full">
          <CarouselContent className="ml-0">
            {imagenes.map((imagen, index) => (
              <CarouselItem key={imagen.id || index} className="pl-0">
                <div className="p-0 relative w-full h-full">
                  <Card className="w-full h-full border-0 shadow-none">
                    <CardContent className="flex items-center justify-center p-0 relative group w-full h-full">
                      <div
                        className="relative w-full h-full flex items-center justify-center bg-muted rounded-md overflow-hidden"
                        style={{
                          width: CONTAINER_SIZE.width,
                          height: CONTAINER_SIZE.height,
                        }}
                      >
                        <Image
                          src={imagen.url || "/placeholder.png"}
                          alt={`Imagen del producto ${index + 1}`}
                          unoptimized
                          width={CONTAINER_SIZE.width}
                          height={CONTAINER_SIZE.height}
                          className="object-cover rounded-md"
                          style={{ width: "100%", height: "100%" }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";

                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML =
                                '<div class="w-full h-full flex items-center justify-center bg-muted">' +
                                '<ImageIcon class="h-5 w-5 text-muted-foreground" />' +
                                "</div>";
                            }
                          }}
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteClick(imagen.id!)}
                        disabled={deleteMutation.isPending}
                        className="absolute -top-1 -left-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        style={{ width: "16px", height: "16px" }}
                        title="Eliminar imagen"
                      >
                        {deleteMutation.isPending &&
                        imageToDelete === imagen.id ? (
                          <div className="h-2 w-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Trash2 size={8} />
                        )}
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div
          className="w-full h-full bg-muted rounded-md flex items-center justify-center"
          style={{ width: CONTAINER_SIZE.width, height: CONTAINER_SIZE.height }}
        >
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      <button
        className="absolute -top-2 -right-2 bg-primary rounded-full p-1 cursor-pointer shadow z-10"
        onClick={() => setIsOpen(true)}
        style={{ width: "20px", height: "20px" }}
      >
        <Plus size={12} className="text-white" />
      </button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Agregar Imagen</AlertDialogTitle>
              <AlertDialogDescription>
                Selecciona una imagen para este producto
              </AlertDialogDescription>
            </AlertDialogHeader>

            <input
              type="file"
              accept="image/*"
              {...register("file", { required: true })}
              className="mt-4"
            />

            {preview && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={preview}
                  alt="Vista previa"
                  unoptimized
                  width={120}
                  height={120}
                  className="rounded-md border object-cover"
                />
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setPreview(null);
                  reset();
                }}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? "Subiendo..." : "Subir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la imagen del producto. No
              podrás deshacer esta acción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductoImagenes;
