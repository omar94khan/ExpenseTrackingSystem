import {useState, useEffect} from 'react';
import {getBanksList} from './FetchBanksTable';
import { apiFetch } from '../api';


function CreateCIFs({token, refreshCount, setRefreshCount}) {

    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [cif, setCIF] = useState("");

    useEffect(() => {
        async function loadBanks() {
            try {
                const data = await getBanksList(token);
                setBanks(data);
            } catch (err) {
                alert("Error fetching banks: "+err);
            }
        }
        loadBanks()
    },[])

    async function CreateCIF() {
        if (selectedBank === "") {
            alert("Please selected your bank.");
            return
        };

        if (cif === "") {
            alert("CIF Cannot be empty");
            return
        };


        const endpoint = "/cifs/create";
        const options = {
            method : "POST",
            body : JSON.stringify({
                        "bank_key" : selectedBank,
                        "cif" : cif
                    })
        }
        setLoading(true);
        
        try { 
                const response = await apiFetch(endpoint,options);

                if (!response) {return};

                const data = await response.json();
                setRefreshCount((e) => e + 1);
                setSelectedBank("");
                setCIF("");

        }
        catch(err) {
                throw alert("Error creating CIF: "+err);
            }
        finally {
            setLoading(false)
        }
    };

    function populateBankDropdown() {
        return banks.map(bank => (
                <option key={bank.bank_key} value={bank.bank_key}>{bank.bank_name}</option>
        ))
    }
    
    return (<div className='cif-management-div'>
        <h3>Add New CIF</h3>
        <table>
            <tbody>
                <tr>
                    <th>Bank Name</th>
                    <td>
                        <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                            <option value="">Select Bank</option>
                            {populateBankDropdown()}
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>CIF ID</th>
                    <td>
                        <input type='text' value={cif} placeholder='Enter CIF here' onChange={(e) => setCIF(e.target.value)}></input>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}><button onClick={() => CreateCIF()}>Add CIF</button> </td>
                </tr>
            </tbody>
        </table>
    </div>);
}

export default CreateCIFs;