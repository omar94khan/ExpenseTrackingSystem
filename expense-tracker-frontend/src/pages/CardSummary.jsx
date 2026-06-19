import { useState, useEffect } from 'react';
import BankAndCIFDropdown from './BankAndCIFDropdown';
import CardListingCredit from './CardListingCredit';
import CardListingDebit from './CardListingDebit';
import CardListingPrepaid from './CardListingPrepaid';

function CardSummary({token}) {

    const [loading, setLoading] = useState(false);
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedCIF, setSelectedCIF] = useState("");
    const [cards, setCards] = useState([])
    
    
    return (<div>
                <h2>Card Summary Page</h2>
                
                <BankAndCIFDropdown token={token} 
                                    loading={loading} setLoading={setLoading}
                                    selectedBank={selectedBank} setSelectedBank={setSelectedBank} 
                                    selectedCIF={selectedCIF} setSelectedCIF = {setSelectedCIF} 
                                    cards={cards} setCards={setCards}
                                    />

                <CardListingDebit token={token} cards={cards} loading={loading}/>

                <CardListingCredit token={token} cards={cards} loading={loading}/>

                <CardListingPrepaid token={token} cards={cards} loading={loading}/>
            
            </div>)
}

export default CardSummary;