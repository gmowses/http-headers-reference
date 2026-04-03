import { useState, useMemo } from 'react'
import { Search, Sun, Moon, Languages, Copy, Check, Server } from 'lucide-react'

const translations = {
  en: {
    title: 'HTTP Headers Reference',
    subtitle: 'Request, response, and security headers with descriptions. Search and filter by type.',
    searchPlaceholder: 'Search headers (e.g. Content-Type, Authorization)...',
    name: 'Header name',
    type: 'Type',
    description: 'Description',
    example: 'Example',
    noResults: 'No results found.',
    results: 'results',
    allTypes: 'All types',
    request: 'Request',
    response: 'Response',
    security: 'Security',
    both: 'Both',
    copy: 'Copy',
    copied: 'Copied!',
    builtBy: 'Built by',
  },
  pt: {
    title: 'Referencia de Headers HTTP',
    subtitle: 'Headers de requisicao, resposta e seguranca com descricoes. Pesquise e filtre por tipo.',
    searchPlaceholder: 'Pesquise headers (ex: Content-Type, Authorization)...',
    name: 'Nome do header',
    type: 'Tipo',
    description: 'Descricao',
    example: 'Exemplo',
    noResults: 'Nenhum resultado encontrado.',
    results: 'resultados',
    allTypes: 'Todos os tipos',
    request: 'Requisicao',
    response: 'Resposta',
    security: 'Seguranca',
    both: 'Ambos',
    copy: 'Copiar',
    copied: 'Copiado!',
    builtBy: 'Criado por',
  }
} as const

type Lang = keyof typeof translations

interface HeaderEntry {
  name: string
  type: 'request' | 'response' | 'security' | 'both'
  desc: string
  example: string
}

