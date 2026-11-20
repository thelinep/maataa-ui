import React, { Suspense, ReactNode } from 'react';
import styled from 'styled-components';

const StyledLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: linear-gradient(90deg, #f5f4f1 25%, #faf9f4 50%, #f5f4f1 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const StyledLoaderText = styled.div`
  color: #8a8784;
  font-size: 14px;
  font-weight: 500;
`;

interface SuspenseLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({
  children,
  fallback
}) => (
  <Suspense
    fallback={
      fallback || (
        <StyledLoader>
          <StyledLoaderText>Loading...</StyledLoaderText>
        </StyledLoader>
      )
    }
  >
    {children}
  </Suspense>
);
