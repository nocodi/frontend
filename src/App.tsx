import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Verification from "./pages/verification";
import ForgetPassword from "./pages/forgetPassword";
import LoginVerification from "./pages/loginVerification";
import Workflow from "./pages/Workflow";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/loginVerification" element={<LoginVerification />} />
          <Route path="/workflow" element={<Workflow />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
