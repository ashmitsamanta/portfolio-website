import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-[#F2EFE9] flex flex-col items-center justify-center p-6 text-center select-none">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">
            Something went wrong
          </h1>
          <p className="text-sm text-[#8A8A8A] max-w-md mb-8 leading-relaxed font-sans">
            An unexpected error occurred while displaying this page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full bg-white text-black font-mono text-xs uppercase font-bold tracking-wider hover:bg-neutral-200 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
