import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import CardSearch from './pages/CardSearch';
import UserCreate from './pages/UserCreate';

function App() {

  const [loginToken, setLoginToken] = useState();

    return (
      <div>
        <h1>My Expense Tracker</h1>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login loginToken = {loginToken} setLoginToken={setLoginToken}/>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/cards" element={<CardSearch />} />
                <Route path="/usercreate" element={<UserCreate />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
      </div>
    );
}

export default App;