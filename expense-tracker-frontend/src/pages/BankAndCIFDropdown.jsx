import {useState, useEffect} from 'react';


function BankAndCIFDropdown({token, selectedBank, setSelectedBank, selectedCIF, setSelectedCIF, setRefreshCount}) {

    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState([]);
    const [CIFs, setCIFs] = useState([]);
    const [enableCIF, setEnableCIF] = useState(false);
    const [banksLoaded, setBanksLoaded] = useState(false)
    const [bankID, setBankID] = useState("")

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

    

    useEffect(() => {
        if (selectedBank !== "") {setEnableCIF(true); console.log(enableCIF)}
        if (selectedBank === "" || selectedBank === undefined) {setEnableCIF(false); console.log(enableCIF)}
    },[selectedBank])

    useEffect(() => {
        getBanks()
    },[]);

    

    function populateBankDropdown() {
        return (
            <select onChange={(e) => {setSelectedBank(e.target.value)}}>
                <option></option>
                {banks.map((row) => <option value={row.bank_key}>{row.bank_name}</option>)} 
            </select>
        )
    }



    async function getCIFs() {
        const endpoint = "http://localhost:8000/cifs/fetch"
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
                )

                if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail);
                    }

                const data = await response.json();
                setCIFs(data);

        }

        catch (err) {
            throw alert("Error fetching CIFs: "+err);
        }

        finally {
            setLoading(false)
        }

    };

    useEffect(() => {
        getCIFs()
        const filteredBanks = (banks.find((bank) => bank.bank_key === selectedBank))
        if (filteredBanks !== [] && filteredBanks !== undefined) {setBankID(banks.find((bank) => bank.bank_key === selectedBank)["id"])}
    },[selectedBank]);

    function populateCIFsDropdown() {
        const filteredCIFs = CIFs.filter((item) => item.bank_id === bankID)

        return (
            <select disabled={!enableCIF} onChange={(e) => {setSelectedCIF(e.target.value)}}>
                <option></option>
                {filteredCIFs.map((row) => <option key={row.id}>{row.cif_id}</option>)} 
            </select>
        )
    }
    

    return (<div className='banks-dropdown'>
                <table>
                    <thead>
                        <tr>
                            <th>Select Bank</th>
                            <th>CIF</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{!banksLoaded ? populateBankDropdown() : ""}</td>
                            <td>{populateCIFsDropdown()}</td>
                            <td><button onClick={setRefreshCount((e) => e + 1)}>Fetch Cards</button></td>
                        </tr>
                    </tbody>
                </table>
            
            </div>)
}

export default BankAndCIFDropdown;