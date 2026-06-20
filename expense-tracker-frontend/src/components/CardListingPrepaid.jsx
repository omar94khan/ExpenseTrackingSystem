import {useState, useEffect} from 'react';


function CardListingPrepaid({token, cards, loading}) {
    const [expandedId, setExpandedId] = useState(null);
    const [prepaidCards, setPrepaidCards] = useState([]);
    

    function toggleRow(id) {
            setExpandedId(expandedId === id ? null : id);
        }

    const prepaidCardsFilter = [
        {"cardOrg": "024", "logo": "006"},
        {"cardOrg": "160", "logo": "001"},
        {"cardOrg": "161", "logo": "001"},
        {"cardOrg": "162", "logo": "001"},
        {"cardOrg": "163", "logo": "001"},
        {"cardOrg": "166", "logo": "001"}
    ]

    function isPrepaidCard(card) {
        return prepaidCardsFilter.some(filter =>
                filter.cardOrg === card.cardOrg &&
                filter.logo === card.logo
            );
    }

    function formatAmount(value, currency) {
        const decimals =  currency === "BHD" ? 3 : 2;
        return ((parseFloat(value) / (10 ** decimals)).toFixed(decimals))
    }

    function formatDate(dateStr) {
                if (!dateStr || dateStr.length !== 8) return "Invalid Date";

                const day = dateStr.substring(0, 2);
                const monthIndex = parseInt(dateStr.substring(2, 4)) -1
                const year = dateStr.substring(4, 8);

                const dummyDate = new Date(year, monthIndex, day);
                const shortMonth = dummyDate.toLocaleString('en-US', { month: 'short' });

                return `${day}-${shortMonth}-${year}`;
        }

    function explainBlockCde(e) {
        if (e === "B") {
            return "Blocked"
        }
        if (e === "D") {
            return "Dormant"
        }
        if (e === "F") {
            return "Frozen"
        }
        return ""
    }

    function explainAccountStatus(status) {
        if (status === "B") {
            return "Blocked"
        }
        if (status === "D") {
            return "Declined (Fraud Team)"
        }
        if (status === "I") {
            return "Inactive (New Card)"
        }
        if (status === "F") {
            return "Frozen by Customer"
        }
        if (status === "W") {
            return "Write Off"
        }
        if (status === "M") {
            return "Migration"
        }
        if (status === "K") {
            return "Closed"
        }
        if (status === "N") {
            return "Do Not Renew"
        }
        if (status === "S") {
            return "Delinquent"
        }
        if (status === "G") {
            return "Dormant"
        }
        if (status === "P") {
            return "Past Due"
        }
        if (status === "C") {
            return "Cycle Past Due"
        }
        if (status === "H") {
            return "Delinquent 60+ Days"
        }
        if (status === "R") {
            return "Delinquent 180+ Days"
        }
        return ""
    }


    useEffect(() => 
                {
                    setPrepaidCards(cards.creditCards?.cardsList?.filter((card) => isPrepaidCard(card)));
                    console.log("List of prepaid cards: "+prepaidCards);
                },[cards])
    
    function populateTable() {
        return prepaidCards?.map((card) =>
            <>
               <tr key={card.cardNumber} onClick={() => toggleRow(card.cardNumber)}>
                    <td>{card.productDescription}</td>
                    <td>{card.cardholderName}</td>
                    <td>{card.maskedCardNumber}</td>
                    <td>{card.creditCardCurrency}</td>
                    <td>{card.cardStatus}</td>
                </tr> 
                {expandedId === card.cardNumber && (
                    <tr key={card.cardNumber + "-details"}>
                    <td colSpan={5}>
                        <tr>
                            <th colSpan={2}>Additional Information</th>
                        </tr>
                        <tr>
                            <th>Available Balance</th>
                            <td>{formatAmount(card.holdAmount, card.creditCardCurrency)}</td>
                        </tr>
                        <tr>
                            <th>Supplementary Status</th>
                            <td>{card.primarySupplementaryFlag === "0" ? "Primary" : "Supplementary"}</td>
                        </tr>
                        <tr>
                            <th>Card Issuance Date</th>
                            <td>{formatDate(card.cardIssueDate)}</td>
                        </tr>
                        <tr>
                            <th>Card Expiry Date</th>
                            <td>{formatDate(card.cardExpiryDate)}</td>
                        </tr>
                        <tr>
                            <th>Card Printing Status</th>
                            <td>{card.isVirtual ? "Virtual Card" : "Physical Card"}</td>
                        </tr>
                        <tr>
                            <th>Click to Pay Enrollment Status</th>
                            <td>{card.isVisaClickToPayEnrolled ? "Enrolled" : "Not Enrolled"}</td>
                        </tr>
                        <tr>
                            <th>Card Block Status</th>
                            <td>{explainBlockCde(card.blockCde)}</td>
                        </tr>
                        <tr>
                            <th>Account Block Status 1</th>
                            <td>{explainAccountStatus(card.blockCode1)}</td>
                        </tr>
                        <tr>
                            <th>Account Block Status 2</th>
                            <td>{explainAccountStatus(card.blockCode2)}</td>
                        </tr>
                    </td>
                </tr>
                )}
            </>
        )
    }
    
    if (loading) {return <div>
                    <h3>Prepaid Cards Loading</h3>
                </div>}

    return (<div>
                <h3>Prepaid Cards</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Card Type</th>
                            <th>Cardholder Name</th>
                            <th>Card Number</th>
                            <th>Card Currency</th>
                            <th>Card Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {populateTable()}
                    </tbody>
                </table>
            </div>)
}

export default CardListingPrepaid;