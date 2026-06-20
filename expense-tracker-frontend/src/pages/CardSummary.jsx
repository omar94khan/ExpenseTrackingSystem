import { useState, useEffect } from 'react';
import BankAndCIFDropdown from '../components/BankAndCIFDropdown';
import CardListingCredit from '../components/CardListingCredit';
import CardListingDebit from '../components/CardListingDebit';
import CardListingPrepaid from '../components/CardListingPrepaid';

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