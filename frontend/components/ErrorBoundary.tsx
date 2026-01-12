'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props for the ErrorBoundary.
 */
interface Props {
    children: ReactNode;
}

/**
 * State for the ErrorBoundary.
 */
interface State {
    hasError: boolean;
}

/**
 * ErrorBoundary Component.
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-persona-text/50">
                    <h2 className="text-xl font-serif mb-2">Persona is resting.</h2>
                    <p className="text-xs uppercase tracking-widest opacity-60">System Refresh Required</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 border border-persona-text/20 rounded-full text-[10px] hover:bg-persona-text/5 transition-colors"
                    >
                        Reload Interface
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
