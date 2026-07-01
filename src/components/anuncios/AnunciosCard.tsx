import React from "react";
import { Card, CardContent } from "../ui/card";
import { ImageOff } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Anuncio } from "@/apis/anuncios/interfaces/response-anuncios.interface";
import { formatDate } from "@/helpers/funciones/formatDate";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";

interface Props {
  anuncio: Anuncio;
  handleEditAnuncio: (anuncio: Anuncio) => void;
}

const AnunciosCard = ({ anuncio, handleEditAnuncio }: Props) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {anuncio.anucioImages && anuncio.anucioImages.length > 0 ? (
        <div className="relative">
          <img
            src={anuncio.anucioImages[0].url}
            alt={anuncio.titulo}
            className="w-full h-48 object-cover"
          />
          {anuncio.etiqueta && (
            <Badge className="absolute top-2 right-2 bg-primary/90 hover:bg-primary">
              {anuncio.etiqueta}
            </Badge>
          )}
        </div>
      ) : (
        <div className="w-full h-48 bg-muted flex items-center justify-center">
          <ImageOff className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2 line-clamp-1">
          {anuncio.titulo}
        </h2>
        <p className="text-muted-foreground mb-3 line-clamp-2">
          {anuncio.descripcion}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {anuncio.pais?.nombre || "No especificado"}
          </span>
          {anuncio.link && (
            <a
              href={anuncio.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Visitar →
            </a>
          )}
        </div>
        {anuncio.fechaInicio && anuncio.fechaFin ? (
          <div className="mt-5">
            <p>
              De {formatDateLocal(anuncio.fechaInicio!)} a{" "}
              {formatDateLocal(anuncio.fechaFin!)}
            </p>
          </div>
        ) : (
          <div className="mt-5">
            <p>No se ha establecido fecha para el anuncio</p>
          </div>
        )}
        <div className="mt-3">
          <Button onClick={() => handleEditAnuncio(anuncio)} className="w-full">
            Editar Anuncio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnunciosCard;
