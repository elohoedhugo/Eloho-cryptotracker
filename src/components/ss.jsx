import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setPrices } from "../store/trackerSlice";

const Tracker = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      console.log("Connecting WebSocket...");
      socketRef.current = new WebSocket(
        "wss://ws.coincap.io/prices?assets=bitcoin,ethereum,tether,solana,chainlink,polkadot,uniswap,bittensor,kaspa,celestial"
      );

      socketRef.current.onopen = () => {
        console.log("WebSocket connected!");
      };

      socketRef.current.onmessage = (event) => {
        try {
          const newPrices = JSON.parse(event.data);
          console.log("Received prices:", newPrices);
          dispatch(setPrices(newPrices));
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socketRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.reason);
        setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
      };
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        console.log("Closing WebSocket...");
        socketRef.current.close();
      }
    };
  }, [dispatch]);

  return <div>Crypto Price Tracker</div>;
};

export default Tracker;
