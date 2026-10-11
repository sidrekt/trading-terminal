from __future__ import annotations

import uuid
from datetime import datetime
from backend.models import Order, OrderType, OrderStyle, OrderStatus, Trade

def execute_order(order, instruments, orders, trades, portfolio):
    instrument = next((i for i in instruments if i.symbol == order.symbol), None)
    if not instrument:
        raise ValueError("Instrument not found")

    exec_price = instrument.lastTradedPrice if order.style == OrderStyle.MARKET else order.price

    order.status = OrderStatus.EXECUTED
    orders[order.id] = order

    trade = Trade(
        id=str(uuid.uuid4()),
        orderId=order.id,
        symbol=order.symbol,
        quantity=order.quantity,
        price=exec_price,
        type=order.type,
        timestamp=datetime.utcnow()
    )

    trades.append(trade)

    holding = portfolio.get(order.symbol, {"quantity": 0, "avgPrice": 0})

    if order.type == OrderType.SELL and holding["quantity"] < order.quantity:
        raise ValueError("Not enough quantity to sell")

    if order.type == OrderType.BUY:
        total = holding["quantity"] * holding["avgPrice"] + order.quantity * exec_price
        holding["quantity"] += order.quantity
        holding["avgPrice"] = total / holding["quantity"]
    else:
        holding["quantity"] -= order.quantity

    portfolio[order.symbol] = holding