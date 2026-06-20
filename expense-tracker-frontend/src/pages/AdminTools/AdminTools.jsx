import BankManagement  from "./BankManagement";
import { Outlet, Link, useNavigate } from "react-router-dom";


function AdminTools({token}) {




    return <div>
                <h1>Admin Control Panel</h1>

                <ul>
                    <li> <Link to="/admintools/bankManagement">Manage Banks</Link> </li>
                    <li> <Link to="/admintools/usersManagement">Manage Users</Link> </li>
                </ul>
            </div>
}

export default AdminTools;