/**
 * Drawer - Slide-out drawer panel component
 *
 * A drawer panel that slides in from the side with backdrop.
 *
 * Features:
 * - Slide animation
 * - Customizable side (left/right)
 * - Focus management
 * - ESC key to close
 * - Design token integration
 */

import { ReactNode, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, transitions, zIndex } from '@/utils/tokens';

export interface DrawerProps {
  /** Whether drawer is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Drawer title */
  title?: ReactNode;
  /** Drawer content */
  children: ReactNode;
  /** Drawer actions/footer */
  footer?: ReactNode;
  /** Side to open from */
  side?: 'left' | 'right';
  /** Width of drawer */
  width?: string;
  /** Whether clicking backdrop closes drawer */
  closeOnBackdropClick?: boolean;
}

// Backdrop
const Backdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${zIndex.modal - 1};
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  animation: fadeIn ${transitions.normal};

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Drawer container
const DrawerContainer = styled.div<{ isOpen: boolean; side?: 'left' | 'right'; width?: string }>`
  position: fixed;
  top: 0;
  ${(props) => (props.side === 'right' ? 'right' : 'left')}: 0;
  bottom: 0;
  width: ${(props) => props.width || '400px'};
  background-color: ${colorTokens.background.primary};
  z-index: ${zIndex.modal};
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => (props.side === 'right' ? '-10px 0 15px -5px rgba(0, 0, 0, 0.1)' : '10px 0 15px -5px rgba(0, 0, 0, 0.1)')};
  transform: translateX(${(props) => {
    if (props.isOpen) return '0';
    return props.side === 'right' ? '100%' : '-100%';
  }});
  transition: transform ${transitions.normal};
  overflow: hidden;
`;

// Header
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.lg};
  border-bottom: 1px solid ${colorTokens.border.primary};
  flex-shrink: 0;
`;

// Title
const Title = styled.h2`
  font-size: ${typography.heading3.fontSize};
  font-weight: ${typography.heading3.fontWeight};
  line-height: ${typography.heading3.lineHeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

// Close button
const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: ${colorTokens.text.secondary};
  cursor: pointer;
  font-size: 1.5em;
  line-height: 1;
  transition: all ${transitions.fast};
  border-radius: 4px;

  &:hover {
    color: ${colorTokens.text.primary};
    background-color: ${colorTokens.background.secondary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colorTokens.interactive.primary};
  }
`;

// Content
const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${spacing.lg};
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.primary};
`;

// Footer
const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${spacing.md};
  padding: ${spacing.lg};
  border-top: 1px solid ${colorTokens.border.primary};
  background-color: ${colorTokens.background.secondary};
  flex-shrink: 0;
`;

/**
 * Drawer Component
 *
 * A slide-out drawer panel with backdrop.
 *
 * @example
 * <Drawer
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Settings"
 *   side="right"
 *   footer={
 *     <>
 *       <Button onClick={() => setIsOpen(false)}>Close</Button>
 *       <Button variant="primary">Save</Button>
 *     </>
 *   }
 * >
 *   <p>Drawer content here</p>
 * </Drawer>
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  side = 'right',
  width,
  closeOnBackdropClick = true,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Store previously focused element
    previousActiveElement.current = document.activeElement || null;

    // Focus trap
    setTimeout(() => {
      if (drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }
    }, 0);

    // Handle ESC key
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Restore focus
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (): void => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <>
      <Backdrop isOpen={isOpen} onClick={closeOnBackdropClick ? handleBackdropClick : undefined} />

      <DrawerContainer ref={drawerRef} isOpen={isOpen} side={side} width={width} role="dialog" aria-modal="true">
        {title && (
          <Header>
            <Title>{title}</Title>
            <CloseButton onClick={onClose} aria-label="Close drawer">
              ×
            </CloseButton>
          </Header>
        )}

        <Content>{children}</Content>

        {footer && <Footer>{footer}</Footer>}
      </DrawerContainer>
    </>
  );
};

Drawer.displayName = 'Drawer';

export default Drawer;
