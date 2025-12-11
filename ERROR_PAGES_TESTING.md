# Error Pages Testing Guide

Anleitung zum Testen aller Error Pages in der VetLib Anwendung.

## Übersicht Error Pages

- **404** - Seite nicht gefunden (ungültige Route)
- **403** - Zugriff verweigert (keine Berechtigung)
- **500** - Interner Server Fehler (unerwarteter Fehler)
- **503** - Service nicht verfügbar (Maintenance/Down)

## Struktur

```
frontend/src/components/error/
├── Error404.tsx      # 404-Komponente
├── Error403.tsx      # 403-Komponente
├── Error500.tsx      # 500-Komponente
├── Error503.tsx      # 503-Komponente
├── ErrorPage.tsx     # Basis-Template (wiederverwendbar)
└── index.ts          # Exporte

frontend/src/styles/components/Error.scss  # Einheitliche Styles
frontend/src/utils/errorHandler.ts         # Error-Utility & Helper
```

## 1. 404 - Seite nicht gefunden

### Automatisches Testen
Ungültige URL aufrufen → Error 404 wird automatisch angezeigt.

```bash
# App starten
cd frontend && npm run dev

# Browser: http://localhost:3001/nicht-existierende-route
# → 404-Page sollte erscheinen
```

### Manuelles Testen im Code
```typescript
import { Error404 } from '@/components/error'

// Irgendwo in einer Komponente:
<Error404 />
```

---

## 2. 403 - Zugriff verweigert

### Szenario 1: Route Protection
**Anwendungsfall**: User versucht, auf geschützte Ressource ohne Authentifizierung zuzugreifen.

```typescript
// In einer spezifischen Route mit Guard:
import { createFileRoute } from '@tanstack/react-router'
import { Error403 } from '@/components/error'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
  beforeLoad: ({ context }) => {
    if (!context.auth?.isAdmin) {
      throw new Error('Forbidden') // → Error500 wird angezeigt
      // Stattdessen: manually return Error403 component
    }
  },
})
```

### Szenario 2: Manueller Test
```typescript
import { Error403 } from '@/components/error'

function ProtectedComponent() {
  const isAuthorized = false

  if (!isAuthorized) {
    return <Error403 />
  }

  return <div>Geschützter Inhalt</div>
}
```

### Szenario 3: API-Error Handling
```typescript
import { handleAPIError } from '@/utils/errorHandler'

try {
  const response = await fetch('/api/admin/data')
  if (response.status === 403) {
    const error = handleAPIError(response)
    // error.code === 403
    // → Nutze error um 403-Page zu rendern
  }
} catch (err) {
  const error = handleAPIError(err)
}
```

---

## 3. 500 - Interner Server Fehler

### Automatisches Testen
TanStack Router zeigt 500-Error automatisch bei unerwarteten Fehlern.

```bash
# Browser: http://localhost:3001/
# Öffne Developer Console (F12)
# Führe aus:
# throw new Error('Test error')
# → Error500-Page wird angezeigt (falls Root Error Handler aktiv)
```

### Szenario 1: Unerwarteter Fehler in Route
```typescript
export const Route = createFileRoute('/dashboard')({
  component: () => {
    throw new Error('Unexpected error!')
  },
})
```

### Szenario 2: API-Fehler Handling
```typescript
import { handleAPIError } from '@/utils/errorHandler'

async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      const error = handleAPIError(response)
      // error.code === 500 (für status 500+)
    }
  } catch (err) {
    const error = handleAPIError(err)
    // error.code === 500
  }
}
```

### Szenario 3: Manueller Test
```typescript
import { Error500 } from '@/components/error'

function TestComponent() {
  return <Error500 />
}
```

---

## 4. 503 - Service nicht verfügbar

### Szenario 1: API Down
```typescript
import { Error503 } from '@/components/error'
import { handleAPIError } from '@/utils/errorHandler'

async function checkServiceStatus() {
  try {
    const response = await fetch('/api/health')
    if (response.status === 503) {
      const error = handleAPIError(response)
      // error.code === 503
      return <Error503 />
    }
  } catch (err) {
    const error = handleAPIError(err)
  }
}
```

### Szenario 2: Manueller Test
```typescript
import { Error503 } from '@/components/error'

function MaintenanceMode() {
  const isUnderMaintenance = true

  if (isUnderMaintenance) {
    return <Error503 />
  }

  return <Dashboard />
}
```

### Szenario 3: Backend Down Simulieren
```bash
# Backend stoppen
npm run stop

# Frontend versucht API-Call → 503/Connection Error
# → Kann zu Error500 führen oder Error503, je nach Handling
```

---

## Error Handler Utility API

### Helper Funktionen

