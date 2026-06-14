import { useState } from 'react';

function ListTransactions({transactions, setTransactions, onDelete}) {

    return (<div>
        <table>
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Transaction Description</th>
                    <th>Amount</th>
                    <th>Transaction Type</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>                
                {transactions.map(function(transaction) {
                    const formattedDateTime = new Date(Number(transaction.id)).toLocaleString('en-US', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short'
                                                    });
                    return (<tr key={transaction.id}>
                        <td>{formattedDateTime}</td>
                        <td>{transaction.description}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.type}</td>
                        <td><button onClick={(() => onDelete(transaction.id))}>Delete Transaction</button></td>
                    </tr>)
                })}
            </tbody>
        </table>
    </div>)
};

export default ListTransactions;