import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import CreateCIFs from '../components/CreateCIFs';
import FetchCIFs from '../components/FetchCIFs';

function CIFManagement({token}) {
    const [refreshCount, setRefreshCount] = useState(0);

    return (<div>
                <h2>Manage CIFs</h2>
                <CreateCIFs token={token} refreshCount={refreshCount} setRefreshCount={setRefreshCount} />
                <FetchCIFs token={token} refreshCount={refreshCount} setRefreshCount={setRefreshCount} />
            </div>);
}

export default CIFManagement;