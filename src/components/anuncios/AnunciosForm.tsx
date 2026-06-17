import { IngresarAnuncio } from "@/apis/anuncios/accions/ingresar-anuncio";
import { ActualizarAnuncio } from "@/apis/anuncios/accions/actualizar-anuncio";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import {
  Anuncio,
  EtiquetaAnuncio,
} from "@/apis/anuncios/interfaces/response-anuncios.interface";
import { EliminarImagenAnuncio } from "@/apis/anuncios/accions/eliminar-umagen-anuncio";

interface AnuncioFormData {
  titulo: string;
  descripcion: string;
  link: string;
  esPrincipal?: boolean;
  mostrar?: boolean;
  etiqueta?: EtiquetaAnuncio;
}

interface Props {
  onSuccess: () => void;
  editAnuncio?: Anuncio | null;
  isEdit?: boolean;
}

const AnunciosForm = ({ onSuccess, editAnuncio, isEdit }: Props) => {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnuncioFormData>();

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) => EliminarImagenAnuncio(imageId),
    onSuccess: () => {
      toast.success("Imagen eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["anuncios"] });
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
        toast.error("Hubo un error al eliminar la imagen");
      }
    },
  });

  useEffect(() => {
    if (editAnuncio && isEdit) {
      reset({
        titulo: editAnuncio.titulo,
        descripcion: editAnuncio.descripcion,
        link: editAnuncio.link,
        esPrincipal: editAnuncio.esPrincipal,
        mostrar: editAnuncio.mostrar,
        etiqueta: editAnuncio.etiqueta as EtiquetaAnuncio,
      });

      if (editAnuncio.anucioImages) {
        setExistingImages(editAnuncio.anucioImages.map((img) => img.url));
      }
    }
  }, [editAnuncio, isEdit, reset]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + selectedFiles.length > 5) {
      toast.error("Máximo 5 imágenes permitidas");
      return;
    }

    setSelectedFiles([...selectedFiles, ...files]);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const removedFile = newFiles.splice(index, 1)[0];
    setSelectedFiles(newFiles);

    URL.revokeObjectURL(previewUrls[index]);
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const removeExistingImage = async (url: string) => {
    const imageToDelete = editAnuncio?.anucioImages?.find(
      (img) => img.url === url,
    );

    if (imageToDelete?.id) {
      try {
        await deleteImageMutation.mutateAsync(imageToDelete.id);

        setExistingImages(existingImages.filter((img) => img !== url));
        setImagesToDelete([...imagesToDelete, url]);
      } catch (error) {}
    } else {
      setExistingImages(existingImages.filter((img) => img !== url));
      setImagesToDelete([...imagesToDelete, url]);
    }
  };

  const mutation = useMutation({
    mutationFn: (formData: FormData) => IngresarAnuncio(formData),
    onSuccess: () => {
      toast.success("Anuncio creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["anuncios"] });
      reset();
      setSelectedFiles([]);
      setPreviewUrls([]);
      onSuccess();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el anuncio";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el anuncio. Inténtalo de nuevo.",
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      ActualizarAnuncio(id, formData),
    onSuccess: () => {
      toast.success("Anuncio actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["anuncios"] });
      reset();
      setSelectedFiles([]);
      setPreviewUrls([]);
      onSuccess();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el anuncio";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el anuncio. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = (data: AnuncioFormData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    selectedFiles.forEach((file) => {
      formData.append("imagenes", file);
    });

    if (isEdit && editAnuncio) {
      mutationUpdate.mutate({ id: editAnuncio.id, formData });
    } else {
      mutation.mutate(formData);
    }
  };

  const watchEtiqueta = watch("etiqueta");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label className="font-bold">
          Título del Anuncio <span className="text-red-500">*</span>
        </Label>
        <Input
          {...register("titulo", { required: "El título es requerido" })}
          placeholder="Escriba el título del anuncio"
          className="focus:ring-2 focus:ring-primary"
        />
        {errors.titulo && (
          <p className="text-sm font-medium text-red-500">
            {errors.titulo.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-bold">
          Descripción <span className="text-red-500">*</span>
        </Label>
        <Textarea
          {...register("descripcion", {
            required: "La descripción es requerida",
          })}
          placeholder="Escriba la descripción del anuncio"
          rows={4}
          className="resize-none focus:ring-2 focus:ring-primary"
        />
        {errors.descripcion && (
          <p className="text-sm font-medium text-red-500">
            {errors.descripcion.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-bold">
          Enlace <span className="text-red-500">*</span>
        </Label>
        <Input
          {...register("link", {
            required: "El enlace es requerido",
            pattern: {
              value:
                /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
              message: "Ingrese una URL válida",
            },
          })}
          placeholder="https://ejemplo.com/anuncio"
          className="focus:ring-2 focus:ring-primary"
        />
        {errors.link && (
          <p className="text-sm font-medium text-red-500">
            {errors.link.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-bold">Etiqueta</Label>
        <Select
          defaultValue={editAnuncio?.etiqueta}
          onValueChange={(value) =>
            setValue("etiqueta", value as EtiquetaAnuncio)
          }
        >
          <SelectTrigger className="focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="Seleccione una etiqueta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EtiquetaAnuncio.PATROCINADO}>
              Patrocinado
            </SelectItem>
            <SelectItem value={EtiquetaAnuncio.OFERTA}>
              Oferta Especial
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.etiqueta && (
          <p className="text-sm font-medium text-red-500">
            {errors.etiqueta.message as string}
          </p>
        )}
        {watchEtiqueta === "PATROCINADO" && (
          <p className="text-sm text-muted-foreground">
            Los anuncios patrocinados aparecerán con un distintivo especial
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="font-bold">Anuncio Principal</Label>
              <p className="text-sm text-muted-foreground">
                Aparecerá en la sección principal
              </p>
            </div>
            <Switch
              defaultChecked={editAnuncio?.esPrincipal || false}
              onCheckedChange={(checked) => setValue("esPrincipal", checked)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="font-bold">Mostrar Anuncio</Label>
              <p className="text-sm text-muted-foreground">
                Visible en la aplicación
              </p>
            </div>
            <Switch
              defaultChecked={editAnuncio?.mostrar !== false}
              onCheckedChange={(checked) => setValue("mostrar", checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-bold">
          Imágenes del Anuncio{" "}
          {!isEdit && <span className="text-red-500">*</span>}
        </Label>
        <p className="text-sm text-muted-foreground">
          Máximo 5 imágenes (PNG, JPG, JPEG)
        </p>

        {isEdit && existingImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {existingImages.map((url, index) => {
              const imageData = editAnuncio?.anucioImages?.find(
                (img) => img.url === url,
              );
              return (
                <div key={index} className="relative group">
                  <div className="relative h-32 w-full rounded-lg overflow-hidden border">
                    <Image
                      src={url}
                      alt={`Imagen existente ${index + 1}`}
                      width={400}
                      height={300}
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    disabled={deleteImageMutation.isPending}
                    className={`absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors ${
                      deleteImageMutation.isPending
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {deleteImageMutation.isPending ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                  {imageData && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                      ID: {imageData.id}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative h-32 w-full rounded-lg overflow-hidden border">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedFiles.length + (isEdit ? existingImages.length : 0) < 5 && (
          <div className="relative">
            <Input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              onChange={handleFileChange}
              className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          <span>
            {selectedFiles.length + (isEdit ? existingImages.length : 0)} de 5
            imágenes seleccionadas
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setSelectedFiles([]);
            setPreviewUrls([]);
            onSuccess();
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
          className="min-w-[120px]"
        >
          {mutation.isPending || mutationUpdate.isPending ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isEdit ? "Actualizando..." : "Creando..."}
            </span>
          ) : (
            <span>{isEdit ? "Actualizar Anuncio" : "Crear Anuncio"}</span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AnunciosForm;
