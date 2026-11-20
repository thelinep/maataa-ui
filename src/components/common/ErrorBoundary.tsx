import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const StyledErrorContainer = styled.div`
  background: #dc354520;
  border: 1px solid #dc3545;
  border-radius: 12px;
  padding: 24px;
  color: #3d3835;
`;

const StyledErrorTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #dc3545;
`;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <StyledErrorContainer>
            <StyledErrorTitle>Something went wrong</StyledErrorTitle>
            <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                background: '#0066cc',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Try again
            </button>
          </StyledErrorContainer>
        )
      );
    }

    return this.props.children;
  }
}
