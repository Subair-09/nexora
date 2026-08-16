export type AssetCategory = 'all' | 'forex' | 'crypto' | 'commodities' | 'indices' | 'digital_assets';

export type TransactionType = 'deposit' | 'withdrawal' | 'sent' | 'trade';

export interface LiveTransaction {
  id: string;
  userName: string;
  country: string;
  countryCode: string;
  flag: string;
  type: TransactionType;
  amount: number;
  currency: string;
  formattedAmount: string;
  asset?: string;
  timestamp: string;
  relativeTime: string;
  status: 'completed' | 'processing' | 'confirmed';
  txHash: string;
  note?: string;
}

export interface MarketAsset {
  id: string;
  name: string;
  pair: string;
  category: 'forex' | 'crypto' | 'commodities' | 'indices' | 'digital_assets';
  price: number;
  displayPrice: string;
  change24h: number;
  changeAmount?: string;
  high24h: string;
  low24h: string;
  volume24h: string;
  bidPrice: string;
  askPrice: string;
  spread: string;
  sparkline: number[];
  baseCurrency?: string;
  quoteCurrency?: string;
}

export type TimeInterval = '1H' | '4H' | '1D' | '1W';

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20?: number;
  ma50?: number;
}

export interface SecurityFeature {
  id: string;
  title: string;
  description: string;
  tag: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  location: string;
}

export interface PlatformStat {
  value: string;
  label: string;
  description: string;
  badge?: string;
}

export type OrderSide = 'buy' | 'sell';
export type OrderExecutionType = 'market' | 'limit' | 'stop';

export interface TradePosition {
  id: string;
  pair: string;
  side: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  amount: number;
  leverage: number;
  margin: number;
  pnl: number;
  pnlPercent: number;
  openTime: string;
  takeProfit?: number;
  stopLoss?: number;
}

export interface TerminalOrder {
  id: string;
  pair: string;
  side: OrderSide;
  type: OrderExecutionType;
  amount: number;
  price: number;
  totalValue: number;
  fee: number;
  status: 'filled' | 'pending' | 'cancelled';
  timestamp: string;
  pnlRealized?: number;
}

export interface AssetHolding {
  symbol: string;
  name: string;
  amount: number;
  avgBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface WithdrawalRecord {
  id: string;
  method: 'bank_wire' | 'crypto_usdt' | 'crypto_btc' | 'instant_card';
  destination: string;
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  status: 'processing' | 'settled' | 'confirmed';
  timestamp: string;
  txHash: string;
}

export interface TraderAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: string;
}
