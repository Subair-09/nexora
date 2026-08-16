import { LiveTransaction, TransactionType } from '../types';

export const INITIAL_LIVE_TRANSACTIONS: LiveTransaction[] = [
  {
    id: 'tx-001',
    userName: 'Chin',
    country: 'China',
    countryCode: 'CN',
    flag: '🇨🇳',
    type: 'deposit',
    amount: 200,
    currency: 'USD',
    formattedAmount: '$200.00',
    asset: 'USDT (Tether)',
    timestamp: new Date(Date.now() - 4000).toISOString(),
    relativeTime: 'Just now',
    status: 'completed',
    txHash: '0x8f2a...c94b',
    note: 'Instant Bank Wire / USDT Rail',
  },
  {
    id: 'tx-002',
    userName: 'Mark',
    country: 'USA',
    countryCode: 'US',
    flag: '🇺🇸',
    type: 'deposit',
    amount: 1500,
    currency: 'USD',
    formattedAmount: '$1,500.00',
    asset: 'ACH Direct',
    timestamp: new Date(Date.now() - 12000).toISOString(),
    relativeTime: '12s ago',
    status: 'completed',
    txHash: '0x3e11...77d2',
    note: 'FedNow Instant Clearing',
  },
  {
    id: 'tx-003',
    userName: 'Elena',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    type: 'withdrawal',
    amount: 850,
    currency: 'EUR',
    formattedAmount: '€850.00',
    asset: 'SEPA Instant',
    timestamp: new Date(Date.now() - 25000).toISOString(),
    relativeTime: '25s ago',
    status: 'completed',
    txHash: '0x9a4f...310e',
    note: 'Processed via Deutsche Prime',
  },
  {
    id: 'tx-004',
    userName: 'Kenji',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    type: 'sent',
    amount: 3200,
    currency: 'USD',
    formattedAmount: '$3,200.00',
    asset: 'USDC P2P Transfer',
    timestamp: new Date(Date.now() - 42000).toISOString(),
    relativeTime: '42s ago',
    status: 'completed',
    txHash: '0x1b88...fa09',
    note: 'Internal FastPath Transfer',
  },
  {
    id: 'tx-005',
    userName: 'Mateo',
    country: 'Brazil',
    countryCode: 'BR',
    flag: '🇧🇷',
    type: 'deposit',
    amount: 500,
    currency: 'USD',
    formattedAmount: '$500.00',
    asset: 'PIX Instant Rail',
    timestamp: new Date(Date.now() - 65000).toISOString(),
    relativeTime: '1m ago',
    status: 'completed',
    txHash: '0x7c42...91ab',
    note: 'PIX Real-Time Deposit',
  },
  {
    id: 'tx-006',
    userName: 'Sarah',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    type: 'withdrawal',
    amount: 2400,
    currency: 'GBP',
    formattedAmount: '£2,400.00',
    asset: 'Faster Payments',
    timestamp: new Date(Date.now() - 90000).toISOString(),
    relativeTime: '1m ago',
    status: 'completed',
    txHash: '0x55dc...aa19',
    note: 'Direct UK Clearing',
  },
  {
    id: 'tx-007',
    userName: 'Amir',
    country: 'UAE',
    countryCode: 'AE',
    flag: '🇦🇪',
    type: 'sent',
    amount: 10000,
    currency: 'USD',
    formattedAmount: '$10,000.00',
    asset: 'Institutional Escrow',
    timestamp: new Date(Date.now() - 130000).toISOString(),
    relativeTime: '2m ago',
    status: 'completed',
    txHash: '0x0d33...e421',
    note: 'Prime OTC Gateway',
  },
  {
    id: 'tx-008',
    userName: 'Chloe',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    type: 'deposit',
    amount: 1250,
    currency: 'EUR',
    formattedAmount: '€1,250.00',
    asset: 'Credit Card (Instant)',
    timestamp: new Date(Date.now() - 170000).toISOString(),
    relativeTime: '2m ago',
    status: 'completed',
    txHash: '0x4f12...bb90',
    note: '3D Secure 2.0 Authenticated',
  }
];

