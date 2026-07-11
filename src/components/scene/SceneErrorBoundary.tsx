import { Component, type ErrorInfo, type ReactNode } from 'react';

type SceneErrorBoundaryProps = {
  readonly children: ReactNode;
  readonly fallback: ReactNode;
  readonly label: string;
};

type SceneErrorBoundaryState = {
  readonly hasError: boolean;
};

export class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(`[scene:${this.props.label}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
