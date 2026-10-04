import { Component } from 'react'

/**
 * Error boundary for optional/heavy UI (3D scenes, lazy sections).
 * If a child throws, the boundary renders `fallback` (null by default)
 * so a decorative failure can never blank the rest of the page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    // Surface the failure in DevTools without crashing the app.
    console.error('[ErrorBoundary]', error)
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
