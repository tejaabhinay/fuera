import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Module ids arrive with OS-native separators, so normalise before matching.
const REACT_VENDOR = /\/node_modules\/(react|react-dom|scheduler)\//

function isReactVendor(id) {
  return REACT_VENDOR.test(id.split('\\').join('/'))
}

// The homepage fetches sports, timeline and archive data as soon as it mounts. Warming the
// connection in <head> removes a DNS + TLS round trip from the critical path.
function preconnectApiOrigin(apiBaseUrl) {
  return {
    name: 'preconnect-api-origin',
    transformIndexHtml(html) {
      if (!apiBaseUrl) return html

      let origin
      try {
        origin = new URL(apiBaseUrl).origin
      } catch {
        return html
      }

      return html.replace(
        '</head>',
        `  <link rel="preconnect" href="${origin}" crossorigin />\n    <link rel="dns-prefetch" href="${origin}" />\n  </head>`,
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')

  return {
    plugins: [react(), preconnectApiOrigin(env.VITE_API_BASE_URL)],
    build: {
      // React changes on upgrades, app code changes on every deploy. Splitting them lets
      // returning visitors reuse the cached vendor chunk across releases.
      rollupOptions: {
        output: {
          manualChunks(id) {
            return isReactVendor(id) ? 'react' : undefined
          },
        },
      },
    },
  }
})
