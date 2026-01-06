import { CreateUser } from "@/apis/users/accions/crear-usuario";
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
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import useGetPaisesActivos from "@/hooks/paises/useGetPaisesActivos";
import usePaisesById from "@/hooks/paises/usePaisesById";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const FormRegister = () => {
  const [prefijoNumber, setPrefijoNumber] = useState("");
  const router = useRouter();
  const [codigoPais, setCodigoPais] = useState("");
  const [paisId, setPaisId] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data: sucursales } = useGetSucursalesPais(paisId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CrearUsuario>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      identificacion: "",
      direccion: "",
      telefono: "",
      pais: "",
      departamento: "",
      municipio: "",
      sucursal: "",
      sexo: "",
    },
  });

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

  const { data: departamentos } = useGetDeptosActivesByPais(paisId);

  const { data: municipios } = useGetMunicipiosActivosByDepto(departamentoId);

  const { data: pais } = usePaisesById(paisId);

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
      toast.success(
        "Usuario creado correctamente, revisa tu correo electronico"
      );
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
        sucursal: "",
      });
      setPaisId("");
      setDepartamentoId("");
      setCodigoPais("");
      setPrefijoNumber("");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el médico";

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
    const telefonoConPrefijo = `${prefijoNumber} ${data.telefono}`;

    const payload: CrearUsuario = {
      ...data,
      telefono: telefonoConPrefijo,
    };

    mutation.mutate(payload);
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

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña*</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "password" : "text"}
              placeholder="••••••••"
              {...register("password", {
                required: "La contraseña es requerida",
                validate: validatePassword,
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm font-medium text-red-500 ">
              {errors.password.message as string}
            </p>
          )}
        </div>

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
          <Label htmlFor="pais">País*</Label>
          <Select
            onValueChange={(value) => {
              setValue("pais", value);
              setPaisId(value);
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
            onValueChange={(value) => {
              setValue("departamento", value);
              setDepartamentoId(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentos && departamentos.data.length > 0 ? (
                departamentos?.data.map((depto) => (
                  <SelectItem key={depto.id} value={depto.id}>
                    {depto.nombre}
                  </SelectItem>
                ))
              ) : (
                <p>No se encontraron departamentos</p>
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
            onValueChange={(value) => {
              setValue("municipio", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un municipio" />
            </SelectTrigger>
            <SelectContent>
              {municipios && municipios.data.length > 0 ? (
                municipios?.data.map((mun) => (
                  <SelectItem key={mun.id} value={mun.id}>
                    {mun.nombre}
                  </SelectItem>
                ))
              ) : (
                <p>No se encontraron municipios</p>
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

      <div className="mt-6">
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Registrarse
        </Button>
      </div>
      <div className="flex justify-between">
        <Link href="/reset-password" className="text-green-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
        <div className="flex items-center gap-4">
          <p>¿Ya tienes una cuenta?</p>
          <Link href="/" className="text-green-600 hover:underline">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </form>
  );
};

export default FormRegister;
