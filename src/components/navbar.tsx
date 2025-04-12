import { Link } from "react-scroll";

export default function Navbar({ setLoginHovered }) {
  return (
    <div className="fixed top-0 z-50 w-full bg-base-100 bg-patina-50 shadow-md">
      <nav className="navbar px-4 md:px-10">
        {/* Left section: Logo + Nav links */}
        <div className="flex flex-1 items-center gap-6">
          <a href="/" className="text-xl font-bold text-patina-500">
            NoCodi
          </a>

          {/* Nav links moved next to the logo */}
          <ul className="menu menu-horizontal hidden gap-4 md:flex">
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
                to="TutorialSection"
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

        {/* Right section: Login/Sign Up */}
        <div className="flex-none">
          <a
            href="/Login"
            className="btn-patina btn text-patina-500 btn-outline hover:bg-patina-700"
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
