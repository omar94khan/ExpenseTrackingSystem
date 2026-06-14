import { useState } from 'react';

function ListTransactions({transactions, setTransactions, onDelete}) {
    
    function deleteTransaction(id) {
        setTransactions(transactions.filter(function(x) {return x.id !== id;})
        );
    }

    return (<div>
      <ul>
        {transactions.map(function(transaction) {
          return (
            <li key={transaction.id}>
              {transaction.id} - {transaction.description} — {transaction.amount} ({transaction.type})
              <button onClick={() => onDelete(transaction.id)}>Delete</button>
            </li>
            
          );
          
        })}
            
      </ul>

    </div>)
};

export default ListTransactions;