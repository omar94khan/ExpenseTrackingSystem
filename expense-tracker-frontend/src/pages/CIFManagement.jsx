import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import CreateBanks from '../components/CreateBank';
import FetchBanks from '../components/FetchBanksTable';

function CIFManagement({token}) {
    const [refreshCount, setRefreshCount] = useState(0);

    return (<div>
                <h2>Bank Management</h2>
                <CreateBanks token={token} refreshCount={refreshCount} setRefreshCount={setRefreshCount} />
                <FetchBanks token={token} refreshCount={refreshCount} setRefreshCount={setRefreshCount} />
            </div>);
}

export default CIFManagement;