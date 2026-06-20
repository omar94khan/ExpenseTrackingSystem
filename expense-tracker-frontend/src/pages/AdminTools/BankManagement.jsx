import {useState} from 'react';
import { useNavigate, Link } from "react-router-dom";
import CreateBanks from '../../components/CreateBank';
import FetchBanks from '../../components/FetchBanksTable';

function BankManagement({token}) {
    const [refreshCount, setRefreshCount] = useState(0);

    return (<>
                <div>
                    <h2>Bank Management</h2>
                    <CreateBanks token={token} refreshCount={refreshCount} setRefreshCount={setRefreshCount} />
                    <FetchBanks token={token} refreshCount={refreshCount} setRefreshCount={setRefreshCount} />
                </div>

                <div>
                    <Link to="/admintools">Go Back</Link>
                </div>
            </>);
}

export default BankManagement;