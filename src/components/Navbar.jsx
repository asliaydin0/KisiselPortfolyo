import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close } from "../assets";
import { useSiteSettings } from "../context/SiteSettingsContext";

const Navbar = () => {
  const { settings } = useSiteSettings();
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = toggle ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [toggle]);

  const handleNavClick = (title) => {
    setActive(title);
    setToggle(false);
  };

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-4 sm:py-5 fixed top-0 z-20 ${
        scrolled || toggle ? "bg-primary/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 min-w-0"
          onClick={() => {
            setActive("");
            setToggle(false);
            window.scrollTo(0, 0);
          }}
        >
          <img
            src={settings.logo_url}
            alt="logo"
            className="w-9 h-9 object-contain shrink-0"
          />
          <p className="text-white text-[15px] xs:text-[18px] font-bold cursor-pointer truncate">
            Aslı AYDIN
            <span className="hidden sm:inline"> &nbsp;| Yazılım Geliştirici</span>
          </p>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-8 lg:gap-10">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white" : "text-secondary"
              } hover:text-white text-[16px] lg:text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
        </ul>

        <div className="sm:hidden flex items-center shrink-0">
          <button
            type="button"
            aria-label={toggle ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={toggle}
            className="flex items-center justify-center w-11 h-11 -mr-1"
            onClick={() => setToggle(!toggle)}
          >
            <img
              src={toggle ? close : menu}
              alt=""
              className="w-7 h-7 object-contain"
            />
          </button>
        </div>
      </div>

      {toggle && (
        <>
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="fixed inset-0 bg-black/60 z-10 sm:hidden"
            onClick={() => setToggle(false)}
          />
          <div className="fixed inset-x-0 top-[68px] z-20 sm:hidden black-gradient border-t border-white/10 px-6 py-6">
            <ul className="list-none flex flex-col gap-1">
              {navLinks.map((nav) => (
                <li key={nav.id}>
                  <a
                    href={`#${nav.id}`}
                    className={`block py-3 px-2 text-[17px] font-medium min-h-[44px] ${
                      active === nav.title ? "text-white" : "text-secondary"
                    }`}
                    onClick={() => handleNavClick(nav.title)}
                  >
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
