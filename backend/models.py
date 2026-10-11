from typing import Optional
from pydantic import BaseModel
from enum import Enum
from datetime import datetime

class OrderType(str, Enum):
    BUY = "BUY"
    SELL = "SELL"

class OrderStyle(str, Enum):
    MARKET = "MARKET"
    LIMIT = "LIMIT"

class OrderStatus(str, Enum):
    NEW = "NEW"
    PLACED = "PLACED"
    EXECUTED = "EXECUTED"
    CANCELLED = "CANCELLED"

class Instrument(BaseModel):
    symbol: str
    exchange: str
    instrumentType: str
    lastTradedPrice: float

class Order(BaseModel):
    id: str
    symbol: str
    type: OrderType
    style: OrderStyle
    quantity: int
    price: Optional[float]
    status: OrderStatus

class Trade(BaseModel):
    id: str
    orderId: str
    symbol: str
    quantity: int
    price: float
    type: OrderType
    timestamp: datetime