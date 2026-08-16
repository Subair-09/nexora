import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  TradePosition, 
  TerminalOrder, 
  AssetHolding, 
  WithdrawalRecord, 
  OrderSide, 
  OrderExecutionType,
  TraderAchievement 
} from '../types';
import { playTradingSound } from '../utils/audio';

export interface LiveMarketQuote {
  pair: string;
  name: string;
  category: 'crypto' | 'forex' | 'commodities' | 'equities';
  price: number;
  basePrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  bid: number;
  ask: number;
  spread: string;
  lastTick: 'up' | 'down' | 'neutral';
  decimals: number;
}

export const DEFAULT_MARKETS: Record<string, LiveMarketQuote> = {
  'BTC/USD': {
    pair: 'BTC/USD',
    name: 'Bitcoin',
    category: 'crypto',
    price: 118420.50,
    basePrice: 118420.50,
    change24h: 2.84,
    high24h: 119100.00,
    low24h: 114890.00,
    volume24h: '$42.8B',
    bid: 118418.00,
    ask: 118422.50,
    spread: '0.003%',
    lastTick: 'up',
    decimals: 2,
  },
  'ETH/USD': {
    pair: 'ETH/USD',
    name: 'Ethereum',
    category: 'crypto',
    price: 4285.20,
    basePrice: 4285.20,
    change24h: 1.72,
    high24h: 4320.00,
    low24h: 4190.50,
    volume24h: '$18.4B',
    bid: 4284.80,
    ask: 4285.60,
    spread: '0.018%',
    lastTick: 'up',
    decimals: 2,
  },
  'SOL/USD': {
    pair: 'SOL/USD',
    name: 'Solana',
    category: 'crypto',
    price: 248.65,
    basePrice: 248.65,
    change24h: 4.15,
    high24h: 254.20,
    low24h: 236.80,
    volume24h: '$9.2B',
    bid: 248.60,
    ask: 248.70,
    spread: '0.04%',
    lastTick: 'up',
    decimals: 2,
  },
  'EUR/USD': {
    pair: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    price: 1.1684,
    basePrice: 1.1684,
    change24h: 0.42,
    high24h: 1.1702,
    low24h: 1.1631,
    volume24h: '$112.5B',
    bid: 1.16838,
    ask: 1.16842,
    spread: '0.4 pips',
    lastTick: 'up',
    decimals: 4,
  },
  'GBP/USD': {
    pair: 'GBP/USD',
    name: 'British Pound / USD',
    category: 'forex',
    price: 1.3472,
    basePrice: 1.3472,
    change24h: 0.31,
    high24h: 1.3490,
    low24h: 1.3425,
    volume24h: '$84.2B',
    bid: 1.34716,
    ask: 1.34724,
    spread: '0.8 pips',
    lastTick: 'neutral',
    decimals: 4,
  },
  'USD/JPY': {
    pair: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'forex',
    price: 147.82,
    basePrice: 147.82,
    change24h: -0.18,
    high24h: 148.35,
    low24h: 147.60,
    volume24h: '$96.1B',
    bid: 147.815,
    ask: 147.825,
    spread: '0.7 pips',
    lastTick: 'down',
    decimals: 2,
  },
  'XAU/USD': {
    pair: 'XAU/USD',
    name: 'Gold / US Dollar',
    category: 'commodities',
    price: 3382.10,
    basePrice: 3382.10,
    change24h: 1.24,
    high24h: 3395.00,
    low24h: 3338.00,
    volume24h: '$28.4B',
    bid: 3381.80,
    ask: 3382.40,
    spread: '$0.60',
    lastTick: 'up',
    decimals: 2,
  },
  'NVDA/USD': {
    pair: 'NVDA/USD',
    name: 'NVIDIA Corp',
    category: 'equities',
    price: 148.75,
    basePrice: 148.75,
    change24h: 3.48,
    high24h: 151.20,
    low24h: 144.50,
    volume24h: '$34.1B',
    bid: 148.70,
    ask: 148.80,
    spread: '$0.10',
    lastTick: 'up',
    decimals: 2,
  },
};

export interface TraderStats {
  rank: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  totalTrades: number;
  winningTrades: number;
  realizedPnl: number;
  soundEnabled: boolean;
}

