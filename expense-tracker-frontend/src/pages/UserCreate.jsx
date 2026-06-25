import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { apiFetch } from '../api';

function UserCreate() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [pass2, setPass2] = useState("")

    async function createUser() {
        
        if (username === "" || username === undefined) {throw alert("Username cannot be empty")}
        if (pass2 !== password) {throw alert("Passwords must match.")}

        const endpoint = "/users/create"
        const options = {
            method:"POST",
            body: JSON.stringify(
                    {
                        "username" : username,
                        "password" : password
                    }
                )
        }

        setLoading(true);

        

        try {
                const response = await apiFetch(endpoint,options);
                if (!response) {return};

                const data = await response.json();
                alert("User created successfully with userid "+data.id+". \nNavigating back to login page.")
                return navigate("/login");
            } catch (err) {
                 throw alert("Error occured while creating user: "+err);
             } 
            finally {
                setLoading(false);  // ← always runs, success or failure
            }



    };

    function matchPass() {
        if ((pass2 !== "" && password !== "") && (pass2 !== undefined && password !== undefined) && password !== pass2) {return "Passwords do not match"} else {""};
    }


    const loadingButton = loading ? "Creating User..." : <button class="formButtons" onClick={() => createUser()}>Register</button>;
    const passValidation = matchPass();
    const navigate = useNavigate();

    return (<div>
                <h2>User Registration Page</h2>

                            <b>Username:</b> <input id="userlogin" type="text" placeholder="Username / Email" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <br />          <b>Password:</b> <input id="userPass" type="password"  onBlur={(e) => setPassword(e.target.value)}/> 
            <br />          <b>Re-enter Password:</b> <input id="userPass" type="password" onBlur={(e) => setPass2(e.target.value)}/> 
            <br />          <p class="warning-message">{matchPass()}</p>
            <br />          {loadingButton}
                            <button class="formButtons" onClick={() => navigate("/login")}>Back to Login</button>
            </div>)
}

export default UserCreate;