import { useState } from 'react';
import CardSummary from './components/cardsearch';
import AddTransactions from './components/addTransactions';
import ListTransactions from './components/listTransactions';

function App() {
    const [transactions, setTransactions] = useState([]);

    function handleAdd(newTransaction) {
        setTransactions(prev => [...prev, newTransaction]);
    }

    function handleDelete(id) {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }

    return (
        <div>
            <CardSummary />
            <AddTransactions onAdd={handleAdd} />
            <ListTransactions transactions={transactions} onDelete={handleDelete} />
        </div>
    );
}

export default App;