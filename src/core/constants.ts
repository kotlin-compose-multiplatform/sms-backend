export const regions = [
  'Ahal',
  'Ashgabat',
  'Dashoguz',
  'Mary',
  'Balkan',
  'Lebap',
];

export const ruRegions = [
  'Ахал',
  'Ашхабад',
  'Дашогуз',
  'Мары',
  'Балкан',
  'Лебап',
];

export function getRegion(region: string): string {
  try {
    const res = ruRegions.findIndex((val) =>
      val.trim().toLowerCase().includes(region.trim().toLowerCase()),
    );
    if (res != -1) {
      return regions[res];
    } else {
      return regions[1];
    }
  } catch (err) {
    return regions[1];
  }
}

export const userTypes = ['zawod', 'parnik'];
