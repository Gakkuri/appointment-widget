import "./App.css";

function App() {
  const onClick = () => {
    alert("hello");
  };
  return (
    <button className="test" onClick={onClick}>
      Test
    </button>
  );
}

export default App;
