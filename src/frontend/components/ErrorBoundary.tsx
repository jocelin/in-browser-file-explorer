import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
	errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({
			error,
			errorInfo,
		});

		// Call the onError callback if provided
		this.props.onError?.(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="error-boundary p-6 bg-red-50 border border-red-200 rounded-lg">
					<div className="flex items-center gap-2 mb-4">
						<span className="text-red-600 text-xl">⚠️</span>
						<h2 className="text-lg font-semibold text-red-800">
							Something went wrong
						</h2>
					</div>

					<div className="text-red-700 mb-4">
						<p className="mb-2">
							An unexpected error occurred. Please try refreshing the page.
						</p>

						{process.env.NODE_ENV === 'development' && this.state.error && (
							<details className="mt-4">
								<summary className="cursor-pointer font-medium">
									Error Details (Development)
								</summary>
								<pre className="mt-2 p-3 bg-red-100 rounded text-xs overflow-auto">
									{this.state.error.toString()}
									{this.state.errorInfo?.componentStack}
								</pre>
							</details>
						)}
					</div>

					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
					>
						Refresh Page
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
	Component: React.ComponentType<P>,
	fallback?: ReactNode,
	onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
	const WrappedComponent = (props: P) => (
		<ErrorBoundary fallback={fallback} onError={onError}>
			<Component {...props} />
		</ErrorBoundary>
	);

	WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

	return WrappedComponent;
};
