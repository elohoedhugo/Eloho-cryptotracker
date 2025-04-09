import React, { useEffect, useRef } from "react";
import {
  setPrices,
  setError,
  setLoading,
  setIsUpdating,
} from "../store/trackerSlice";
import { useSelector, useDispatch } from "react-redux";
import "./tracker.css";
import { COINCAP_API_KEY } from "../config";

const Tracker = () => {
  const { prices, error, loading, isUpdating } = useSelector(
    (state) => state.tracker
  );
  const sendAction = useDispatch();

  const cryptos = [
    "bitcoin",
    "ethereum",
    "tether",
    "solana",
    "chainlink",
    "polkadot",
    "uniswap",
    "bittensor",
    "kaspa",
    "dogecoin",
    "litecoin",
    "toncoin",
  ];
  
   const apiKey = COINCAP_API_KEY
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isUpdating) return;

    socketRef.current = new WebSocket(
      `wss://wss.coincap.io/prices?assets=${cryptos.join(",")}&apiKey=${apiKey}`
    );
    sendAction(setLoading(true));

    socketRef.current.onopen = () => {
      sendAction(setError(null));
      console.log("Web socket has been connected");
    };

    socketRef.current.onmessage = (event) => {
      const newPrices = JSON.parse(event.data);
      console.log("Received prices : ", newPrices);
      sendAction(setLoading(false));
      sendAction(setPrices(newPrices));
    };

    socketRef.current.onerror = (error) => {
      console.error("Error: ", error);
      sendAction(setError("Web socket connection failed! Please try again."));
    };

    socketRef.current.onclose = () => {
      console.log("Websocket connection is closed");
    };

    return () => socketRef.current?.close();
  }, [isUpdating]);

  const manualFetch = () => {
    sendAction(setLoading(true));
    sendAction(setError(null));

    const tempSocket = new WebSocket(
      `wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`
    );

    tempSocket.onmessage = (event) => {
      const newPrices = JSON.parse(event.data);
      console.log("Manually fetched prices: ", newPrices);

      sendAction(setPrices(newPrices));
      sendAction(setLoading(false));

      tempSocket.close();

      if (!isUpdating) {
        sendAction(setIsUpdating(true));
        console.log("Resuming live updates...");
      }
    };

    tempSocket.onerror = (error) => {
      console.error("WebSocket error (Manual refresh): ", error);
      sendAction(setError("WEbSocket connection failed. Please try again"));
      sendAction(setLoading(false));
      tempSocket.close();
    };

    tempSocket.onclose = () => {
      console.log("Manual refresh ... WebSocket closed. ");
    };
  };
  const stopFetch = () => {
    sendAction(setIsUpdating(false));
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    console.log("Live updates stopped.");
  };

  return (
    <div className="body">
      <h1>Crypto App Tracker</h1>
      {error && <p className="errorP"> {error} </p>}
      {loading ? (
        <p className="loadingP"> Fetching latest prices...</p>
      ) : (
        <p className="loadedP">Prices loaded</p>
      )}
      <div className="crypto-container">
        {cryptos.map((crypto) => (
          <div key={crypto} className="crypto-card">
            <h3> {crypto.charAt(0).toUpperCase() + crypto.slice(1)}</h3>
            <p> ${prices[crypto] || "Fetching"} </p>
          </div>
        ))}
      </div>
      <div className="button-div">
        <button onClick={manualFetch} className="manualFetch">
          🔄 Refresh Prices
        </button>
        <button onClick={stopFetch} className="stopFetch">
          🛑 Stop Updates
        </button>
      </div>
    </div>
  );
};

export default Tracker;
