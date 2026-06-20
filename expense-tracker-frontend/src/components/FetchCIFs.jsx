import {useState, useEffect} from 'react';
import {getBanksList} from './FetchBanksTable';

function FetchCIFs({token, refreshCount, setRefreshCount}) {

    const [loading, setLoading] = useState(false);
    const [cifs, setCIFs] = useState([]);
    const [banks, setBanks] = useState([]);

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

    async function getCIFs() {
        const endpoint = "http://localhost:8000/cifs/fetch";
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
                setCIFs(data);
        }
        catch(err) {
                throw alert("Error fetching CIFs: "+err);
            }
        finally {
            setLoading(false)
        }
    };

    
    async function deleteCIF(bank_key, cif_id) {
        const endpoint = "http://localhost:8000/cifs/delete";
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
                                "bank_key" : bank_key,
                                "cif" : cif_id
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
                throw alert("Error Deleting CIF: "+err);
            }
        finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        getCIFs();
    }, [refreshCount]);

    function populateTable() {
        
        const cifsWithBankInfo = cifs.map(cif => ({
                    ...cif,
                    bank: banks.find(bank => bank.id === cif.bank_id)
                }));
        
        return cifsWithBankInfo.map((row) =>   <tr key={row.id}>
                                                    <td>{row.id}</td>
                                                    <td>{row.bank?.bank_name ?? "Loading..."}</td>
                                                    <td>{row.cif_id}</td>
                                                    <td><button 
                                                            disabled={!row.bank}
                                                            onClick={() => deleteCIF(row.bank.bank_key, row.cif_id)}>
                                                                Delete CIF
                                                        </button>
                                                    </td>
                                                </tr>);
        };



    return (<div className='bank-management-div'>
               <h3>List of CIFs</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Bank Name</th>
                            <th>CIF</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {populateTable()}
                    </tbody>
                </table>
            
            </div>)
}

export default FetchCIFs;