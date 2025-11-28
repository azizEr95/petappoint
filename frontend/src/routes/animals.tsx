import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/animals')({
  component: Animals,
})

function Animals() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Meine Tiere</h1>
      <p className="text-muted">
        Hier können Sie Ihre Tiere verwalten und einsehen.
      </p>
      {/* TODO: Implement animals list and management */}
    </div>
  )
}
