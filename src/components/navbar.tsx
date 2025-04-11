import { Link } from "react-scroll";

export default function Navbar({ setLoginHovered }) {
  return (
    <div className="fixed top-0 z-50 w-full bg-base-100 bg-white shadow-md">
      <nav className="navbar px-4 md:px-10">
        <div className="flex-1">
          <a href="/" className="text-xl font-bold text-patina-500">
            NoCodi
          </a>
        </div>

        <div className="hidden flex-none md:flex">
          <ul className="menu menu-horizontal gap-4 px-1">
            <li>
              <Link
                to="services"
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
                className="cursor-pointer text-patina-500"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="tutorial"
                spy={true}
                smooth={true}
                offset={-40}
                duration={500}
                className="cursor-pointer text-patina-500"
              >
                Tutorial
              </Link>
            </li>
            <li>
              <Link
                to="about"
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
                className="cursor-pointer text-patina-500"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Login Button */}
        <div className="flex-none">
          <a
            href="/Login"
            className="btn-patina btn text-patina-500 btn-outline"
            onMouseEnter={() => setLoginHovered(true)}
            onMouseLeave={() => setLoginHovered(false)}
          >
            Login | Sign Up
          </a>
        </div>
      </nav>
    </div>
  );
}
