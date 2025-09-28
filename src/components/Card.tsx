// src/components/Card.tsx
import {Link} from 'react-router-dom'
import type {ReactNode} from 'react'

type CardProps = {
  imageUrl?: string
  imageAlt?: string
  title: ReactNode
  subtitle?: ReactNode
  to?: string               // if provided, wraps the title in a <Link>
  className?: string
  mediaClassName?: string
  bodyClassName?: string
  children?: ReactNode      // optional extra content (badges, actions, etc.)
}

export function Card({
  imageUrl,
  imageAlt = '',
  title,
  subtitle,
  to,
  className = '',
  mediaClassName = '',
  bodyClassName = '',
  children,
}: CardProps) {
  return (
    <article className={`card ${className}`}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={imageAlt}
          className={`card-media ${mediaClassName}`}
          loading="lazy"
        />
      )}
      <div className={`card-body ${bodyClassName}`}>
        <h3 className="card-title">
          {to ? <Link className="link" to={to}>{title}</Link> : title}
        </h3>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        {children}
      </div>
    </article>
  )
}
