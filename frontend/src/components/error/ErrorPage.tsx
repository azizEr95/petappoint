import { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

interface ErrorPageProps {
  code: number
  title: string
  description: string
  actions?: {
    label: string
    href: string
    variant?: 'primary' | 'secondary'
  }[]
}

export default function ErrorPage({
  code,
  title,
  description,
  actions = [
    { label: '← Zur Startseite', href: '/', variant: 'primary' },
    { label: 'Tierärzte suchen', href: '/search', variant: 'secondary' },
  ],
}: ErrorPageProps) {
  return (
    <div id="errorPage">
      <div className="error-container">
        <h1 className="error-number">{code}</h1>
        <h2 className="error-title">{title}</h2>
        <p className="error-description">{description}</p>
        <div className="error-actions">
          {actions.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className={`btn-${action.variant || 'primary'}-light`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
