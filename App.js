import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import { Routes } from './src/routes/app.routes';

export default function App() {
  return (
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  );
}