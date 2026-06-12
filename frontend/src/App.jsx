function App() {
  const fruits = ["Apple", "Banana", "Mango", "Orange", "Pear"];

  return (
    <div>
      <h2>Fruit List</h2>
      <ol>
        {fruits.map(function(fruit) {
          return <li>{fruit}</li>;
        })}
      </ol>
      <p>Total fruits: {fruits.length}</p>
    </div>
  );
}

export default App;