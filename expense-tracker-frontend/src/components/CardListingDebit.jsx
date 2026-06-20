import {useState, useEffect} from 'react';


function CardListingDebit({token, cards, loading}) {
    
    const [expandedId, setExpandedId] = useState(null);
    
    function toggleRow(id) {
        setExpandedId(expandedId === id ? null : id);
    }

    function getCardProgram(card) {
        return card.fields.find(e => e.fieldName === "card_program")?.fieldValue
    }

    function getCardStatus(card) {
        const status = card.fields.find(e => e.fieldName === "card_status")?.fieldValue
        return status === "0" ? "ACTIVE" : "INACTIVE"
    }

    function getCustomerID(card) { 
        return card.fields.find(e => e.fieldName === "customer_id")?.fieldValue
    }

    function getIssueDate(card) { 
        return card.fields.find(e => e.fieldName === "date_issued")?.fieldValue
    }

    function populateTable() {        
        return cards?.debitCards?.cardsList?.map((card) =>
        <>
            <tr key={card.cardId} onClick={() => toggleRow(card.cardId)}>
                <td>{getCardProgram(card)}</td>
                <td>{card?.embossName}</td>
                <td>{card?.pAN}</td>
                <td>{getCardStatus(card)}</td>
            </tr>
            {expandedId === card.cardId && (
                <tr key={card.cardId + "-details"}>
                    <td colSpan={4}>
                        <tr>
                            <th colSpan={2}>Additional Information</th>
                        </tr>
                        <tr>
                            <th>Customer ID</th>
                            <td>{getCustomerID(card)}</td>
                        </tr>
                        <tr>
                            <th>Card Issuance Date</th>
                            <td>{getIssueDate(card)}</td>
                        </tr>
                        <tr>
                            <th>Card Printing Status</th>
                            <td>{card.isVirtual ? "Virtual Card" : "Physical Card"}</td>
                        </tr>
                        <tr>
                            <th>Click to Pay Status</th>
                            <td>{card.isVisaClickToPayEnrolled ? "Enrolled" : "Not Enrolled"}</td>
                        </tr>
                    </td>
                </tr>
            )}
        </>)
    }
    
    if (loading) {return <div>
                    <h3>Debit Cards Loading</h3>
                </div>}
    return (<div>
                <h3>Debit Cards</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Card Type</th>
                            <th>Emboss Name</th>
                            <th>Card Number</th>
                            <th>Card Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {populateTable()}
                    </tbody>
                </table>
            </div>)
}

export default CardListingDebit;