import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, Loader2, Crosshair } from "lucide-react";
import { toast } from "react-toastify";

declare global {
  interface Window {
    google: any;
    googleMapsLoaded?: boolean;
  }
}

interface GoogleAddressInputProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  initialLat?: number | null;
  initialLng?: number | null;
}

const MapComponent = ({
  onLocationSelect,
  initialLocation,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation: { lat: number; lng: number };
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: initialLocation,
      zoom: 15,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    markerRef.current = new window.google.maps.Marker({
      position: initialLocation,
      map: mapInstanceRef.current,
      draggable: true,
      title: "Ubicación de la sucursal",
    });

    const dragEndListener = markerRef.current.addListener("dragend", () => {
      const position = markerRef.current?.getPosition();
      if (position) {
        onLocationSelect(position.lat(), position.lng());
      }
    });

    const clickListener = mapInstanceRef.current.addListener(
      "click",
      (event: any) => {
        if (event.latLng && markerRef.current) {
          markerRef.current.setPosition(event.latLng);
          onLocationSelect(event.latLng.lat(), event.latLng.lng());
        }
      },
    );

    return () => {
      if (dragEndListener) {
        window.google.maps.event.removeListener(dragEndListener);
      }
      if (clickListener) {
        window.google.maps.event.removeListener(clickListener);
      }
    };
  }, [onLocationSelect, initialLocation]);

  return <div ref={mapRef} className="w-full h-64 rounded-lg" />;
};

const GoogleMapsWrapper = ({
  onLocationSelect,
  initialLocation,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation: { lat: number; lng: number };
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      toast.error("Google Maps API key no encontrada");
      setLoadError(true);
      return;
    }

    if (window.google) {
      setMapLoaded(true);
      return;
    }

    if (scriptLoadedRef.current) {
      return;
    }

    scriptLoadedRef.current = true;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setMapLoaded(true);
    };

    script.onerror = () => {
      setLoadError(true);
      scriptLoadedRef.current = false;
    };

    document.head.appendChild(script);
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
        <MapPin className="h-12 w-12 text-gray-400 mb-2" />
        <span className="text-gray-600 text-center">
          Error al cargar el mapa. <br />
          Verifica tu conexión a internet.
        </span>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando mapa...</span>
      </div>
    );
  }

  return (
    <MapComponent
      onLocationSelect={onLocationSelect}
      initialLocation={initialLocation}
    />
  );
};

