import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  /** Rendered instead of children after an error. */
  fallback: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, info: ErrorInfo) => void;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Generic boundary. Used around each 3D scene so one failing chapter scene
 * never takes down navigation or other chapters (SPEC §11.4).
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
    if (import.meta.env.DEV) console.error('[ErrorBoundary]', error, info.componentStack);
  }

  override render(): ReactNode {
    const { error } = this.state;
    if (error) {
      const { fallback } = this.props;
      return typeof fallback === 'function' ? fallback(error) : fallback;
    }
    return this.props.children;
  }
}
