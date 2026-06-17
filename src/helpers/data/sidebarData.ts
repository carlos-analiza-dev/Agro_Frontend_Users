import {
  Boxes,
  BriefcaseMedical,
  Building2,
  ChartBarStacked,
  FileText,
  Globe,
  Handbag,
  Layers3,
  LayoutDashboard,
  Locate,
  Settings,
  Tag,
  UserCog,
  Users,
  Package,
  PackageOpen,
  ClipboardList,
  Warehouse,
  Droplet,
  FlaskConical,
  HousePlus,
  ShoppingBag,
  TicketPercent,
  UsersIcon,
  ChartColumnStacked,
  ChartNoAxesGantt,
  ShoppingBagIcon,
  CalendarCheck,
  CalendarArrowDown,
  CalendarCog,
  CalendarDays,
  PackageSearch,
  PackageCheck,
  NotepadTextIcon,
  User,
  UserCheck,
  Scale,
  PawPrint,
  Shirt,
  DollarSign,
  Bandage,
  ArrowLeftRight,
  PanelTop,
  PanelBottom,
} from "lucide-react";

export const navItems = [
  {
    category: "Principal",
    items: [
      { name: "Dashboard", href: "/dashboard-admin", icon: LayoutDashboard },
    ],
  },
  {
    category: "Gestión",
    items: [
      { name: "Usuarios", href: "/users-admin", icon: Users },
      { name: "Clientes", href: "/clientes-admin", icon: UsersIcon },
      { name: "Paises", href: "/paises-admin", icon: Globe },
      { name: "Departamentos", href: "/deptos-admin", icon: Locate },
      { name: "Sucursales", href: "/sucursales-admin", icon: HousePlus },
      {
        name: "Datos Empresa",
        href: "/datos-empresa",
        icon: ChartColumnStacked,
      },
      {
        name: "Rangos Factura",
        href: "/rangos-facturas",
        icon: ChartNoAxesGantt,
      },
      {
        name: "Servicios",
        href: "/servicios-admin",
        icon: ChartBarStacked,
      },
      {
        name: "Proveedores",
        href: "/proveedores-admin",
        icon: Building2,
      },
      {
        name: "Marcas",
        href: "/marcas-admin",
        icon: Tag,
      },
      { name: "Categorías", href: "/categorias-admin", icon: Layers3 },
      { name: "Sub categorías", href: "/sub-categorias-admin", icon: Boxes },
      { name: "Tipos Producto", href: "/tipos-productos", icon: Shirt },
      { name: "Productos", href: "/productos-admin", icon: Handbag },
      { name: "Insumos", href: "/insumos-admin", icon: FlaskConical },
      {
        name: "Veterinarios",
        href: "/veterinarios-admin",
        icon: BriefcaseMedical,
      },
      {
        name: "Especies",
        href: "/especies",
        icon: PawPrint,
      },
      {
        name: "Pesos Promedio",
        href: "/pesos-promedio",
        icon: Scale,
      },
      { name: "Roles", href: "/roles-admin", icon: UserCog },
    ],
  },
  {
    category: "Paquetes",
    items: [
      {
        name: "Paquetes",
        href: "/paquetes",
        icon: Bandage,
      },
      {
        name: "Precios",
        href: "/precios-paquetes",
        icon: DollarSign,
      },
    ],
  },
  {
    category: "Lotes",
    items: [
      {
        name: "Lotes",
        href: "/lotes",
        icon: Package,
      },
      {
        name: "Traslados",
        href: "/lotes-traslados",
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    category: "Compras",
    items: [
      {
        name: "Productos",
        href: "/compras-productos-admin",
        icon: ShoppingBag,
      },
      {
        name: "Insumos",
        href: "/compras-insumos-admin",
        icon: TicketPercent,
      },
    ],
  },
  {
    category: "MarketPlace",
    items: [
      {
        name: "Categorias",
        href: "/marketplace-category",
        icon: Layers3,
      },
      {
        name: "Sub Categorias",
        href: "/marketplace-subcategorias",
        icon: Boxes,
      },
      {
        name: "Marcas",
        href: "/marketplace-marcas",
        icon: Tag,
      },
      {
        name: "Tipo Producto",
        href: "/marketplace-tipos",
        icon: Shirt,
      },
    ],
  },
  {
    category: "Anuncios",
    items: [
      {
        name: "Banner Principal",
        href: "/anuncios-principales",
        icon: PanelTop,
      },
      {
        name: "Banner Secundario",
        href: "/anuncios-secundarios",
        icon: PanelBottom,
      },
    ],
  },
  {
    category: "Pedidos",
    items: [
      {
        name: "Pedidos",
        href: "/pedidos",
        icon: PackageSearch,
      },
    ],
  },
  {
    category: "Inventarios",
    items: [
      {
        name: "Existencias Productos",
        href: "/existencias-inventario-admin",
        icon: Warehouse,
      },
      {
        name: "Existencias Insumos",
        href: "/existencias-inventario-insumos-admin",
        icon: Warehouse,
      },
      {
        name: "Movimientos",
        href: "/movimientos-productos-admin",
        icon: PackageOpen,
      },
    ],
  },
  {
    category: "Ventas Perdidas",
    items: [
      {
        name: "Ventas Perdidas",
        href: "/productos-faltantes-admin",
        icon: ShoppingBagIcon,
      },
    ],
  },
  {
    category: "Facturacion",
    items: [
      {
        name: "Facturacion",
        href: "/facturacion-admin",
        icon: Warehouse,
      },
      {
        name: "Nota de Credito",
        href: "/nota-credito-admin",
        icon: NotepadTextIcon,
      },
    ],
  },

  {
    category: "Permisos",
    items: [
      { name: "Ganaderos", href: "/permisos-clientes", icon: User },

      {
        name: "Veterinarios",
        href: "/permisos-veterinarios",
        icon: UserCheck,
      },
    ],
  },

  {
    category: "Impuestos",
    items: [
      { name: "Impuestos", href: "/impuestos-admin", icon: FileText },

      {
        name: "Descuentos Clientes",
        href: "/descuentos-clientes-admin",
        icon: FileText,
      },
    ],
  },
];

export const navItemsVete = [
  {
    category: "Citas",
    items: [
      {
        name: "Citas Pendientes",
        href: "/citas-veterinario",
        icon: CalendarCog,
      },
      {
        name: "Citas Confirmadas",
        href: "/citas-confirmadas",
        icon: CalendarCheck,
      },
      {
        name: "Historial Citas",
        href: "/historial-ciitas",
        icon: CalendarDays,
      },
    ],
  },
  {
    category: "Historial",
    items: [
      {
        name: "Historial Clinico",
        href: "/historial-clinico",
        icon: Warehouse,
      },
    ],
  },
  {
    category: "Facturacion",
    items: [
      {
        name: "Facturacion",
        href: "/facturacion-vet",
        icon: Warehouse,
      },
    ],
  },
];
