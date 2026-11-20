/**
 * Tabs - Tab navigation component
 *
 * Display content in tabs with keyboard navigation and
 * accessibility support.
 *
 * Features:
 * - Tab selection
 * - Keyboard navigation (Arrow keys, Tab)
 * - Active tab styling
 * - Design token integration
 */

import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, transitions, borderRadius } from '@/utils/tokens';

export interface TabItem {
  id: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface TabsProps {
  /** Tab items */
  items: TabItem[];
  /** Selected tab id */
  activeTabId?: string;
  /** Tab selection handler */
  onSelectTab?: (tabId: string) => void;
  /** Tab variant */
  variant?: 'default' | 'subtle';
}

// Container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// Tab list
const TabList = styled.div<{ variant?: 'default' | 'subtle' }>`
  display: flex;
  border-bottom: ${(props) => (props.variant === 'subtle' ? 'none' : `2px solid ${colorTokens.border.primary}`)};
  gap: ${(props) => (props.variant === 'subtle' ? spacing.md : 0)};
  padding: ${(props) => (props.variant === 'subtle' ? `${spacing.md} 0` : 0)};
`;

// Tab button
const TabButton = styled.button<{ isActive?: boolean; disabled?: boolean; variant?: 'default' | 'subtle' }>`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${(props) => (props.variant === 'subtle' ? `${spacing.sm} ${spacing.md}` : `${spacing.md} ${spacing.lg}`)};
  background: none;
  border: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-family: ${typography.body.fontFamily};
  font-size: ${typography.body.fontSize};
  font-weight: ${(props) => (props.isActive ? 600 : 400)};
  color: ${(props) => {
    if (props.disabled) return colorTokens.text.disabled;
    if (props.isActive) return colorTokens.interactive.primary;
    return colorTokens.text.primary;
  }};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: all ${transitions.fast};
  position: relative;

  /* Underline for default variant */
  ${(props) =>
    props.variant !== 'subtle' &&
    `
    border-bottom: 3px solid transparent;
    padding-bottom: calc(${spacing.md} - 3px);
    margin-bottom: -2px;

    ${
      props.isActive
        ? `
      border-bottom-color: ${colorTokens.interactive.primary};
    `
        : `
      &:hover:not(:disabled) {
        border-bottom-color: ${colorTokens.border.secondary};
      }
    `
    }
  `}

  /* Styling for subtle variant */
  ${(props) =>
    props.variant === 'subtle' &&
    `
    border-radius: ${borderRadius.md};

    ${
      props.isActive
        ? `
      background-color: ${colorTokens.background.tertiary};
    `
        : `
      &:hover:not(:disabled) {
        background-color: ${colorTokens.background.secondary};
      }
    `
    }
  `}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colorTokens.interactive.primary};
  }

  /* Icon */
  svg {
    width: 1.2em;
    height: 1.2em;
    flex-shrink: 0;
  }
`;

// Tab panel
const TabPanel = styled.div<{ isActive?: boolean }>`
  display: ${(props) => (props.isActive ? 'block' : 'none')};
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

// Content area
const ContentArea = styled.div`
  padding: ${spacing.lg};
`;

/**
 * Tabs Component
 *
 * Tab navigation component with keyboard support and
 * accessibility features.
 *
 * @example
 * <Tabs
 *   items={[
 *     { id: 'overview', label: 'Overview', content: <OverviewContent /> },
 *     { id: 'details', label: 'Details', content: <DetailsContent /> },
 *   ]}
 *   activeTabId="overview"
 *   onSelectTab={(id) => setActive(id)}
 * />
 */
export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTabId,
  onSelectTab,
  variant = 'default',
}) => {
  const [internalActiveId, setInternalActiveId] = useState(items[0]?.id);
  const currentActiveId = activeTabId ?? internalActiveId;

  const handleSelectTab = (tabId: string) => {
    setInternalActiveId(tabId);
    onSelectTab?.(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex: number | null = null;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    if (nextIndex !== null) {
      const nextTab = items[nextIndex];
      if (!nextTab.disabled) {
        handleSelectTab(nextTab.id);
      }
    }
  };

  return (
    <Container>
      <TabList role="tablist" variant={variant}>
        {items.map((item, index) => (
          <TabButton
            key={item.id}
            role="tab"
            isActive={item.id === currentActiveId}
            disabled={item.disabled}
            variant={variant}
            onClick={() => !item.disabled && handleSelectTab(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-selected={item.id === currentActiveId}
            aria-controls={`tabpanel-${item.id}`}
            tabIndex={item.id === currentActiveId ? 0 : -1}
          >
            {item.icon && <span>{item.icon}</span>}
            {item.label}
          </TabButton>
        ))}
      </TabList>

      {items.map((item) => (
        <TabPanel
          key={item.id}
          id={`tabpanel-${item.id}`}
          role="tabpanel"
          isActive={item.id === currentActiveId}
          aria-labelledby={item.id}
          hidden={item.id !== currentActiveId}
        >
          {item.content && <ContentArea>{item.content}</ContentArea>}
        </TabPanel>
      ))}
    </Container>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
