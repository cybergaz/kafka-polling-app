import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Approutes from "./Approutes";

function App() {
  const [count, setCount] = useState(0);

  return <Approutes />;
}

export default App;
