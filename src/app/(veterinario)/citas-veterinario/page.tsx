"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapIcon, RefreshCwIcon, AlertCircleIcon } from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { ActualizarCita } from "@/apis/citas/accions/update-cita";
import { toast } from "react-toastify";
import { EstadoCita } from "@/helpers/data/estadosCita";
import { MessageError } from "@/components/generics/MessageError";
import { ScrollArea } from "@/components/ui/scroll-area";
import HojaRutaOptimizada from "./ui/HojaRutaOptimizada";
import CardCitasMedico from "@/components/generics/CardCitasMedicos";
import useGetCitasPendientesByMedico from "@/hooks/citas/useGetCitasPendientesByMedico";
import ModalMotivoCancelacion from "@/components/generics/ModalMotivoCancelacion";

const CitasPendientesVeterinario = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = user?.id || "";
  const limit = 10;
  const [mostrarHojaRuta, setMostrarHojaRuta] = useState(false);

  const [citaCancelar, setCitaCancelar] = useState<{
    id: string;
    codigo: string;
  } | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");

  const {
    data: citas,
    isLoading,
    refetch,
    fetchNextPage,
    isError,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCitasPendientesByMedico(userId, limit);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const updateCitaMutation = useMutation({
    mutationFn: ({
      id,
      estado,
      motivoCancelacion,
    }: {
      id: string;
      estado: string;
      motivoCancelacion?: string;
    }) => ActualizarCita(id, { estado, motivoCancelacion }),
    onSuccess: async () => {
      toast.success("Cita actualizada exitosamente");

      const allCitas = citas?.pages.flatMap((page) => page.citas) || [];

      if (allCitas.length === 1) {
        queryClient.setQueryData(
          ["citas-pendientes-medico", userId, limit],
          () => ({
            pages: [],
            pageParams: [],
          }),
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["citas-pendientes-medico", userId, limit],
      });
      await refetch();

      setCitaCancelar(null);
      setMotivoCancelacion("");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar la cita";

        toast.error(errorMessage);
      } else {
        toast.error("Contacte al administrador");
      }
    },
  });

  const handleConfirmCita = (id: string) => {
    updateCitaMutation.mutate({ id, estado: EstadoCita.CONFIRMADA });
  };

  const handleOpenCancelModal = (id: string, codigo: string) => {
    setCitaCancelar({ id, codigo });
  };

  const handleConfirmCancel = (motivo: string) => {
    if (citaCancelar) {
      updateCitaMutation.mutate({
        id: citaCancelar.id,
        estado: EstadoCita.CANCELADA,
        motivoCancelacion: motivo,
      });
    }
  };

  const handleCloseCancelModal = () => {
    setCitaCancelar(null);
    setMotivoCancelacion("");
  };

  if (isLoading || updateCitaMutation.isPending) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Cargando citas...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <MessageError
          titulo="No se encontraron citas"
          descripcion="No se encontraron citas para este modulo en este momento."
          onPress={() => onRefresh()}
        />
      </div>
    );
  }

  const allCitas = citas?.pages.flatMap((page) => page.citas) || [];

  if (mostrarHojaRuta) {
    return (
      <HojaRutaOptimizada
        citas={allCitas}
        onBack={() => setMostrarHojaRuta(false)}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
      <ModalMotivoCancelacion
        isOpen={!!citaCancelar}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        isLoading={updateCitaMutation.isPending}
        citaCodigo={citaCancelar?.codigo}
      />

      {allCitas && allCitas.length > 0 && (
        <Button
          className="mb-4 md:mb-6 lg:mx-auto lg:max-w-2xl w-full"
          onClick={() => setMostrarHojaRuta(true)}
        >
          <MapIcon className="h-4 w-4 mr-2" />
          Ver Ruta Optimizada
        </Button>
      )}

      <ScrollArea className="flex-1">
        <div className="space-y-4 lg:mx-auto lg:max-w-2xl">
          {allCitas.map((item) => (
            <Card key={item.id} className="w-full">
              <CardContent className="p-0">
                <CardCitasMedico
                  item={item}
                  onConfirm={() => handleConfirmCita(item.id)}
                  onCancel={() => handleOpenCancelModal(item.id, item.codigo)}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {isFetchingNextPage && (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {allCitas.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-16">
            <div className="text-center space-y-4">
              <AlertCircleIcon className="h-12 w-12 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  No se encontraron citas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Desliza hacia abajo para recargar
                </p>
              </div>
              <Button variant="outline" onClick={onRefresh}>
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Recargar
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CitasPendientesVeterinario;