const HEADERS: HeaderEntry[] = [
  // Request headers
  { name: 'Accept', type: 'request', desc: 'Media types the client can process', example: 'Accept: application/json, text/html' },
  { name: 'Accept-Charset', type: 'request', desc: 'Character sets acceptable by the client', example: 'Accept-Charset: utf-8, iso-8859-1' },
  { name: 'Accept-Encoding', type: 'request', desc: 'Compression algorithms the client supports', example: 'Accept-Encoding: gzip, deflate, br' },
  { name: 'Accept-Language', type: 'request', desc: 'Preferred languages for the response', example: 'Accept-Language: en-US,en;q=0.9' },
  { name: 'Authorization', type: 'request', desc: 'Credentials for authenticating the client', example: 'Authorization: Bearer eyJhbGci...' },
  { name: 'Cache-Control', type: 'both', desc: 'Directives for caching mechanisms in requests and responses', example: 'Cache-Control: no-cache' },
  { name: 'Connection', type: 'both', desc: 'Control options for the current connection', example: 'Connection: keep-alive' },
  { name: 'Content-Length', type: 'both', desc: 'Size of the request/response body in bytes', example: 'Content-Length: 348' },
  { name: 'Content-Type', type: 'both', desc: 'Media type of the request/response body', example: 'Content-Type: application/json; charset=utf-8' },
  { name: 'Cookie', type: 'request', desc: 'Stored HTTP cookies sent to the server', example: 'Cookie: session=abc123; user=john' },
  { name: 'DNT', type: 'request', desc: 'Do Not Track user preference', example: 'DNT: 1' },
  { name: 'Expect', type: 'request', desc: 'Server behaviors required by the client', example: 'Expect: 100-continue' },
  { name: 'Forwarded', type: 'request', desc: 'Information from proxies (standardized)', example: 'Forwarded: for=192.0.2.60;proto=http' },
  { name: 'From', type: 'request', desc: 'Email address of the user making the request', example: 'From: user@example.com' },
  { name: 'Host', type: 'request', desc: 'Domain name and port of the server', example: 'Host: api.example.com:443' },
  { name: 'If-Match', type: 'request', desc: 'Makes request conditional on matching ETag', example: 'If-Match: "737060cd8c284d8af7ad3082f209582d"' },
  { name: 'If-Modified-Since', type: 'request', desc: 'Request the resource only if modified since this date', example: 'If-Modified-Since: Sat, 29 Oct 2023 19:43:31 GMT' },
  { name: 'If-None-Match', type: 'request', desc: 'Request the resource only if ETag does not match', example: 'If-None-Match: "737060cd8c284d8af7ad3082f209582d"' },
  { name: 'If-Range', type: 'request', desc: 'Resend range if ETag/date matches; else send full resource', example: 'If-Range: "737060cd8c284d8af7ad3082f209582d"' },
  { name: 'If-Unmodified-Since', type: 'request', desc: 'Only send if not modified since this date', example: 'If-Unmodified-Since: Sat, 29 Oct 2023 19:43:31 GMT' },
  { name: 'Max-Forwards', type: 'request', desc: 'Limit proxy/gateway forwards for TRACE/OPTIONS', example: 'Max-Forwards: 10' },
  { name: 'Origin', type: 'request', desc: 'Origin of the cross-site request', example: 'Origin: https://example.com' },
  { name: 'Proxy-Authorization', type: 'request', desc: 'Credentials for proxy authentication', example: 'Proxy-Authorization: Basic dXNlcjpwYXNz' },
  { name: 'Range', type: 'request', desc: 'Request only a portion of the resource', example: 'Range: bytes=500-999' },
  { name: 'Referer', type: 'request', desc: 'URL of the page making the request (note: misspelled in spec)', example: 'Referer: https://example.com/page' },
  { name: 'TE', type: 'request', desc: 'Transfer encodings the client can accept', example: 'TE: trailers, deflate' },
  { name: 'Upgrade-Insecure-Requests', type: 'request', desc: 'Signal preference for HTTPS over HTTP', example: 'Upgrade-Insecure-Requests: 1' },
  { name: 'User-Agent', type: 'request', desc: 'Client application and OS information', example: 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  { name: 'Via', type: 'both', desc: 'Proxies through which the request/response was forwarded', example: 'Via: 1.1 vegur' },
  { name: 'X-Forwarded-For', type: 'request', desc: 'Originating IP address behind a proxy', example: 'X-Forwarded-For: 203.0.113.195, 70.41.3.18' },
  { name: 'X-Forwarded-Host', type: 'request', desc: 'Original host requested by the client', example: 'X-Forwarded-Host: example.com' },
  { name: 'X-Forwarded-Proto', type: 'request', desc: 'Protocol used by the client to connect to proxy', example: 'X-Forwarded-Proto: https' },
  { name: 'X-Request-ID', type: 'request', desc: 'Unique identifier for tracing the request', example: 'X-Request-ID: f058ebd6-02f7-4d3f-942e-904344e8cde3' },
  // Response headers
  { name: 'Accept-Ranges', type: 'response', desc: 'Whether the server supports range requests', example: 'Accept-Ranges: bytes' },
  { name: 'Age', type: 'response', desc: 'Time in seconds the object has been in proxy cache', example: 'Age: 12' },
  { name: 'Allow', type: 'response', desc: 'HTTP methods supported by the resource', example: 'Allow: GET, POST, HEAD' },
  { name: 'Alt-Svc', type: 'response', desc: 'Alternative services for the resource', example: 'Alt-Svc: h2=":443"; ma=2592000' },
  { name: 'Content-Disposition', type: 'response', desc: 'Whether content is displayed inline or downloaded', example: 'Content-Disposition: attachment; filename="report.pdf"' },
  { name: 'Content-Encoding', type: 'response', desc: 'Encoding applied to the response body', example: 'Content-Encoding: gzip' },
  { name: 'Content-Language', type: 'response', desc: 'Natural language of the response content', example: 'Content-Language: en-US' },
  { name: 'Content-Location', type: 'response', desc: 'Alternate URL for the returned resource', example: 'Content-Location: /documents/foo.json' },
  { name: 'Content-Range', type: 'response', desc: 'Position of partial content in the full body', example: 'Content-Range: bytes 21010-47021/47022' },
  { name: 'ETag', type: 'response', desc: 'Identifier for a specific version of a resource', example: 'ETag: "737060cd8c284d8af7ad3082f209582d"' },
  { name: 'Expires', type: 'response', desc: 'Date/time after which the response is stale', example: 'Expires: Thu, 01 Dec 2023 16:00:00 GMT' },
  { name: 'Last-Modified', type: 'response', desc: 'Date/time the resource was last changed', example: 'Last-Modified: Tue, 15 Nov 2023 12:00:00 GMT' },
  { name: 'Link', type: 'response', desc: 'Related resources (preload, prefetch, canonical)', example: 'Link: </style.css>; rel="preload"; as="style"' },
  { name: 'Location', type: 'response', desc: 'URL to redirect to (3xx) or new resource (201)', example: 'Location: https://example.com/new-page' },
  { name: 'Proxy-Authenticate', type: 'response', desc: 'Authentication method for proxy access', example: 'Proxy-Authenticate: Basic realm="proxy"' },
  { name: 'Retry-After', type: 'response', desc: 'How long to wait before making a new request', example: 'Retry-After: 120' },
  { name: 'Server', type: 'response', desc: 'Information about the server software', example: 'Server: nginx/1.24.0' },
  { name: 'Set-Cookie', type: 'response', desc: 'Send a cookie from the server to the client', example: 'Set-Cookie: sessionId=38afes7a8; HttpOnly; Secure' },
  { name: 'Transfer-Encoding', type: 'response', desc: 'Encoding used to transfer the payload', example: 'Transfer-Encoding: chunked' },
  { name: 'Vary', type: 'response', desc: 'Request headers that affect the response (for caching)', example: 'Vary: Accept-Encoding, Accept-Language' },
  { name: 'WWW-Authenticate', type: 'response', desc: 'Authentication method for the requested resource', example: 'WWW-Authenticate: Bearer realm="api"' },
  // Security headers
  { name: 'Content-Security-Policy', type: 'security', desc: 'Restrict sources for scripts, styles, images, etc. Prevents XSS.', example: "Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com" },
  { name: 'Content-Security-Policy-Report-Only', type: 'security', desc: 'CSP in report-only mode; violations reported but not blocked', example: "Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report" },
  { name: 'Strict-Transport-Security', type: 'security', desc: 'Force HTTPS for a specified duration (HSTS)', example: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' },
  { name: 'X-Content-Type-Options', type: 'security', desc: 'Prevent MIME type sniffing', example: 'X-Content-Type-Options: nosniff' },
  { name: 'X-Frame-Options', type: 'security', desc: 'Control whether page can be embedded in a frame (clickjacking)', example: 'X-Frame-Options: DENY' },
  { name: 'X-XSS-Protection', type: 'security', desc: 'Enable XSS filtering in older browsers (deprecated, use CSP)', example: 'X-XSS-Protection: 1; mode=block' },
  { name: 'Referrer-Policy', type: 'security', desc: 'Control how much referrer info is sent', example: 'Referrer-Policy: strict-origin-when-cross-origin' },
  { name: 'Permissions-Policy', type: 'security', desc: 'Control browser features and APIs (replaces Feature-Policy)', example: 'Permissions-Policy: camera=(), microphone=(), geolocation=()' },
  { name: 'Cross-Origin-Opener-Policy', type: 'security', desc: 'Isolate browsing context from cross-origin documents', example: 'Cross-Origin-Opener-Policy: same-origin' },
  { name: 'Cross-Origin-Embedder-Policy', type: 'security', desc: 'Prevent cross-origin resources from being embedded without permission', example: 'Cross-Origin-Embedder-Policy: require-corp' },
  { name: 'Cross-Origin-Resource-Policy', type: 'security', desc: 'Restrict which origins can load the resource', example: 'Cross-Origin-Resource-Policy: same-site' },
  { name: 'Access-Control-Allow-Origin', type: 'security', desc: 'CORS: allowed origins', example: 'Access-Control-Allow-Origin: https://example.com' },
  { name: 'Access-Control-Allow-Methods', type: 'security', desc: 'CORS: allowed HTTP methods', example: 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE' },
  { name: 'Access-Control-Allow-Headers', type: 'security', desc: 'CORS: allowed request headers', example: 'Access-Control-Allow-Headers: Content-Type, Authorization' },
  { name: 'Access-Control-Allow-Credentials', type: 'security', desc: 'CORS: whether credentials are sent with requests', example: 'Access-Control-Allow-Credentials: true' },
  { name: 'Access-Control-Max-Age', type: 'security', desc: 'CORS: cache duration for preflight result', example: 'Access-Control-Max-Age: 86400' },
  { name: 'Access-Control-Expose-Headers', type: 'security', desc: 'CORS: which headers can be exposed to the browser', example: 'Access-Control-Expose-Headers: X-Custom-Header' },
]

const TYPE_COLORS: Record<string, string> = {
  request: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  response: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  security: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  both: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
}

export default function HttpHeadersReference() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [copiedName, setCopiedName] = useState<string | null>(null)

  const t = translations[lang]

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return HEADERS.filter(h => {
      const matchType = typeFilter === 'all' || h.type === typeFilter
      const matchSearch = !q || h.name.toLowerCase().includes(q) || h.desc.toLowerCase().includes(q) || h.example.toLowerCase().includes(q)
      return matchType && matchSearch
    })
  }, [search, typeFilter])

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopiedName(name)
      setTimeout(() => setCopiedName(null), 2000)
    })
  }

  const typeLabel = (type: string) => {
    const map: Record<string, string> = { request: t.request, response: t.response, security: t.security, both: t.both }
    return map[type] ?? type
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Server size={18} className="text-white" />
            </div>
            <span className="font-semibold">HTTP Headers Reference</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/http-headers-reference" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="all">{t.allTypes}</option>
              <option value="request">{t.request}</option>
              <option value="response">{t.response}</option>
              <option value="security">{t.security}</option>
              <option value="both">{t.both}</option>
            </select>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">{filtered.length} {t.results}</p>

          <div className="space-y-3">
            {filtered.map(h => (
              <div key={h.name} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-semibold text-green-600 dark:text-green-400">{h.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[h.type]}`}>{typeLabel(h.type)}</span>
                  </div>
                  <button onClick={() => handleCopy(h.name)} title={copiedName === h.name ? t.copied : t.copy}
                    className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 shrink-0">
                    {copiedName === h.name ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                  </button>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{h.desc}</p>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-2 font-mono text-xs text-zinc-500 dark:text-zinc-400 break-all">{h.example}</div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-zinc-400">{t.noResults}</div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-green-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
