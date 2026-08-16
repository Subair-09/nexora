import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Maximize2,
  Minimize2,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  Ruler,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  BarChart2,
  Radio,
  Flame,
  Volume2,
  VolumeX,
  Target,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CandlestickData, TimeInterval, TradePosition } from '../types';
import { LiveMarketQuote } from '../context/TradingContext';
import {
  calculateEMA,
  calculateBollingerBands,
  calculateRSI,
  calculateMACD,
  toHeikinAshi,
  generateInitialCandles,
  BollingerBandPoint,
  MacdPoint,
} from '../utils/chartIndicators';

export type ChartVisualMode = 'candles' | 'hollow' | 'heikin_ashi' | 'area' | 'baseline';
export type SubChartType = 'none' | 'rsi' | 'macd' | 'volume';

interface InteractiveTradingChartProps {
  pair: string;
  currentQuote: LiveMarketQuote;
  positions: TradePosition[];
  isLight: boolean;
  onClosePosition?: (posId: string) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const InteractiveTradingChart: React.FC<InteractiveTradingChartProps> = ({
  pair,
  currentQuote,
  positions,
  isLight,
  onClosePosition,
  onShowToast,
}) => {
  // Chart visual configuration
  const [chartMode, setChartMode] = useState<ChartVisualMode>('candles');
  const [timeInterval, setTimeInterval] = useState<string>('1m');
  const [subChart, setSubChart] = useState<SubChartType>('rsi');
  
  // Indicator toggles
  const [showEMA20, setShowEMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showPositionLines, setShowPositionLines] = useState(true);
  const [turboMode, setTurboMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Ruler measurement tool
  const [rulerActive, setRulerActive] = useState(false);
  const [rulerStart, setRulerStart] = useState<{ x: number; y: number; price: number; idx: number } | null>(null);
  const [rulerCurrent, setRulerCurrent] = useState<{ x: number; y: number; price: number; idx: number } | null>(null);

  // Candlestick historical and active live stream
  const [candles, setCandles] = useState<CandlestickData[]>(() => {
    return generateInitialCandles(pair, currentQuote.price, 36);
  });

  // Candle creation countdown timer
  const [candleProgress, setCandleProgress] = useState(0); // 0 to 100%
  const [candleDurationSec, setCandleDurationSec] = useState(turboMode ? 4 : 12);
  const [secondsRemaining, setSecondsRemaining] = useState(turboMode ? 4 : 12);

  // Zoom / visible candle slice
  const [zoomLevel, setZoomLevel] = useState(32); // number of visible candles
  const [panOffset, setPanOffset] = useState(0); // offset from right edge

  // Interactive mouse/touch tracking
  const [crosshair, setCrosshair] = useState<{
    x: number;
    y: number;
    price: number;
    candle: CandlestickData | null;
    candleIdx: number | null;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    price: 0,
    candle: null,
    candleIdx: null,
    visible: false,
  });

  // Tick flash effect
  const [lastTickDirection, setLastTickDirection] = useState<'up' | 'down' | null>(null);
  const [tickCounter, setTickCounter] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Price formatting helper
  const formatPrice = useCallback((val: number) => {
    if (val >= 1000) {
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (val >= 10) {
      return `$${val.toFixed(2)}`;
    } else if (val >= 1) {
      return `$${val.toFixed(4)}`;
    } else {
      return `$${val.toFixed(5)}`;
    }
  }, []);

  // Format short price for Y-axis
  const formatAxisPrice = useCallback((val: number) => {
    if (val >= 1000) {
      return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
    } else if (val >= 10) {
      return val.toFixed(2);
    } else {
      return val.toFixed(4);
    }
  }, []);

  // Whenever pair changes, re-initialize candles to match asset price level
  useEffect(() => {
    setCandles(generateInitialCandles(pair, currentQuote.price, 36));
    setPanOffset(0);
  }, [pair]);

  // Adjust candle timer duration based on timeframe and turbo mode
  useEffect(() => {
    let dur = 8;
    if (turboMode) {
      dur = 4;
    } else if (timeInterval === '1s') {
      dur = 2;
    } else if (timeInterval === '1m') {
      dur = 10;
    } else if (timeInterval === '5m') {
      dur = 20;
    } else if (timeInterval === '15m') {
      dur = 30;
    } else {
      dur = 45;
    }
    setCandleDurationSec(dur);
    setSecondsRemaining(dur);
  }, [timeInterval, turboMode]);

  // Real-time live candle morphing engine with active price updates
  useEffect(() => {
    const livePrice = currentQuote.price;
    setLastTickDirection(currentQuote.lastTick === 'neutral' ? 'up' : currentQuote.lastTick);
    setTickCounter((prev) => prev + 1);

    setCandles((prevCandles) => {
      if (prevCandles.length === 0) return prevCandles;
      const copy = [...prevCandles];
      const activeIdx = copy.length - 1;
      const active = { ...copy[activeIdx] };

      // Morph active candle with incoming real-time quote
      active.close = livePrice;
      if (livePrice > active.high) active.high = livePrice;
      if (livePrice < active.low) active.low = livePrice;
      active.volume += Math.floor(Math.random() * 25) + 5;

      copy[activeIdx] = active;
      return copy;
    });
  }, [currentQuote.price, currentQuote.lastTick]);

  // Candle generation loop (completes candle and adds new active bar)
  useEffect(() => {
    const intervalTime = 100; // ms
    const totalSteps = (candleDurationSec * 1000) / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const pct = (step / totalSteps) * 100;
      const rem = Math.max(0, candleDurationSec - (step * intervalTime) / 1000);
      setCandleProgress(pct);
      setSecondsRemaining(Math.ceil(rem));

      if (step >= totalSteps) {
        step = 0;
        // Seal current candle and start a new one!
        setCandles((prev) => {
          if (prev.length === 0) return prev;
          const lastCandle = prev[prev.length - 1];
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

          const newCandle: CandlestickData = {
            time: timeStr,
            open: lastCandle.close,
            high: lastCandle.close,
            low: lastCandle.close,
            close: lastCandle.close,
            volume: Math.floor(Math.random() * 150) + 50,
          };

          // Maintain rolling window of 60 candles
          const updated = [...prev.slice(-55), newCandle];
          return updated;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [candleDurationSec, pair]);

  // Turbo Micro-Ticks: Generates organic live fluctuations every 500ms
  useEffect(() => {
    if (!turboMode) return;

    const turboInterval = setInterval(() => {
      const volatility = currentQuote.price * 0.0003;
      const delta = (Math.random() - 0.49) * volatility;
      const microPrice = Math.max(0.0001, Number((currentQuote.price + delta).toFixed(currentQuote.decimals)));

      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const copy = [...prev];
        const lastIdx = copy.length - 1;
        const active = { ...copy[lastIdx] };

        active.close = microPrice;
        if (microPrice > active.high) active.high = microPrice;
        if (microPrice < active.low) active.low = microPrice;
        active.volume += Math.floor(Math.random() * 8) + 1;

        copy[lastIdx] = active;
        return copy;
      });
    }, 550);

    return () => clearInterval(turboInterval);
  }, [turboMode, currentQuote.price, currentQuote.decimals]);

  // Filter positions for current pair
  const activePairPositions = useMemo(() => {
    return positions.filter((p) => p.pair === pair);
  }, [positions, pair]);

  // Process data with Heikin-Ashi if enabled
  const displayCandles = useMemo(() => {
    if (chartMode === 'heikin_ashi') {
      return toHeikinAshi(candles);
    }
    return candles;
  }, [candles, chartMode]);

  // Visible slice based on zoom & pan
  const visibleData = useMemo(() => {
    const end = Math.max(zoomLevel, displayCandles.length - panOffset);
    const start = Math.max(0, end - zoomLevel);
    return displayCandles.slice(start, end);
  }, [displayCandles, zoomLevel, panOffset]);

  // Indicator Calculations
  const ema20Data = useMemo(() => calculateEMA(displayCandles, 20), [displayCandles]);
  const ema50Data = useMemo(() => calculateEMA(displayCandles, 50), [displayCandles]);
  const bollingerData = useMemo(() => calculateBollingerBands(displayCandles, 20, 2), [displayCandles]);
  const rsiData = useMemo(() => calculateRSI(displayCandles, 14), [displayCandles]);
  const macdData = useMemo(() => calculateMACD(displayCandles), [displayCandles]);

  // Dimensions & Scale Math
  const width = 860;
  const isSubChartOpen = subChart !== 'none';
  const mainHeight = isSubChartOpen ? 260 : 340;
  const subChartHeight = isSubChartOpen ? 90 : 0;
  const totalSvgHeight = mainHeight + (isSubChartOpen ? subChartHeight + 20 : 0);

  const padding = { top: 24, right: 75, bottom: isSubChartOpen ? 15 : 30, left: 15 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = mainHeight - padding.top - padding.bottom;

  // Price Bounds Math with dynamic padding
  const priceMinMax = useMemo(() => {
    if (visibleData.length === 0) return { min: 0, max: 100, range: 100 };
    const prices = visibleData.flatMap((d) => [d.high, d.low]);

    // Also include active position entry prices and TP/SL in range so they are always visible!
    activePairPositions.forEach((pos) => {
      prices.push(pos.entryPrice);
      if (pos.takeProfit) prices.push(pos.takeProfit);
      if (pos.stopLoss) prices.push(pos.stopLoss);
    });

    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);
    const buffer = (rawMax - rawMin) * 0.08 || rawMax * 0.01;
    const min = Math.max(0.00001, rawMin - buffer);
    const max = rawMax + buffer;
    const range = max - min || 1;

    return { min, max, range };
  }, [visibleData, activePairPositions]);

  const { min: minPrice, max: maxPrice, range: priceRange } = priceMinMax;

  // Coordinates helper functions
  const getY = useCallback(
    (price: number) => {
      return padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    },
    [minPrice, priceRange, chartHeight, padding.top]
  );

  const getPriceFromY = useCallback(
    (y: number) => {
      const normalized = (padding.top + chartHeight - y) / chartHeight;
      return minPrice + normalized * priceRange;
    },
    [minPrice, priceRange, chartHeight, padding.top]
  );

  const getX = useCallback(
    (index: number) => {
      return padding.left + (index + 0.5) * (chartWidth / visibleData.length);
    },
    [chartWidth, visibleData.length, padding.left]
  );

  const candleBarWidth = useMemo(() => {
    const raw = (chartWidth / visibleData.length) * 0.68;
    return Math.max(4, Math.min(24, raw));
  }, [chartWidth, visibleData.length]);

  // Y-Axis Grid ticks
  const yAxisTicks = useMemo(() => {
    const ticksCount = 6;
    const step = priceRange / (ticksCount - 1);
    const list: number[] = [];
    for (let i = 0; i < ticksCount; i++) {
      list.push(minPrice + step * i);
    }
    return list;
  }, [minPrice, priceRange]);

  // Volume scale
  const maxVolume = useMemo(() => {
    const vols = visibleData.map((d) => d.volume);
    return Math.max(...vols, 100);
  }, [visibleData]);

  // Current active live candle
  const activeCandle = visibleData[visibleData.length - 1] || candles[candles.length - 1];
  const activePriceY = getY(currentQuote.price);
  const isUp = activeCandle ? activeCandle.close >= activeCandle.open : true;

  // Moving Average SVG Path builders
  const visibleStartIndex = Math.max(0, displayCandles.length - panOffset - zoomLevel);

  const ema20Path = useMemo(() => {
    if (!showEMA20) return '';
    const points: string[] = [];
    visibleData.forEach((_, idx) => {
      const globalIdx = visibleStartIndex + idx;
      const val = ema20Data[globalIdx];
      if (val !== null && val !== undefined) {
        const x = getX(idx);
        const y = getY(val);
        points.push(`${x},${y}`);
      }
    });
    return points.length > 1 ? `M ${points.join(' L ')}` : '';
  }, [showEMA20, visibleData, visibleStartIndex, ema20Data, getX, getY]);

  const ema50Path = useMemo(() => {
    if (!showEMA50) return '';
    const points: string[] = [];
    visibleData.forEach((_, idx) => {
      const globalIdx = visibleStartIndex + idx;
      const val = ema50Data[globalIdx];
      if (val !== null && val !== undefined) {
        const x = getX(idx);
        const y = getY(val);
        points.push(`${x},${y}`);
      }
    });
    return points.length > 1 ? `M ${points.join(' L ')}` : '';
  }, [showEMA50, visibleData, visibleStartIndex, ema50Data, getX, getY]);

  // Bollinger Bands SVG paths
  const bollingerPaths = useMemo(() => {
    if (!showBollinger) return { upper: '', middle: '', lower: '', area: '' };
    const uPoints: string[] = [];
    const mPoints: string[] = [];
    const lPoints: string[] = [];

    visibleData.forEach((_, idx) => {
      const globalIdx = visibleStartIndex + idx;
      const band = bollingerData[globalIdx];
      if (band) {
        const x = getX(idx);
        uPoints.push(`${x},${getY(band.upper)}`);
        mPoints.push(`${x},${getY(band.middle)}`);
        lPoints.push(`${x},${getY(band.lower)}`);
      }
    });

    if (uPoints.length < 2) return { upper: '', middle: '', lower: '', area: '' };

    const upper = `M ${uPoints.join(' L ')}`;
    const middle = `M ${mPoints.join(' L ')}`;
    const lower = `M ${lPoints.join(' L ')}`;
    
    // Area polygon between upper and lower
    const reversedLower = [...lPoints].reverse();
    const area = `M ${uPoints[0]} L ${uPoints.join(' L ')} L ${reversedLower.join(' L ')} Z`;

    return { upper, middle, lower, area };
  }, [showBollinger, visibleData, visibleStartIndex, bollingerData, getX, getY]);

  // Area Chart Line & Gradient Path
  const areaPaths = useMemo(() => {
    if (chartMode !== 'area' && chartMode !== 'baseline') return { line: '', fill: '' };
    const points = visibleData.map((d, idx) => `${getX(idx)},${getY(d.close)}`);
    if (points.length < 2) return { line: '', fill: '' };

    const line = `M ${points.join(' L ')}`;
    const bottomY = padding.top + chartHeight;
    const firstX = getX(0);
    const lastX = getX(visibleData.length - 1);
    const fill = `M ${firstX},${bottomY} L ${points.join(' L ')} L ${lastX},${bottomY} Z`;

    return { line, fill };
  }, [chartMode, visibleData, getX, getY, padding.top, chartHeight]);

  // Handle Mouse Move over chart
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    processChartCoords(rawX, rawY, rect.width, rect.height);
  };

  // Handle Touch on Mobile
  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const rawX = touch.clientX - rect.left;
    const rawY = touch.clientY - rect.top;
    processChartCoords(rawX, rawY, rect.width, rect.height);
  };

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const rawX = touch.clientX - rect.left;
    const rawY = touch.clientY - rect.top;
    processChartCoords(rawX, rawY, rect.width, rect.height);
  };

  const processChartCoords = (rawX: number, rawY: number, rectW: number, rectH: number) => {
    // Convert to SVG viewBox coordinates
    const scaleX = width / rectW;
    const scaleY = totalSvgHeight / rectH;
    const svgX = rawX * scaleX;
    const svgY = rawY * scaleY;

    if (svgX >= padding.left && svgX <= width - padding.right && svgY >= padding.top && svgY <= mainHeight - padding.bottom) {
      // Find nearest candle index
      const colWidth = chartWidth / visibleData.length;
      const relX = svgX - padding.left;
      const idx = Math.min(visibleData.length - 1, Math.max(0, Math.floor(relX / colWidth)));
      const candle = visibleData[idx];
      const price = getPriceFromY(svgY);

      setCrosshair({
        x: getX(idx),
        y: svgY,
        price,
        candle,
        candleIdx: idx,
        visible: true,
      });

      if (rulerActive && rulerStart) {
        setRulerCurrent({
          x: getX(idx),
          y: svgY,
          price,
          idx,
        });
      }
    } else {
      setCrosshair((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleMouseLeave = () => {
    setCrosshair((prev) => ({ ...prev, visible: false }));
  };

  // Ruler click handler
  const handleChartClick = () => {
    if (!rulerActive) return;
    if (!rulerStart) {
      if (crosshair.candleIdx !== null) {
        setRulerStart({
          x: crosshair.x,
          y: crosshair.y,
          price: crosshair.price,
          idx: crosshair.candleIdx,
        });
        if (onShowToast) {
          onShowToast('Ruler: Point A Set', 'Click anywhere on the chart to set Point B.', 'info');
        }
      }
    } else {
      // Point B set, measurement complete
      if (onShowToast) {
        onShowToast('Measurement Fixed', 'Click the ruler button to clear measurement.', 'info');
      }
    }
  };

  // Currently inspected candle (either hovered or the latest active one)
  const inspectedCandle = crosshair.visible && crosshair.candle ? crosshair.candle : activeCandle;
  const inspectedChange = inspectedCandle ? ((inspectedCandle.close - inspectedCandle.open) / inspectedCandle.open) * 100 : 0;

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.max(16, prev - 4));
  };
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.min( displayCandles.length, prev + 4));
  };
  const handleResetZoom = () => {
    setZoomLevel(32);
    setPanOffset(0);
    setRulerStart(null);
    setRulerCurrent(null);
    setRulerActive(false);
  };

  return (
    <div
      ref={containerRef}
      id="interactive-trading-chart-container"
      className={`relative w-full rounded-2xl overflow-hidden border transition-all duration-200 select-none ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl flex flex-col' : 'flex flex-col shadow-lg'
      } ${
        isLight
          ? 'bg-slate-900 text-white border-slate-700'
          : 'bg-[#080B10] text-white border-[#1E293B]'
      }`}
    >
      {/* Top Header: Pair Info, Live Ticks, Timeframes, Indicators, Tools */}
      <div className="flex items-center justify-between gap-2 px-2.5 sm:px-3.5 py-2 bg-[#0C1017]/95 border-b border-[#1E293B] text-xs font-mono overflow-x-auto no-scrollbar">
        {/* Left: Asset Pair, Live Price badge, 24h delta */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 font-bold text-xs sm:text-sm tracking-tight text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
            <span className="whitespace-nowrap">{pair}</span>
          </div>

          <motion.div
            key={tickCounter}
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`px-2 py-0.5 rounded-md font-bold text-xs sm:text-sm flex items-center gap-1 transition-colors whitespace-nowrap ${
              lastTickDirection === 'up'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            {lastTickDirection === 'up' ? (
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            ) : (
              <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            )}
            <span>{formatPrice(currentQuote.price)}</span>
          </motion.div>

          <span
            className={`hidden sm:inline-flex text-[11px] font-semibold whitespace-nowrap ${
              currentQuote.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {currentQuote.change24h >= 0 ? '+' : ''}
            {currentQuote.change24h}%
          </span>

          {/* Candle countdown bar */}
          <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-[#1E293B] text-[10px] text-slate-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse flex-shrink-0" />
            <span>Bar:</span>
            <span className="text-white font-bold">{secondsRemaining}s</span>
            <div className="w-10 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
                style={{ width: `${candleProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Timeframe Selector */}
        <div className="flex items-center gap-0.5 bg-[#151C28] p-0.5 rounded-lg border border-[#1E293B] flex-shrink-0">
          {['1s', '1m', '5m', '15m', '1H', '4H', '1D'].map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeInterval(tf)}
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold transition-all whitespace-nowrap ${
                timeInterval === tf
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right: Chart Type, Indicators & Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Chart Style Switcher */}
          <div className="flex items-center gap-0.5 bg-[#151C28] p-0.5 rounded-lg border border-[#1E293B]">
            <button
              type="button"
              title="Candlesticks"
              onClick={() => setChartMode('candles')}
              className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                chartMode === 'candles' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Candles
            </button>
            <button
              type="button"
              title="Hollow Candlesticks"
              onClick={() => setChartMode('hollow')}
              className={`hidden xs:inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                chartMode === 'hollow' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hollow
            </button>
            <button
              type="button"
              title="Heikin-Ashi Trend Bars"
              onClick={() => setChartMode('heikin_ashi')}
              className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                chartMode === 'heikin_ashi' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              HA
            </button>
            <button
              type="button"
              title="Area Line Chart"
              onClick={() => setChartMode('area')}
              className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                chartMode === 'area' ? 'bg-slate-700 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Area
            </button>
          </div>

          {/* Indicator toggles */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-[#151C28] p-0.5 rounded-lg border border-[#1E293B]">
            <button
              type="button"
              onClick={() => setShowEMA20(!showEMA20)}
              className={`px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold transition-colors ${
                showEMA20 ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle EMA 20"
            >
              EMA20
            </button>
            <button
              type="button"
              onClick={() => setShowEMA50(!showEMA50)}
              className={`hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                showEMA50 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle EMA 50"
            >
              EMA50
            </button>
            <button
              type="button"
              onClick={() => setShowBollinger(!showBollinger)}
              className={`px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold transition-colors ${
                showBollinger ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Bollinger Bands"
            >
              BB
            </button>
          </div>

          {/* Subchart toggle (RSI, MACD, Volume) */}
          <div className="flex items-center gap-0.5 bg-[#151C28] p-0.5 rounded-lg border border-[#1E293B]">
            <button
              type="button"
              onClick={() => setSubChart(subChart === 'rsi' ? 'none' : 'rsi')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                subChart === 'rsi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              RSI
            </button>
            <button
              type="button"
              onClick={() => setSubChart(subChart === 'macd' ? 'none' : 'macd')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                subChart === 'macd' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              MACD
            </button>
          </div>

          {/* Turbo Live Tick Switch */}
          <button
            type="button"
            onClick={() => setTurboMode(!turboMode)}
            className={`p-1 rounded-md transition-colors ${
              turboMode
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={turboMode ? 'Turbo Ticks Active' : 'Standard Speed'}
          >
            <Zap className="w-3.5 h-3.5" />
          </button>

          {/* Ruler measure tool */}
          <button
            type="button"
            onClick={() => {
              setRulerActive(!rulerActive);
              setRulerStart(null);
              setRulerCurrent(null);
            }}
            className={`p-1 rounded-md transition-colors ${
              rulerActive
                ? 'bg-emerald-500 text-black font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Measure Price Range"
          >
            <Ruler className="w-3.5 h-3.5" />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 text-slate-400">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 hover:text-white hover:bg-slate-800 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 hover:text-white hover:bg-slate-800 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 hover:text-white hover:bg-slate-800 rounded"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Chart'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Floating Live OHLCV Inspector Strip */}
      <div className="flex items-center justify-between px-2.5 sm:px-3.5 py-1 bg-[#0A0D13] border-b border-[#1E293B]/60 text-[10px] sm:text-[11px] font-mono text-slate-400 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 sm:gap-3.5 flex-nowrap whitespace-nowrap">
          {inspectedCandle && (
            <>
              <span>
                <strong className="text-white">{inspectedCandle.time}</strong>
              </span>
              <span>
                O: <strong className="text-white">{formatPrice(inspectedCandle.open)}</strong>
              </span>
              <span>
                H: <strong className="text-emerald-400">{formatPrice(inspectedCandle.high)}</strong>
              </span>
              <span>
                L: <strong className="text-rose-400">{formatPrice(inspectedCandle.low)}</strong>
              </span>
              <span>
                C: <strong className="text-white">{formatPrice(inspectedCandle.close)}</strong>
              </span>
              <span className="hidden xs:inline">
                Vol: <strong className="text-slate-300">{inspectedCandle.volume.toLocaleString()}</strong>
              </span>
              <span className={inspectedChange >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                Δ {inspectedChange >= 0 ? '+' : ''}
                {inspectedChange.toFixed(2)}%
              </span>
            </>
          )}
        </div>

        {/* Legend for active indicators */}
        <div className="hidden lg:flex items-center gap-3 text-[10px] flex-shrink-0 pl-3">
          {showEMA20 && (
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> EMA(20)
            </span>
          )}
          {showEMA50 && (
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> EMA(50)
            </span>
          )}
          {showBollinger && (
            <span className="flex items-center gap-1 text-purple-400">
              <span className="w-2.5 h-0.5 bg-purple-400 inline-block" /> BB(20,2)
            </span>
          )}
          {activePairPositions.length > 0 && (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> {activePairPositions.length} Open
            </span>
          )}
        </div>
      </div>

      {/* Main SVG Interactive Trading Stage */}
      <div className="relative flex-1 w-full bg-[#080B10] cursor-crosshair overflow-hidden touch-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${totalSvgHeight}`}
          className="w-full h-full min-h-[290px]"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseLeave}
          onClick={handleChartClick}
        >
          <defs>
            {/* Area Chart Gradient Fill */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
            </linearGradient>

            {/* Baseline Up/Down Gradients */}
            <linearGradient id="bullishCandleGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
              <stop offset="100%" stopColor="#059669" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="bearishCandleGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="1" />
            </linearGradient>

            {/* Live Price Pulsing Ping Dot */}
            <radialGradient id="livePricePing">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid Lines (Horizontal Price Grid) */}
          {yAxisTicks.map((price, idx) => {
            const y = getY(price);
            return (
              <g key={`ygrid-${idx}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1E293B"
                  strokeDasharray="2 3"
                  strokeWidth="1"
                />
                {/* Y-Axis Label */}
                <text
                  x={width - padding.right + 8}
                  y={y + 3.5}
                  fill="#94A3B8"
                  fontSize="9.5"
                  fontFamily="monospace"
                  textAnchor="start"
                >
                  ${formatAxisPrice(price)}
                </text>
              </g>
            );
          })}

          {/* Vertical Time Grid Lines */}
          {visibleData.map((d, idx) => {
            // Draw every 5th or 6th candle label to prevent overcrowding
            const stepMod = Math.max(4, Math.floor(visibleData.length / 6));
            if (idx % stepMod !== 0) return null;
            const x = getX(idx);
            return (
              <g key={`xgrid-${idx}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={mainHeight - padding.bottom}
                  stroke="#1E293B"
                  strokeDasharray="2 4"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text
                  x={x}
                  y={mainHeight - padding.bottom + 14}
                  fill="#64748B"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {d.time}
                </text>
              </g>
            );
          })}

          {/* Volume Histogram in Background */}
          {showVolume &&
            visibleData.map((d, idx) => {
              const x = getX(idx);
              const isBull = d.close >= d.open;
              const barHeight = (d.volume / maxVolume) * 45;
              const y = mainHeight - padding.bottom - barHeight;
              return (
                <rect
                  key={`vol-bar-${idx}`}
                  x={x - candleBarWidth / 2}
                  y={y}
                  width={candleBarWidth}
                  height={barHeight}
                  fill={isBull ? '#10B981' : '#EF4444'}
                  opacity={isBull ? '0.2' : '0.18'}
                  rx="1"
                />
              );
            })}

          {/* Bollinger Bands Clouds & Lines */}
          {showBollinger && bollingerPaths.upper && (
            <g>
              <path d={bollingerPaths.area} fill="#A855F7" fillOpacity="0.08" />
              <path d={bollingerPaths.upper} fill="none" stroke="#C084FC" strokeWidth="1" strokeDasharray="3 3" />
              <path d={bollingerPaths.middle} fill="none" stroke="#A855F7" strokeWidth="1" opacity="0.8" />
              <path d={bollingerPaths.lower} fill="none" stroke="#C084FC" strokeWidth="1" strokeDasharray="3 3" />
            </g>
          )}

          {/* EMA 20 (Cyan Line) */}
          {showEMA20 && ema20Path && (
            <path
              d={ema20Path}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* EMA 50 (Amber Line) */}
          {showEMA50 && ema50Path && (
            <path
              d={ema50Path}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Area Line Chart Mode */}
          {(chartMode === 'area' || chartMode === 'baseline') && (
            <g>
              <path d={areaPaths.fill} fill="url(#areaGradient)" />
              <path
                d={areaPaths.line}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* Candlesticks Rendering (Standard, Hollow, Heikin-Ashi) */}
          {chartMode !== 'area' &&
            chartMode !== 'baseline' &&
            visibleData.map((d, idx) => {
              const x = getX(idx);
              const isBullish = d.close >= d.open;
              const color = isBullish ? '#10B981' : '#EF4444';
              const isLastActive = idx === visibleData.length - 1;

              const highY = getY(d.high);
              const lowY = getY(d.low);
              const openY = getY(d.open);
              const closeY = getY(d.close);

              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.max(2, Math.abs(openY - closeY));

              return (
                <g key={`candle-bar-${idx}`} className="transition-all duration-75">
                  {/* Top & Bottom Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={color}
                    strokeWidth={isLastActive ? '1.75' : '1.25'}
                    strokeLinecap="round"
                  />

                  {/* Candlestick Body */}
                  {chartMode === 'hollow' && isBullish ? (
                    // Hollow Candle for Green
                    <rect
                      x={x - candleBarWidth / 2}
                      y={bodyTop}
                      width={candleBarWidth}
                      height={bodyHeight}
                      fill="#080B10"
                      stroke="#10B981"
                      strokeWidth="1.5"
                      rx="1"
                    />
                  ) : (
                    // Solid Candle
                    <rect
                      x={x - candleBarWidth / 2}
                      y={bodyTop}
                      width={candleBarWidth}
                      height={bodyHeight}
                      fill={color}
                      rx="1"
                    />
                  )}

                  {/* Active Live Candle Radar Glow Pulse */}
                  {isLastActive && (
                    <circle
                      cx={x}
                      cy={closeY}
                      r={6}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      opacity="0.8"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}

          {/* Active Open Positions Overlays on the Chart Line */}
          {showPositionLines &&
            activePairPositions.map((pos) => {
              const posY = getY(pos.entryPrice);
              const isLong = pos.side === 'long';
              const lineColor = isLong ? '#10B981' : '#EF4444';

              return (
                <g key={`chart-pos-${pos.id}`}>
                  {/* Entry Price Dashed Line across chart */}
                  <line
                    x1={padding.left}
                    y1={posY}
                    x2={width - padding.right}
                    y2={posY}
                    stroke={lineColor}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />

                  {/* Position Tag / Badge */}
                  <rect
                    x={padding.left + 8}
                    y={posY - 10}
                    width={185}
                    height={20}
                    rx="4"
                    fill="#0F172A"
                    stroke={lineColor}
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left + 14}
                    y={posY + 4}
                    fill={lineColor}
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {isLong ? '▲ LONG' : '▼ SHORT'} {pos.leverage}x @ ${formatAxisPrice(pos.entryPrice)}
                  </text>
                  <text
                    x={padding.left + 125}
                    y={posY + 4}
                    fill={pos.pnl >= 0 ? '#34D399' : '#F87171'}
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(0)}
                  </text>

                  {/* Close position cross button right on chart */}
                  {onClosePosition && (
                    <g
                      className="cursor-pointer hover:opacity-80"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClosePosition(pos.id);
                      }}
                    >
                      <circle cx={padding.left + 180} cy={posY} r="6" fill="#DC2626" />
                      <text
                        x={padding.left + 180}
                        y={posY + 3}
                        fill="white"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        ✕
                      </text>
                    </g>
                  )}

                  {/* Take Profit Target Line */}
                  {pos.takeProfit && (
                    <g>
                      <line
                        x1={padding.left}
                        y1={getY(pos.takeProfit)}
                        x2={width - padding.right}
                        y2={getY(pos.takeProfit)}
                        stroke="#10B981"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        opacity="0.8"
                      />
                      <rect
                        x={width - padding.right - 90}
                        y={getY(pos.takeProfit) - 8}
                        width={85}
                        height={16}
                        rx="3"
                        fill="#064E3B"
                      />
                      <text
                        x={width - padding.right - 48}
                        y={getY(pos.takeProfit) + 3}
                        fill="#6EE7B7"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        TP: ${formatAxisPrice(pos.takeProfit)}
                      </text>
                    </g>
                  )}

                  {/* Stop Loss Target Line */}
                  {pos.stopLoss && (
                    <g>
                      <line
                        x1={padding.left}
                        y1={getY(pos.stopLoss)}
                        x2={width - padding.right}
                        y2={getY(pos.stopLoss)}
                        stroke="#EF4444"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        opacity="0.8"
                      />
                      <rect
                        x={width - padding.right - 90}
                        y={getY(pos.stopLoss) - 8}
                        width={85}
                        height={16}
                        rx="3"
                        fill="#7F1D1D"
                      />
                      <text
                        x={width - padding.right - 48}
                        y={getY(pos.stopLoss) + 3}
                        fill="#FCA5A5"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        SL: ${formatAxisPrice(pos.stopLoss)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

          {/* Pulsing Live Laser Price Line across chart */}
          <g>
            <line
              x1={padding.left}
              y1={activePriceY}
              x2={width - padding.right}
              y2={activePriceY}
              stroke={isUp ? '#10B981' : '#EF4444'}
              strokeWidth="1.25"
              strokeDasharray="3 3"
            />
            {/* Right-edge Pulsing Radar Dot */}
            <circle
              cx={width - padding.right}
              cy={activePriceY}
              r="4"
              fill={isUp ? '#10B981' : '#EF4444'}
            />
            {/* Live Right-Axis Price Pill */}
            <rect
              x={width - padding.right + 2}
              y={activePriceY - 9}
              width={70}
              height={18}
              rx="3"
              fill={isUp ? '#059669' : '#DC2626'}
            />
            <text
              x={width - padding.right + 36}
              y={activePriceY + 3.5}
              fill="white"
              fontSize="9.5"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
            >
              ${formatAxisPrice(currentQuote.price)}
            </text>
          </g>

          {/* Interactive Crosshair (Cursor tracking) */}
          {crosshair.visible && (
            <g>
              {/* Vertical Crosshair Line */}
              <line
                x1={crosshair.x}
                y1={padding.top}
                x2={crosshair.x}
                y2={mainHeight - padding.bottom}
                stroke="#94A3B8"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.8"
              />
              {/* Horizontal Crosshair Line */}
              <line
                x1={padding.left}
                y1={crosshair.y}
                x2={width - padding.right}
                y2={crosshair.y}
                stroke="#94A3B8"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.8"
              />
              {/* Right Y-Axis Floating Price Badge */}
              <rect
                x={width - padding.right + 2}
                y={crosshair.y - 8}
                width={70}
                height={16}
                rx="3"
                fill="#334155"
                stroke="#94A3B8"
                strokeWidth="1"
              />
              <text
                x={width - padding.right + 36}
                y={crosshair.y + 3.5}
                fill="#FFFFFF"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                ${formatAxisPrice(crosshair.price)}
              </text>

              {/* Bottom X-Axis Floating Time Badge */}
              {crosshair.candle && (
                <g>
                  <rect
                    x={crosshair.x - 24}
                    y={mainHeight - padding.bottom + 2}
                    width={48}
                    height={16}
                    rx="3"
                    fill="#334155"
                    stroke="#94A3B8"
                    strokeWidth="1"
                  />
                  <text
                    x={crosshair.x}
                    y={mainHeight - padding.bottom + 13}
                    fill="#FFFFFF"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {crosshair.candle.time}
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Interactive Ruler Measurement Overlay */}
          {rulerActive && rulerStart && rulerCurrent && (
            <g>
              {/* Shaded Measurement Box */}
              <rect
                x={Math.min(rulerStart.x, rulerCurrent.x)}
                y={Math.min(rulerStart.y, rulerCurrent.y)}
                width={Math.abs(rulerCurrent.x - rulerStart.x)}
                height={Math.abs(rulerCurrent.y - rulerStart.y)}
                fill="#38BDF8"
                fillOpacity="0.12"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {/* Ruler Delta Badge */}
              {(() => {
                const priceDelta = rulerCurrent.price - rulerStart.price;
                const pctDelta = (priceDelta / rulerStart.price) * 100;
                const barDelta = Math.abs(rulerCurrent.idx - rulerStart.idx);
                const midX = (rulerStart.x + rulerCurrent.x) / 2;
                const midY = Math.min(rulerStart.y, rulerCurrent.y) - 16;

                return (
                  <g>
                    <rect
                      x={midX - 60}
                      y={Math.max(10, midY)}
                      width={120}
                      height={24}
                      rx="4"
                      fill="#0369A1"
                      stroke="#7DD3FC"
                      strokeWidth="1"
                    />
                    <text
                      x={midX}
                      y={Math.max(10, midY) + 15}
                      fill="white"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {pctDelta >= 0 ? '+' : ''}
                      {pctDelta.toFixed(2)}% ({formatPrice(Math.abs(priceDelta))}) · {barDelta} bars
                    </text>
                  </g>
                );
              })()}
            </g>
          )}

          {/* Sub-Chart Divider Line */}
          {isSubChartOpen && (
            <line
              x1={padding.left}
              y1={mainHeight}
              x2={width - padding.right}
              y2={mainHeight}
              stroke="#334155"
              strokeWidth="1"
            />
          )}

          {/* Sub-Chart: RSI (Relative Strength Index) */}
          {subChart === 'rsi' && (
            <g transform={`translate(0, ${mainHeight + 10})`}>
              {/* Subchart Title & Value */}
              <text x={padding.left + 5} y={12} fill="#818CF8" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
                RSI (14):{' '}
                <tspan fill="white">
                  {rsiData[rsiData.length - 1] ? rsiData[rsiData.length - 1]?.toFixed(1) : '52.4'}
                </tspan>
              </text>

              {/* 70 Overbought & 30 Oversold Lines */}
              <line x1={padding.left} y1={25} x2={width - padding.right} y2={25} stroke="#EF4444" strokeDasharray="2 3" opacity="0.5" />
              <text x={width - padding.right + 5} y={28} fill="#EF4444" fontSize="8" fontFamily="monospace">70</text>
              <line x1={padding.left} y1={55} x2={width - padding.right} y2={55} stroke="#10B981" strokeDasharray="2 3" opacity="0.5" />
              <text x={width - padding.right + 5} y={58} fill="#10B981" fontSize="8" fontFamily="monospace">30</text>

              {/* RSI Curve */}
              {(() => {
                const points: string[] = [];
                visibleData.forEach((_, idx) => {
                  const globalIdx = visibleStartIndex + idx;
                  const val = rsiData[globalIdx];
                  if (val !== null && val !== undefined) {
                    const x = getX(idx);
                    // Map 0-100 to subchart height (75 to 15)
                    const y = 75 - (val / 100) * 60;
                    points.push(`${x},${y}`);
                  }
                });
                return points.length > 1 ? (
                  <path d={`M ${points.join(' L ')}`} fill="none" stroke="#818CF8" strokeWidth="1.75" strokeLinecap="round" />
                ) : null;
              })()}
            </g>
          )}

          {/* Sub-Chart: MACD (12, 26, 9) */}
          {subChart === 'macd' && (
            <g transform={`translate(0, ${mainHeight + 10})`}>
              <text x={padding.left + 5} y={12} fill="#38BDF8" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
                MACD (12, 26, 9)
              </text>

              {/* Zero baseline */}
              <line x1={padding.left} y1={45} x2={width - padding.right} y2={45} stroke="#334155" strokeWidth="1" />

              {/* MACD Histogram Bars */}
              {visibleData.map((_, idx) => {
                const globalIdx = visibleStartIndex + idx;
                const pt = macdData[globalIdx];
                if (!pt) return null;
                const x = getX(idx);
                const h = Math.min(25, Math.abs(pt.histogram) * 0.15);
                const isPos = pt.histogram >= 0;
                const y = isPos ? 45 - h : 45;
                return (
                  <rect
                    key={`macd-hist-${idx}`}
                    x={x - 2}
                    y={y}
                    width={4}
                    height={Math.max(1, h)}
                    fill={isPos ? '#10B981' : '#EF4444'}
                    opacity="0.8"
                  />
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Chart Footer Stats & Live Status */}
      <div className="flex flex-wrap items-center justify-between px-3.5 py-2 bg-[#0C1017] border-t border-[#1E293B] text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Feed:</span>
            <strong className="text-white">Direct L2 Ultra-Low Latency</strong>
          </span>
          <span>
            Spread: <strong className="text-white">{currentQuote.spread}</strong>
          </span>
          <span>
            24h Vol: <strong className="text-white">{currentQuote.volume24h}</strong>
          </span>
          <span>
            Range: <strong className="text-white">${formatAxisPrice(minPrice)} - ${formatAxisPrice(maxPrice)}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          {turboMode && (
            <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              <Zap className="w-3 h-3 animate-bounce" /> TURBO TICKS (500ms)
            </span>
          )}
          <span>UTC {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};
