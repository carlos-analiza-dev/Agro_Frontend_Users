import React, { useState, useMemo, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, X } from "lucide-react";
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

interface ProductoServicioUnificado {
  id: string;
  nombre: string;
  tipo: "producto" | "servicio";
  precio?: number;
  preciosPorPais: PreciosPorPai[];
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

  return (
    <div className="relative mb-4">
      <div className="mt-2 mb-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Categoria del Producto</Label>

          <Select
            value={categoriaId}
            onValueChange={(value) => {
              setCategoriaId(value);

              setSubcategoriaId("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="--Categoria--" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {categorias && categorias.length > 0 ? (
                  categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <p>No se encontraron categorias</p>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sub Categoria del Producto</Label>

          <Select
            value={subcategoriaId}
            onValueChange={(value) => {
              setSubcategoriaId(value);
              setTipoId("");
            }}
            disabled={!categoriaId}
          >
            <SelectTrigger>
              <SelectValue placeholder="--Sub Categoria--" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {subcategorias && subcategorias.length > 0 ? (
                  subcategorias.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id}>
                      {subcat.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <p>No se encontraron sub categorias</p>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tipo de Producto</Label>

          <Select
            value={tipoId}
            onValueChange={(value) => {
              setTipoId(value);
            }}
            disabled={!subcategoriaId}
          >
            <SelectTrigger>
              <SelectValue placeholder="--Tipo Producto--" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {tipo_producto && tipo_producto.length > 0 ? (
                  tipo_producto.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <p>No se encontraron tipos</p>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <Input
          type="text"
          placeholder="Ingresa las indicaciones del producto"
          value={indicaciones}
          onChange={(e) => {
            setIndicaciones(e.target.value);
          }}
        />

        <Input
          type="text"
          placeholder="Ingresa los tipos de uso del producto"
          value={tipo_uso}
          onChange={(e) => {
            setTipo_uso(e.target.value);
          }}
        />
      </div>

      <div className="flex gap-2">
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
            className="pr-10"
          />

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          disabled={disabled}
        >
          {isOpen ? "Cerrar" : "Buscar"}
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-auto">
          {opcionesFiltradas.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm
                ? "No se encontraron resultados"
                : "No hay productos/servicios disponibles"}
            </div>
          ) : (
            <div className="py-2">
              {opcionesFiltradas.map((item) => {
                const seleccionado = estaSeleccionado(item.id);

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-3 py-3 border-b border-gray-100 last:border-b-0 ${
                      seleccionado
                        ? "bg-gray-50 opacity-60"
                        : "hover:bg-gray-50 cursor-pointer"
                    }`}
                    onClick={() => !seleccionado && handleAgregar(item)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`font-medium ${seleccionado ? "text-gray-500" : "text-gray-900"}`}
                        >
                          {item.nombre}
                        </span>
                        <div className="flex items-center gap-2">
                          {seleccionado && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 text-xs"
                            >
                              Agregado
                            </Badge>
                          )}
                          <Badge
                            variant={
                              item.tipo === "producto" ? "default" : "secondary"
                            }
                          >
                            {item.tipo === "producto" ? "Producto" : "Servicio"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Precio: {simbolo} {item.preciosPorPais[0]?.precio || 0}
                        {item.tipo === "servicio" &&
                          item.preciosPorPais.length > 1 && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({item.preciosPorPais.length} precios disponibles)
                            </span>
                          )}
                      </div>
                    </div>

                    {!seleccionado && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAgregar(item)}
                        className="ml-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default SelectorProductoServicio;
