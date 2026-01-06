"use client";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import FormImpuestos from "@/components/impuestos/FormImpuestos";
import TableImpuestos from "@/components/impuestos/TableImpuestos";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetDescuentosClientes from "@/hooks/descuentos-clientes/useGetDescuentosClientes";
import { Plus } from "lucide-react";
import React, { useState } from "react";

const DescuentosClientesAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: impuestos, isLoading } = useGetDescuentosClientes();

  if (isLoading) {
    return <TableUsersSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="block md:flex justify-between items-center">
          <CardTitle>Descuento de los Clientes</CardTitle>
          <Button onClick={() => setIsOpen(true)} className="w-full md:w-auto">
            <Plus />
            Agregar Descuento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TableImpuestos impuestos={impuestos} tipo="descuento" />
      </CardContent>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Descuentos</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agregar los diferentes tipos de descuentos
              para clientes
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormImpuestos onSuccess={() => setIsOpen(false)} tipo="descuento" />
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default DescuentosClientesAdmin;
