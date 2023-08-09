import { useState } from "react";
import "./App.css";

function App() {
  const onClick = () => {
    alert("hello");
  };
  return <button onClick={onClick}>Test</button>;
}

export default App;
