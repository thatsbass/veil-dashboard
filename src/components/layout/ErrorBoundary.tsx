import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-screen items-center justify-center bg-[#fafafa]">
          <div className="max-w-md rounded-[12px] bg-white p-8 shadow-card text-center">
            <p className="text-[15px] font-semibold text-ink">Something went wrong</p>
            <p className="mt-1 text-[12.5px] text-ink-3">{this.state.error.message}</p>
            <button
              className="mt-4 rounded-md bg-surface-2 px-4 py-2 text-[13px] font-medium text-ink hover:bg-[rgba(0,0,0,0.05)]"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