interface TradingContextType {
  balance: number;
  equity: number;
  marginUsed: number;
  freeMargin: number;
  realizedPnl: number;
  unrealizedPnl: number;
  positions: TradePosition[];
  orders: TerminalOrder[];
  withdrawals: WithdrawalRecord[];
  holdings: AssetHolding[];
  stats: TraderStats;
  markets: Record<string, LiveMarketQuote>;
  achievements: TraderAchievement[];
  
  // Actions
  executeTrade: (params: {
    pair: string;
    side: OrderSide;
    type: OrderExecutionType;
    amount: number;
    price?: number;
    leverage?: number;
    takeProfit?: number;
    stopLoss?: number;
  }) => { success: boolean; message: string; order?: TerminalOrder };
  
  closePosition: (positionId: string) => { success: boolean; pnl: number; message: string };
  cancelOrder: (orderId: string) => void;
  depositFunds: (amount: number, methodTitle?: string) => { success: boolean; newBalance: number };
  withdrawFunds: (params: {
    amount: number;
    method: 'bank_wire' | 'crypto_usdt' | 'crypto_btc' | 'instant_card';
    destination: string;
    currency?: string;
  }) => { success: boolean; record?: WithdrawalRecord; message: string };
  resetSandbox: () => void;
  toggleSound: () => void;
}

const STORAGE_KEYS = {
  BALANCE: 'nexora_demo_balance',
  POSITIONS: 'nexora_demo_positions',
  ORDERS: 'nexora_demo_orders',
  WITHDRAWALS: 'nexora_demo_withdrawals',
  STATS: 'nexora_demo_stats',
  SOUND: 'nexora_demo_sound',
};

const INITIAL_BALANCE = 100000.00; // $100k USD initial demo funding

