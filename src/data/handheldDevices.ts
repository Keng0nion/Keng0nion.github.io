export type HandheldCategory = 'pc' | 'console' | 'retro';

export interface HandheldDevice {
  id: string;
  name: string;
  brand: string;
  aliases: string[];
  priceCny: number;
  weightG: number;
  batteryWh: number;
  estimatedBatteryH: number;
  year: number;
  category: HandheldCategory;
  screen: {
    sizeInch: number;
    type: 'OLED' | 'IPS';
    refreshHz: number;
    resolution: string;
    srgbPercent: number;
  };
  hardware: {
    cpu: string;
    gpu: string;
    ramGb: number;
    storageGb: number;
    tdpW: number;
    architecture: string;
    tdpMinW: number;
    tdpMaxW: number;
  };
  scores: {
    performance: number;
    battery: number;
    screen: number;
    portability: number;
    value: number;
    cooling: number;
  };
}

export const handheldDevices: HandheldDevice[] = [
  {
    id: 'steam-deck-oled',
    name: 'Steam Deck OLED',
    brand: 'Valve',
    aliases: ['SD', 'Deck', 'V社', 'OLED Deck'],
    priceCny: 4200,
    weightG: 640,
    batteryWh: 50,
    estimatedBatteryH: 6,
    year: 2023,
    category: 'pc',
    screen: {
      sizeInch: 7.4,
      type: 'OLED',
      refreshHz: 90,
      resolution: '1280x800',
      srgbPercent: 110,
    },
    hardware: {
      cpu: 'AMD Sephiroth (Zen2 6nm)',
      gpu: 'RDNA2 12CU',
      ramGb: 16,
      storageGb: 512,
      tdpW: 15,
      architecture: 'x86_64',
      tdpMinW: 4,
      tdpMaxW: 15,
    },
    scores: {
      performance: 78,
      battery: 75,
      screen: 88,
      portability: 55,
      value: 80,
      cooling: 70,
    },
  },
  {
    id: 'rog-ally-x',
    name: 'ROG Ally X',
    brand: 'ASUS',
    aliases: ['AllyX', 'Ally X', '华硕'],
    priceCny: 5800,
    weightG: 678,
    batteryWh: 80,
    estimatedBatteryH: 5,
    year: 2024,
    category: 'pc',
    screen: {
      sizeInch: 7,
      type: 'IPS',
      refreshHz: 120,
      resolution: '1920x1080',
      srgbPercent: 100,
    },
    hardware: {
      cpu: 'AMD Ryzen Z1 Extreme',
      gpu: 'RDNA3 12CU',
      ramGb: 24,
      storageGb: 1024,
      tdpW: 30,
      architecture: 'x86_64',
      tdpMinW: 9,
      tdpMaxW: 30,
    },
    scores: {
      performance: 90,
      battery: 82,
      screen: 80,
      portability: 50,
      value: 70,
      cooling: 78,
    },
  },
  {
    id: 'legion-go-2',
    name: 'Legion Go 2',
    brand: 'Lenovo',
    aliases: ['Legion', '拯救者'],
    priceCny: 5800,
    weightG: 875,
    batteryWh: 74,
    estimatedBatteryH: 4.5,
    year: 2026,
    category: 'pc',
    screen: {
      sizeInch: 8.8,
      type: 'OLED',
      refreshHz: 144,
      resolution: '2560x1600',
      srgbPercent: 110,
    },
    hardware: {
      cpu: 'AMD Ryzen AI 9 HX 370',
      gpu: 'RDNA3.5 16CU',
      ramGb: 32,
      storageGb: 1024,
      tdpW: 33,
      architecture: 'x86_64',
      tdpMinW: 10,
      tdpMaxW: 35,
    },
    scores: {
      performance: 95,
      battery: 75,
      screen: 95,
      portability: 30,
      value: 65,
      cooling: 82,
    },
  },
  {
    id: 'ayaneo-2s',
    name: 'AYANEO 2S',
    brand: 'AYANEO',
    aliases: ['AYA', '亚诺'],
    priceCny: 5500,
    weightG: 670,
    batteryWh: 50.7,
    estimatedBatteryH: 4,
    year: 2024,
    category: 'pc',
    screen: {
      sizeInch: 7,
      type: 'IPS',
      refreshHz: 120,
      resolution: '1920x1080',
      srgbPercent: 100,
    },
    hardware: {
      cpu: 'AMD Ryzen 7 7840U',
      gpu: 'RDNA3 12CU',
      ramGb: 16,
      storageGb: 512,
      tdpW: 28,
      architecture: 'x86_64',
      tdpMinW: 8,
      tdpMaxW: 28,
    },
    scores: {
      performance: 88,
      battery: 65,
      screen: 80,
      portability: 50,
      value: 60,
      cooling: 70,
    },
  },
  {
    id: 'gpd-win-4',
    name: 'GPD WIN 4 (2025)',
    brand: 'GPD',
    aliases: ['WIN4', 'GPD'],
    priceCny: 5300,
    weightG: 598,
    batteryWh: 45.6,
    estimatedBatteryH: 3.5,
    year: 2025,
    category: 'pc',
    screen: {
      sizeInch: 6,
      type: 'IPS',
      refreshHz: 60,
      resolution: '1920x1080',
      srgbPercent: 100,
    },
    hardware: {
      cpu: 'AMD Ryzen 7 8840U',
      gpu: 'RDNA3 12CU',
      ramGb: 16,
      storageGb: 1024,
      tdpW: 28,
      architecture: 'x86_64',
      tdpMinW: 8,
      tdpMaxW: 28,
    },
    scores: {
      performance: 85,
      battery: 60,
      screen: 70,
      portability: 70,
      value: 60,
      cooling: 65,
    },
  },
  {
    id: 'switch-oled',
    name: 'Switch OLED',
    brand: 'Nintendo',
    aliases: ['NS', 'NSO', 'Switch'],
    priceCny: 2200,
    weightG: 420,
    batteryWh: 17.5,
    estimatedBatteryH: 5,
    year: 2021,
    category: 'console',
    screen: {
      sizeInch: 7,
      type: 'OLED',
      refreshHz: 60,
      resolution: '1280x720',
      srgbPercent: 100,
    },
    hardware: {
      cpu: 'NVIDIA Tegra X1+',
      gpu: 'Maxwell 256CU',
      ramGb: 4,
      storageGb: 64,
      tdpW: 7,
      architecture: 'ARMv8',
      tdpMinW: 3,
      tdpMaxW: 10,
    },
    scores: {
      performance: 45,
      battery: 70,
      screen: 78,
      portability: 90,
      value: 75,
      cooling: 95,
    },
  },
  {
    id: 'miyoo-mini-plus',
    name: 'Miyoo Mini Plus',
    brand: 'Miyoo',
    aliases: ['Miyoo+', 'Mini+', '复古'],
    priceCny: 400,
    weightG: 136,
    batteryWh: 8,
    estimatedBatteryH: 7,
    year: 2024,
    category: 'retro',
    screen: {
      sizeInch: 3.5,
      type: 'IPS',
      refreshHz: 60,
      resolution: '640x480',
      srgbPercent: 90,
    },
    hardware: {
      cpu: 'Allwinner A133',
      gpu: 'PowerVR GE8300',
      ramGb: 1,
      storageGb: 64,
      tdpW: 3,
      architecture: 'ARMv7',
      tdpMinW: 0.5,
      tdpMaxW: 3,
    },
    scores: {
      performance: 25,
      battery: 90,
      screen: 50,
      portability: 95,
      value: 95,
      cooling: 100,
    },
  },
  {
    id: 'retroid-pocket-4-pro',
    name: 'Retroid Pocket 4 Pro',
    brand: 'Retroid',
    aliases: ['RP4P', 'Retroid'],
    priceCny: 1300,
    weightG: 380,
    batteryWh: 16,
    estimatedBatteryH: 6,
    year: 2024,
    category: 'retro',
    screen: {
      sizeInch: 4.7,
      type: 'IPS',
      refreshHz: 60,
      resolution: '1280x960',
      srgbPercent: 95,
    },
    hardware: {
      cpu: 'Dimensity 1100',
      gpu: 'Mali-G77',
      ramGb: 8,
      storageGb: 128,
      tdpW: 8,
      architecture: 'ARMv8',
      tdpMinW: 2,
      tdpMaxW: 10,
    },
    scores: {
      performance: 60,
      battery: 78,
      screen: 70,
      portability: 88,
      value: 92,
      cooling: 80,
    },
  },
];

export const scoreLabels = ['performance', 'battery', 'screen', 'portability', 'value', 'cooling'] as const;

export type ScoreKey = typeof scoreLabels[number];
