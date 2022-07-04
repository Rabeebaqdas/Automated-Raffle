import React from "react";
import Header from "./components/Header";
import LotteryEntrance from "./components/LotteryEntrance";
import Web3Header from "./components/Web3Header";

function App() {
  return (
    <div className="App">
      <Web3Header />
      <LotteryEntrance />
    </div>
  );
}

export default App;
