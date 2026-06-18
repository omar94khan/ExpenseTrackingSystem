import { useState, useEffect } from 'react';
import BankAndCIFDropdown from './BankAndCIFDropdown';

function CardSummary({token}) {

    const [loading, setLoading] = useState(false);
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedCIF, setSelectedCIF] = useState("");
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        
    },[refreshCount])
    

    return (<div>
                <h2>Card Summary Page</h2>
                
                <BankAndCIFDropdown token={token} selectedBank={selectedBank} setSelectedBank={setSelectedBank} selectedCIF={selectedCIF} setSelectedCIF = {selectedCIF} setRefreshCount={setRefreshCount}/>
            
            </div>)
}

export default CardSummary;