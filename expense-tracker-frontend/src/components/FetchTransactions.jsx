import {useState, useEffect} from 'react';


function FetchTransactions({token, refreshCount, setRefreshCount}) {

    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);

    async function getTransactions() {
        const endpoint = "http://localhost:8000/transactions/fetch";
        setLoading(true);
        
        try {
            const response = await fetch(endpoint,
                        {
                            method: "GET",
                            headers : {
                                    "Authorization": "Bearer " + token,
                                    "Content-Type": "application/json"
                                }
                        }
                    );
                if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail);
                    }

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
        const endpoint = "http://localhost:8000/transactions/delete/"+transaction_id;
        setLoading(true);
        
        try {
            const response = await fetch(endpoint,
                        {
                            method: "DELETE",
                            headers : {
                                    "Authorization": "Bearer " + token,
                                    "Content-Type": "application/json"
                                }
                        }
                    );
                if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail);
                    }

                const data = await response.json();
                setRefreshCount((e) => e + 1);
                
        }
        catch(err) {
                throw alert("Error deleting transaction: "+err);
            }
        finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        getTransactions();
    }, [refreshCount]);

    function populateTable() {
        return transactions.map((row) =>   <tr>
                                        <td>{row.id}</td>
                                        <td>{row.date}</td>
                                        <td>{row.transaction_type}</td>
                                        <td>{row.category}</td>
                                        <td>{row.amount}</td>
                                        <td>{row.description}</td>
                                        <td><button onClick={() => deleteTransactions(row.id)}>Delete Transaction</button></td>
                                    </tr>);
        };



    return (<div>
               
                <table>
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Date</th>
                            <th>Transaction Type</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {populateTable()}
                    </tbody>
                </table>
            
            </div>)
}

export default FetchTransactions;