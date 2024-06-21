// src/StockList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StockCard from './StockCard';
import { Container, Grid, Typography, Box, Paper } from '@mui/material';

interface Stock {
  ticker: string;
  price: number;
  sector: string;
}

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [diversity, setDiversity] = useState<number>(0);

  useEffect(() => {
    const fetchStocks = async () => {
      const apiKey = 'cppjjd1r01qi7uaim3d0cppjjd1r01qi7uaim3dg'; 
      const tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "FB"];

      const promises = tickers.map(async (ticker) => {
        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`);
        const sectorResponse = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`);
        return {
          ticker,
          price: response.data.c,
          sector: sectorResponse.data.finnhubIndustry,
        };
      });

      const stockData = await Promise.all(promises);
      setStocks(stockData);
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    const calculateDiversity = () => {
      const sectorWeights: { [key: string]: number } = {};
      portfolio.forEach(stock => {
        sectorWeights[stock.sector] = (sectorWeights[stock.sector] || 0) + stock.price;
      });

      const totalValue = portfolio.reduce((sum, stock) => sum + stock.price, 0);
      const weights = Object.values(sectorWeights).map(weight => weight / totalValue);

      const diversityScore = (1 - weights.reduce((sum, weight) => sum + weight * weight, 0)) * 100;
      setDiversity(diversityScore);
    };

    calculateDiversity();
  }, [portfolio]);

  const addToPortfolio = (stock: Stock) => {
    if (!portfolio.includes(stock)) {
      setPortfolio([...portfolio, stock]);
    }
  };

  const removeFromPortfolio = (stock: Stock) => {
    setPortfolio(portfolio.filter(item => item.ticker !== stock.ticker));
  };

  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Stock Portfolio
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h2" gutterBottom>
            Selected Stocks
          </Typography>
          {portfolio.map(stock => (
            <StockCard
              key={stock.ticker}
              stock={stock}
              onClick={() => removeFromPortfolio(stock)}
              buttonText="Remove"
            />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Stock Portfolio Diversity
            </Typography>
            <Typography variant="h5">
              {diversity.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          All Stocks
        </Typography>
        <Grid container spacing={3}>
          {stocks.map(stock => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={stock.ticker}>
              <StockCard
                stock={stock}
                onClick={() => addToPortfolio(stock)}
                buttonText="Add to Portfolio"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default StockList;
