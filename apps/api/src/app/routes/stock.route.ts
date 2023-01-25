import { Request, Response, Router } from "express";

import stockService from '../services/stock.service';

const router = Router();

router.route('/').get( async (req: Request, res: Response) => {
    try {
        const stocks = await stockService.getStocks();
        res.status(200).send(stocks);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
    
});

router.route('/:stockId/data').get( async (req: Request, res: Response) => {
    try {
        const stockId = req.params.stockId as string | undefined;
        const stockData = await stockService.getStockData(stockId);
        
        res.status(200).send(stockData);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
    
});

export default router;