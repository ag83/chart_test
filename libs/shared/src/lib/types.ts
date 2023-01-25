export interface Stock {
  id: string;
  name: string;
  icon: string;
  unit: string;
}

export interface StockData {
  date: string;
  amount: number;
  demand: number;
}
