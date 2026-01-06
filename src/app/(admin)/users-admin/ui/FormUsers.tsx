import { CreateUser } from "@/apis/users/accions/crear-usuario";
import { actualizarUsuario } from "@/apis/users/accions/update-user";
import { CrearUsuario } from "@/apis/users/interfaces/create-user.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sexos } from "@/helpers/data/sexos";
import useGetDepartamentosByPais from "@/hooks/departamentos/useGetDepartamentosByPais";
import useGetMunicipiosByDepto from "@/hooks/municipios/useGetMunicipiosByDepto";
import useGetPaisesActivos from "@/hooks/paises/useGetPaisesActivos";
import usePaisesById from "@/hooks/paises/usePaisesById";
import useGetRoles from "@/hooks/roles/useGetRoles";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";
import userById from "@/hooks/users/userById";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  userId?: string;
  onSuccess: () => void;
}

const FormUsers = ({ userId, onSuccess }: Props) => {
  const [prefijoNumber, setPrefijoNumber] = useState("");
  const { data: user } = userById(userId ?? "");
  const queryClient = useQueryClient();
  const [codigoPais, setCodigoPais] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CrearUsuario>();

  useEffect(() => {
    if (user) {
      reset({
        email: user.data.email,
        name: user.data.name,
        identificacion: user.data.identificacion,
        direccion: user.data.direccion,
        telefono: user.data.telefono.split(" ")[1],
        role: user.data.role.id,
        pais: user.data.pais.id,
        sexo: user.data.sexo,
        departamento: user.data.departamento.id,
        municipio: user.data.municipio.id,
        sucursal: user.data.sucursal?.id || "",
      });

      setCodigoPais(user.data.pais.code);
      setPrefijoNumber(user.data.pais.code_phone);

      setValue("departamento", user.data.departamento.id, {
        shouldValidate: true,
      });
      setValue("municipio", user.data.municipio.id, { shouldValidate: true });
    }
  }, [user, reset]);

  const ID_REGEX = {
    HN: {
      regex: /^\d{4}-\d{4}-\d{5}$/,
      message: "Formato inválido. Use: xxxx-xxxx-xxxxx",
      example: "Ejemplo: 0801-1999-01234",
    },
    SV: {
      regex: /^\d{8}-\d{1}$/,
      message: "Formato inválido. Use: xxxxxxxx-x",
      example: "Ejemplo: 04210000-5",
    },
    GT: {
      regex: /^\d{4}-\d{5}-\d{4}$/,
      message: "Formato inválido. Use: xxxx-xxxxx-xxxx",
      example: "Ejemplo: 1234-56789-0123",
    },
    PASSPORT: {
      regex: /^[A-Za-z0-9]{6,20}$/,
      message: "Formato inválido. Use 6-20 caracteres alfanuméricos",
      example: "Ejemplo: AB123456",
    },
  };

  const { data: paises } = useGetPaisesActivos();
  const paisId = watch("pais");
  const { data: departamentos } = useGetDepartamentosByPais(paisId);
  const departamentoId = watch("departamento");
  const { data: municipios } = useGetMunicipiosByDepto(departamentoId);
  const { data: sucursales } = useGetSucursalesPais(paisId);

  const { data: pais } = usePaisesById(paisId);

  const { data: roles } = useGetRoles();

  useEffect(() => {
    if (pais) {
      setCodigoPais(pais.data.code);
      setPrefijoNumber(pais.data.code_phone);
    }
  }, [pais]);

  const validateIdentification = (value: string, codigoPais: string) => {
    if (!value) return "La identificación es requerida";

    switch (codigoPais) {
      case "HN":
        return ID_REGEX.HN.regex.test(value) || ID_REGEX.HN.message;
      case "SV":
        return ID_REGEX.SV.regex.test(value) || ID_REGEX.SV.message;
      case "GT":
        return ID_REGEX.GT.regex.test(value) || ID_REGEX.GT.message;
      default:
        return true;
    }
  };

  const mutation = useMutation({
    mutationFn: CreateUser,
    onSuccess: () => {
      toast.success("Usuario creado correctamente");
      reset({
        email: "",
        password: "",
        name: "",
        identificacion: "",
        direccion: "",
        telefono: "",
        pais: "",
        departamento: "",
        municipio: "",
        sexo: "",
      });
      queryClient.invalidateQueries({ queryKey: ["usuarios-admin"] });
      onSuccess();
      setCodigoPais("");
      setPrefijoNumber("");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el usuario";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el usuario. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearUsuario) =>
      actualizarUsuario(userId!, {
        ...data,
        telefono: `${prefijoNumber} ${data.telefono}`,
      }),
    onSuccess: () => {
      toast.success("Usuario actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["usuarios-admin"] });
      onSuccess();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el usuario";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el usuario. Inténtalo de nuevo."
        );
      }
    },
  });

  const validateEmail = (email: string) => {
    const re =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return re.test(email) || "El correo electrónico no tiene formato adecuado";
  };

  const validatePassword = (password: string) => {
    const re = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
    return (
      re.test(password) ||
      "La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, una minúscula y una mayúscula"
    );
  };

  const onSubmit = (data: CrearUsuario) => {
    if (userId) {
      mutationUpdate.mutate(data);
    } else {
      const telefonoConPrefijo = `${prefijoNumber} ${data.telefono}`;
      const payload: CrearUsuario = {
        ...data,
        telefono: telefonoConPrefijo,
      };

      mutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico*</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            {...register("email", {
              required: "El correo es requerido",
              validate: validateEmail,
            })}
          />
          {errors.email && (
            <p className="text-sm font-medium text-red-500">
              {errors.email.message as string}
            </p>
          )}
        </div>

        {!userId && (
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña*</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "La contraseña es requerida",
                  validate: validatePassword,
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm font-medium text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Nombre Completo*</Label>
          <Input
            id="name"
            placeholder="Juan Pérez"
            {...register("name", {
              required: "El nombre es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
            })}
          />
          {errors.name && (
            <p className="text-sm font-medium text-red-500">
              {errors.name.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Rol*</Label>
          <Select
            value={watch("role")}
            onValueChange={(value) => {
              setValue("role", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {roles?.data.map((rol) => (
                <SelectItem key={rol.id} value={rol.id}>
                  {rol.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm font-medium text-red-500">
              {errors.role.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pais">País*</Label>
          <Select
            value={watch("pais")}
            onValueChange={(value) => {
              setValue("pais", value);
              setValue("departamento", "");
              setValue("municipio", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un país" />
            </SelectTrigger>
            <SelectContent>
              {paises?.data.map((pais) => (
                <SelectItem key={pais.id} value={pais.id}>
                  {pais.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.pais && (
            <p className="text-sm font-medium text-red-500">
              {errors.pais.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="departamento">Departamento*</Label>
          <Select
            value={watch("departamento") || user?.data.departamento.id}
            onValueChange={(value) => {
              setValue("departamento", value);
              setValue("municipio", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentos &&
              departamentos?.data?.departamentos?.length > 0 ? (
                departamentos.data.departamentos.map((depto) => (
                  <SelectItem key={depto.id} value={depto.id}>
                    {depto.nombre}
                  </SelectItem>
                ))
              ) : (
                <p>No hay departamentos disponibles</p>
              )}
            </SelectContent>
          </Select>
          {errors.departamento && (
            <p className="text-sm font-medium text-red-500">
              {errors.departamento.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="municipio">Municipio*</Label>
          <Select
            value={watch("municipio") || user?.data.municipio.id}
            onValueChange={(value) => {
              setValue("municipio", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un municipio" />
            </SelectTrigger>
            <SelectContent>
              {municipios && municipios?.data?.municipios?.length > 0 ? (
                municipios.data.municipios.map((mun) => (
                  <SelectItem key={mun.id} value={mun.id}>
                    {mun.nombre}
                  </SelectItem>
                ))
              ) : (
                <p>No hay municipios disponibles</p>
              )}
            </SelectContent>
          </Select>
          {errors.municipio && (
            <p className="text-sm font-medium text-red-500">
              {errors.municipio.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sucursal">Sucursal</Label>
          <Select
            value={watch("sucursal") || user?.data.sucursal.id}
            onValueChange={(value) => {
              setValue("sucursal", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una sucursal" />
            </SelectTrigger>
            <SelectContent>
              {sucursales && sucursales.length > 0 ? (
                sucursales?.map((sucursal) => (
                  <SelectItem key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre} - {sucursal.tipo}
                  </SelectItem>
                ))
              ) : (
                <p>No se encontraron sucursales</p>
              )}
            </SelectContent>
          </Select>
          {errors.sucursal && (
            <p className="text-sm font-medium text-red-500">
              {errors.sucursal.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="identificacion">Identificación*</Label>
          <Input
            id="identificacion"
            placeholder="Número de documento"
            {...register("identificacion", {
              required: "La identificación es requerida",
              validate: (value) => validateIdentification(value, codigoPais),
            })}
          />
          {errors.identificacion && (
            <p className="text-sm font-medium text-red-500">
              {errors.identificacion.message as string}
              {codigoPais &&
                ID_REGEX[codigoPais as keyof typeof ID_REGEX]?.example && (
                  <span className="block text-xs text-gray-500">
                    {ID_REGEX[codigoPais as keyof typeof ID_REGEX]?.example}
                  </span>
                )}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección*</Label>
          <Input
            id="direccion"
            placeholder="Calle 123 # 45-67"
            {...register("direccion", {
              required: "La dirección es requerida",
              minLength: {
                value: 10,
                message: "La dirección debe tener al menos 10 caracteres",
              },
            })}
          />
          {errors.direccion && (
            <p className="text-sm font-medium text-red-500">
              {errors.direccion.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono*</Label>
          <Input
            id="telefono"
            placeholder="0000-0000"
            {...register("telefono", {
              required: "El teléfono es requerido",
              pattern: {
                value: /^\d{4}-\d{4}$/,
                message: "El formato debe ser xxxx-xxxx",
              },
            })}
          />

          {errors.telefono && (
            <p className="text-sm font-medium text-red-500">
              {errors.telefono.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sexo">Sexo*</Label>
          <Select
            onValueChange={(value) => {
              setValue("sexo", value);
            }}
            value={watch("sexo")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              {sexos.map((sexo) => (
                <SelectItem key={sexo.id} value={sexo.value}>
                  {sexo.sexo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sexo && (
            <p className="text-sm font-medium text-red-500">
              {errors.sexo.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit">
          {userId ? "Editar Usuario" : "Crear Usuario"}
        </Button>
      </div>
    </form>
  );
};

export default FormUsers;
