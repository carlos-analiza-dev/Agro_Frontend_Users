import {
  Permiso,
  ResponsePermisosRolesAgro,
  Rol,
} from "@/apis/agroservicio/permisos_rol/interface/response-permisos-roles.interface";

export const groupByRol = (data: ResponsePermisosRolesAgro[]) => {
  const grouped = data.reduce(
    (acc, item) => {
      const rolKey = item.rol.id;
      if (!acc[rolKey]) {
        acc[rolKey] = {
          rol: item.rol,
          permisos: [],
        };
      }
      acc[rolKey].permisos.push(item.permiso);
      return acc;
    },
    {} as Record<string, { rol: Rol; permisos: Permiso[] }>,
  );

  return Object.values(grouped);
};

export const groupByModulo = (permisos: Permiso[]) => {
  return permisos.reduce(
    (acc, permiso) => {
      const modulo = permiso.modulo || "Sin módulo";
      if (!acc[modulo]) {
        acc[modulo] = [];
      }
      acc[modulo].push(permiso);
      return acc;
    },
    {} as Record<string, Permiso[]>,
  );
};

export const getUniqueModulos = (data: ResponsePermisosRolesAgro[]) => {
  const modulos = new Set(data.map((item) => item.permiso.modulo));
  return Array.from(modulos).sort();
};

export const getPermisosByModulo = (data: ResponsePermisosRolesAgro[]) => {
  const modulosMap = new Map<string, Set<string>>();

  data.forEach((item) => {
    const modulo = item.permiso.modulo;
    if (!modulosMap.has(modulo)) {
      modulosMap.set(modulo, new Set());
    }
    modulosMap.get(modulo)?.add(item.permiso.nombre);
  });

  const result: Record<string, string[]> = {};
  modulosMap.forEach((permisos, modulo) => {
    result[modulo] = Array.from(permisos);
  });
  return result;
};

export const getRolesByPermiso = (
  data: ResponsePermisosRolesAgro[],
  permisoNombre: string,
) => {
  const roles = data
    .filter((item) => item.permiso.nombre === permisoNombre)
    .map((item) => item.rol.name);
  return Array.from(new Set(roles));
};
