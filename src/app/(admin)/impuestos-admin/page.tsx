"use client";
import useGetTaxesPais from "@/hooks/impuestos/useGetTaxesPais";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";

const FormImpuestos = dynamic(
  () => import("@/components/impuestos/FormImpuestos"),
  {
    loading: () => <LoaderComponents />,
  }
);

const TableImpuestos = dynamic(
  () => import("@/components/impuestos/TableImpuestos"),
  {
    loading: () => <TableUsersSkeleton />,
  }
);

const ImpuestosPaisAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: impuestos, isLoading } = useGetTaxesPais();

  if (isLoading) {
    return <TableUsersSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="block md:flex justify-between items-center">
          <CardTitle>Impuestos del País</CardTitle>
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto mt-1 md:mt-0"
          >
            <Plus />
            Agregar Impuesto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TableImpuestos impuestos={impuestos} tipo="impuesto" />
      </CardContent>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Impuesto</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agregar los diferentes tipos de impuesto
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormImpuestos onSuccess={() => setIsOpen(false)} tipo="impuesto" />
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ImpuestosPaisAdmin;
