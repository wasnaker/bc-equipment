import { defineModuleManifest } from "@/core/modules/types";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import {
  GroupCountWidget,
  SubgroupCountWidget,
} from "./components/dashboard-widgets";

/**
 * Manifest modul Equipment.
 *
 * Modul ini menyediakan halaman admin di /admin/equipment.
 * String UI memakai namespace "module-equipment" (lihat
 * src/services/i18n/locales/<lang>/module-equipment.json).
 */
export default defineModuleManifest({
  alias: "equipment",
  menu: [
    {
      slug: "equipment",
      label: { namespace: "module-equipment", key: "menu" },
      href: "/admin/equipment",
      position: 60,
      icon: MapPin,
      children: [
        {
          slug: "equipment-groups",
          label: { namespace: "module-equipment", key: "menu_groups" },
          href: "/admin/equipment",
          position: 1,
          permission: "read:equipment",
        },
        {
          slug: "equipment-subgroups",
          label: { namespace: "module-equipment", key: "menu_subgroups" },
          href: "/admin/equipment/subgroups",
          position: 2,
          permission: "read:equipment",
        },
        {
          slug: "equipment-categories",
          label: { namespace: "module-equipment", key: "menu_categories" },
          href: "/admin/equipment/categories",
          position: 3,
          permission: "read:equipment",
        },
        {
          slug: "equipment-items",
          label: { namespace: "module-equipment", key: "menu_equipment" },
          href: "/admin/equipment/items",
          position: 4,
          permission: "read:equipment",
        },
      ],
    },
  ],
  // Satu module dapat mendaftarkan beberapa widget sekaligus.
  // defaultVisible: konstanta statis modul — meng-override default true saat
  // global Settings › Misc › dashboardWidgetsEnabled = ON. Preferensi user
  // (toggle di toolbar dashboard) tetap menang atas nilai ini.
  dashboardWidgets: [
    {
      id: "equipment-group-count",
      label: { namespace: "module-equipment", key: "dashboard.groups" },
      area: "summary",
      position: 60,
      permission: "read:equipment",
      component: GroupCountWidget,
      defaultVisible: true,
    },
    {
      id: "equipment-subgroup-count",
      label: { namespace: "module-equipment", key: "dashboard.subgroups" },
      area: "summary",
      position: 70,
      permission: "read:equipment",
      component: SubgroupCountWidget,
      defaultVisible: false,
    },
  ],
});
