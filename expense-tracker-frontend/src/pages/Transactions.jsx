import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import CreateTransactions from './CreateTransactions';
import FetchTransactions from './FetchTransactions';


function Transactions({token}) {
    console.log("Token received from App.jsx = "+token)
    const [triggerAPI, setTriggerAPI] = useState(false)
    
    async function fetchTransactions(){
        
        return ""
    };

    return (<div>
        <h2>New Entry</h2>
        <CreateTransactions token={token} onAdd={fetchTransactions} />

        <br />
        <br />

        <h2>Transactions</h2>
        <FetchTransactions token = {token} adhoctrigger={triggerAPI} triggerSetter = {setTriggerAPI}/>
    </div>)


}

export default Transactions;