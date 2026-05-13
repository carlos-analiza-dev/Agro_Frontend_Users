import { Producto } from "@/apis/productos/interfaces/response-productos.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import {
  Edit,
  DollarSign,
  Tag,
  Box,
  Barcode,
  Percent,
  Building,
  Package2,
  ImageIcon,
  Settings,
  Eye,
} from "lucide-react";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormProductos from "./FormProductos";
import FormEditPrecios from "./FormEditPrecios";
import ProductoImagenes from "./ProductoImagenes";
import OptionsProducto from "./OptionsProducto";
import { useAuthStore } from "@/providers/store/useAuthStore";
import LotesByProducto from "./LotesByProducto";
import Modal from "@/components/generics/Modal";

interface Props {
  productos: Producto[];
}

const TableProducts = ({ productos }: Props) => {
  const { user } = useAuthStore();
  const [editSubServicio, setEditSubServicio] = useState<Producto | null>(null);
  const [editPrecioSubServicio, setEditPrecioSubServicio] =
    useState<Producto | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPrecios, setIsOpenPrecios] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [isOpenLotes, setIsOpenLotes] = useState(false);
  const [productoId, setProductoId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null,
  );

  const handleEditProducto = (producto: Producto) => {
    setIsOpen(true);
    setIsEdit(true);
    setEditSubServicio(producto);
  };

  const handleEditPrecios = (producto: Producto) => {
    setIsOpenPrecios(true);
    setEditPrecioSubServicio(producto);
  };

  const handleClosePrecios = () => {
    setIsOpenPrecios(false);
    setEditPrecioSubServicio(null);
  };

  const handleOpenSettings = (producto: Producto) => {
    setIsOpenSettings(true);
    setSelectedProducto(producto);
  };

  const handleViewLotes = (productoId: string) => {
    setIsOpenLotes(true);
    setProductoId(productoId);
  };

  return (
    <div className="space-y-4">
      {productos.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-8">
              <Package2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay productos disponibles</p>
              <p className="text-sm mt-2">
                Comienza agregando tu primer producto
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden lg:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-center w-[80px]">
                    <div className="flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Imagen
                    </div>
                  </TableHead>

                  <TableHead className="w-[300px] font-bold">
                    <div className="flex items-center">
                      <Box className="h-4 w-4 mr-2" />
                      Producto
                    </div>
                  </TableHead>

                  <TableHead className="font-bold text-center">
                    <div className="flex items-center justify-center">
                      <Barcode className="h-4 w-4 mr-2" />
                      Código
                    </div>
                  </TableHead>

                  <TableHead className="font-bold text-center">Marca</TableHead>

                  <TableHead className="font-bold text-center">
                    Categoría
                  </TableHead>

                  <TableHead className="font-bold text-center">
                    <div className="flex items-center justify-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Precio
                    </div>
                  </TableHead>

                  <TableHead className="font-bold text-center">
                    <div className="flex items-center justify-center">
                      <Percent className="h-4 w-4 mr-2" />
                      Impuesto
                    </div>
                  </TableHead>

                  <TableHead className="font-bold text-center">
                    Estado
                  </TableHead>

                  <TableHead className="font-bold text-center">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id} className="hover:bg-muted/50">
                    <TableCell className="text-center">
                      <ProductoImagenes
                        imagenes={producto.imagenes}
                        productoId={producto.id}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base">
                              {producto.nombre}
                            </h4>
                          </div>
                          <Badge
                            variant="outline"
                            className="ml-2 flex-shrink-0"
                          >
                            {producto.unidad_venta}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {producto.codigo_barra && (
                            <div className="flex items-center">
                              <Barcode className="h-3 w-3 mr-1" />
                              {producto.codigo_barra}
                            </div>
                          )}
                          {producto.proveedor && (
                            <div className="flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              {producto.proveedor.nombre_legal}
                            </div>
                          )}
                        </div>

                        {producto.atributos && (
                          <div className="mt-2">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Tag className="h-3 w-3 mr-1" />
                              <span className="line-clamp-1">
                                {producto.atributos}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {producto.codigo}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      {producto.marca ? (
                        <Badge variant="outline" className="text-xs">
                          {producto.marca.nombre}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          N/A
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {producto.categoria ? (
                        <Badge variant="outline" className="text-xs">
                          {producto.categoria.nombre}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          N/A
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {producto.preciosPorPais &&
                      producto.preciosPorPais.length > 0 ? (
                        <div className="space-y-1">
                          {producto.preciosPorPais.map((precio, index) => (
                            <div key={index} className="text-sm">
                              <div className="font-semibold text-green-600">
                                {precio.pais?.simbolo_moneda} {precio.precio}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Costo: {precio.pais?.simbolo_moneda}{" "}
                                {precio.costo}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-orange-600 text-xs"
                        >
                          Sin precio
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {producto.tax?.porcentaje ? (
                        <Badge variant="outline" className="text-xs">
                          {producto.tax?.porcentaje}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          N/A
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex flex-col gap-1 items-center">
                        <Badge
                          variant={producto.isActive ? "default" : "secondary"}
                          className="text-xs w-fit"
                        >
                          {producto.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        <Badge
                          variant={
                            producto.disponible ? "default" : "secondary"
                          }
                          className="text-xs w-fit"
                        >
                          {producto.disponible ? "Disponible" : "No disp."}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          title="Editar"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditProducto(producto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Lotes"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewLotes(producto.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Mas opciones"
                          className="h-8 w-8 p-0"
                          onClick={() => handleOpenSettings(producto)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Gestionar precios"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditPrecios(producto)}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-1 gap-4">
              {productos.map((producto) => (
                <Card key={producto.id}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-center mb-2">
                          <ProductoImagenes
                            imagenes={producto.imagenes}
                            productoId={producto.id}
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {producto.nombre}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {producto.codigo}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {producto.unidad_venta}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {producto.marca && (
                              <Badge variant="outline" className="text-xs">
                                {producto.marca.nombre}
                              </Badge>
                            )}
                            {producto.categoria && (
                              <Badge variant="outline" className="text-xs">
                                {producto.categoria.nombre}
                              </Badge>
                            )}
                          </div>

                          {producto.proveedor && (
                            <div className="text-xs text-muted-foreground">
                              Proveedor: {producto.proveedor.nombre_legal}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {producto.preciosPorPais &&
                        producto.preciosPorPais.length > 0 ? (
                          <div className="space-y-2">
                            {producto.preciosPorPais.map((precio, index) => (
                              <div
                                key={index}
                                className="bg-muted p-2 rounded-md"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold text-green-600">
                                    {precio.pais?.simbolo_moneda}{" "}
                                    {precio.precio}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {precio.pais?.nombre}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Costo: {precio.pais?.simbolo_moneda}{" "}
                                  {precio.costo}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-orange-600">
                            Sin precios
                          </Badge>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {producto.tax?.porcentaje && (
                            <Badge variant="outline" className="text-xs">
                              {Number(producto.tax?.porcentaje) * 100}% impuesto
                            </Badge>
                          )}
                          <Badge
                            variant={
                              producto.isActive ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {producto.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                          <Badge
                            variant={
                              producto.disponible ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {producto.disponible ? "Disponible" : "No disp."}
                          </Badge>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditProducto(producto)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditPrecios(producto)}
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Precios
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4 md:hidden">
            {productos.map((producto) => (
              <Card key={producto.id}>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <ProductoImagenes
                        imagenes={producto.imagenes}
                        productoId={producto.id}
                      />
                    </div>

                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-center">
                          {producto.nombre}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 justify-center">
                          <Badge variant="secondary" className="text-xs">
                            {producto.codigo}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {producto.unidad_venta}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Marca:</span>
                        <div className="text-muted-foreground">
                          {producto.marca?.nombre || "N/A"}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Categoría:</span>
                        <div className="text-muted-foreground">
                          {producto.categoria?.nombre || "N/A"}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Proveedor:</span>
                        <div className="text-muted-foreground">
                          {producto.proveedor?.nombre_legal || "N/A"}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Impuesto:</span>
                        <div className="text-muted-foreground">
                          {producto.tax?.porcentaje
                            ? `${Number(producto.tax?.porcentaje) * 100}%`
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Precios
                      </h4>
                      {producto.preciosPorPais &&
                      producto.preciosPorPais.length > 0 ? (
                        <div className="space-y-2">
                          {producto.preciosPorPais.map((precio, index) => (
                            <div
                              key={index}
                              className="bg-muted p-2 rounded-md"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-green-600">
                                  {precio.pais?.simbolo_moneda} {precio.precio}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {precio.pais?.nombre}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Costo: {precio.pais?.simbolo_moneda}{" "}
                                {precio.costo}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-orange-600">
                          Sin precios configurados
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={producto.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {producto.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <Badge
                        variant={producto.disponible ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {producto.disponible ? "Disponible" : "No disponible"}
                      </Badge>
                    </div>

                    {producto.atributos && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          Atributos
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {producto.atributos}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditProducto(producto)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditPrecios(producto)}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Precios
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Editar Producto"
        description="En esta seccion podras editar un producto"
        size="2xl"
        height="auto"
      >
        <FormProductos
          onSuccess={() => setIsOpen(false)}
          editSubServicio={editSubServicio}
          isEdit={isEdit}
        />
      </Modal>

      <AlertDialog open={isOpenPrecios} onOpenChange={setIsOpenPrecios}>
        <AlertDialogContent className="max-w-md">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Gestionar Precios</AlertDialogTitle>
            <AlertDialogDescription>
              Edita los precios y costos del producto
            </AlertDialogDescription>
          </AlertDialogHeader>
          {editPrecioSubServicio && (
            <FormEditPrecios
              onSuccess={handleClosePrecios}
              editSubServicio={editPrecioSubServicio}
              isEdit={true}
            />
          )}
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpenSettings} onOpenChange={setIsOpenSettings}>
        <AlertDialogContent className="max-w-6xl h-full overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Gestionar Datos del Producto - {selectedProducto?.nombre}
            </AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras gestionar diferentes datos de los productos
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex-1">
            <OptionsProducto user={user} selectedProducto={selectedProducto} />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpenLotes} onOpenChange={setIsOpenLotes}>
        <AlertDialogContent className="max-w-6xl h-full overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Lotes de Producto</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras observar los lotes del producto
              seleccionado
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex-1">
            <LotesByProducto productoId={productoId} user={user} />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TableProducts;
