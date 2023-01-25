import { format, subDays, addDays } from 'date-fns'

import { Stock, StockData } from '@test/shared';

interface DataResponseConfig {
    dataLength: number;
    pastDays: number;
    min: number;
    max: number;
}

class StockService {

    private stocks: Stock[] = [
        {
            id: '76908',
            name: 'Pickle',
            icon: 'pickle',
            unit: 'kg',
        },
        {
            id: '56788',
            name: 'Coffee',
            icon: 'coffee',
            unit: 'pkg',
        },
    ];
    private config: DataResponseConfig = {
        dataLength: 14,
        pastDays: 3,
        min: 10,
        max: 100
    }

    public getStocks(): Promise<Stock[]> {
        return new Promise<Stock[]>((resolve, reject) => {
            resolve(this.stocks);
        });
    }

    public getStockData(stockId: string): Promise<StockData[]> {
        return new Promise<StockData[]>((resolve, reject) => {
            const stock = this.stocks.find((stock) => stock.id === stockId);
            if (!stock) reject('stock not found');
    
            const today = new Date();
            let currentDay = subDays(today, this.config.pastDays);
    
            const data =  Array(this.config.dataLength).fill(0);
            const mockStock: StockData[] = data.map(() => {
                const mockAmount = this.mockNumber(this.config.min, this.config.max);
                const mockDemand = this.mockNumber(this.config.min, mockAmount / 2);
    
                const formattedDate = format(currentDay, 'MM/dd/yyyy');
                currentDay = addDays(currentDay, 1);
                return {
                    date: formattedDate,
                    amount: mockAmount,
                    demand: mockDemand
                };
            });
            resolve(mockStock);
        });
    }

    private mockNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export default new StockService();