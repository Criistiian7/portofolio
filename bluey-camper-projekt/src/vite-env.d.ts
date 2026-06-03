/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origine HTTPS pentru og:image absolut, JSON-LD url și sitemap la deploy */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
