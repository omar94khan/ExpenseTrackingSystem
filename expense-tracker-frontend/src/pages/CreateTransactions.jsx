import {useState} from 'react';


function CreateTransactions({token, onAdd}) {

    const [loading, setLoading] = useState(false);
    const [transactionTime, setTransactionTime] = useState();
    const [transactionDescription, setTransactionDescription] = useState();
    const [transactionCategory, setTransactionCategory] = useState();
    const [transactionAmount, setTransactionAmount] = useState();
    const [transactionType, setTransactionType] = useState("Income");

    async function createTransaction() {
        const endpoint = "http://localhost:8000/transactions/create";
        setLoading(true);
        
        try {
            const response = await fetch(endpoint,
                        {
                            method: "POST",
                            headers : {
                                    "Authorization": "Bearer " + token,
                                    "Content-Type": "application/json"
                                },
                            body : JSON.stringify({
                                "amount" : transactionAmount,
                                "transaction_type" : transactionType,
                                "category" : transactionCategory,
                                "date" : transactionTime,
                                "description" : transactionDescription
                            })
                        }
                    );
                if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail);
                    }

                const data = await response.json();
                onAdd;

        }
        catch(err) {
                throw alert("Error logging in: "+err);
            }
        finally {
            setLoading(false)
        }
    };

    //  amount: float
    // transaction_type: str
    // category: Optional[str] = None
    // date: date
    // description: Optional[str] = None

    function populateOptions() {
            if (transactionType === "Income") {
                return (<select id="transaction-category" onChange={(e) => setTransactionCategory(e)}>
                            <option>Salary</option>
                            <option>Rental Income</option>
                            <option>Sales</option>
                            <option>Reimbursement</option>
                            <option>Remittance</option>
                            <option>Transfer Receipts</option>
                        </select>)
                    }
            else if (transactionType === "Expense") {
                return (<select id="transaction-category" onChange={(e) => setTransactionCategory(e)}>
                            <option>Food</option>
                            <option>Rent</option>
                            <option>Education</option>
                            <option>Drinks</option>
                            <option>Clothing</option>
                            <option>Car Payment</option>
                            <option>Parking</option>
                            <option>Transport</option>
                            <option>Loan Payback</option>
                            <option>Remittance</option>
                            <option>Phone Credit</option>
                            <option>Allowance</option>
                            <option>Fun</option>
                            <option>Sports</option>
                        </select>)
                    }
            else if (transactionType === "Transfer") {
                return (<select id="transaction-category" onChange={(e) => setTransactionCategory(e)} disabled>
                            <option>Transfer</option>
                        </select>)
                    }
            else {
                alert("Incorrect transaction type selected");
                return
            }

    };
    
    return (<div>
        <table>
            <thead>
                <th>Transaction Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Transaction Type</th>
                <th></th>
            </thead>

            <tbody>
                <td><input type="datetime-local" id="transaction-time" onChange={(e) => setTransactionTime(e)} /></td>
                <td><input type='text' id='transaction-description' onChange={(e) => setTransactionDescription(e)}/></td>
                <td>{populateOptions()}</td>
                <td><input type="number" id="transaction-amount" onChange={(e) => setTransactionAmount(e)} /></td>
                <td><select onChange={(e) => setTransactionType(e.target.value)}><option>Income</option> <option>Expense</option> <option>Transfer</option> </select></td>
                <td><button onClick={() => createTransaction()}>Post Transaction</button></td>
            </tbody>
        </table>
    </div>);
}

export default CreateTransactions;