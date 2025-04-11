import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Verification from "./pages/verification";
import ForgetPassword from "./pages/forgetPassword";
import LoginVerification from "./pages/loginVerification";
import Workflow from "./pages/Workflow";
import BotList from "./pages/BotList";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/passwordlessLogin" element={<ForgetPassword />} />
          <Route path="/loginVerification" element={<LoginVerification />} />
          <Route path="/workflow">
            <Route index Component={BotList} />
            <Route path=":id" element={<Workflow />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
