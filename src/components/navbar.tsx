import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed top-0 z-50 w-full bg-base-100 bg-base-300 shadow-md">
      <nav className="navbar px-4 md:px-10">
        <div className="flex flex-1 items-center gap-6">
          <a href="/" className="text-xl font-bold text-patina-500">
            NoCodi
          </a>

          <ul className="menu menu-horizontal hidden gap-4 md:flex">
            <li>
              <Link to="services" className="cursor-pointer text-patina-500">
                Services
              </Link>
            </li>
            <li>
              <Link to="/tutorial" className="cursor-pointer text-patina-500">
                Tutorial
              </Link>
            </li>
            <li>
              <Link to="/about" className="cursor-pointer text-patina-500">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex-none">
          <a
            href="/Signup"
            className="btn-patina btn text-patina-500 btn-outline hover:bg-patina-700"
          >
            Get Started
          </a>
        </div>
      </nav>
    </div>
  );
}
