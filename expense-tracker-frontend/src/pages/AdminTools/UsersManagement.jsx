import {useState} from 'react';
import { useNavigate, Link } from "react-router-dom";
import CreateUsers from '../../components/CreateUsers';
import FetchUsers from '../../components/FetchUsers';

function UsersManagement({token}) {
    const [refreshCount, setRefreshCount] = useState(0);

    return (<>
                <div>
                    <h2>Users Management</h2>
                    <CreateUsers token={token} refreshCount={refreshCount} setRefreshCount={setRefreshCount} />
                    <FetchUsers token={token} refreshCount={refreshCount} setRefreshCount={setRefreshCount} />
                </div>

                <div>
                    <Link to="/admintools">Go Back</Link>
                </div>
            </>);
}

export default UsersManagement;