import { useState, useEffect } from 'react';
import BankAndCIFDropdown from './BankAndCIFDropdown';

function CardSummary({token}) {

    // const [loading, setLoading] = useState(false);
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedCIF, setSelectedCIF] = useState("");
    const [cards, setCards] = useState({})

    // useEffect(() => {
    //     return
    // },[refreshCount])
    

    return (<div>
                <h2>Card Summary Page</h2>
                
                <BankAndCIFDropdown token={token} selectedBank={selectedBank} setSelectedBank={setSelectedBank} selectedCIF={selectedCIF} 
                                    setSelectedCIF = {selectedCIF} cards={cards} setCards={setCards}
                                    />
                
                <h4>Debit Cards</h4>
                <table>
                    <thead>
                        <tr>
                            <th>S No</th>
                            {/* 
                            embossName 
                            pAN 
                            fields:
                                card_program
                                customer_id
                                card_status 1 is inactive 0 is active
                                date_issued 2026-02-19 13:07:01.0
                                isVirtual
                                isVisaClickToPayEnrolled */}
                        </tr>
                    </thead>
                </table>



                <h4>Credit Cards</h4>
                <table>
                    <thead>
                        <tr>
                            <th>S No</th>
                            {/* 
                            maskedCardNumber
                            productDescription
                            cardStatus
                            creditCardCurrency
                            cardIssueDate": "14022026",
                            cardExpiryDate": "29022028"
                            cardholderName
                            creditLimit
                            HoldAmountSign + means owed - means extra
                            primarySupplementaryFlag
                            holdAmount
                            blockCde
                            blockCode1
                            blockCode2
                            isVirtual
                            isVisaClickToPayEnrolled */}
                        </tr>
                    </thead>
                </table>
            
            </div>)
}

export default CardSummary;