export const GoogleAddressInput = ({
  value,
  onChange,
  onCoordinatesChange,
  placeholder = "Ingresa una dirección",
  label = "Dirección",
  required = false,
  error,
  disabled = false,
  initialLat = null,
  initialLng = null,
}: GoogleAddressInputProps) => {
  const defaultLat = 14.0818;
  const defaultLng = -87.2068;

  const [address, setAddress] = useState(value || "");
  const [latitude, setLatitude] = useState<string>(() => {
    if (initialLat && !isNaN(initialLat)) return initialLat.toString();
    return defaultLat.toString();
  });
  const [longitude, setLongitude] = useState<string>(() => {
    if (initialLng && !isNaN(initialLng)) return initialLng.toString();
    return defaultLng.toString();
  });
  const [buscandoDireccion, setBuscandoDireccion] = useState(false);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setAddress(value || "");
  }, [value]);

  useEffect(() => {
    if (initialLat && initialLng && !isNaN(initialLat) && !isNaN(initialLng)) {
      const newLat = initialLat.toString();
      const newLng = initialLng.toString();
      setLatitude(newLat);
      setLongitude(newLng);
    }
  }, [initialLat, initialLng]);

  const handlePlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();

    if (place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const newLat = lat.toString();
      const newLng = lng.toString();
      const newAddress = place.formatted_address || place.name || "";

      setLatitude(newLat);
      setLongitude(newLng);
      setAddress(newAddress);
      onChange(newAddress, lat, lng);

      if (onCoordinatesChange) {
        onCoordinatesChange(lat, lng);
      }

      setShowMap(true);
    }
  }, [onChange, onCoordinatesChange]);

  useEffect(() => {
    if (!window.google || disabled) return;
    if (!inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        fields: ["address_components", "geometry", "formatted_address", "name"],
      },
    );

    autocompleteRef.current.addListener("place_changed", handlePlaceChanged);

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current,
        );
      }
    };
  }, [disabled, handlePlaceChanged]);

  const buscarDireccion = useCallback(async () => {
    if (!address.trim() || !window.google) return;

    setBuscandoDireccion(true);
    try {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode(
        { address: address },
        (results: any[], status: string) => {
          setBuscandoDireccion(false);

          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            const newLat = lat.toString();
            const newLng = lng.toString();
            const newAddress = results[0].formatted_address;

            setLatitude(newLat);
            setLongitude(newLng);
            setAddress(newAddress);
            onChange(newAddress, lat, lng);

            if (onCoordinatesChange) {
              onCoordinatesChange(lat, lng);
            }

            setShowMap(true);
          } else {
            toast.warning(
              "No se pudo encontrar la dirección. Intenta con una descripción más específica.",
            );
          }
        },
      );
    } catch (error) {
      setBuscandoDireccion(false);
      toast.error("Error al buscar dirección");
    }
  }, [address, onChange, onCoordinatesChange]);

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setLatitude(lat.toString());
      setLongitude(lng.toString());

      if (window.google) {
        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(lat, lng);

        geocoder.geocode(
          { location: latLng },
          (results: any[], status: string) => {
            if (status === "OK" && results && results[0]) {
              const formattedAddress = results[0].formatted_address;
              setAddress(formattedAddress);
              onChange(formattedAddress, lat, lng);
            } else {
              onChange(address, lat, lng);
            }
          },
        );
      }

      if (onCoordinatesChange) {
        onCoordinatesChange(lat, lng);
      }
    },
    [address, onChange, onCoordinatesChange],
  );

  const obtenerUbicacionActual = useCallback(() => {
    if (!navigator.geolocation) {
      toast.warn("La geolocalización no es compatible con este navegador");
      return;
    }

    setCargandoUbicacion(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat.toString());
        setLongitude(lng.toString());

        if (window.google) {
          const geocoder = new window.google.maps.Geocoder();
          const latLng = new window.google.maps.LatLng(lat, lng);

          geocoder.geocode(
            { location: latLng },
            (results: any[], status: string) => {
              setCargandoUbicacion(false);
              if (status === "OK" && results && results[0]) {
                const formattedAddress = results[0].formatted_address;
                setAddress(formattedAddress);
                onChange(formattedAddress, lat, lng);
              } else {
                onChange("", lat, lng);
              }
            },
          );
        } else {
          setCargandoUbicacion(false);
          onChange("", lat, lng);
        }

        setShowMap(true);

        if (onCoordinatesChange) {
          onCoordinatesChange(lat, lng);
        }
      },
      (error) => {
        setCargandoUbicacion(false);
        toast.warning("Error al obtener la ubicación: " + error.message);
      },
    );
  }, [onChange, onCoordinatesChange]);

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAddress = e.target.value;
      setAddress(newAddress);
      onChange(newAddress);
    },
    [onChange],
  );

  const handleLatitudeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newLat = e.target.value;
      setLatitude(newLat);
      const latNum = parseFloat(newLat);
      const lngNum = parseFloat(longitude);
      if (!isNaN(latNum) && !isNaN(lngNum) && onCoordinatesChange) {
        onCoordinatesChange(latNum, lngNum);
      }
    },
    [longitude, onCoordinatesChange],
  );

  const handleLongitudeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newLng = e.target.value;
      setLongitude(newLng);
      const latNum = parseFloat(latitude);
      const lngNum = parseFloat(newLng);
      if (!isNaN(latNum) && !isNaN(lngNum) && onCoordinatesChange) {
        onCoordinatesChange(latNum, lngNum);
      }
    },
    [latitude, onCoordinatesChange],
  );

  const validLat = !isNaN(parseFloat(latitude))
    ? parseFloat(latitude)
    : defaultLat;
  const validLng = !isNaN(parseFloat(longitude))
    ? parseFloat(longitude)
    : defaultLng;

  const initialLocation = {
    lat: validLat,
    lng: validLng,
  };

  return (
    <div className="space-y-3">
      {label && (
        <Label className="font-bold">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="flex gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder={placeholder}
          disabled={disabled}
          className={error ? "border-red-500 flex-1" : "flex-1"}
          onKeyPress={(e) => e.key === "Enter" && buscarDireccion()}
        />
        <Button
          type="button"
          onClick={buscarDireccion}
          disabled={buscandoDireccion || !address.trim()}
          size="sm"
        >
          {buscandoDireccion ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={obtenerUbicacionActual}
          title={cargandoUbicacion ? "Cargando..." : "Usar Ubicacion Actual"}
          disabled={cargandoUbicacion}
          size="sm"
        >
          {cargandoUbicacion ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4" />
          )}
        </Button>
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowMap(!showMap)}
          className="text-xs"
        >
          {showMap ? "Ocultar mapa" : "Mostrar mapa para seleccionar ubicación"}
        </Button>
      </div>

      {showMap && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <Label>Selecciona la ubicación en el mapa</Label>
              <GoogleMapsWrapper
                onLocationSelect={handleLocationSelect}
                initialLocation={initialLocation}
              />
              <p className="text-xs text-gray-600">
                Haz click en el mapa o arrastra el marcador para seleccionar la
                ubicación exacta
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Latitud</Label>
                <Input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={handleLatitudeChange}
                  placeholder="Latitud"
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Longitud</Label>
                <Input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={handleLongitudeChange}
                  placeholder="Longitud"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <MapPin className="h-4 w-4" />
                <span className="text-xs">
                  Coordenadas registradas: {validLat.toFixed(6)},{" "}
                  {validLng.toFixed(6)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-gray-500">
        💡 Sugerencia: Comienza a escribir y selecciona una dirección de las
        sugerencias, o usa el mapa para seleccionar la ubicación exacta
      </p>
    </div>
  );
};
