import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Verification from "./pages/auth/verification";
import PasswordlessLogin from "./pages/auth/passwordlessLogin";
import Workflow from "./pages/Workflow";
import Dashboard from "./pages/Dashboard";
import CheckAuthWrapper from "./utils/CheckAuthWrapper";
import CheckNoAuthWrapper from "./utils/CheckNoAuthWrapper";
import { AuthProvider } from "./services/Auth";
import Landing from "./pages/public/Landing";
import AboutContact from "./pages/public/About";
import TutorialPage from "./pages/public/Tutorial";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="about" element={<AboutContact />} />
            <Route path="tutorial" element={<TutorialPage />} />
            <Route Component={CheckNoAuthWrapper}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="verification" element={<Verification />} />
              <Route path="passwordlessLogin" element={<PasswordlessLogin />} />
            </Route>
            <Route Component={CheckAuthWrapper} path="dashboard">
              <Route index Component={Dashboard} />
              <Route path="bot/:botId" element={<Workflow />} />
              <Route path="*" element={<Navigate to={"/dashboard"} />} />
            </Route>
            <Route path="*" element={<Navigate to={"/"} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
