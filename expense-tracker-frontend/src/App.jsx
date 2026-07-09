import { BrowserRouter, Routes, Route, Navigate, redirect } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import CardSummary from './pages/CardSummary';
import UserCreate from './pages/UserCreate';
import Layout from './pages/NavigationBar';
import Settings from './pages/Settings';
import AdminTools from './pages/AdminTools/AdminTools';
import BankManagement from './pages/AdminTools/BankManagement';
import CIFManagement from './pages/CIFManagement';
import UsersManagement from './pages/AdminTools/UsersManagement';
import EmailVerification from './pages/EmailVerification';

function App() {

  const [loginToken, setLoginToken] = useState(localStorage.getItem("token") || "");


  function onLogin(token) {
    localStorage.setItem("token", token);
    setLoginToken(token);
  };

  function onLogout() {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (confirmed) {
      localStorage.removeItem("token");
      setLoginToken("");
      // console.log("reached the end")
    }
  
  };

    return (
      <div>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login tokenSetter={onLogin}/>} />
                <Route path="/usercreate" element={<UserCreate />} />
                <Route element={<Layout onLogout={onLogout} />}>
                    <Route path="/transactions" element={<Transactions token={loginToken} />} />
                    <Route path="/dashboard" element={<Dashboard token={loginToken}/>} />
                    <Route path="/transactions" element={<Transactions token={loginToken}/>} />
                    <Route path="/reports" element={<Reports token={loginToken}/>} />
                    <Route path="/cards" element={<CardSummary token={loginToken}/>} />
                    <Route path="/settings" element={<Settings token={loginToken}/>} />
                      <Route path="/settings/EmailVerification" element={<EmailVerification token={loginToken}/>} />
                      <Route path="/settings/CIFManagement" element={<CIFManagement token={loginToken}/>} />
                    <Route path="/admintools" element={<AdminTools token={loginToken}/>} />
                      <Route path="/admintools/bankManagement" element={<BankManagement token={loginToken}/>} />
                      <Route path="/admintools/usersManagement" element={<UsersManagement token={loginToken}/>} />
                </Route>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/logout" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
      </div>
    );
}

export default App;