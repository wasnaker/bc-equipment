/**
 * Canonical K3 equipment groups and subgroups migrated from
 * wasnaker/prfx-equipments database/seeds/SubgroupsSeeder.php.
 *
 * Natural keys are names (group.name) and (groupId, subgroup.name).
 * Conflicts only fill missing metadata; they never overwrite names,
 * descriptions, active flags, or user-maintained non-default sort order.
 */
export const EQUIPMENT_MASTER_DATA_SQL = `
  INSERT INTO "equipment_group" ("name", "code", "abbr")
  VALUES
    ('Pesawat Angkat dan Angkut', 'PAA', 'PA'),
    ('Pesawat Tenaga dan Produksi', 'PTP', 'PT'),
    ('Pesawat Uap Bejana Tekan dan Tangki Timbun', 'PUBT', 'UB'),
    ('Sarana Proteksi Kebakaran', 'IPK', 'PK'),
    ('Instalasi Listrik dan Penyalur Petir', 'ILP', 'IL'),
    ('Elevator dan Eskalator', 'LIE', 'LE')
  ON CONFLICT ("name") DO UPDATE SET
    "code" = COALESCE("equipment_group"."code", EXCLUDED."code"),
    "abbr" = COALESCE("equipment_group"."abbr", EXCLUDED."abbr");

  INSERT INTO "equipment_subgroup"
    ("groupId", "name", "abbr", "sortOrder", "color")
  SELECT g."id", s."name", s."abbr", s."sortOrder", '#3b82f6'
  FROM (VALUES
    ('Pesawat Angkat dan Angkut', 'Pesawat Angkat', 'PA', 1),
    ('Pesawat Angkat dan Angkut', 'Pesawat Angkut', 'PK', 2),

    ('Pesawat Tenaga dan Produksi', 'Penggerak Mula', 'GM', 1),
    ('Pesawat Tenaga dan Produksi', 'Mesin Perkakas', 'MP', 2),
    ('Pesawat Tenaga dan Produksi', 'Mesin Produksi', 'MR', 3),
    ('Pesawat Tenaga dan Produksi', 'Transmisi Tenaga Mekanik', 'TM', 4),
    ('Pesawat Tenaga dan Produksi', 'Tanur', 'TN', 5),
    ('Pesawat Tenaga dan Produksi', 'Turbin', 'TB', 6),
    ('Pesawat Tenaga dan Produksi', 'Kincir Angin', 'KA', 7),
    ('Pesawat Tenaga dan Produksi', 'Motor Listrik', 'ML', 8),

    ('Pesawat Uap Bejana Tekan dan Tangki Timbun', 'Pesawat Uap', 'PU', 1),
    ('Pesawat Uap Bejana Tekan dan Tangki Timbun', 'Bejana Bertekanan', 'BT', 2),
    ('Pesawat Uap Bejana Tekan dan Tangki Timbun', 'Tangki Timbun', 'TT', 3),

    ('Sarana Proteksi Kebakaran', 'APAR', 'AP', 1),
    ('Sarana Proteksi Kebakaran', 'Instalasi Hydrant', 'IH', 2),
    ('Sarana Proteksi Kebakaran', 'Fire Alarm', 'FA', 3),

    ('Instalasi Listrik dan Penyalur Petir', 'Instalasi Listrik', 'IL', 1),
    ('Instalasi Listrik dan Penyalur Petir', 'Penyalur Petir', 'PP', 2),

    ('Elevator dan Eskalator', 'Lift', 'LF', 1),
    ('Elevator dan Eskalator', 'Eskalator', 'ES', 2)
  ) AS s("groupName", "name", "abbr", "sortOrder")
  INNER JOIN "equipment_group" g ON g."name" = s."groupName"
  ON CONFLICT ("groupId", "name") DO UPDATE SET
    "abbr" = COALESCE("equipment_subgroup"."abbr", EXCLUDED."abbr"),
    "sortOrder" = CASE
      WHEN "equipment_subgroup"."sortOrder" = 0 THEN EXCLUDED."sortOrder"
      ELSE "equipment_subgroup"."sortOrder"
    END,
    "color" = COALESCE("equipment_subgroup"."color", EXCLUDED."color");
`;