const INITIAL_ACHIEVEMENTS: TraderAchievement[] = [
  { id: 'first_trade', title: 'First Execution', description: 'Place your first buy or sell order in the terminal.', icon: '🎯', unlocked: false },
  { id: 'profit_maker', title: 'Green Closer', description: 'Close a trade with a positive realized return.', icon: '💰', unlocked: false },
  { id: 'high_leverage', title: 'Margin Ace', description: 'Execute a trade using 10x or higher leverage.', icon: '⚡', unlocked: false },
  { id: 'first_withdraw', title: 'Liquidity Cashout', description: 'Execute a simulated withdrawal to crypto or bank.', icon: '🏧', unlocked: false },
  { id: 'whale_status', title: 'Whale Territory', description: 'Grow total account equity above $150,000 USD.', icon: '🐋', unlocked: false },
];

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Markets quote states with live random walk ticks
  const [markets, setMarkets] = useState<Record<string, LiveMarketQuote>>(DEFAULT_MARKETS);

  // Cash Balance
  const [balance, setBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
      return saved ? parseFloat(saved) : INITIAL_BALANCE;
    } catch {
      return INITIAL_BALANCE;
    }
  });

  // Open Positions
  const [positions, setPositions] = useState<TradePosition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSITIONS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'pos-init-1',
          pair: 'BTC/USD',
          side: 'long',
          entryPrice: 116250.00,
          currentPrice: 118420.50,
          amount: 0.5,
          leverage: 5,
          margin: 11625.00,
          pnl: 1085.25,
          pnlPercent: 9.33,
          openTime: '2 hours ago',
          takeProfit: 125000,
          stopLoss: 112000,
        },
      ];
    } catch {
      return [];
    }
  });

  // Orders history
  const [orders, setOrders] = useState<TerminalOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'ord-init-1',
          pair: 'BTC/USD',
          side: 'buy',
          type: 'limit',
          amount: 0.5,
          price: 116250.00,
          totalValue: 58125.00,
          fee: 29.06,
          status: 'filled',
          timestamp: 'Today, 09:15:22',
        },
      ];
    } catch {
      return [];
    }
  });

  // Withdrawals history
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'wdr-sample-1',
          method: 'crypto_usdt',
          destination: '0x71C...a89F (TRC20)',
          amount: 5000,
          fee: 1.5,
          netAmount: 4998.5,
          currency: 'USDT',
          status: 'settled',
          timestamp: 'Yesterday, 18:40',
          txHash: '0x49f1...8e3b',
        },
      ];
    } catch {
      return [];
    }
  });

  // Trader profile stats
  const [stats, setStats] = useState<TraderStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      return saved ? JSON.parse(saved) : {
        rank: 'Apprentice Scalper',
        level: 1,
        xp: 150,
        nextLevelXp: 500,
        totalTrades: 3,
        winningTrades: 2,
        realizedPnl: 1420.50,
        soundEnabled: true,
      };
    } catch {
      return {
        rank: 'Apprentice Scalper',
        level: 1,
        xp: 150,
        nextLevelXp: 500,
        totalTrades: 3,
        winningTrades: 2,
        realizedPnl: 1420.50,
        soundEnabled: true,
      };
    }
  });

  // Achievements
  const [achievements, setAchievements] = useState<TraderAchievement[]>(INITIAL_ACHIEVEMENTS);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BALANCE, balance.toString());
      localStorage.setItem(STORAGE_KEYS.POSITIONS, JSON.stringify(positions));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      // Ignore storage limit
    }
  }, [balance, positions, orders, withdrawals, stats]);

  // Real-time market tick engine (ticks prices every 1.6s with organic small random delta)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setMarkets((prevMarkets) => {
        const updated: Record<string, LiveMarketQuote> = { ...prevMarkets };
        
        Object.keys(updated).forEach((pair) => {
          const m = updated[pair];
          // 70% chance of small tick
          if (Math.random() > 0.3) {
            const volatility = pair.includes('BTC') ? 15 : pair.includes('ETH') ? 1.5 : pair.includes('SOL') ? 0.3 : pair.includes('XAU') ? 0.8 : 0.0003;
            const delta = (Math.random() - 0.49) * volatility;
            const newPrice = Math.max(0.0001, Number((m.price + delta).toFixed(m.decimals)));
            const tickDir: 'up' | 'down' = delta >= 0 ? 'up' : 'down';
            
            const spreadDelta = m.decimals === 4 ? 0.00004 : m.decimals === 2 ? 0.05 : 2;
            updated[pair] = {
              ...m,
              price: newPrice,
              lastTick: tickDir,
              bid: Number((newPrice - spreadDelta).toFixed(m.decimals)),
              ask: Number((newPrice + spreadDelta).toFixed(m.decimals)),
            };
          }
        });
        
        return updated;
      });
    }, 1600);

    return () => clearInterval(tickInterval);
  }, []);

  // Update open positions' currentPrice & live PnL based on market quotes
  useEffect(() => {
    setPositions((prevPositions) => {
      if (prevPositions.length === 0) return prevPositions;

      return prevPositions.map((pos) => {
        const currentQuote = markets[pos.pair];
        const currentPrice = currentQuote ? currentQuote.price : pos.currentPrice;
        
        let pnl = 0;
        if (pos.side === 'long') {
          pnl = (currentPrice - pos.entryPrice) * pos.amount * pos.leverage;
        } else {
          pnl = (pos.entryPrice - currentPrice) * pos.amount * pos.leverage;
        }
        
        const pnlPercent = (pnl / (pos.margin || 1)) * 100;

        return {
          ...pos,
          currentPrice,
          pnl: Number(pnl.toFixed(2)),
          pnlPercent: Number(pnlPercent.toFixed(2)),
        };
      });
    });
  }, [markets]);

  // Compute Margin in Use & Total Equity
  const marginUsed = positions.reduce((sum, p) => sum + (p.margin || 0), 0);
  const unrealizedPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const equity = balance + marginUsed + unrealizedPnl;
  const freeMargin = Math.max(0, balance);

  // Helper to add XP and evaluate rank level up
  const addXp = useCallback((amount: number) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newRank = prev.rank;
      let nextThreshold = prev.nextLevelXp;

      if (newXp >= prev.nextLevelXp) {
        newLevel += 1;
        nextThreshold = newLevel * 1000;
        if (newLevel >= 4) newRank = 'Market Maker Whale';
        else if (newLevel >= 3) newRank = 'Fund Lead Specialist';
        else if (newLevel >= 2) newRank = 'Prop Desk Trader';

        playTradingSound('levelUp', prev.soundEnabled);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        rank: newRank,
        nextLevelXp: nextThreshold,
      };
    });
  }, []);

  // Execute a new trade (Buy/Sell, Market/Limit)
  const executeTrade = useCallback((params: {
    pair: string;
    side: OrderSide;
    type: OrderExecutionType;
    amount: number;
    price?: number;
    leverage?: number;
    takeProfit?: number;
    stopLoss?: number;
  }) => {
    const market = markets[params.pair] || DEFAULT_MARKETS['BTC/USD'];
    const execPrice = params.type === 'market' ? (params.side === 'buy' ? market.ask : market.bid) : (params.price || market.price);
    const leverage = params.leverage || 1;
    const totalOrderValue = params.amount * execPrice;
    const requiredMargin = totalOrderValue / leverage;
    const fee = totalOrderValue * 0.0005; // 0.05% institutional maker/taker fee

    if (requiredMargin + fee > balance) {
      return {
        success: false,
        message: `Insufficient margin. Required: $${(requiredMargin + fee).toLocaleString('en-US', { minimumFractionDigits: 2 })} | Available Cash: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      };
    }

    // Deduct margin and fee from cash balance
    setBalance((prev) => prev - requiredMargin - fee);

    const newPosition: TradePosition = {
      id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      pair: params.pair,
      side: params.side === 'buy' ? 'long' : 'short',
      entryPrice: execPrice,
      currentPrice: execPrice,
      amount: params.amount,
      leverage,
      margin: requiredMargin,
      pnl: 0,
      pnlPercent: 0,
      openTime: 'Just now',
      takeProfit: params.takeProfit,
      stopLoss: params.stopLoss,
    };

    const newOrder: TerminalOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      pair: params.pair,
      side: params.side,
      type: params.type,
      amount: params.amount,
      price: execPrice,
      totalValue: totalOrderValue,
      fee,
      status: 'filled',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setPositions((prev) => [newPosition, ...prev]);
    setOrders((prev) => [newOrder, ...prev.slice(0, 49)]);

    setStats((prev) => ({
      ...prev,
      totalTrades: prev.totalTrades + 1,
    }));

    addXp(60);
    playTradingSound(params.side === 'buy' ? 'buy' : 'sell', stats.soundEnabled);

    return {
      success: true,
      message: `⚡ ${params.side.toUpperCase()} ${params.amount} ${params.pair.split('/')[0]} @ $${execPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} Filled!`,
      order: newOrder,
    };
  }, [markets, balance, stats.soundEnabled, addXp]);

  // Close an active position
  const closePosition = useCallback((positionId: string) => {
    const pos = positions.find((p) => p.id === positionId);
    if (!pos) {
      return { success: false, pnl: 0, message: 'Position not found' };
    }

    const currentQuote = markets[pos.pair];
    const exitPrice = currentQuote ? (pos.side === 'long' ? currentQuote.bid : currentQuote.ask) : pos.currentPrice;
    
    let finalPnl = 0;
    if (pos.side === 'long') {
      finalPnl = (exitPrice - pos.entryPrice) * pos.amount * pos.leverage;
    } else {
      finalPnl = (pos.entryPrice - exitPrice) * pos.amount * pos.leverage;
    }

    const returnedFunds = pos.margin + finalPnl;

    // Credit returned margin + realized PnL back to balance
    setBalance((prev) => Math.max(0, prev + returnedFunds));
    setPositions((prev) => prev.filter((p) => p.id !== positionId));

    // Record closed trade in order log
    const closeOrder: TerminalOrder = {
      id: `ord-close-${Date.now()}`,
      pair: pos.pair,
      side: pos.side === 'long' ? 'sell' : 'buy',
      type: 'market',
      amount: pos.amount,
      price: exitPrice,
      totalValue: pos.amount * exitPrice,
      fee: pos.amount * exitPrice * 0.0005,
      status: 'filled',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      pnlRealized: finalPnl,
    };

    setOrders((prev) => [closeOrder, ...prev.slice(0, 49)]);

    // Update stats & XP
    const isWin = finalPnl > 0;
    setStats((prev) => ({
      ...prev,
      realizedPnl: prev.realizedPnl + finalPnl,
      winningTrades: isWin ? prev.winningTrades + 1 : prev.winningTrades,
    }));

    addXp(isWin ? 150 : 40);
    playTradingSound(isWin ? 'profit' : 'loss', stats.soundEnabled);

    return {
      success: true,
      pnl: finalPnl,
      message: `Position Closed: ${isWin ? '+' : ''}$${finalPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${isWin ? 'PROFIT' : 'LOSS'}) settled to Cash.`,
    };
  }, [positions, markets, stats.soundEnabled, addXp]);

  // Cancel a pending order
  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    playTradingSound('click', stats.soundEnabled);
  }, [stats.soundEnabled]);

  // Deposit funds (demo faucet)
  const depositFunds = useCallback((amount: number, methodTitle: string = 'Instant Demo Liquidity Faucet') => {
    if (amount <= 0) return { success: false, newBalance: balance };

    setBalance((prev) => {
      const next = prev + amount;
      return next;
    });

    const depositTx: WithdrawalRecord = {
      id: `dep-${Date.now()}`,
      method: 'instant_card',
      destination: methodTitle,
      amount,
      fee: 0,
      netAmount: amount,
      currency: 'USD',
      status: 'settled',
      timestamp: 'Just now',
      txHash: `0x${Math.random().toString(36).substr(2, 8)}...faucet`,
    };

    setWithdrawals((prev) => [depositTx, ...prev]);
    addXp(100);
    playTradingSound('deposit', stats.soundEnabled);

    return { success: true, newBalance: balance + amount };
  }, [balance, stats.soundEnabled, addXp]);

  // Withdraw funds (interactive payout simulation)
  const withdrawFunds = useCallback((params: {
    amount: number;
    method: 'bank_wire' | 'crypto_usdt' | 'crypto_btc' | 'instant_card';
    destination: string;
    currency?: string;
  }) => {
    const fee = params.method === 'bank_wire' ? 15.00 : params.method === 'crypto_btc' ? 8.50 : 1.50;
    const totalDeduction = params.amount + fee;

    if (totalDeduction > balance) {
      return {
        success: false,
        message: `Insufficient available cash. You requested $${params.amount.toLocaleString()} + $${fee} fee, but cash balance is $${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      };
    }

    setBalance((prev) => prev - totalDeduction);

    const record: WithdrawalRecord = {
      id: `wdr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      method: params.method,
      destination: params.destination || 'Institutional Vault Direct',
      amount: params.amount,
      fee,
      netAmount: params.amount,
      currency: params.currency || 'USD',
      status: 'settled',
      timestamp: 'Just now',
      txHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
    };

    setWithdrawals((prev) => [record, ...prev]);
    addXp(120);
    playTradingSound('withdraw', stats.soundEnabled);

    return {
      success: true,
      record,
      message: `Withdrawal of $${params.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} successfully routed to ${params.destination}.`,
    };
  }, [balance, stats.soundEnabled, addXp]);

  // Reset sandbox to initial $100k
  const resetSandbox = useCallback(() => {
    setBalance(INITIAL_BALANCE);
    setPositions([]);
    setOrders([]);
    setWithdrawals([]);
    setStats({
      rank: 'Apprentice Scalper',
      level: 1,
      xp: 0,
      nextLevelXp: 500,
      totalTrades: 0,
      winningTrades: 0,
      realizedPnl: 0,
      soundEnabled: true,
    });
    playTradingSound('click', true);
  }, []);

  const toggleSound = useCallback(() => {
    setStats((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  // Compute spot holdings from open positions
  const holdings: AssetHolding[] = Object.keys(DEFAULT_MARKETS)
    .map((pair) => {
      const symbol = pair.split('/')[0];
      const m = markets[pair] || DEFAULT_MARKETS[pair];
      const pairPositions = positions.filter((p) => p.pair === pair && p.side === 'long');
      const totalAmount = pairPositions.reduce((sum, p) => sum + p.amount, 0);
      const totalCost = pairPositions.reduce((sum, p) => sum + p.amount * p.entryPrice, 0);
      const avgBuyPrice = totalAmount > 0 ? totalCost / totalAmount : m.price;
      const currentValue = totalAmount * m.price;
      const pnl = currentValue - totalCost;
      const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

      return {
        symbol,
        name: m.name,
        amount: Number(totalAmount.toFixed(4)),
        avgBuyPrice: Number(avgBuyPrice.toFixed(2)),
        currentPrice: m.price,
        currentValue: Number(currentValue.toFixed(2)),
        pnl: Number(pnl.toFixed(2)),
        pnlPercent: Number(pnlPercent.toFixed(2)),
      };
    })
    .filter((h) => h.amount > 0);

  return (
    <TradingContext.Provider
      value={{
        balance,
        equity,
        marginUsed,
        freeMargin,
        realizedPnl: stats.realizedPnl,
        unrealizedPnl,
        positions,
        orders,
        withdrawals,
        holdings,
        stats,
        markets,
        achievements,
        executeTrade,
        closePosition,
        cancelOrder,
        depositFunds,
        withdrawFunds,
        resetSandbox,
        toggleSound,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = (): TradingContextType => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
