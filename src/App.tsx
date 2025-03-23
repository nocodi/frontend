import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from './pages/login'
import Signup from './pages/signup';
import Verification from './pages/verification';
import ForgetPassword from './pages/forgetPassword';
import LoginVerification from './pages/loginVerification';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/verification' element={<Verification />} />
          <Route path='/forgetPassword' element={<ForgetPassword />} />
          <Route path='/loginVerification' element={<LoginVerification />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
