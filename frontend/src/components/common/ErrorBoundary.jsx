import { Component } from 'react'

// React still needs a class for this: without it a single render throw leaves the
// visitor staring at a blank white page with nothing in the UI to act on.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="app-error" role="alert">
        <p className="display-label">Something broke</p>
        <h1>This page<br /><em>failed to load.</em></h1>
        <p>Reload the page to try again. If it keeps happening, let the FUERA team know.</p>
        <button className="button button-primary" type="button" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </main>
    )
  }
}
