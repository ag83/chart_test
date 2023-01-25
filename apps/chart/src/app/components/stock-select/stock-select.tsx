import React, { FC, useMemo } from 'react';
import Select from 'react-select';
import { format } from 'date-fns';

import './stock-select.scss';

import { Stock, StockData } from '@test/shared';

interface StockSelectProps {
    stocks: Stock[];
    selectedStock: Stock | null;
    selectStock: (id: string | null) => void;
    stockData: StockData[] | null;
}

interface SelectedStockData {
  current: number;
  max: number;
}

export const StockSelect: FC<StockSelectProps> = ({ stocks, selectedStock, selectStock, stockData }) => {

  const selectOptions = useMemo(() => {
    return stocks.map((stock) => {
      return {
        value: stock.id,
        label: `${stock.name} | #${stock.id}`
      };
    });
  }, [stocks]);

  const selectedStockData: SelectedStockData | null = useMemo(() => {
    if (!stockData) return null;
    const formattedToday = format(new Date(), 'MM/dd/yyyy');
    const data = {
      current: 0,
      max: 0,
    }
    stockData.forEach((item) => {
      if (item.date === formattedToday) {
        data.current = item.amount;
      }
      if (item.amount > data.max) {
        data.max = item.amount;
      }
    });
    return data;
  }, [stockData]);

  return (
    <div className='stock-select-wrapper'>
      {
        selectedStock && (
          <div className='stock-selected-wrapper'>
            <div className='stock-selected-icon'>
              <img src={require(`/src/assets/icons/${selectedStock.icon}.svg`).default} alt={selectedStock.name}/>
            </div>
            <div className='stock-selected-name'>
              <h4>{selectedStock.name}</h4>
              <div className='stock-selected-amount'>
                {selectedStockData && 
                  (<>
                    <span className='stock-selected-current'>{`${selectedStockData.current}${selectedStock.unit}/`}</span>
                    <span className='stock-selected-max'>{`${selectedStockData.max}${selectedStock.unit}`}</span>
                  </>)
                }
              </div>
            </div>
          </div>
        )
      }
      <div className='stock-select'>
        <Select 
          options={selectOptions} 
          onChange={(e) => selectStock(e?.value || null)} />
      </div>
    </div>
  )
};