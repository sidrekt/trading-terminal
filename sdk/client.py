import requests

class TradingClient:
    def __init__(self, base_url):
        self.base = base_url

    def get_instruments(self):
        return requests.get(f"{self.base}/api/v1/instruments").json()

    def place_order(self, symbol, side, style, qty, price=None):
        payload = {
            "symbol": symbol,
            "type": side,
            "style": style,
            "quantity": qty,
            "price": price
        }
        return requests.post(f"{self.base}/api/v1/orders", json=payload).json()

    def get_portfolio(self):
        return requests.get(f"{self.base}/api/v1/portfolio").json()