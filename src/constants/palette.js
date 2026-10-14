/**
 * Strawberry & Matcha Design Palette
 * - Strawberry: #F9D1D9 (Soft blush berry)
 * - Matcha:     #838F58 (Earthy powdered green tea)
 */

export const PALETTE = {
  strawberry: {
    name: 'strawberry',
    hex: '#F9D1D9',
    rgb: '249, 209, 217',
    label: 'Soft Berry Foam',
    textOnColor: '#838F58',
    role: 'Primary accents, delicate badges & card highlights'
  },
  matcha: {
    name: 'matcha',
    hex: '#838F58',
    rgb: '131, 143, 88',
    label: 'Stoneground Green Tea',
    textOnColor: '#F9D1D9',
    role: 'Primary action buttons, checkmarks & completed states'
  },
  creamLinen: {
    name: 'cream linen',
    hex: '#FAF7F2',
    rgb: '250, 247, 242',
    label: 'Warm Milk Canvas',
    textOnColor: '#282F1B',
    role: 'Ambient board background'
  },
  espresso: {
    name: 'deep espresso',
    hex: '#282F1B',
    rgb: '40, 47, 27',
    label: 'Rich Organic Ink',
    textOnColor: '#FFFFFF',
    role: 'Editorial headlines & readable typography'
  }
};

export const COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    description: 'Fresh tasks waiting to start',
    accentColor: '#F9D1D9',
    badgeBg: '#FDF2F4',
    badgeText: '#9A3B52',
    borderColor: '#F9D1D9',
    dotColor: '#C96B7F'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    description: 'Currently brewing & being created',
    accentColor: '#B2BD8D',
    badgeBg: '#F5F7EC',
    badgeText: '#5A6635',
    borderColor: '#D4DCBC',
    dotColor: '#838F58'
  },
  {
    id: 'completed',
    title: 'Completed',
    description: 'Done & fully bloomed',
    accentColor: '#838F58',
    badgeBg: '#EFF3E6',
    badgeText: '#465126',
    borderColor: '#838F58',
    dotColor: '#535E32'
  }
];
