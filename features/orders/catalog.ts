import { CatalogItem } from './types';

export const WATER_CATALOG: CatalogItem[] = [
  {
    id: 'slim-5gal',
    name: '5-Gallon Slim Dispenser',
    description: 'Narrow footprint bottle with built-in front dispensing spigot.',
    volume: '5 Gallons (18.9L)',
    refillPrice: 35,
    newPrice: 250,
  },
  {
    id: 'round-5gal',
    name: '5-Gallon Round Dispenser',
    description: 'Standard round carboy container designed for inverted water coolers.',
    volume: '5 Gallons (18.9L)',
    refillPrice: 40,
    newPrice: 260,
  },
];

export const DELIVERY_WINDOWS = [
  {
    id: 'asap',
    label: 'ASAP (45m)',
    description: 'Earliest dispatch, usually 45-60 minutes.',
  },
  {
    id: 'today_pm',
    label: 'Today 2-5 PM',
    description: 'Afternoon neighborhood delivery window.',
  },
  {
    id: 'tomorrow_am',
    label: 'Tomorrow AM',
    description: 'Morning route, 8:00 AM - 11:30 AM.',
  },
] as const;
