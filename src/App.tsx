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
import Landing from "./pages/landing";
import AboutContact from "./pages/AboutPage";
import TutorialPage from "./pages/TutorialPage";

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
            <Route path="/landing" element={<Landing />} />
            <Route path="/About" element={<AboutContact />} />
            <Route path="/Tutorial" element={<TutorialPage />} />
          </Route>
          <Route Component={CheckAuthWrapper}>
            <Route path="/" element={<Navigate to={"/workflow"} />} />
            <Route path="/workflow">
              <Route index Component={BotList} />
              <Route path=":botId" element={<Workflow />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
