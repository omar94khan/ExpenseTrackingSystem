import {useState} from 'react';
import { unstable_setDevServerHooks } from 'react-router-dom';
import { apiFetch } from '../api';


function CreateUsers({token, refreshCount, setRefreshCount}) {

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [date, setDate] = useState(getTodayDate());

    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2,"0");
        const day = String(today.getDate()).padStart(2,"0");

        return `${year}-${month}-${day}`;
    };

    async function CreateUser() {
        if (username==="" || username ===undefined) {
            alert("Username cannot be empty")
            return
        }

        if (password.length < 6 || password===undefined) {
            alert("Password cannot be less than 6 characters.")
            return
        }

        const endpoint = "/users/create"
        const options = {
            method: "POST",
            body: JSON.stringify({
                    "username" : username,
                    "password" : password,
                    "created_on" : date
                })
        }
        setLoading(true)

        try {
            const response = await apiFetch(endpoint,options)
            if (!response) {return};

            const data = await response.json()
            setRefreshCount((e) => e+1);
            setUsername("");
            setPassword("");
            setDate(getTodayDate());
        }

        catch (err) {
            throw alert("Error creating user: "+err)
        }

        finally {
            setLoading(false);
        }

    };

    
        

    
    return (<div className='user-management-div'>
                {/* To create a user we will need the following:
                    1 - Username
                    2 - Password
                    3 - Email
                    4 -  */}

                <table>
                    <thead>
                        <tr>
                            <th colSpan={2}>New User Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <th>Username</th>
                            <td>
                                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                            </td>
                        </tr>
                        
                        <tr>
                            <th>Password</th>
                            <td>
                                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            </td>
                        </tr>
                        
                        <tr>
                            <th>Date</th>
                            <td>
                                <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
                            </td>
                        </tr>
                        
                        <tr>
                            <button onClick={() => CreateUser()}>Create User</button>
                        </tr>
                    </tbody>
                </table>
        
            </div>);
}

export default CreateUsers;