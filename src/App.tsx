import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Verification from "./pages/verification";
import PasswordlessLogin from "./pages/passwordlessLogin";
import Workflow from "./pages/Workflow";
import BotList from "./pages/BotList";
import CheckAuthWrapper from "./utils/CheckAuthWrapper";
import CheckNoAuthWrapper from "./utils/CheckNoAuthWrapper";
import { AuthProvider } from "./services/Auth";

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <Router>
        <Routes>
          <Route Component={CheckNoAuthWrapper}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/passwordlessLogin" element={<PasswordlessLogin />} />
          </Route>
          <Route Component={CheckAuthWrapper}>
            <Route path="/" element={<Navigate to={"/workflow"} />} />
            <Route path="/workflow">
              <Route index Component={BotList} />
              <Route path=":id" element={<Workflow />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
