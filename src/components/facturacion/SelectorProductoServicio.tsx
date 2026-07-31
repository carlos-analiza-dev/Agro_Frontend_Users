import React, { useState, useMemo, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  X,
  Filter,
  FolderClosed,
  FolderOpen,
  Tag,
  Pill,
  TicketSlash,
  DollarSign,
  Syringe,
} from "lucide-react";
import { PreciosPorPai } from "@/apis/productos/interfaces/response-productos.interface";
import { Categoria } from "@/apis/categorias/interface/response-categorias.interface";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SubCategoria } from "@/apis/subcategorias/interface/get-subcategorias.interface";
import { TipoProducto } from "@/apis/tipo-producto/interface/response-tipo-producto.interface";
import { TipoSubServicio } from "@/interfaces/enums/tipo-sub-servicios";

interface ProductoServicioUnificado {
  id: string;
  nombre: string;
  tipo: "producto" | "servicio";
  precio?: number;
  preciosPorPais: PreciosPorPai[];
  indicaciones?: string[];
  tipos_uso?: string[];
  componentes?: {
    nombre: string;
    cantidad?: string;
    unidad?: string;
  }[];
  cantidadMin?: number;
  cantidadMax?: number;
}

interface SelectorProductoServicioProps {
  onAgregar: (productoId: string) => void;
  productosYServicios: ProductoServicioUnificado[];
  productosSeleccionados: string[];
  disabled?: boolean;
  categorias: Categoria[] | undefined;
  subcategorias: SubCategoria[] | undefined;
  tipo_producto: TipoProducto[] | undefined;
  setCategoriaId: Dispatch<SetStateAction<string>>;
  setSubcategoriaId: Dispatch<SetStateAction<string>>;
  setTipoId: Dispatch<SetStateAction<string>>;
  categoriaId: string;
  subcategoriaId: string;
  tipoId: string;
  simbolo: string;
  setIndicaciones: Dispatch<SetStateAction<string>>;
  setTipo_uso: Dispatch<SetStateAction<string>>;
  tipo_uso: string;
  indicaciones: string;
  isEdit?: boolean;
  isLoading?: boolean;
}

