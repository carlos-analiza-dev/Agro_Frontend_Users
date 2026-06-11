import { TipoCliente } from "@/interfaces/enums/clientes.enums";

export const rolTrabajadorOptions = [
  {
    value: TipoCliente.PROPIETARIO,
    label: "Propietario",
  },
  {
    value: TipoCliente.TRABAJADOR,
    label: "Trabajador",
  },
  {
    value: TipoCliente.SUPERVISOR,
    label: "Supervisor",
  },
];
