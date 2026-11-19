/**
 * Modal - Modal dialog component
 *
 * A modal dialog with backdrop, fade animation, and focus management.
 *
 * Features:
 * - Overlay backdrop
 * - Focus trap
 * - ESC key to close
 * - Smooth fade animation
 * - Design token integration
 */

import { ReactNode, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, transitions, zIndex } from '@/utils/tokens';

export interface ModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: ReactNode;
  /** Modal content */
  children: ReactNode;
  /** Modal actions/footer */
  footer?: ReactNode;
  /** Maximum width */
  maxWidth?: string;
  /** Whether clicking backdrop closes modal */
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
  z-index: ${zIndex.modal};
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
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

// Modal container
const ModalContainer = styled.div<{ maxWidth?: string; isOpen: boolean }>`
  position: relative;
  background-color: ${colorTokens.background.primary};
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: ${(props) => props.maxWidth || '500px'};
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp ${transitions.normal};

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// Header
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.lg};
  border-bottom: 1px solid ${colorTokens.border.primary};
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
`;

/**
 * Modal Component
 *
 * A modal dialog with backdrop, focus trap, and animations.
 *
 * @example
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   footer={
 *     <>
 *       <Button onClick={() => setIsOpen(false)}>Cancel</Button>
 *       <Button variant="primary">Confirm</Button>
 *     </>
 *   }
 * >
 *   <p>Are you sure you want to continue?</p>
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth,
  closeOnBackdropClick = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Store previously focused element
    previousActiveElement.current = document.activeElement || null;

    // Focus trap - focus modal when opened
    setTimeout(() => {
      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
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
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
      // Restore focus
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Backdrop isOpen={isOpen} onClick={handleBackdropClick} role="presentation">
      <ModalContainer ref={modalRef} maxWidth={maxWidth} isOpen={isOpen} role="dialog" aria-modal="true">
        {title && (
          <Header>
            <Title>{title}</Title>
            <CloseButton onClick={onClose} aria-label="Close modal">
              ×
            </CloseButton>
          </Header>
        )}

        <Content>{children}</Content>

        {footer && <Footer>{footer}</Footer>}
      </ModalContainer>
    </Backdrop>
  );
};

Modal.displayName = 'Modal';

export default Modal;
