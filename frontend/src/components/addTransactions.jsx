import { useState } from 'react';

function AddTransactions({setTransactions, transactions, description, amount, type}) {

    // A helper function to ensure the user doesn't submit null or empty strings for Description and Amount
    function handleSubmit() {
        if (!description || !amount) {
            alert("Please fill in all fields");
            return;
        }
    }

    const newTransaction = {
      id: Date.now(),
      description: description,
      amount: Number(amount),
      type: type,
    };

    setTransactions([...transactions, newTransaction]);
    setDescription("");
    setAmount("");

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