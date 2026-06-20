import {useState} from 'react';


function CreateUsers({token, refreshCount, setRefreshCount}) {

    const [loading, setLoading] = useState(false);
    const [bankKey, setBankKey] = useState("");
    const [bankName, setBankName] = useState("");
    const [bankBIC, setBankBIC] = useState("");

    async function CreateBank() {
        if (bankName === "") {
            alert("Bank Name Cannot be Empty.");
            return
        };

        if (bankKey === "") {
            alert("Bank Key Cannot be Empty");
            return
        };


        const endpoint = "http://localhost:8000/banks/create";
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
                                "bank_name" : bankName,
                                "bank_key" : bankKey,
                                "bank_bic" : bankBIC
                            })
                        }
                    );
                if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail);
                    }

                const data = await response.json();
                setRefreshCount((e) => e + 1);
                setBankName("");
                setBankKey("");
                setBankBIC("");

        }
        catch(err) {
                throw alert("Error adding bank: "+err);
            }
        finally {
            setLoading(false)
        }
    };

    
    return (<div className='bank-management-div'>
        <h3>Add New Bank</h3>
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
                <tr>
                    <td><input type="text" onChange={(e) => setBankKey(e.target.value)} value={bankKey} /></td>
                    <td><input type="text" onChange={(e) => setBankName(e.target.value)} value={bankName} /></td>
                    <td><input type="text" onChange={(e) => setBankBIC(e.target.value)} value={bankBIC} /></td>
                    <td><button onClick={() => CreateBank()}>Add Bank</button> </td>
                </tr>
            </tbody>
        </table>
    </div>);
}

export default CreateUsers;