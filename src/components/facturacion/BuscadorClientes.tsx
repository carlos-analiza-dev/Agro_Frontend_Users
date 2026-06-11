import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, X } from "lucide-react";
import { Cliente } from "@/apis/clientes/interfaces/response-clientes-activos.interface";

interface BuscadorClientesProps {
  value: string;
  onValueChange: (value: string) => void;
  clientes: Cliente[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const BuscadorClientes = ({
  value,
  onValueChange,
  clientes,
  placeholder = "Buscar cliente...",
  disabled = false,
  className = "",
}: BuscadorClientesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const clientesFiltrados = useMemo(() => {
    if (!searchTerm) return clientes;

    return clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.identificacion.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [clientes, searchTerm]);

  const clienteSeleccionado = clientes.find((c) => c.id === value);

  const handleSelect = (cliente: Cliente) => {
    onValueChange(cliente.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onValueChange("");
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={
            isOpen
              ? searchTerm
              : clienteSeleccionado
                ? `${clienteSeleccionado.nombre} - ${clienteSeleccionado.identificacion}`
                : ""
          }
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          className={`pr-10 ${className}`}
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <User className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {clientesFiltrados.length === 0 ? (
            <div className="p-3 text-center text-gray-500 text-sm">
              {searchTerm
                ? "No se encontraron clientes"
                : "No hay clientes disponibles"}
            </div>
          ) : (
            <div className="py-1">
              {clientesFiltrados.map((cliente) => {
                const estaSeleccionado = cliente.id === value;

                return (
                  <button
                    key={cliente.id}
                    type="button"
                    className={`w-full text-left px-3 py-2 transition-colors ${
                      estaSeleccionado
                        ? "bg-blue-50 border-l-2 border-l-blue-500"
                        : "hover:bg-gray-100 focus:bg-gray-100"
                    }`}
                    onClick={() => handleSelect(cliente)}
                    disabled={estaSeleccionado}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {estaSeleccionado && (
                          <Search className="h-4 w-4 text-blue-500 mr-2" />
                        )}
                        <span
                          className={`font-medium ${estaSeleccionado ? "text-blue-600" : ""}`}
                        >
                          {cliente.nombre}
                        </span>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {cliente.identificacion}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 text-left">
                      email: {cliente.email}
                    </div>
                  </button>
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

export default BuscadorClientes;