const USER_POOL: { name: string; country: string; countryCode: string; flag: string }[] = [
  { name: 'Chin', country: 'China', countryCode: 'CN', flag: '🇨🇳' },
  { name: 'Mark', country: 'USA', countryCode: 'US', flag: '🇺🇸' },
  { name: 'Elena', country: 'Germany', countryCode: 'DE', flag: '🇩🇪' },
  { name: 'Kenji', country: 'Japan', countryCode: 'JP', flag: '🇯🇵' },
  { name: 'Mateo', country: 'Brazil', countryCode: 'BR', flag: '🇧🇷' },
  { name: 'Sarah', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧' },
  { name: 'Amir', country: 'UAE', countryCode: 'AE', flag: '🇦🇪' },
  { name: 'Chloe', country: 'France', countryCode: 'FR', flag: '🇫🇷' },
  { name: 'Liam', country: 'Australia', countryCode: 'AU', flag: '🇦🇺' },
  { name: 'Wei', country: 'Singapore', countryCode: 'SG', flag: '🇸🇬' },
  { name: 'Priya', country: 'India', countryCode: 'IN', flag: '🇮🇳' },
  { name: 'Lukas', country: 'Switzerland', countryCode: 'CH', flag: '🇨🇭' },
  { name: 'Fatima', country: 'Qatar', countryCode: 'QA', flag: '🇶🇦' },
  { name: 'David', country: 'USA', countryCode: 'US', flag: '🇺🇸' },
  { name: 'Carlos', country: 'Mexico', countryCode: 'MX', flag: '🇲🇽' },
  { name: 'Yuki', country: 'Japan', countryCode: 'JP', flag: '🇯🇵' },
  { name: 'Emma', country: 'Canada', countryCode: 'CA', flag: '🇨🇦' },
  { name: 'Giovanni', country: 'Italy', countryCode: 'IT', flag: '🇮🇹' },
  { name: 'Sofia', country: 'Spain', countryCode: 'ES', flag: '🇪🇸' },
  { name: 'Lars', country: 'Norway', countryCode: 'NO', flag: '🇳🇴' },
  { name: 'Amina', country: 'Nigeria', countryCode: 'NG', flag: '🇳🇬' },
  { name: 'Dae-hyun', country: 'South Korea', countryCode: 'KR', flag: '🇰🇷' },
  { name: 'Isabella', country: 'Argentina', countryCode: 'AR', flag: '🇦🇷' },
  { name: 'Nikolai', country: 'Estonia', countryCode: 'EE', flag: '🇪🇪' },
  { name: 'Hassan', country: 'Saudi Arabia', countryCode: 'SA', flag: '🇸🇦' },
  { name: 'Olivia', country: 'New Zealand', countryCode: 'NZ', flag: '🇳🇿' },
];

const AMOUNTS_POOL = [
  50, 100, 150, 200, 250, 300, 450, 500, 750, 850, 1000, 1200, 1500, 2000, 2400, 3200, 4500, 5000, 8500, 10000, 15000, 25000
];

const ASSETS_BY_TYPE = {
  deposit: ['USD Wire', 'USDT (Tether)', 'ACH Instant', 'Credit Card', 'PIX', 'SEPA Instant', 'Crypto Direct', 'Apple Pay'],
  withdrawal: ['Bank Wire', 'SEPA Transfer', 'USDC (Solana)', 'BTC Wallet', 'Faster Payments', 'Direct Deposit', 'Institutional Sweep'],
  sent: ['P2P Internal', 'USDT Rail', 'Instant Sub-Account', 'Global Clearing', 'Escrow Contract', 'OTC Allocation'],
  trade: ['BTC/USD Buy', 'ETH/USD Long', 'EUR/USD Swap', 'Gold (XAU) Buy', 'SOL/USD Fill', 'NVDA/USD Market'],
};

export function generateRandomTransaction(): LiveTransaction {
  const user = USER_POOL[Math.floor(Math.random() * USER_POOL.length)];
  
  // Weighted transaction types: deposits 45%, withdrawals 25%, sent 20%, trades 10%
  const randType = Math.random();
  let type: TransactionType = 'deposit';
  if (randType < 0.45) type = 'deposit';
  else if (randType < 0.70) type = 'withdrawal';
  else if (randType < 0.90) type = 'sent';
  else type = 'trade';

  const amount = AMOUNTS_POOL[Math.floor(Math.random() * AMOUNTS_POOL.length)];
  const assets = ASSETS_BY_TYPE[type];
  const asset = assets[Math.floor(Math.random() * assets.length)];

  // Format currency
  let currency = 'USD';
  let formattedAmount = `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  if (user.countryCode === 'DE' || user.countryCode === 'FR' || user.countryCode === 'ES' || user.countryCode === 'IT') {
    currency = 'EUR';
    formattedAmount = `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (user.countryCode === 'GB') {
    currency = 'GBP';
    formattedAmount = `£${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const randomHex = Math.random().toString(16).substring(2, 6);
  const randomHex2 = Math.random().toString(16).substring(2, 6);

  return {
    id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userName: user.name,
    country: user.country,
    countryCode: user.countryCode,
    flag: user.flag,
    type,
    amount,
    currency,
    formattedAmount,
    asset,
    timestamp: new Date().toISOString(),
    relativeTime: 'Just now',
    status: 'completed',
    txHash: `0x${randomHex}...${randomHex2}`,
    note: `${type.toUpperCase()} verified across global liquidity node`,
  };
}

export function getActionVerb(type: TransactionType): string {
  switch (type) {
    case 'deposit':
      return 'just deposited';
    case 'withdrawal':
      return 'just withdrew';
    case 'sent':
      return 'just sent';
    case 'trade':
      return 'just traded';
  }
}
