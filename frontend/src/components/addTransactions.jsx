import { useState } from 'react';

function AddTransactions({onAdd, transactions}) {

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("Expense");

    // A helper function to ensure the user doesn't submit null or empty strings for Description and Amount
    function handleSubmit() {
        if (!description || !amount) {
            alert("Please fill in all fields");
            return;
        }

        onAdd({
            id: Date.now(),
            description,
            amount: Number(amount),
            type,
        });
        setDescription("");
        setAmount("");
    
    }

    return(<div><h1>Transactions</h1>

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Expense">Expense</option>
        <option value="Income">Income</option>
      </select>

      <button onClick={handleSubmit}>Add Transaction</button>
      </div>
    )
};

export default AddTransactions;