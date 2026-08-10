import { CrearCompraInsumo } from "@/apis/compras_insumos/accions/crear-compra-insumo";
import { InsumoCompra } from "@/apis/compras_insumos/interfaces/insumos_compra.interface";
import DetailsCompra from "@/components/generics/DetailsCompra";
import ResumenCompra from "@/components/generics/ResumenCompra";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tiposPagos } from "@/helpers/data/tiposPagos";
import useGetTaxesPais from "@/hooks/impuestos/useGetTaxesPais";
import useGetInsumosDisponibles from "@/hooks/insumos/useGetInsumosDisponibles";
import useGetProveedoresActivos from "@/hooks/proveedores/useGetProveedoresActivos";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DetailsConfirmCompraInsumos from "./DetailsConfirmCompraInsumos";
import { ObtenerDescuentoProveedorAndInsumo } from "@/apis/descuentos-insumos/accions/descuentos-proveedor-insumo";
import { ObtenerEscalasProveedorAndInsumo } from "@/apis/escalas-insumos/accions/escalas-proveedor-insumo";

interface FormCompra {
  sucursalId: string;
  proveedorId: string;
  tipoPago: string;
  numero_factura: string;
  insumos: InsumoCompra[];
}

interface Props {
  onSuccess: () => void;
}

const FormCompraInsumos = ({ onSuccess }: Props) => {
  const { user } = useAuthStore();
  const [isConfirmCompra, setIsConfirmCompra] = useState(false);
  const [compraDataToSubmit, setCompraDataToSubmit] = useState<any>(null);
  const paisId = user?.pais.id || "";
  const sucursalId = user?.sucursal.id || "";
  const queryClient = useQueryClient();

  const crearCompraMutation = useMutation({
    mutationFn: CrearCompraInsumo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras-insumos-admin"] });
      queryClient.invalidateQueries({ queryKey: ["existencia-insumos"] });
      toast.success("Compra creada exitosamente");
      onSuccess();
      reset();
      setIsConfirmCompra(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al ejecutar la compra";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de ejecutar la compra. Inténtalo de nuevo.",
        );
      }
      setIsConfirmCompra(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormCompra>({
    defaultValues: {
      insumos: [
        {
          insumoId: "",
          cantidad: 0,
          bonificacion: 0,
          costoUnitario: 0,
          descuento: 0,
          impuesto: 0,
        },
      ],
      proveedorId: "",
      tipoPago: "",
      numero_factura: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "insumos",
  });

  const { data: proveedores } = useGetProveedoresActivos();
  const { data: insumosData } = useGetInsumosDisponibles();
  const { data: impuestos } = useGetTaxesPais();
  const insumos = insumosData?.insumos || [];

  const insumosWatch = watch("insumos");
  const proveedorId = watch("proveedorId");
  const tipoPago = watch("tipoPago");
  const numero_factura = watch("numero_factura");

  const descuentosQueries = useQueries({
    queries: insumosWatch.map((insumo) => ({
      queryKey: ["descuento-proveedor-insumo", proveedorId, insumo.insumoId],
      queryFn: () =>
        ObtenerDescuentoProveedorAndInsumo(proveedorId, insumo.insumoId),
      enabled: !!proveedorId && !!insumo.insumoId,
    })),
  });

  const escalasQueries = useQueries({
    queries: insumosWatch.map((insumo) => ({
      queryKey: ["escalas-proveedor-insumo", proveedorId, insumo.insumoId],
      queryFn: () =>
        ObtenerEscalasProveedorAndInsumo(proveedorId, insumo.insumoId),
      enabled: !!proveedorId && !!insumo.insumoId,
    })),
  });

  const handleProveedorChange = (value: string) => {
    setValue("proveedorId", value);
    const proveedorSeleccionado = proveedores?.find((p) => p.id === value);

    if (proveedorSeleccionado && proveedorSeleccionado.tipo_pago_default) {
      const tipoPagoFromAPI = proveedorSeleccionado.tipo_pago_default
        .toUpperCase()
        .trim();

      const tipoPagoMatch = tiposPagos.find(
        (tipo) => tipo.value.toUpperCase() === tipoPagoFromAPI,
      );

      if (tipoPagoMatch) {
        setValue("tipoPago", tipoPagoMatch.value);
      } else {
        toast.warning(
          `Tipo de pago "${proveedorSeleccionado.tipo_pago_default}" no coincide con los valores disponibles`,
        );
        setValue("tipoPago", "");
      }
    } else {
      setValue("tipoPago", "");
    }
  };

  const getTipoPagoLabel = (value: string) => {
    const tipo = tiposPagos.find((t) => t.value === value);
    return tipo ? tipo.label : "";
  };

  useEffect(() => {}, [tipoPago]);

  const isFormValid = () => {
    if (!proveedorId || !tipoPago || !sucursalId || !numero_factura)
      return false;

    return insumosWatch.every(
      (insumo) =>
        insumo.insumoId && insumo.cantidad > 0 && insumo.costoUnitario > 0,
    );
  };

  const getInsumosDisponibles = (currentIndex: number) => {
    return insumos.filter((insumo) => {
      if (insumosWatch?.[currentIndex]?.insumoId === insumo.id) {
        return true;
      }
      const estaSeleccionado = insumosWatch?.some(
        (p, index) => index !== currentIndex && p.insumoId === insumo.id,
      );
      return !estaSeleccionado;
    });
  };

  const calcularTotales = () => {
    let subtotal = 0;
    let totalImpuestos = 0;
    let totalDescuentos = 0;
    let total = 0;

    insumosWatch?.forEach((insumo) => {
      const cantidadTotal = insumo.cantidad;
      const subtotalInsumo = cantidadTotal * (insumo.costoUnitario || 0);
      const descuentoInsumo = subtotalInsumo * ((insumo.descuento || 0) / 100);
      const subtotalConDescuento = subtotalInsumo - descuentoInsumo;
      const impuestoProducto =
        subtotalConDescuento * ((insumo.impuesto || 0) / 100);

      subtotal += subtotalInsumo;
      totalDescuentos += descuentoInsumo;
      totalImpuestos += impuestoProducto;
      total += subtotalConDescuento + impuestoProducto;
    });

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalImpuestos: parseFloat(totalImpuestos.toFixed(2)),
      totalDescuentos: parseFloat(totalDescuentos.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  };

  const { subtotal, totalImpuestos, totalDescuentos, total } =
    calcularTotales();

  const prepareCompraData = (data: FormCompra) => {
    const detalles = data.insumos.map((insumo) => {
      const subtotalInsumo = insumo.cantidad * insumo.costoUnitario;
      const descuentoInsumo = subtotalInsumo * (insumo.descuento / 100);
      const subtotalConDescuento = subtotalInsumo - descuentoInsumo;
      const impuestoInsumo = subtotalConDescuento * (insumo.impuesto / 100);

      return {
        insumoId: insumo.insumoId,
        costo_por_unidad: insumo.costoUnitario,
        cantidad: insumo.cantidad,
        bonificacion: insumo.bonificacion || 0,
        descuentos: parseFloat(descuentoInsumo.toFixed(2)),
        porcentaje_impuesto: insumo.impuesto || 0,
        impuestos: parseFloat(impuestoInsumo.toFixed(2)),
        cantidad_total: insumo.cantidad + (insumo.bonificacion || 0),
        monto_total: parseFloat(
          (subtotalConDescuento + impuestoInsumo).toFixed(2),
        ),
      };
    });

    return {
      proveedorId: data.proveedorId,
      sucursalId: sucursalId,
      numero_factura: data.numero_factura,
      paisId: paisId,
      tipo_pago: data.tipoPago.toUpperCase(),
      subtotal: subtotal,
      descuentos: totalDescuentos,
      impuestos: totalImpuestos,
      total: total,
      detalles: detalles,
    };
  };

  const onSubmit = (data: FormCompra) => {
    if (!isFormValid()) {
      toast.error("Por favor, complete todos los campos requeridos");
      return;
    }

    const compraData = prepareCompraData(data);
    setCompraDataToSubmit(compraData);

    setIsConfirmCompra(true);
  };

  const confirmCompra = () => {
    if (compraDataToSubmit) {
      crearCompraMutation.mutate(compraDataToSubmit);
    }
  };

  const handleInsumoChange = (index: number, insumoId: string) => {
    setValue(`insumos.${index}.insumoId`, insumoId);

    const insumoSeleccionado = insumos.find((p) => p.id === insumoId);
    if (insumoSeleccionado) {
      setValue(`insumos.${index}.costoUnitario`, 0);
      setValue(`insumos.${index}.cantidad`, 1);
    } else {
      setValue(`insumos.${index}.costoUnitario`, 0);
      setValue(`insumos.${index}.impuesto`, 0);
      setValue(`insumos.${index}.cantidad`, 0);
    }
  };

  const handleImpuestoChange = (index: number, value: string) => {
    setValue(`insumos.${index}.impuesto`, Number(value));
  };

  const proveedorSeleccionado = proveedores?.find((p) => p.id === proveedorId);
  const tipoPagoSeleccionado = tiposPagos?.find((t) => t.value === tipoPago);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <Label className="font-bold">Proveedor*</Label>
            <Select value={proveedorId} onValueChange={handleProveedorChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Proveedor</SelectLabel>
                  {proveedores?.map((prov) => (
                    <SelectItem value={prov.id} key={prov.id}>
                      {prov.nombre_legal} - {prov.nit_rtn}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.proveedorId && (
              <p className="text-sm text-red-500">
                {errors.proveedorId.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="font-bold">Número de Factura*</Label>
            <Input
              type="text"
              placeholder="Ej: FAC-00123"
              {...register("numero_factura", {
                required: "El número de factura es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
              })}
            />
            {errors.numero_factura && (
              <p className="text-sm text-red-500">
                {errors.numero_factura.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="font-bold">Tipo de Pago*</Label>
            <Input
              type="text"
              readOnly
              value={getTipoPagoLabel(tipoPago) || "Seleccione un proveedor"}
              className="bg-gray-100 cursor-not-allowed"
              {...register("tipoPago", {
                required: "El tipo de pago es obligatorio",
              })}
            />
            {errors.tipoPago && (
              <p className="text-sm text-red-500">{errors.tipoPago.message}</p>
            )}

            {proveedorSeleccionado?.tipo_pago_default && tipoPago && (
              <p className="text-sm text-green-600 mt-1">
                Tipo de pago por defecto del proveedor
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  Insumos de la Compra
                </h2>

                {proveedorSeleccionado && proveedorSeleccionado.tipo_escala && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-700">
                      Proveedor trabaja por{" "}
                      <span className="font-bold uppercase">
                        {proveedorSeleccionado.tipo_escala}
                      </span>{" "}
                      de insumos
                    </span>
                  </div>
                )}

                {proveedorSeleccionado &&
                  proveedorSeleccionado?.tipo_pago_default === "CREDITO" && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">
                        Plazo de pago:{" "}
                        <span className="font-bold">
                          {proveedorSeleccionado.plazo || 30}
                        </span>{" "}
                        días
                      </span>
                    </div>
                  )}
              </div>

              <Button
                type="button"
                onClick={() =>
                  append({
                    insumoId: "",
                    cantidad: 0,
                    bonificacion: 0,
                    costoUnitario: 0,
                    descuento: 0,
                    impuesto: 0,
                    paisId: "",
                  })
                }
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Plus size={18} />
                Agregar Insumo
              </Button>
            </div>
          </div>

          {fields.map((field, index) => {
            const descuentos = descuentosQueries[index]?.data;
            const escalas = escalasQueries[index]?.data;
            const insumosSeleccionado = insumos.find(
              (p) => p.id === insumosWatch?.[index]?.insumoId,
            );

            const cantidadPagada = insumosWatch?.[index]?.cantidad || 0;
            const bonificacion = insumosWatch?.[index]?.bonificacion || 0;

            const subtotalProducto =
              cantidadPagada * (insumosWatch?.[index]?.costoUnitario || 0);
            const descuentoProducto =
              subtotalProducto *
              ((insumosWatch?.[index]?.descuento || 0) / 100);
            const subtotalConDescuento = subtotalProducto - descuentoProducto;
            const impuestoProducto =
              subtotalConDescuento *
              ((insumosWatch?.[index]?.impuesto || 0) / 100);
            const totalProducto = subtotalConDescuento + impuestoProducto;

            const insumosDisponibles = getInsumosDisponibles(index);

            return (
              <div key={field.id} className="p-4 border rounded-lg space-y-4">
                {proveedorSeleccionado?.tipo_escala === "ESCALA" && (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="space-y-1">
                      <Label>Insumo*</Label>
                      <Select
                        value={insumosWatch?.[index]?.insumoId || ""}
                        onValueChange={(value) =>
                          handleInsumoChange(index, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Insumos</SelectLabel>
                            {insumosDisponibles.map((ins) => (
                              <SelectItem value={ins.id} key={ins.id}>
                                {ins.nombre} - {ins.codigo}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.insumos?.[index]?.insumoId && (
                        <p className="text-sm text-red-500">
                          {errors.insumos[index]?.insumoId?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label>Cantidad*</Label>
                      <Select
                        value={
                          insumosWatch?.[index]?.cantidad?.toString() || ""
                        }
                        onValueChange={(value) => {
                          const cantidad = Number(value);
                          const escala = escalas?.find(
                            (d) => d.cantidad_comprada === cantidad,
                          );

                          setValue(`insumos.${index}.cantidad`, cantidad);

                          setValue(
                            `insumos.${index}.bonificacion`,
                            escala?.bonificacion ?? 0,
                          );
                          setValue(
                            `insumos.${index}.costoUnitario`,
                            escala?.costo ?? 0,
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar Cantidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Cantidad</SelectLabel>
                            {escalas && escalas.length > 0 ? (
                              escalas?.map((escala) => (
                                <SelectItem
                                  value={escala.cantidad_comprada.toString()}
                                  key={escala.id}
                                >
                                  {escala.cantidad_comprada} →{" "}
                                  {escala.bonificacion} Bonus
                                </SelectItem>
                              ))
                            ) : (
                              <p>No se encontraron cantidades</p>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.insumos?.[index]?.cantidad && (
                        <p className="text-sm text-red-500">
                          {errors.insumos[index]?.cantidad?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label>Bonificación</Label>
                      <Input
                        type="number"
                        min="0"
                        {...register(`insumos.${index}.bonificacion` as const, {
                          valueAsNumber: true,
                          min: { value: 0, message: "Mínimo 0" },
                        })}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Costo Unitario</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register(
                          `insumos.${index}.costoUnitario` as const,
                          {
                            valueAsNumber: true,
                            min: { value: 0, message: "Mínimo 0" },
                          },
                        )}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Descuento %</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        {...register(`insumos.${index}.descuento` as const, {
                          valueAsNumber: true,
                          min: { value: 0, message: "Mínimo 0%" },
                          max: { value: 100, message: "Máximo 100%" },
                        })}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Impuesto %</Label>
                      <Select
                        value={insumosWatch?.[index]?.impuesto?.toString()}
                        onValueChange={(value) =>
                          handleImpuestoChange(index, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Impuesto</SelectLabel>
                            {impuestos?.map((imp) => (
                              <SelectItem
                                value={String(parseFloat(imp.porcentaje))}
                                key={imp.id}
                              >
                                {imp.nombre} - {parseFloat(imp.porcentaje)}%
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {proveedorSeleccionado?.tipo_escala === "DESCUENTO" && (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="space-y-1">
                      <Label>Insumo*</Label>
                      <Select
                        value={insumosWatch?.[index]?.insumoId || ""}
                        onValueChange={(value) =>
                          handleInsumoChange(index, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Insumos</SelectLabel>
                            {insumosDisponibles.map((ins) => (
                              <SelectItem value={ins.id} key={ins.id}>
                                {ins.nombre} - {ins.codigo}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.insumos?.[index]?.insumoId && (
                        <p className="text-sm text-red-500">
                          {errors.insumos[index]?.insumoId?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label>Cantidad*</Label>
                      <Select
                        value={
                          insumosWatch?.[index]?.cantidad?.toString() || ""
                        }
                        onValueChange={(value) => {
                          const cantidad = Number(value);
                          const descuento = descuentos?.find(
                            (d) => d.cantidad_comprada === cantidad,
                          );

                          setValue(`insumos.${index}.cantidad`, cantidad);

                          setValue(
                            `insumos.${index}.descuento`,
                            descuento?.descuentos ?? 0,
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar Cantidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Cantidad</SelectLabel>
                            {descuentos && descuentos.length > 0 ? (
                              descuentos?.map((desc) => (
                                <SelectItem
                                  value={desc.cantidad_comprada.toString()}
                                  key={desc.id}
                                >
                                  {desc.cantidad_comprada} → {desc.descuentos}%
                                </SelectItem>
                              ))
                            ) : (
                              <p>No se encontraron cantidades</p>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.insumos?.[index]?.cantidad && (
                        <p className="text-sm text-red-500">
                          {errors.insumos[index]?.cantidad?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label>Bonificación</Label>
                      <Input
                        type="number"
                        min="0"
                        {...register(`insumos.${index}.bonificacion` as const, {
                          valueAsNumber: true,
                          min: { value: 0, message: "Mínimo 0" },
                        })}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Costo Unitario</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register(
                          `insumos.${index}.costoUnitario` as const,
                          {
                            valueAsNumber: true,
                            min: { value: 0, message: "Mínimo 0" },
                          },
                        )}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Descuento %</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        {...register(`insumos.${index}.descuento` as const, {
                          valueAsNumber: true,
                          min: { value: 0, message: "Mínimo 0%" },
                          max: { value: 100, message: "Máximo 100%" },
                        })}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Impuesto %</Label>
                      <Select
                        value={insumosWatch?.[index]?.impuesto?.toString()}
                        onValueChange={(value) =>
                          handleImpuestoChange(index, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Impuesto</SelectLabel>
                            {impuestos?.map((imp) => (
                              <SelectItem
                                value={String(parseFloat(imp.porcentaje))}
                                key={imp.id}
                              >
                                {imp.nombre} - {parseFloat(imp.porcentaje)}%
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {insumosSeleccionado && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-blue-50 rounded-lg text-sm">
                    <div>
                      <span className="font-semibold">Código: </span>
                      {insumosSeleccionado.codigo}
                    </div>
                  </div>
                )}

                <ResumenCompra
                  user={user}
                  descuentoProducto={descuentoProducto}
                  bonificacion={bonificacion}
                  cantidadPagada={cantidadPagada}
                  impuestoProducto={impuestoProducto}
                  subtotalProducto={subtotalProducto}
                  totalProducto={totalProducto}
                />

                {fields.length > 1 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <DetailsCompra
          user={user}
          subtotal={subtotal}
          totalDescuentos={totalDescuentos}
          totalImpuestos={totalImpuestos}
          total={total}
        />

        <div className="flex justify-end pt-4 gap-4">
          <Button type="button" variant="outline" onClick={() => onSuccess()}>
            Cancelar
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid() || crearCompraMutation.isPending}
          >
            {crearCompraMutation.isPending
              ? "Procesando..."
              : "Ingresar Compra"}
          </Button>
        </div>
      </form>

      <AlertDialog open={isConfirmCompra} onOpenChange={setIsConfirmCompra}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">
              Confirmación de Compra
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <DetailsConfirmCompraInsumos
                proveedorSeleccionado={proveedorSeleccionado}
                tipoPagoSeleccionado={tipoPagoSeleccionado}
                insumosWatch={insumosWatch}
                insumos={insumos}
                user={user}
                subtotal={subtotal}
                totalDescuentos={totalDescuentos}
                totalImpuestos={totalImpuestos}
                total={total}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-between">
            <AlertDialogCancel
              onClick={() => setIsConfirmCompra(false)}
              disabled={crearCompraMutation.isPending}
            >
              Revisar Compra
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCompra}
              disabled={crearCompraMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {crearCompraMutation.isPending
                ? "Procesando..."
                : "Confirmar Compra"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FormCompraInsumos;
