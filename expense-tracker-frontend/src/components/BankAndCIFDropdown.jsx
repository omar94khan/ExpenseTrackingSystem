import {useState, useEffect} from 'react';
import { apiFetch } from '../api';


function BankAndCIFDropdown({token, selectedBank, setSelectedBank, selectedCIF, setSelectedCIF, setCards, cards, loading, setLoading}) {

    const [banks, setBanks] = useState([]);
    const [CIFs, setCIFs] = useState([]);
    const [enableCIF, setEnableCIF] = useState(false);
    const [banksLoaded, setBanksLoaded] = useState(false)
    const [bankID, setBankID] = useState("")

    async function getBanks() {
        const endpoint = "/banks/fetch";
        const options = {
            method : "GET"
        }
        setLoading(true);
        
        try {
            const response = await apiFetch(endpoint,options)

            if (!response) {return}

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
        setSelectedCIF("")

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
        const endpoint = "/cifs/fetch"
        const options = {
            method: "GET"
        };
        setLoading(true);

        try {
                const response = await apiFetch(endpoint,options);

                if (!response) {return}

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

        if (selectedBank === "" || selectedCIF === "") {
            alert("Please ensure both, Bank and CIF are selected.")
            return
        }

        try {
            const endpoint = "/cardlist/getList?bank_key="+selectedBank+"&cif="+selectedCIF;
            const options = {
                    method: "GET"
                };

            const response = await apiFetch(endpoint, options)

            if (!response) {return}
                
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