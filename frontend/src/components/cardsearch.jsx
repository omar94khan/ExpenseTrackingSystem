import { useState } from 'react';

function CardSearch() {
    const [cif, setCif] = useState();
    const[cardResponse, setCardResponse] = useState()
    const[loading, setLoading] = useState(false)

    async function getCards(cif) {
        if (!cif) {
            alert("Please input a CIF number.");
            return;
        }

        
        setLoading(true);

        
        const response = await fetch("http://localhost:8000/cardlist/getList",
                {
                    method: "POST",
                    headers : {
                            "Content-Type": "application/json"
                        },
                    body: JSON.stringify(
                            {"CIF" : cif}
                        )
                }
            );

        const data = await response.json();

        setCardResponse(data);
        setLoading(false);
        if (!data?.creditcards?.cardsList && !data?.debitCards?.cardsList) {alert("No cards found against given CIF")};

        
    };

    if (loading) return <p>Loading Cards...</p>
    if (!loading) return ( 
        <div>
            <h1>Get List of Cards</h1>

            <input
            type="number"
            placeholder="Enter client CIF here"
            value = {cif}
            onChange={(input) => setCif(input.target.value)}
            />

            <button onClick={() => getCards(cif)}>Fetch Cards</button>
            


            {cardResponse && cardResponse.debitCards && cardResponse.debitCards.cardsList && (
            <div>
                <h3>Debit Cards</h3>
                
                <table className="table">
                    <thead>
                        <tr>
                            <th>Card Type</th>
                            <th>Card Number</th>
                            <th>Card Status</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                    
                    {
                        cardResponse.debitCards.cardsList?.map(function(card) {
                            const program = card.fields.find(x => x.fieldName === 'card_program');
                            const programValue = program ? program.fieldValue : "N/A";

                            const rawCardStatus = card.fields.find(x => x.fieldName === "card_status");
                            const cardStatus = rawCardStatus.fieldValue === "0" ? "Active" : "Inactive";

                            return (
                                    <tr key={card.cardId}>
                                        <td>{programValue}</td>
                                        <td>{card.pAN}</td>
                                        <td>{cardStatus}</td>
                                    </tr>
                                    )
                                }
                            )
                        }
                    </tbody>

                </table>
            </div>
        )
        }

            {cardResponse && cardResponse.creditCards && cardResponse.creditCards.cardsList && (
            <div>
                <h3>Credit Cards</h3>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Card Type</th>
                            <th>Card Number</th>
                            <th>Card Currency</th>
                            <th>Cardholder Name</th>
                            <th>Card Status</th>
                        </tr>
                    </thead>
                    
                    
                    <tbody>
                    {cardResponse.creditCards.cardsList?.map(function(card) {
                    const cardType = card.productDescription;
                    const cardNumber = card.maskedCardNumber;
                    const cardCurrency = card.creditCardCurrency;
                    const cardHolderName = card.cardholderName;
                    const cardStatus = card.cardStatus;

                    return (<tr key={card.cardNumber}>
                                <td>{cardType}</td>
                                <td>{cardNumber}</td>
                                <td>{cardCurrency}</td>
                                <td>{cardHolderName}</td>
                                <td>{cardStatus}</td>
                            </tr>
                            )
                            }
                        )
                        }
                    </tbody>

                </table>
            </div>
            )
            }
        
        </div>
        )
    
};

export default CardSearch;