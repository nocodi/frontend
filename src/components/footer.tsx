import { Link as ScrollLink } from "react-scroll";
import { Instagram, Linkedin, X } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-base-200 bg-white py-10 text-base-content">
      <form className="mx-auto max-w-6xl rounded-xl border border-patina-400 bg-white p-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="mb-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <h6 className="footer-title text-patina-500">About NoCodi</h6>
              <ul className="space-y-2 text-patina-500">
                <li>
                  <ScrollLink
                    to="services"
                    spy={true}
                    smooth={true}
                    offset={0}
                    duration={500}
                    className="link cursor-pointer link-hover"
                  >
                    Services
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="tutorial"
                    spy={true}
                    smooth={true}
                    offset={-40}
                    duration={500}
                    className="link cursor-pointer link-hover"
                  >
                    Train
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="about"
                    spy={true}
                    smooth={true}
                    offset={0}
                    duration={500}
                    className="link cursor-pointer link-hover"
                  >
                    About Us
                  </ScrollLink>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="footer-title text-patina-500">About Nocodi</h6>
              <ul className="space-y-2 text-patina-500">
                <li>
                  <a className="link link-hover">Services</a>
                </li>
                <li>
                  <a className="link link-hover">Services</a>
                </li>
                <li>
                  <a className="link link-hover">Services</a>
                </li>
                <li>
                  <a className="link link-hover">Services</a>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="footer-title text-patina-500">About Nocodi</h6>
              <ul className="space-y-2 text-patina-500">
                <li>
                  <a className="link link-hover">Services</a>
                </li>
                <li>
                  <a className="link link-hover">Services</a>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="footer-title text-patina-500">About NoCodi</h6>
              <ul className="space-y-2 text-patina-500">
                <li>
                  <a className="link link-hover">Services</a>
                </li>
                <li>
                  <a className="link link-hover">Services</a>
                </li>
                <li>
                  <a className="link link-hover">Services</a>
                </li>
                <li>
                  <a className="link link-hover">Services</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-patina-500 pt-6 text-center text-patina-500">
            <h4 className="mb-2 text-xl font-bold">Nocodi</h4>
            <div className="flex justify-center space-x-4 text-patina-500">
              <a className="hover:text-primary-focus text-patina-500 transition">
                <Instagram size={20} />
              </a>
              <a className="hover:text-primary-focus text-patina-500 transition">
                <X size={20} />
              </a>
              <a className="hover:text-primary-focus text-patina-500 transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </form>
    </footer>
  );
};

export default Footer;
