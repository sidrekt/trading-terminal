from fastapi import FastAPI, HTTPException
import uuid

from .models import *
from .storage import instruments, orders, trades, portfolio
from .services import execute_order

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

instruments.extend([
    Instrument(symbol="AAPL", exchange="NASDAQ", instrumentType="EQUITY", lastTradedPrice=182.4),
    Instrument(symbol="GOOG", exchange="NASDAQ", instrumentType="EQUITY", lastTradedPrice=142.1),
    Instrument(symbol="TSLA", exchange="NASDAQ", instrumentType="EQUITY", lastTradedPrice=256.7),
])

@app.get("/api/v1/instruments")
def get_instruments():
    return instruments

@app.post("/api/v1/orders")
def place_order(req: dict):
    try:
        if req["quantity"] <= 0:
            raise HTTPException(400, "Quantity must be > 0")

        if req["style"] == "LIMIT" and not req.get("price"):
            raise HTTPException(400, "Price required for LIMIT order")

        order = Order(
            id=str(uuid.uuid4()),
            symbol=req["symbol"],
            type=req["type"],
            style=req["style"],
            quantity=req["quantity"],
            price=req.get("price"),
            status=OrderStatus.PLACED
        )

        execute_order(order, instruments, orders, trades, portfolio)
        return order

    except ValueError as e:
        raise HTTPException(400, str(e))

@app.get("/api/v1/orders/{order_id}")
def get_order(order_id: str):
    return orders.get(order_id)

@app.get("/api/v1/trades")
def get_trades():
    return trades

@app.get("/api/v1/portfolio")
def get_portfolio():
    return portfolio

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)