import {useState} from 'react';
import { useNavigate } from "react-router-dom";

function Login({tokenSetter}) {

    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function userlogin() {
        const loginurl = "http://localhost:8000/auth/login-json"

        setLoading(true);

        

        try {
                const verification = await fetch(loginurl,
                        {
                            method: "POST",
                            headers : {
                                    "Content-Type": "application/json"
                                },
                            body: JSON.stringify(
                                    {
                                        "username" : username,
                                        "password" : password
                                    }
                                )
                        }
                    );
                if (!verification.ok) {
                        const errorData = await verification.json();
                        throw new Error(errorData.detail);
                    }
                
                const data = await verification.json();
                
                tokenSetter(data.access_token);
                return navigate("/dashboard");
            } catch (err) {
                throw alert("Error logging in: "+err);
            } finally {
                setLoading(false);  // ← always runs, success or failure
            }



    };

    const loadingButton = loading ? "Logging In..." : <button class="formButtons" onClick={() => userlogin()}>Login</button>;

    const navigate = useNavigate();

    return (<div>
                <h2>User Login Page</h2>
                    <form>
                            <b>Username:</b> <input id="userlogin" type="text" placeholder="Username / Email" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <br />          <b>Password:</b> <input id="userPass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onSubmit={() => userlogin()}/> 
            <br />          {loadingButton}
                            <button class="formButtons" onClick={() => navigate("/usercreate")}>Create ID</button>

                    </form>
            </div>)
}

export default Login;