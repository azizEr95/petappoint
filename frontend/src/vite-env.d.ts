/// <reference types="vite/client" />

// CSS Modules
declare module '*.modules.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// Regular CSS
declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
