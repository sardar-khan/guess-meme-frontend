import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { TradeGraphData } from "../../utils/api";

const LightweightCandlestickChart = ({ coinId }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const candlestickSeriesRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Destroy existing chart before creating a new one
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }

        chartRef.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 450,
            layout: {
                background: { color: "#161A25" },
                textColor: "#E0E0E0",
                fontFamily: "Roboto, Ubuntu, Arial, sans-serif",
            },
            grid: {
                vertLines: { color: "#333" },
                horzLines: { color: "#333" },
            },
            priceScale: {
                borderColor: "#888",
                autoScale: true,
                visible: true,
            },
            timeScale: {
                borderColor: "#888",
                timeVisible: true,
                secondsVisible: false,
            },
        });

        candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
            upColor: "#00C853",
            downColor: "#D50000",
            borderUpColor: "#00C853",
            borderDownColor: "#D50000",
            wickUpColor: "#00C853",
            wickDownColor: "#D50000",
            priceFormat: {
                minMove: 0.000000001,
                precision: 9,
            },
        });

        // Resize observer for responsiveness
        const resizeObserver = new ResizeObserver(() => {
            if (chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
                chartRef.current.timeScale().fitContent();
            }
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!coinId) return;

        const fetchCoinData = async () => {
            try {
                const response = await TradeGraphData(coinId);
                // 

                if (response.status === 200 && Array.isArray(response.data)) {
                    const formattedData = response.data.map(item => ({
                        time: Math.floor(new Date(item.time).getTime() / 1000),
                        open: item.open,
                        high: item.high,
                        low: item.low,
                        close: item.close,
                    }));
                   // formattedData.sort((a, b) => a.time - b.time);
                     
                    if (candlestickSeriesRef.current) {
                        candlestickSeriesRef.current.setData(formattedData);
                    }
                }
            } catch (err) {
                console.error("Error fetching coin data:", err);
                setError("Something went wrong. Please refresh the page.");
            }
        };

        fetchCoinData();
        const interval = setInterval(fetchCoinData, 20000);

        return () => clearInterval(interval);
    }, [coinId]);

    return (
        <div className="w-full">
            {error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />
            )}
        </div>
    );
};

export default LightweightCandlestickChart;
