import { Outlet, Link, useNavigate } from "react-router-dom";


function Settings({token}) {




    return <div>
                <h1>Settings</h1>

                <ul className='menuList'>
                    <li> <Link to="/settings/EmailVerification">Verify Email</Link> </li>
                    <li> <Link to="/settings/CIFManagement">Manage CIFs</Link> </li>
                </ul>
            </div>
}

export default Settings;