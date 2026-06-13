import { useState } from 'react';
import CardSearch from './components/cardsearch';
import AddTransaction from './components/addTransactions';
import ListTransaction from './components/listTransactions';


function App() {
  const [transactions, setTransactions] = useState([
    // { id: 1, description: "Rent", amount: 500, type: "Expense" },
    // { id: 2, description: "Salary", amount: 3000, type: "Income" },
  ]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
    
  

  

  return(<div>
    <CardSearch />

    <AddTransaction 
      setTransactions={setTransactions} 
      transactions={transactions} 
      description={description} 
      amount={amount} 
      type={type} />
      
    <ListTransaction transactions={transactions} />
    </div>
  );
}

export default App;