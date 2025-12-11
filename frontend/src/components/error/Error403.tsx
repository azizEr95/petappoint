import ErrorPage from './ErrorPage'

export default function Error403() {
  return (
    <ErrorPage
      code={403}
      title="Zugriff verweigert"
      description="Sie haben keine Berechtigung, auf diese Ressource zuzugreifen. Bitte melden Sie sich an oder kontaktieren Sie den Support."
      actions={[
        { label: '← Zur Startseite', href: '/', variant: 'primary' },
        { label: 'Anmelden', href: '/login', variant: 'secondary' },
      ]}
    />
  )
}
