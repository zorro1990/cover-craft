'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('错误边界捕获到错误:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-red-100 p-6">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">出现了错误</h2>
          <p className="mt-2 text-sm text-gray-600">
            {this.state.error?.message || '发生了一个意外错误'}
          </p>
          <button
            onClick={this.handleReset}
            className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            重试
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 max-w-2xl overflow-auto rounded-lg bg-gray-100 p-4 text-left text-xs text-red-600">
              {this.state.error?.stack}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
