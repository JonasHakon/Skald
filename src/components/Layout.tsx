// src/components/Layout.tsx
import type {ReactNode} from 'react'
import {Link} from 'react-router-dom'

export function Layout({children}: {children: ReactNode}) {
  return (
    <div>
      <nav className="navigation">
        <div className="nav-container">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/works" className="nav-link">Works</Link>
          <Link to="/people" className="nav-link">People</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  )
}
