import "./App.css";
import "./alertscript";

function App() {
  const onClick = () => {
    alert("hello");
  };
  return <button onClick={onClick}>Test</button>;
}

export default App;
