# Paper Trading Platform

A web-based paper trading platform that lets users simulate stock trading, manage a portfolio, and track transaction history without using real money.

## Features

- **Buy & Sell:** Simulate stock buy and sell transactions.
- **Portfolio:** View current holdings and portfolio information.
- **Transaction History:** Track previous trading activity.

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Python, FastAPI
- **API:** REST API

## Getting Started

### Prerequisites

- Python 3
- Node.js and npm

### 1. Clone the repository

```bash
git clone https://github.com/sidrekt/trading-termina.git
cd trading-termina
```

### 2. Start the backend

From the project root, run:

```bash
uvicorn backend.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

Interactive API documentation is available at `http://localhost:8000/docs`.

### 3. Start the frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## Disclaimer

This application is intended for educational purposes and simulated trading only. It is not connected to real-money trading.

## Author

[Siddharth Rekhade](https://github.com/sidrekt)
