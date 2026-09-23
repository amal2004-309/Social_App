import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-fb-bg flex items-center justify-center p-4">
                    <div className="bg-fb-surface border border-fb rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <h2 className="text-xl font-bold text-fb-primary">Something went wrong</h2>
                        <p className="text-sm text-fb-secondary leading-relaxed">
                            We encountered an unexpected error while loading this section.
                        </p>
                        <div className="pt-2">
                            <button
                                onClick={this.handleReload}
                                className="btn bg-fb-blue hover:bg-blue-700 text-white border-none w-full rounded-xl cursor-pointer"
                            >
                                <i className="fa-solid fa-rotate-right mr-2"></i>
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
