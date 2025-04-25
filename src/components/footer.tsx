import { Link as ScrollLink } from "react-scroll";
import { Instagram, Linkedin, X } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-base-300 py-10 text-base-content">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-3 md:text-left">
          <div>
            <h6 className="footer-title text-lg font-semibold text-patina-500">
              About NoCodi
            </h6>
            <ul className="mt-2 space-y-2 text-patina-500">
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
            <h6 className="footer-title text-lg font-semibold text-patina-500">
              Resources
            </h6>
            <ul className="mt-2 space-y-2 text-patina-500">
              <li>
                <a className="link link-hover" href="/blog">
                  Blog
                </a>
              </li>
              <li>
                <a className="link link-hover" href="/faq">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="footer-title text-lg font-semibold text-patina-500">
              Contact
            </h6>
            <ul className="mt-2 space-y-2 text-patina-500">
              <li>
                <a className="link link-hover" href="mailto:nocodi@gmail.com">
                  Email Us
                </a>
              </li>
              <li>
                <a className="link link-hover" href="tel:+98939371901">
                  Call Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-patina-500 pt-6 text-center text-patina-500">
          <h4 className="mb-2 text-xl font-bold">NoCodi</h4>
          <div className="flex justify-center space-x-4">
            <a href="#" className="transition hover:text-patina-600">
              <Instagram size={20} />
            </a>
            <a href="#" className="transition hover:text-patina-600">
              <X size={20} />
            </a>
            <a href="#" className="transition hover:text-patina-600">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
