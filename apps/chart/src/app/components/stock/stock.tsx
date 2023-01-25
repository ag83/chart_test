import React, { useState, useEffect, useCallback } from 'react';

import { Stock, StockData } from '@test/shared';

import './stock.scss';

import { StockSelect } from '../stock-select/stock-select';
import StockChart from '../stock-chart/stock-chart';

export const Stocks = () => {
  const [currentStock, setCurrentStock] = useState<Stock | null>(null);
  const [stocks, setStocks] = useState<Stock[] | null>(null);
  const [stockData, setStockData] = useState<StockData[] | null>(null);

  useEffect(() => {
    fetch('/api/stock/')
      .then(t => t.json())
      .then((res) => {
        setStocks(res);
      });
  }, []);

  useEffect(() => {
    if (currentStock) {
      fetch(`/api/stock/${currentStock.id}/data`)
        .then(t => t.json())
        .then((res) => {
          setStockData(res);
        });
    }
  }, [currentStock]);

  const selectStock = useCallback((id: string | null) => {
    if (stocks && id) {
      const selectedStock = stocks.find((item) => item.id === id);
      setCurrentStock(selectedStock || null);
    }
  }, [stocks]);

  return stocks ? (
    <section className='stock-widget'>
      <StockSelect 
        stocks={stocks}
        selectedStock={currentStock}
        selectStock={selectStock}
        stockData={stockData}
      />
      { (currentStock && stockData) && (
        <StockChart 
          stock={currentStock}
          stockData={stockData}
        />
      )}

    </section>
  ) : null;
};