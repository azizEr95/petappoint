import ErrorPage from './ErrorPage'

export default function Error404() {
  return (
    <ErrorPage
      code={404}
      title="Seite nicht gefunden"
      description="Entschuldigung, die gesuchte Seite existiert nicht oder wurde verschoben."
      actions={[
        { label: '← Zur Startseite', href: '/', variant: 'primary' },
        { label: 'Tierärzte suchen', href: '/search', variant: 'secondary' },
      ]}
    />
  )
}
