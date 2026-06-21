import {useState} from 'react';


function CreateTransactions({token, refreshCount, setRefreshCount}) {

    const [loading, setLoading] = useState(false);
    const [transactionTime, setTransactionTime] = useState("");
    const [transactionDescription, setTransactionDescription] = useState("");
    const [transactionCategory, setTransactionCategory] = useState("");
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [transactionType, setTransactionType] = useState("Expense");

    async function createTransaction() {
        if (transactionAmount <= 0) {
            alert("Transaction Amount Cannot be 0 or negative.");
            return
        };

        if (!['expense','income','transfer'].includes(transactionType.toLowerCase())) {
            alert("Transaction type must be Income / Expense / Transfer");
            return
        };

        if (transactionTime === "") {
            alert("Please select the date of the transaction");
            return
        };

        if (transactionCategory === "" || transactionCategory === undefined) {
            alert("Please select Transaction Category.")
            return
        }

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
                setRefreshCount((e) => e + 1);
                setTransactionAmount(0);
                setTransactionDescription("");
                setTransactionCategory("");

        }
        catch(err) {
                throw alert("Error adding transactions: "+err);
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
                return (<select id="transaction-category" value={transactionCategory} onChange={(e) => setTransactionCategory(e.target.value)}>
                            <option></option>
                            <option>Salary</option>
                            <option>Rental Income</option>
                            <option>Sales</option>
                            <option>Reimbursement</option>
                            <option>Remittance</option>
                            <option>Transfer Receipts</option>
                        </select>)
                    }
            else if (transactionType === "Expense") {
                return (<select id="transaction-category" value={transactionCategory} onChange={(e) => setTransactionCategory(e.target.value)}>
                            <option></option>
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
                return (<select id="transaction-category" value={transactionCategory} onChange={(e) => setTransactionCategory(e.target.value)} disabled>
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
                <tr>
                    <th>Transaction Date</th>
                    <th>Transaction Type</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td><input type="date" id="transaction-time" onChange={(e) => setTransactionTime(e.target.value)} value={transactionTime} /></td>
                    <td><select onChange={(e) => setTransactionType(e.target.value)}><option>Expense</option> <option>Income</option> <option>Transfer</option> </select></td>
                    <td>{populateOptions()}</td>
                    <td><input type="number" id="transaction-amount" onChange={(e) => setTransactionAmount(e.target.value)}  value={transactionAmount}/></td>
                    <td><input type='text' id='transaction-description' onChange={(e) => setTransactionDescription(e.target.value)}  value={transactionDescription}/></td>
                    <td><button onClick={() => createTransaction()}>Post Transaction</button></td>
                </tr>
            </tbody>
        </table>
    </div>);
}

export default CreateTransactions;