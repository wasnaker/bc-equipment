import { defineModuleManifest } from "@/core/modules/types";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import {
  ProvinceCountWidget,
  RegencyCountWidget,
} from "./components/dashboard-widgets";

/**
 * Manifest modul Region.
 *
 * Modul ini menyediakan halaman admin di /admin/region.
 * String UI memakai namespace "module-region" (lihat
 * src/services/i18n/locales/<lang>/module-region.json).
 */
export default defineModuleManifest({
  alias: "region",
  menu: [
    {
      slug: "region",
      label: { namespace: "module-region", key: "menu" },
      href: "/admin/region",
      position: 60,
      permission: "read:region",
      icon: MapPin,
    },
  ],
  // Satu module dapat mendaftarkan beberapa widget sekaligus.
  // defaultVisible: konstanta statis modul — meng-override default true saat
  // global Settings › Misc › dashboardWidgetsEnabled = ON. Preferensi user
  // (toggle di toolbar dashboard) tetap menang atas nilai ini.
  dashboardWidgets: [
    {
      id: "region-province-count",
      label: { namespace: "module-region", key: "dashboard.provinces" },
      area: "summary",
      position: 60,
      permission: "read:region",
      component: ProvinceCountWidget,
      defaultVisible: true,
    },
    {
      id: "region-regency-count",
      label: { namespace: "module-region", key: "dashboard.regencies" },
      area: "summary",
      position: 70,
      permission: "read:region",
      component: RegencyCountWidget,
      defaultVisible: false,
    },
  ],
});
