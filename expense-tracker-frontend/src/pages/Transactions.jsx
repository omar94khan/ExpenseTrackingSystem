import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import CreateTransactions from './CreateTransactions';
import FetchTransactions from './FetchTransactions';


function Transactions({token}) {
    
    const [refreshCount, setRefreshCount] = useState(0)

    return (<div>
        <h2>New Entry</h2>
        <CreateTransactions token={token} refreshCount={refreshCount} setRefreshCount={setRefreshCount} />

        <br />
        <br />

        <h2>Transactions</h2>
        <FetchTransactions token = {token} refreshCount = {refreshCount} setRefreshCount = {setRefreshCount}/>
    </div>)


}

export default Transactions;