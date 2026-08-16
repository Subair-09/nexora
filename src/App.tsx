import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarketTicker } from './components/MarketTicker';
import { MarketsSection } from './components/MarketsSection';
import { WhyNexora } from './components/WhyNexora';
import { TradingTerminalPreview } from './components/TradingTerminalPreview';
import { MobileAppSection } from './components/MobileAppSection';
import { SecuritySection } from './components/SecuritySection';
import { StatsSection } from './components/StatsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { AccountModal } from './components/AccountModal';
import { MarketDetailModal } from './components/MarketDetailModal';
import { LiveTransactionPopup } from './components/LiveTransactionPopup';
import { LiveTransactionsLedgerModal } from './components/LiveTransactionsLedgerModal';
import { ToastContainer, ToastData } from './components/Toast';
import { MarketAsset, LiveTransaction } from './types';
import { INITIAL_LIVE_TRANSACTIONS, generateRandomTransaction } from './data/transactionData';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountModalMode, setAccountModalMode] = useState<'open_account' | 'login'>('open_account');
  const [selectedDetailMarket, setSelectedDetailMarket] = useState<MarketAsset | null>(null);
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Global live transactions stream
  const [liveTransactions, setLiveTransactions] = useState<LiveTransaction[]>(INITIAL_LIVE_TRANSACTIONS);
  const [currentPopupTx, setCurrentPopupTx] = useState<LiveTransaction | null>(INITIAL_LIVE_TRANSACTIONS[0]);

  // Interval to generate realistic transactions (Chin from China, Mark from USA, Elena from Germany, Kenji from Japan, etc.)
  useEffect(() => {
    const interval = setInterval(() => {
      const nextTx = generateRandomTransaction();
      setCurrentPopupTx(nextTx);
      setLiveTransactions((prev) => [nextTx, ...prev.slice(0, 35)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (title: string, message: string, type: 'success' | 'info' = 'success') => {
    const newToast: ToastData = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenAccount = () => {
    setAccountModalMode('open_account');
    setAccountModalOpen(true);
  };

  const handleLogIn = () => {
    setAccountModalMode('login');
    setAccountModalOpen(true);
  };

  const handleExploreMarkets = () => {
    const el = document.getElementById('markets');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTradeInTerminal = (pair: string) => {
    const el = document.getElementById('terminal');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(
      'Chart Loaded',
      `${pair} order interface and depth charts ready in terminal view.`,
      'info'
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 selection:bg-blue-600 selection:text-white ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0A0E14] text-white'
    }`}>
      {/* Sticky Top Navbar */}
      <Navbar
        onOpenAccount={handleOpenAccount}
        onLogIn={handleLogIn}
        onExploreMarkets={handleExploreMarkets}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section with Floating Trading Dashboard & Live Feed */}
        <Hero
          onOpenAccount={handleOpenAccount}
          onExploreMarkets={handleExploreMarkets}
          onSelectMarket={(market) => setSelectedDetailMarket(market)}
          onViewLedger={() => setLedgerModalOpen(true)}
        />

        {/* Sub-Hero Horizontal Market Ticker */}
        <MarketTicker onSelectMarket={(market) => setSelectedDetailMarket(market)} />

        {/* Markets Explorer Section */}
        <MarketsSection
          onSelectMarket={(market) => setSelectedDetailMarket(market)}
          onOpenAccount={handleOpenAccount}
        />

        {/* Why NEXORA 4-Column Feature Section */}
        <WhyNexora />

        {/* Dark/Light Trading Terminal Interactive Preview with Live Order/Activity Feeds */}
        <TradingTerminalPreview onShowToast={showToast} />

        {/* Mobile App & Pocket Trading Section */}
        <MobileAppSection />

        {/* Security & System Safeguards Section */}
        <SecuritySection />

        {/* Platform Statistics & Infrastructure Benchmarks */}
        <StatsSection />

        {/* Testimonials Prototype Section */}
        <TestimonialsSection />

        {/* Final Conversion CTA Section */}
        <FinalCTA
          onOpenAccount={handleOpenAccount}
          onExploreMarkets={handleExploreMarkets}
        />
      </main>

      {/* Institutional Multi-Column Footer with Risk Warning */}
      <Footer
        onOpenAccount={handleOpenAccount}
        onExploreMarkets={handleExploreMarkets}
      />

      {/* Floating Animated Live Transaction Popups (Chin from China, Mark from USA, Elena from Germany, etc.) */}
      <LiveTransactionPopup
        currentTransaction={currentPopupTx}
        onViewLedger={() => setLedgerModalOpen(true)}
      />

      {/* Real-Time Live Audit Ledger Modal */}
      <LiveTransactionsLedgerModal
        isOpen={ledgerModalOpen}
        onClose={() => setLedgerModalOpen(false)}
        transactions={liveTransactions}
      />

      {/* Modals & Notification Overlays */}
      <AccountModal
        isOpen={accountModalOpen}
        mode={accountModalMode}
        onClose={() => setAccountModalOpen(false)}
        onSuccess={(msg) => showToast('Session Active', msg, 'success')}
      />

      <MarketDetailModal
        market={selectedDetailMarket}
        onClose={() => setSelectedDetailMarket(null)}
        onTradeInTerminal={handleTradeInTerminal}
      />

      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
