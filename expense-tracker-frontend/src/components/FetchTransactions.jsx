import {useState, useEffect} from 'react';
import { apiFetch } from '../api';

function FetchTransactions({token, refreshCount, setRefreshCount}) {

    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);

    async function getTransactions() {
        const endpoint = "/transactions/fetch";
        const options = {
            method: "GET"
        }
        setLoading(true);
        
        try {
            const response = await apiFetch(endpoint,options);
            if (!response) {return};

                const data = await response.json();
                setTransactions(data);
        }
        catch(err) {
                throw alert("Error fetching transactions: "+err);
            }
        finally {
            setLoading(false)
        }
    };

    
    async function deleteTransactions(transaction_id) {
        const endpoint = "/transactions/delete/"+transaction_id;
        const options = {
            method:"DELETE"
        }
        setLoading(true);
        
        try {
            const response = await apiFetch(endpoint,options)
            if (!response) {return}

            const data = await response.json();
            setRefreshCount((e) => e + 1);
                
        }
        catch(err) {
            console.error("Error deleting transaction: "+err);
            alert("Error deleting transaction: "+err);
            }
        finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        getTransactions();
    }, [refreshCount]);

    function formatAmount(value, currency = 'BHD') {
        const decimals = currency === 'BHD' ? 3 : 2;
        return parseFloat(value).toFixed(decimals)
    }

    function populateTable() {
        return transactions.map((row) =>   <tr key={row.id}>
                                        <td>{row.date}</td>
                                        <td>{row.transaction_type}</td>
                                        <td>{row.category}</td>
                                        <td style={{ textAlign: 'right' }}>{formatAmount(row.amount)}</td>
                                        <td>{row.description}</td>
                                        <td><button onClick={() => deleteTransactions(row.id)}>Delete Transaction</button></td>
                                    </tr>);
        };

    function populateFooter() {
        let totalSum = 0

        transactions.forEach((row) => {
            row.transaction_type.toLowerCase() === 'income' ? totalSum += row.amount : row.transaction_type.toLowerCase() === 'expense' ? totalSum -= row.amount : 0
        })

        return (<tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th style={{ textAlign: 'right' }}>{formatAmount(totalSum)}</th>
                            <th></th>
                            <th></th>
                        </tr>)
    }


    return (<div>
               
                <table>
                    <thead>
                        <tr>
                            <th>
                                Date
                            </th>
                            <th>Transaction Type</th>
                            <th>Category</th>
                            <th itemID='tranAmount'>Amount</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {populateTable()}
                    </tbody>
                    <tfoot>
                        {populateFooter()}
                    </tfoot>
                </table>
            
            </div>)
}

export default FetchTransactions;