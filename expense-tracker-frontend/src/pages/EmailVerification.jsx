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
    const [failedAttempts, setFailedAttempts] = useState(0);


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
        if (email === user?.email) {
            throw alert("This email is already verified. Please enter a different email, or go back.");
            return;
        }

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
            setFailedAttempts(0);
            setEditMode(false);
        }
        catch (err) {
            throw alert("An error occured when trying to generate OTP.")
        }
        finally{
            setLoading(false);
        }

    }


    async function verifyOTP() {
        if (!otp) {
            throw alert("Please input OTP first.");
            return
        };

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
            setFailedAttempts(0);
        }
        catch (err) {
            setFailedAttempts(failedAttempts + 1)
            console.log("Failed attempts = "+failedAttempts);
            if(failedAttempts >= 2) {
                setFailedAttempts(0);
                setEditMode(true);
                setOTPSent(false);
                setOTP("");
                throw alert("Too many failed attempts. Please generate another OTP.");  
                return
            };
            throw alert("An error occured when trying to verify OTP."+err)
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
                            <td><input type='text' 
                                    disabled={emailVerified && !otpSent} 
                                    onChange={(e) => setOTP(e.target.value)}
                                    value={otp}/></td>
                            <td>
                                <button onClick={() => sendOTP()} disabled={(otpSent || emailVerified) && !editMode}
                                        className='inlineRowButtons'>Generate OTP</button>
                                <button onClick={() => {verifyOTP()}} 
                                        disabled={!otpSent || failedAttempts >=3}
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