```typescript
import {
  create404Error,
  create403Error,
  create500Error,
  create503Error,
  handleAPIError,
  AppError,
} from '@/utils/errorHandler'

// Errors erzeugen
const notFound = create404Error()
const forbidden = create403Error({ description: 'Custom message' })
const serverError = create500Error({
  originalError: new Error('DB Connection failed'),
})
const serviceUnavailable = create503Error()

// API-Fehler handhaben
try {
  const response = await fetch('/api/data')
  if (!response.ok) {
    const error = handleAPIError(response)
    console.log(error.code) // 403, 404, 500, etc.
    console.log(error.title) // "Zugriff verweigert"
    console.log(error.description)
  }
} catch (err) {
  const error = handleAPIError(err)
  // Standardmäßig Error500
}

// AppError instanceof check
if (error instanceof AppError) {
  console.log(`Error ${error.code}: ${error.title}`)
}
```

---

## Integration in Komponenten

### Beispiel 1: Route mit Error Boundary
```typescript
import { createFileRoute } from '@tanstack/react-router'
import { Error403 } from '@/components/error'

export const Route = createFileRoute('/protected')({
  component: ProtectedPage,
  beforeLoad: ({ context }) => {
    if (!context.auth?.isLoggedIn) {
      throw new Error('Forbidden')
    }
  },
  errorComponent: ({ error }) => {
    return <Error403 />
  },
})

function ProtectedPage() {
  return <div>Nur für angemeldete Nutzer</div>
}
```

### Beispiel 2: API-Call mit Error Handling
```typescript
import { useState } from 'react'
import { handleAPIError } from '@/utils/errorHandler'
import { Error500, Error403 } from '@/components/error'

function DataFetcher() {
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  async function fetchData() {
    try {
      const response = await fetch('/api/data')
      if (!response.ok) {
        const error = handleAPIError(response)
        setError(error)
        return
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      const error = handleAPIError(err)
      setError(error)
    }
  }

  if (error?.code === 403) {
    return <Error403 />
  }

  if (error?.code === 500) {
    return <Error500 />
  }

  return (
    <div>
      <button onClick={fetchData}>Daten laden</button>
      {data && <pre>{JSON.stringify(data)}</pre>}
    </div>
  )
}
```

---

## Styling & Responsivität

Alle Error Pages nutzen `Error.scss`:
- Einheitliches Design mit Gradient-Hintergrund
- Animations: `slideUp` (Einfahren) & `float` (Schwebeffekt für große Nummer)
- Responsiv für mobile Geräte
- Breakpoint: 768px

### CSS Klassen
```scss
#errorPage              // Hauptcontainer
.error-container        // Zentrierter Inhalt
.error-number           // Große Fehlernummer (404, 500, etc.)
.error-title            // Fehler-Titel
.error-description      // Fehler-Beschreibung
.error-actions          // Button-Container

.btn-primary-light      // Primärer Button (weiß)
.btn-secondary-light    // Sekundärer Button (transparent)
```

---

## Quick Testing Checklist

- [ ] 404: Ungültige URL aufrufen → Seite anzeigen
- [ ] 404: Links funktionieren (Startseite, Suche)
- [ ] 500: Root Error werfen → Error500 angezeigt
- [ ] 500: API Error simulieren → Error500 anzeigt sich
- [ ] 403: Route Guard schmeißt Fehler → Error403 anzeigen
- [ ] 503: Status 503 API Response → Error503 anzeigen
- [ ] Mobile: Alle Pages responsive testen
- [ ] Animations: slideUp & float Animationen sichtbar

---

## Häufige Fehler

### Problem: Error Pages zeigen Header/Breadcrumb
**Lösung**: Error Pages werden direkt von TanStack Router angezeigt, Header/Breadcrumb sollten NICHT angezeigt werden. Das ist aktuell durch die Root-Konfiguration so eingestellt (errorComponent wird ohne Header/Breadcrumb gerendert).

### Problem: Error Pages haben falsches Styling
**Lösung**: Stellen Sie sicher, dass `Error.scss` in `main.scss` importiert ist:
```scss
@import 'components/Error';
```

### Problem: ErrorHandler arbeitet nicht mit benutzerdefinierten Errors
**Lösung**: Verwenden Sie die Error-Factory-Funktionen:
```typescript
const error = create403Error({ originalError: customError })
```

---

## Development Tipps

### Browser Console testen
```javascript
// Error Page Komponente direkt importieren
import Error500 from '/src/components/error/Error500.tsx'
// → Komponente wird geladen (Syntax Check)
```

### Mock API Error
```typescript
// In __root.tsx oder Route Test
const mockResponse = new Response(null, { status: 403 })
const error = handleAPIError(mockResponse)
```

### E2E-Tests mit Cypress/Playwright
```typescript
// cypress/e2e/error-pages.cy.ts
describe('Error Pages', () => {
  it('shows 404 for invalid routes', () => {
    cy.visit('/invalid-route-12345')
    cy.contains('Seite nicht gefunden').should('be.visible')
  })

  it('shows 403 when forbidden', () => {
    cy.intercept('GET', '/api/admin', { statusCode: 403 })
    cy.visit('/admin')
    cy.contains('Zugriff verweigert').should('be.visible')
  })
})
```
