// src/StockCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

interface Stock {
  ticker: string;
  price: number;
  sector: string;
}

interface StockCardProps {
  stock: Stock;
  onClick: () => void;
  buttonText: string;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick, buttonText }) => {
  return (
    <Card sx={{ minWidth: 275, margin: 1, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {stock.ticker}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Sector: {stock.sector}
        </Typography>
        <Typography variant="body2">
          Price: ${stock.price.toFixed(2)}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: 2 }}>
        <Button variant="contained" color="primary" onClick={onClick}>
          {buttonText}
        </Button>
      </Box>
    </Card>
  );
};

export default StockCard;
