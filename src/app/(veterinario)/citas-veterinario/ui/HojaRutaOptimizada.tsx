"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeftIcon,
  MapPinIcon,
  NavigationIcon,
  ClockIcon,
  CalendarIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { Cita } from "@/apis/citas/interfaces/response-citas-confirm.interface";
import { obtenerTiempoViajeGoogleMaps } from "@/apis/google-maps/accions/obtenerTiempoViajeGoogleMaps";
import GoogleMapViewer from "@/components/generics/GoogleMapViewer";

interface HojaRutaOptimizadaProps {
  citas: Cita[];
  onBack: () => void;
}

interface CitaConDistancia extends Cita {
  distancia?: number;
  tiempoViaje?: string;
}

const HojaRutaOptimizada: React.FC<HojaRutaOptimizadaProps> = ({
  citas,
  onBack,
}) => {
  const [ubicacionActual, setUbicacionActual] =
    useState<GeolocationPosition | null>(null);
  const [citasOrdenadas, setCitasOrdenadas] = useState<CitaConDistancia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: any): string => {
    if (!date) return "N/A";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (typeof date === "string") {
      const [year, month, day] = date.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);

      return dateObj.toLocaleDateString("es-ES", options);
    }

    if (date instanceof Date) {
      return date.toLocaleDateString("es-ES", options);
    }

    return "N/A";
  };

  useEffect(() => {
    const obtenerUbicacionYOrdenar = async () => {
      try {
        if (!navigator.geolocation) {
          setError("Geolocalización no soportada");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setUbicacionActual(position);

            try {
              const citasConDistancias = await Promise.all(
                citas.map(async (cita) => {
                  if (!cita.finca.latitud || !cita.finca.longitud) {
                    return { ...cita, distancia: Infinity };
                  }

                  const resultado = await obtenerTiempoViajeGoogleMaps(
                    position.coords.latitude,
                    position.coords.longitude,
                    cita.finca.latitud,
                    cita.finca.longitud,
                  );

                  return {
                    ...cita,
                    distancia: resultado?.distanciaMetros
                      ? resultado.distanciaMetros / 1000
                      : Infinity,
                    tiempoViaje: resultado?.tiempoTexto || "No calculado",
                  };
                }),
              );

              const ordenadas = [...citasConDistancias].sort(
                (a, b) => (a.distancia || Infinity) - (b.distancia || Infinity),
              );
              setCitasOrdenadas(ordenadas);
            } catch (err) {
              setError("Error al calcular distancias");
            } finally {
              setLoading(false);
            }
          },
          (error) => {
            setError("Permiso de ubicación denegado");
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } catch (err) {
        setError("Error al obtener la ubicación");
        setLoading(false);
      }
    };

    obtenerUbicacionYOrdenar();
  }, [citas]);

  const generarUrlRutaCompleta = () => {
    const coordenadasValidas = citasOrdenadas
      .filter((cita) => cita.finca.latitud && cita.finca.longitud)
      .map((cita) => `${cita.finca.latitud},${cita.finca.longitud}`);

    if (coordenadasValidas.length === 0) return "";

    if (coordenadasValidas.length === 1) {
      return `https://www.google.com/maps/dir/?api=1&destination=${coordenadasValidas[0]}`;
    }

    const destino = coordenadasValidas[0];
    const waypoints = coordenadasValidas.slice(1).join("|");

    return `https://www.google.com/maps/dir/?api=1&destination=${destino}&waypoints=${waypoints}`;
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background/80 backdrop-blur-sm">
        <Card className="w-full max-w-sm mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
            <p className="font-medium text-lg">Calculando ruta optimizada...</p>
            <p className="text-sm text-muted-foreground">
              Estamos calculando la mejor ruta para tus citas
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <MapPinIcon className="h-12 w-12 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Error de ubicación</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={onBack} variant="outline">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const citasConUbicacion = citasOrdenadas.filter(
    (cita) => cita.finca.latitud && cita.finca.longitud,
  );

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Ruta Optimizada
          </h1>
          <p className="text-sm text-muted-foreground">
            {citasOrdenadas.length} citas ordenadas por distancia
          </p>
        </div>
      </div>

      {citasConUbicacion.length > 0 && (
        <Card className="w-full">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">
                  Vista General de la Ruta
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = generarUrlRutaCompleta();
                    if (url) {
                      window.open(url, "_blank");
                    }
                  }}
                  disabled={!generarUrlRutaCompleta()}
                >
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  Abrir Ruta en Maps
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {citasConUbicacion.length} ubicaciones en la ruta optimizada
              </p>
            </div>

            <div className="p-4">
              <GoogleMapViewer
                latitud={citasConUbicacion[0].finca.latitud!}
                longitud={citasConUbicacion[0].finca.longitud!}
                titulo="Primera parada de la ruta"
                direccion={citasConUbicacion[0].finca.ubicacion}
                height="h-64"
                showDirectionsButton={false}
                className="w-full rounded-lg border"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {citasOrdenadas.map((cita, index) => (
            <Card key={cita.id} className="w-full">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-base leading-none">
                        {cita.finca.nombre_finca}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {cita.subServicio.nombre}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(cita.fecha)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{cita.horaInicio.substring(0, 5)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <NavigationIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">
                          {cita.distancia !== Infinity && cita.distancia
                            ? `${cita.distancia.toFixed(1)} km`
                            : "Distancia no disponible"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {cita.tiempoViaje}
                        </span>
                      </div>
                    </div>

                    {cita.finca.latitud && cita.finca.longitud && (
                      <div className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Ubicación específica
                          </span>
                        </div>
                        <GoogleMapViewer
                          latitud={cita.finca.latitud}
                          longitud={cita.finca.longitud}
                          titulo={`Parada ${index + 1}: ${cita.finca.nombre_finca}`}
                          direccion={cita.finca.ubicacion}
                          height="h-48"
                          showDirectionsButton={true}
                          className="w-full rounded-lg border"
                        />

                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Coordenadas:</span>
                            <p>
                              Lat:{" "}
                              {parseFloat(
                                cita.finca.latitud.toString(),
                              ).toFixed(6)}
                            </p>
                            <p>
                              Lng:{" "}
                              {parseFloat(
                                cita.finca.longitud.toString(),
                              ).toFixed(6)}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Orden en ruta:</span>
                            <p className="font-semibold">#{index + 1}</p>
                            {cita.distancia && cita.distancia !== Infinity && (
                              <p>
                                {cita.distancia.toFixed(1)} km desde tu
                                ubicación
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {citasOrdenadas.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-16">
            <div className="text-center space-y-4">
              <MapPinIcon className="h-12 w-12 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  No hay citas para mostrar
                </h3>
                <p className="text-sm text-muted-foreground">
                  No se encontraron citas con ubicación válida para calcular la
                  ruta
                </p>
              </div>
              <Button onClick={onBack} variant="outline">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Volver a la lista
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>

      {citasOrdenadas.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <NavigationIcon className="h-4 w-4 text-primary" />
                <span>Ruta optimizada calculada</span>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  Total: {citasOrdenadas.length} citas
                </p>
                <p className="text-muted-foreground">
                  {citasConUbicacion.length} con ubicación válida
                </p>
              </div>
            </div>

            {citasConUbicacion.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Button
                  onClick={() => {
                    const url = generarUrlRutaCompleta();
                    if (url) {
                      window.open(url, "_blank");
                    }
                  }}
                  className="w-full"
                  size="sm"
                >
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  Abrir Ruta Completa en Google Maps
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HojaRutaOptimizada;
