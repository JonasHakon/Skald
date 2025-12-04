// src/components/Layout.tsx
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
  const isDark = className?.includes("dark-theme");

  const icons = {
    artists: isDark ? ArtistsWhite : ArtistsBlack,
    works: isDark ? WorksWhite : WorksBlack,
    about: isDark ? AboutWhite : AboutBlack,
    contact: isDark ? ContactWhite : ContactBlack,
  };

  return (
    <div className={className ? `navigation-wrapper ${className}` : "navigation-wrapper"}>
      <nav className="navigation">
        <div className="nav-container">

          <Link to="/artists" className="nav-link">
            <img src={icons.artists} alt="Artists" className="nav-icon" />
          </Link>

          <Link to="/works" className="nav-link">
            <img src={icons.works} alt="Works" className="nav-icon" />
          </Link>

          <Link to="/" className="nav-link nav-link-home">
            Skald
          </Link>

          <Link to="/about" className="nav-link">
            <img src={icons.about} alt="About" className="nav-icon" />
          </Link>

          <Link to="/contact" className="nav-link">
            <img src={icons.contact} alt="Contact" className="nav-icon" />
          </Link>

        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
}
