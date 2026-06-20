import {useState, useEffect} from 'react';


function FetchUsers({token, refreshCount, setRefreshCount}) {

    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState([]);

    async function getBanks() {
        const endpoint = "http://localhost:8000/banks/fetch";
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
                setBanks(data);
        }
        catch(err) {
                throw alert("Error fetching banks: "+err);
            }
        finally {
            setLoading(false)
        }
    };

    
    async function deleteBank(bank_key) {
        const endpoint = "http://localhost:8000/banks/delete";
        setLoading(true);
        
        try {
            const response = await fetch(endpoint,
                        {
                            method: "DELETE",
                            headers : {
                                    "Authorization": "Bearer " + token,
                                    "Content-Type": "application/json"
                                },
                            body: JSON.stringify({
                                "bank_key" : bank_key
                            })
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
                throw alert("Error deleting bank: "+err);
            }
        finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        getBanks();
    }, [refreshCount]);

    function populateTable() {
        return banks.map((row) =>   <tr>
                                        <td>{row.bank_key}</td>
                                        <td>{row.bank_name}</td>
                                        <td>{row.bank_bic}</td>
                                        <td><button onClick={() => deleteBank(row.bank_key)}>Delete Bank</button></td>
                                    </tr>);
        };



    return (<div className='bank-management-div'>
               <h3>List of Banks</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Bank Key</th>
                            <th>Bank Name</th>
                            <th>Bank BIC</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {populateTable()}
                    </tbody>
                </table>
            
            </div>)
}

export default FetchUsers;