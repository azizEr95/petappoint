import ErrorPage from './ErrorPage'

export default function Error500() {
  return (
    <ErrorPage
      code={500}
      title="Interner Server Fehler"
      description="Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support."
      actions={[
        { label: '← Zur Startseite', href: '/', variant: 'primary' },
        { label: 'Kontakt', href: '/contact', variant: 'secondary' },
      ]}
    />
  )
}
