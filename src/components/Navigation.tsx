// src/components/Navigation.tsx
import { useState } from 'react'
import type {ReactNode} from 'react'
import {Link} from "react-router-dom";

import ArtistsBlack from "../assets/ArtisitBlack.png";
import ArtistsWhite from "../assets/ArtistWhite.png";

import WorksBlack from "../assets/WorksBlack.png";
import WorksWhite from "../assets/WorksWhite.png";

import AboutBlack from "../assets/AboutBlack.png";
import AboutWhite from "../assets/AboutWhite.png";

import ContactBlack from "../assets/ContactBlack.png";
import ContactWhite from "../assets/ContactWhite.png";

interface NavigationProps {
  children: ReactNode;
  className?: string;
} 


export function Navigation({ children, className }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = className?.includes("dark-theme");

  const icons = {
    artists: isDark ? ArtistsWhite : ArtistsBlack,
    works: isDark ? WorksWhite : WorksBlack,
    about: isDark ? AboutWhite : AboutBlack,
    contact: isDark ? ContactWhite : ContactBlack,
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={className ? `navigation-wrapper ${className}` : "navigation-wrapper"}>
      <nav className={`navigation ${menuOpen ? "menu-open" : ""}`}>

        {/* Hamburger button — visible only on mobile */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        {/* Navigation links */}
        <div className="nav-container">

          <Link to="/" className="nav-link nav-link-home" onClick={closeMenu}>
            Skald
          </Link>

          <Link to="/artists" className="nav-link" onClick={closeMenu}>
            <img src={icons.artists} alt="Artists" className="nav-icon" />
          </Link>

          <Link to="/works" className="nav-link" onClick={closeMenu}>
            <img src={icons.works} alt="Works" className="nav-icon" />
          </Link>

          <Link to="/about" className="nav-link" onClick={closeMenu}>
            <img src={icons.about} alt="About" className="nav-icon" />
          </Link>

          <Link to="/contact" className="nav-link" onClick={closeMenu}>
            <img src={icons.contact} alt="Contact" className="nav-icon" />
          </Link>

        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
}
