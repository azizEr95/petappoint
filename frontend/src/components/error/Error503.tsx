import ErrorPage from './ErrorPage'

export default function Error503() {
  return (
    <ErrorPage
      code={503}
      title="Service nicht verfügbar"
      description="Der Service ist momentan nicht verfügbar. Wir arbeiten daran, das Problem zu beheben. Bitte versuchen Sie es später erneut."
      actions={[
        { label: '← Zur Startseite', href: '/', variant: 'primary' },
      ]}
    />
  )
}
