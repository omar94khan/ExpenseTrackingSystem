import { useState } from 'react';

function CardSearch({token}) {

    const [banks, setBanks] = useState([]);
    const[loading, setLoading] = useState(false);
    const[selectedBank, setSelectedBank] = useState()

    

    async function getBanks() {
        const endpointBanks = "http://localhost:8000/banks/fetch"
        setLoading(true);
        
        try {
            const responseBanks = await fetch(endpointBanks,
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

                const data = await responseBanks.json();
                setBanks(data);
        }
        catch(err) {
                throw alert("Error fetching banks: "+err);
            }
        finally {
            setLoading(false)
        }
    };


    const [cards, setCards] = useState({})

    async function getCards(bank_key) {
        const endpointCards = "http://localhost:8000/cardlist/getList"
        setLoading(true);

        try{
            const responseCards = await fetch(endpointCards,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type" : "application/json"
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

            const cardData =  await responseCards.json();
            setCards(cardData);
        }
        catch(err) {
            throw alert("Error fetching card info: "+ err );
        }
        finally {
            setLoading(false);
        }
    }

    function bankList() {
        return(banks.map(row => <option value={selectedBank} onSelect={() => setSelectedBank(row.bank_key)}>{row.bank_name}</option>))
    }


    return (<div>
                <h2>Card Search Page</h2>

                <table>
                    <thead>
                        <tr>
                            <th></th>
                        </tr>
                    </thead>
                </table>
            </div>)
}

export default CardSearch;