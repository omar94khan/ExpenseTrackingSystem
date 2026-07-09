import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { apiFetch } from '../api';


function EmailVerification({token}) {
    const [user, setUser] = useState();
    const [emailVerified, setEmailVerified] = useState();
    const [email, setEmail] = useState();
    const [otpSent, setOTPSent] = useState(false);
    const [otp, setOTP] = useState();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState();


    async function userDetails() {
        const endpoint = '/users/fetchMe';
        const options = {
            method: "GET"
        }

        try {
            const response = await apiFetch(endpoint,options);

            if (!response) {return}

            const data = await response.json()
            setUser(data)
        }
        catch (err) {
            throw alert("User information not available.")
        }
    };


    async function sendOTP() {
        const endpoint = '/users/otp/create';
        const options = {
            method : "POST",
            body : JSON.stringify({
                "email" : email
            })
        }


        try {
            setLoading(true);
            const response = await apiFetch(endpoint, options);
            if (!response) {return}

            const data = await response.json()
            setOTPSent(true)
        }
        catch (err) {
            throw alert("An error occured when trying to generate OTP.")
        }
        finally{
            setLoading(false);
        }

    }


    async function verifyOTP() {
        const endpoint = '/users/otp/verify';
        const options = {
            method : "POST",
            body : JSON.stringify({
                "email" : email,
                "otp" : otp
            })
        }


        try {
            setLoading(true);
            const response = await apiFetch(endpoint, options);
            if (!response) {return}

            const data = await response.json()
            
            data?.email_verified ? setEmailVerified(true) : setEmailVerified(false)
            userDetails();
            setOTPSent(false);
            setEditMode(false);
        }
        catch (err) {
            throw alert("An error occured when trying to verify OTP.")
        }
        finally{
            setLoading(false);
        }

    }

    useEffect(() => {
      userDetails()
    },[])

    useEffect(() => {
        setEmail(user?.email)
        setEmailVerified(user?.email_verified)
    },[user])

    function verificationStatus() {
        return (user?.email_verified && user?.email === email) ? 'Verified' : 'Unverified'
    }
    


    return (<div>
                <h3>Verify Email</h3>

                <div>
                    <table>
                        <tr>
                            <th width={300}>Email</th>
                            <td width={200}><input type='text' value={email} disabled={user?.email_verified && !editMode}  onChange={(e) => setEmail(e.target.value)}/></td>
                            <td className={verificationStatus()}>{verificationStatus()}</td>
                        </tr>
                        <tr>
                            <th>OTP</th>
                            <td><input type='text' disabled={emailVerified && !otpSent} 
                                    onChange={(e) => setOTP(e.target.value)}/></td>
                            <td>
                                <button onClick={() => sendOTP()} disabled={otpSent || (emailVerified && !editMode)}
                                        className='inlineRowButtons'>Generate OTP</button>
                                <button onClick={() => {editMode ? setEditMode(false) : setEditMode(true);
                                                        verifyOTP();
                                }} 
                                        disabled={!otpSent}
                                        className='inlineRowButtons'>   Verify OTP</button>
                            </td>
                        </tr>
                        <tr>
                                <button onClick={() => {editMode ? setEditMode(false) : setEditMode(true)}} 
                                        disabled={editMode}
                                        className='rowButtons'>    Edit Email</button>
                                
                        </tr>
                    </table>
                </div>
                
            </div>);
}

export default EmailVerification;