const SelectorProductoServicio = ({
  onAgregar,
  productosYServicios,
  productosSeleccionados,
  disabled = false,
  categorias,
  subcategorias,
  tipo_producto,
  setCategoriaId,
  setSubcategoriaId,
  setTipoId,
  categoriaId,
  subcategoriaId,
  tipoId,
  simbolo,
  setIndicaciones,
  setTipo_uso,
  indicaciones,
  tipo_uso,
  isEdit,
  isLoading,
}: SelectorProductoServicioProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const opcionesFiltradas = useMemo(() => {
    let opciones = productosYServicios;

    if (searchTerm) {
      opciones = opciones.filter((item) =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return opciones;
  }, [productosYServicios, searchTerm]);

  const estaSeleccionado = (itemId: string) => {
    return productosSeleccionados.includes(itemId);
  };

  const handleAgregar = (item: ProductoServicioUnificado) => {
    onAgregar(item.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  const clearFilters = () => {
    setCategoriaId("");
    setSubcategoriaId("");
    setTipo_uso("");
    setIndicaciones("");
    setTipoId("");
  };

  return (
    <div className="relative mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h2 className="text-lg font-semibold text-gray-800">
            Filtros de Búsqueda
          </h2>
          {(categoriaId ||
            subcategoriaId ||
            tipoId ||
            indicaciones ||
            tipo_uso) && (
            <Badge variant="secondary" className="ml-2">
              Filtros activos
            </Badge>
          )}
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={clearFilters}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              clearFilters();
            }
          }}
          className="inline-flex cursor-pointer select-none items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
        >
          <Filter className="h-4 w-4" />
          Limpiar Filtros
        </div>
      </div>

      {!isEdit && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <span className="text-blue-500">
                  <FolderClosed size={15} />
                </span>{" "}
                Categoría
              </Label>
              <Select
                value={categoriaId}
                onValueChange={(value) => {
                  setCategoriaId(value);
                  setSubcategoriaId("");
                }}
              >
                <SelectTrigger className="bg-white border-gray-200 hover:border-blue-300 transition-colors">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categorias && categorias.length > 0 ? (
                      categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            {cat.nombre}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-gray-500 text-sm">
                        No hay categorías disponibles
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <span className="text-purple-500">
                  <FolderOpen size={15} />
                </span>{" "}
                Subcategoría
              </Label>
              <Select
                value={subcategoriaId}
                onValueChange={(value) => {
                  setSubcategoriaId(value);
                  setTipoId("");
                }}
                disabled={!categoriaId}
              >
                <SelectTrigger
                  className={`bg-white border-gray-200 hover:border-purple-300 transition-colors ${!categoriaId ? "opacity-50" : ""}`}
                >
                  <SelectValue
                    placeholder={
                      !categoriaId
                        ? "Seleccione categoría primero"
                        : "Todas las subcategorías"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {subcategorias && subcategorias.length > 0 ? (
                      subcategorias.map((subcat) => (
                        <SelectItem key={subcat.id} value={subcat.id}>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            {subcat.nombre}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-gray-500 text-sm">
                        {categoriaId
                          ? "No hay subcategorías"
                          : "Seleccione una categoría"}
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <span className="text-orange-500">
                  <Tag size={15} />
                </span>{" "}
                Tipo de Producto
              </Label>
              <Select
                value={tipoId}
                onValueChange={setTipoId}
                disabled={!subcategoriaId}
              >
                <SelectTrigger
                  className={`bg-white border-gray-200 hover:border-orange-300 transition-colors ${!subcategoriaId ? "opacity-50" : ""}`}
                >
                  <SelectValue
                    placeholder={
                      !subcategoriaId
                        ? "Seleccione subcategoría primero"
                        : "Todos los tipos"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {tipo_producto && tipo_producto.length > 0 ? (
                      tipo_producto.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id}>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            {tipo.nombre}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-gray-500 text-sm">
                        {subcategoriaId
                          ? "No hay tipos de producto"
                          : "Seleccione una subcategoría"}
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {!isEdit && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <span className="text-blue-600">
                  <Pill size={15} />
                </span>{" "}
                Indicaciones
              </Label>
              <Input
                type="text"
                placeholder="Ej: moco, cochilla, infecciones..."
                value={indicaciones}
                onChange={(e) => {
                  const valor = e.target.value.replace(
                    /[^a-zA-ZáéíóúÁÉÍÓÚñÑ,\s]/g,
                    "",
                  );
                  setIndicaciones(valor);
                }}
                className="bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
              />
              <p className="text-xs text-gray-500">
                Separa múltiples indicaciones con comas
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <span className="text-purple-600">
                  <TicketSlash size={15} />
                </span>{" "}
                Usos del Producto
              </Label>
              <Input
                type="text"
                placeholder="Ej: engorde, reproducción, lechero..."
                value={tipo_uso}
                onChange={(e) => {
                  const valor = e.target.value.replace(
                    /[^a-zA-ZáéíóúÁÉÍÓÚñÑ,\s]/g,
                    "",
                  );
                  setTipo_uso(valor);
                }}
                className="bg-white border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
              />
              <p className="text-xs text-gray-500">
                Separa múltiples usos con comas
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Buscar producto o servicio para agregar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              disabled={disabled}
              className="pl-10 pr-12 py-2.5 bg-white border-2 focus:border-blue-500 focus:ring-blue-500 transition-all rounded-lg"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            variant={isOpen ? "default" : "outline"}
            disabled={disabled}
            className="gap-2 transition-all"
          >
            {isOpen ? "Cerrar" : "Buscar"}
          </Button>
        </div>

        {isOpen && (
          <>
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-auto animate-in fade-in zoom-in duration-200">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-500">Cargando productos...</p>
                </div>
              ) : opcionesFiltradas.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-600 font-medium">
                    {searchTerm
                      ? `No se encontraron resultados para "${searchTerm}"`
                      : "No hay productos o servicios disponibles"}
                  </p>
                  {(categoriaId ||
                    subcategoriaId ||
                    tipoId ||
                    indicaciones ||
                    tipo_uso) && (
                    <Button
                      variant="link"
                      onClick={() => clearFilters()}
                      className="mt-2 text-blue-600"
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              ) : (
                <div className="py-2 divide-y divide-gray-100">
                  <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 font-medium sticky top-0">
                    {opcionesFiltradas.length} resultados encontrados
                  </div>
                  {opcionesFiltradas.map((item) => {
                    const seleccionado = estaSeleccionado(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`group transition-all duration-150 ${
                          seleccionado
                            ? "bg-gray-50 opacity-60"
                            : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer"
                        }`}
                        onClick={() => !seleccionado && handleAgregar(item)}
                      >
                        <div className="flex items-start justify-between px-3 py-3">
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <span
                                className={`font-semibold ${seleccionado ? "text-gray-500" : "text-gray-900"}`}
                              >
                                {item.nombre}
                              </span>
                              <Badge
                                variant={
                                  item.tipo === TipoSubServicio.PRODUCTO
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {item.tipo === TipoSubServicio.PRODUCTO
                                  ? "Producto"
                                  : "Servicio"}
                              </Badge>
                              {seleccionado && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 text-xs border-green-200"
                                >
                                  ✓ Agregado
                                </Badge>
                              )}
                            </div>

                            <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <DollarSign size={15} />
                                <span className="font-medium">Precio:</span>
                              </div>
                              <span className="text-lg font-bold text-green-600">
                                {simbolo} {item.preciosPorPais[0]?.precio || 0}
                              </span>
                              {item.tipo === "servicio" &&
                                item.preciosPorPais.length > 1 && (
                                  <Badge variant="outline" className="text-xs">
                                    {item.preciosPorPais.length} precios
                                    disponibles
                                  </Badge>
                                )}
                            </div>

                            {item.tipo === TipoSubServicio.PRODUCTO && (
                              <div className="space-y-1.5 mt-2">
                                {item.indicaciones &&
                                  item.indicaciones.length > 0 && (
                                    <div className="flex items-start gap-2">
                                      <div className="flex items-center gap-2">
                                        <Pill size={15} />
                                        <span className="text-xs font-medium text-blue-600 min-w-[80px]">
                                          Indicaciones:
                                        </span>
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {item.indicaciones.map(
                                          (indicacion, idx) => (
                                            <Badge
                                              key={idx}
                                              variant="secondary"
                                              className="text-xs bg-blue-50 text-blue-700"
                                            >
                                              {indicacion}
                                            </Badge>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {item.tipos_uso &&
                                  item.tipos_uso.length > 0 && (
                                    <div className="flex items-start gap-2">
                                      <div className="flex items-center gap-2">
                                        <Tag size={15} />
                                        <span className="text-xs font-medium text-purple-600 min-w-[80px]">
                                          Usos:
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap gap-1">
                                        {item.tipos_uso.map((tipoUso, idx) => (
                                          <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="text-xs bg-purple-50 text-purple-700"
                                          >
                                            {tipoUso}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {item.componentes &&
                                  item.componentes.length > 0 && (
                                    <div className="flex items-start gap-2">
                                      <div className="flex items-center gap-2">
                                        <Syringe size={15} />
                                        <span className="text-xs font-medium text-orange-600 min-w-[80px]">
                                          Componentes:
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap gap-1">
                                        {item.componentes.map(
                                          (componente, idx) => (
                                            <Badge
                                              key={idx}
                                              variant="outline"
                                              className="text-xs bg-orange-50 text-orange-700"
                                            >
                                              {componente.nombre}:{" "}
                                              {componente.cantidad}{" "}
                                              {componente.unidad}
                                            </Badge>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            )}
                          </div>

                          {!seleccionado && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAgregar(item);
                              }}
                              className="ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Agregar
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </div>

      {(categoriaId ||
        subcategoriaId ||
        tipoId ||
        indicaciones ||
        tipo_uso) && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Filtros activos:</span>
          {categoriaId && (
            <Badge
              variant="secondary"
              className="text-xs bg-blue-100 text-blue-700"
            >
              Categoría: {categorias?.find((c) => c.id === categoriaId)?.nombre}
            </Badge>
          )}
          {subcategoriaId && (
            <Badge
              variant="secondary"
              className="text-xs bg-purple-100 text-purple-700"
            >
              Subcategoría seleccionada
            </Badge>
          )}
          {tipoId && (
            <Badge
              variant="secondary"
              className="text-xs bg-orange-100 text-orange-700"
            >
              Tipo seleccionado
            </Badge>
          )}
          {indicaciones && (
            <Badge
              variant="secondary"
              className="text-xs bg-blue-100 text-blue-700"
            >
              Indicaciones: {indicaciones}
            </Badge>
          )}
          {tipo_uso && (
            <Badge
              variant="secondary"
              className="text-xs bg-purple-100 text-purple-700"
            >
              Usos: {tipo_uso}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectorProductoServicio;
