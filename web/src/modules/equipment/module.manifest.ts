import { defineModuleManifest } from "@/core/modules/types";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import {
  GroupCountWidget,
  SubgroupCountWidget,
} from "./components/dashboard-widgets";
import { EquipmentPage } from "./pages/equipment-page";
import { SubgroupsPage } from "./pages/subgroups-page";
import { CategoriesPage } from "./pages/categories-page";
import { EquipmentTypesPage } from "./pages/equipment-types-page";

/**
 * Equipment owns its admin pages and navigation. The host resolves these
 * canonical paths through the shared module page registry.
 */
export default defineModuleManifest({
  alias: "equipment",
  pages: [
    {
      path: "/admin/equipment",
      component: EquipmentPage,
      title: { namespace: "module-equipment", key: "title" },
      permission: "read:equipment",
    },
    {
      path: "/admin/equipment/subgroups",
      component: SubgroupsPage,
      title: { namespace: "module-equipment", key: "subgroups_title" },
      permission: "read:equipment",
    },
    {
      path: "/admin/equipment/categories",
      component: CategoriesPage,
      title: { namespace: "module-equipment", key: "categories_title" },
      permission: "read:equipment",
    },
    {
      path: "/admin/equipment/items",
      component: EquipmentTypesPage,
      title: { namespace: "module-equipment", key: "equipment_page_title" },
      permission: "read:equipment",
    },
  ],
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
