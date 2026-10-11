import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [instruments, setInstruments] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [trades, setTrades] = useState([]);

  const [symbol, setSymbol] = useState("AAPL");
  const [side, setSide] = useState("BUY");
  const [style, setStyle] = useState("MARKET");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");

  // Fetch instruments, portfolio, and trades from FastAPI
  const loadData = async () => {
    try {
      const [instrumentRes, portfolioRes, tradesRes] =
        await Promise.all([
          fetch(`${API}/api/v1/instruments`),
          fetch(`${API}/api/v1/portfolio`),
          fetch(`${API}/api/v1/trades`),
        ]);

      if (!instrumentRes.ok || !portfolioRes.ok || !tradesRes.ok) {
        throw new Error("Failed to fetch trading data");
      }

      const instrumentData = await instrumentRes.json();
      const portfolioData = await portfolioRes.json();
      const tradesData = await tradesRes.json();

      console.log("Instruments received:", instrumentData);

      if (!Array.isArray(instrumentData)) {
        throw new Error("Instruments API did not return an array");
      }

      setInstruments(instrumentData);
      setPortfolio(portfolioData);
      setTrades(tradesData);

      // Select the first available instrument if the current
      // selection is not present in the API response.
      if (instrumentData.length > 0) {
        setSymbol((current) =>
          instrumentData.some((item) => item.symbol === current)
            ? current
            : instrumentData[0].symbol
        );
      }
    } catch (error) {
      console.error("Failed to load trading data:", error);
    }
  };

  // Load data when the component mounts
  useEffect(() => {
    loadData();
  }, []);

  const placeOrder = async () => {
    try {
      const body = {
        symbol,
        type: side,
        style,
        quantity: Number(quantity),
      };

      if (style === "LIMIT") {
        body.price = Number(price);
      }

      const response = await fetch(`${API}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Order failed");
        return;
      }

      await loadData();
      alert(`Order ${data.status}`);
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Could not connect to the trading backend.");
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Trading Terminal</h1>
        <span>Paper Trading</span>
      </header>

      <main>
        <section>
          <h2>Market</h2>

          <div className="cards">
            {instruments.map((instrument) => (
              <div className="card" key={instrument.symbol}>
                <div>
                  <strong>{instrument.symbol}</strong>
                  <small>{instrument.exchange}</small>
                </div>

                <div className="price">
                  $
                  {Number(instrument.lastTradedPrice ?? 0).toFixed(2)}
                </div>

                <button
                  onClick={() => {
                    setSymbol(instrument.symbol);
                    setSide("BUY");
                  }}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="order-section">
          <div className="panel">
            <h2>Place Order</h2>

            <label>Symbol</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              disabled={instruments.length === 0}
            >
              {instruments.length === 0 && (
                <option value="">Loading instruments...</option>
              )}

              {instruments.map((instrument) => (
                <option
                  key={instrument.symbol}
                  value={instrument.symbol}
                >
                  {instrument.symbol}
                </option>
              ))}
            </select>

            <label>Side</label>
            <div className="toggle">
              <button
                className={side === "BUY" ? "active" : ""}
                onClick={() => setSide("BUY")}
              >
                BUY
              </button>

              <button
                className={side === "SELL" ? "active sell" : ""}
                onClick={() => setSide("SELL")}
              >
                SELL
              </button>
            </div>

            <label>Order Type</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option value="MARKET">MARKET</option>
              <option value="LIMIT">LIMIT</option>
            </select>

            <label>Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            {style === "LIMIT" && (
              <>
                <label>Limit Price</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </>
            )}

            <button
              className="place"
              onClick={placeOrder}
              disabled={
                instruments.length === 0 ||
                !symbol ||
                Number(quantity) < 1 ||
                (style === "LIMIT" &&
                  (!price || Number(price) <= 0))
              }
            >
              PLACE ORDER
            </button>
          </div>

          <div className="panel">
            <h2>Portfolio</h2>

            {Object.keys(portfolio).length === 0 ? (
              <p className="muted">No holdings yet.</p>
            ) : (
              Object.entries(portfolio).map(([symbol, holding]) => (
                <div className="holding" key={symbol}>
                  <strong>{symbol}</strong>
                  <span>{holding.quantity} shares</span>
                  <span>
                    Avg ${Number(holding.avgPrice).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2>Recent Trades</h2>

          {trades.length === 0 ? (
            <p className="muted">No trades yet.</p>
          ) : (
            <div className="trades">
              {trades.map((trade) => (
                <div className="trade" key={trade.id}>
                  <strong>{trade.symbol}</strong>
                  <span className={trade.type === "BUY" ? "buy" : "sell"}>
                    {trade.type}
                  </span>
                  <span>{trade.quantity}</span>
                  <span>${Number(trade.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;