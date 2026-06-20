import { Outlet, Link, useNavigate } from "react-router-dom";


function Settings({token}) {




    return <div>
                <h1>Settings</h1>

                <ul>
                    <li> <Link to="/settings/CIFManagement">Manage CIFs</Link> </li>
                </ul>
            </div>
}

export default Settings;