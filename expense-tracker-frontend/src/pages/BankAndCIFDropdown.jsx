import {useState, useEffect} from 'react';


function BankAndCIFDropdown({token, selectedBank, setSelectedBank, selectedCIF, setSelectedCIF, setCards, cards}) {

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
        if (selectedBank !== "") {setEnableCIF(true)}
        if (selectedBank === "" || selectedBank === undefined) {setEnableCIF(false)}

        getCIFs()
        // console.log("Bank Selected = "+selectedBank)
        const filteredBanks = (banks.find((bank) => bank.bank_key === selectedBank))
        if (filteredBanks !== [] && filteredBanks !== undefined) {setBankID(banks.find((bank) => bank.bank_key === selectedBank)["id"])}
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

    function populateCIFsDropdown() {
        const filteredCIFs = CIFs.filter((item) => item.bank_id === bankID)

        return (
            <select disabled={!enableCIF} onChange={(e) => setSelectedCIF(e.target.value)}>
                <option></option>
                {filteredCIFs.map((row) => <option key={row.id}>{row.cif_id}</option>)} 
            </select>
        )
    }

    async function getlistofcards() {
        setLoading(true)

        try {
            const response = await fetch(
                                            "http://localhost:8000/cardlist/getList?bank_key="+selectedBank,
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
                setCards(data);

            }

        catch (err) {
            throw alert("Error fetching Cards: "+err);
        }

        finally {
            setLoading(false)
        }

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
                            <td><button onClick={() => getlistofcards()}>Fetch Cards</button></td>
                        </tr>
                    </tbody>
                </table>
            
            </div>)
}

export default BankAndCIFDropdown;