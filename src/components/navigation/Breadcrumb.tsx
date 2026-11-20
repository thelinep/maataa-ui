/**
 * Breadcrumb - Navigation breadcrumb component
 *
 * Display navigation hierarchy with clickable breadcrumb items.
 *
 * Features:
 * - Clickable breadcrumb items
 * - Automatic separator rendering
 * - Design token integration
 * - Responsive truncation support
 */

import { ReactNode } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, transitions } from '@/utils/tokens';

export interface BreadcrumbItem {
  id?: string;
  label: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  isCurrent?: boolean;
}

export interface BreadcrumbProps {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Separator character */
  separator?: ReactNode;
  /** Custom className */
  className?: string;
}

// Container
const Container = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${spacing.sm};
  font-size: ${typography.body.fontSize};
`;

// List
const List = styled.ol`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`;

// Item
const Item = styled.li`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  min-width: 0;
`;

// Link
const Link = styled.a<{ isCurrent?: boolean; disabled?: boolean }>`
  color: ${(props) => {
    if (props.disabled) return colorTokens.text.disabled;
    if (props.isCurrent) return colorTokens.text.primary;
    return colorTokens.interactive.primary;
  }};
  text-decoration: ${(props) => (props.isCurrent ? 'none' : 'none')};
  cursor: ${(props) => (props.disabled || props.isCurrent ? 'default' : 'pointer')};
  font-weight: ${(props) => (props.isCurrent ? 600 : 400)};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: all ${transitions.fast};
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;

  &:hover:not([disabled]):not([aria-current]) {
    text-decoration: underline;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colorTokens.interactive.primary};
    border-radius: 2px;
  }
`;

// Separator
const Separator = styled.span`
  color: ${colorTokens.text.secondary};
  flex-shrink: 0;
`;

/**
 * Breadcrumb Component
 *
 * Display navigation hierarchy with clickable breadcrumb items.
 *
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Projects', href: '/projects' },
 *     { label: 'Project Name', isCurrent: true },
 *   ]}
 * />
 *
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: 'Workspace', onClick: () => navigate('/') },
 *     { label: 'Team', onClick: () => navigate('/team') },
 *     { label: 'Members', isCurrent: true },
 *   ]}
 *   separator="/"
 * />
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className,
}) => {
  return (
    <Container className={className} aria-label="Breadcrumb">
      <List>
        {items.map((item, index) => (
          <Item key={item.id || index}>
            <Link
              href={item.href}
              isCurrent={item.isCurrent}
              disabled={item.disabled}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
              }}
              aria-current={item.isCurrent ? 'page' : undefined}
              role={item.isCurrent ? 'doc-pagebreak' : 'link'}
              tabIndex={item.disabled ? -1 : 0}
            >
              {item.label}
            </Link>

            {index < items.length - 1 && <Separator aria-hidden="true">{separator}</Separator>}
          </Item>
        ))}
      </List>
    </Container>
  );
};

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
