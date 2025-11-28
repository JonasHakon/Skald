// src/components/Layout.tsx
import type {ReactNode} from 'react'
import {Link} from 'react-router-dom'

interface NavigationProps {
  children: ReactNode;
  className?: string;
} 

export function Navigation({ children, className }: NavigationProps) {
  return (
    <div className={className ? `navigation-wrapper ${className}` : "navigation-wrapper"}>
      <nav className="navigation">
        <div className="nav-container">
          <Link to="/artists" className="nav-link">Artists</Link>
          <Link to="/works" className="nav-link">Works</Link>
          <Link to="/" className="nav-link nav-link-home">Skald</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  )
}
