import { useState } from 'react';

function CardSearch() {
    const [cif, setCif] = useState("");
    const[cardResponse, setCardResponse] = useState()

    async function getCards(cif) {
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
    };

    return (
        <div>
            <h1>Get List of Cards</h1>

            <input
            type="text"
            placeholder="Enter client CIF here"
            value = {cif}
            onChange={(input) => setCif(input.target.value)}
            />

            <button onClick={() => getCards(cif)}>Fetch Cards</button>
            

            <h3>Debit Cards</h3>
            {cardResponse && cardResponse.debitCards && (
        
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
        )
        }

            <h3>Credit Cards</h3>
            {cardResponse && cardResponse.creditCards && (
            
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
            )
            }
        
        </div>
        )
};

export default CardSearch;