/**
 * Skip Links Component
 * Phase I Day 3: Advanced Accessibility
 * 
 * Allow keyboard users to skip to main content
 */

import React from 'react';
import styled from 'styled-components';

const SkipLinksContainer = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
`;

const SkipLink = styled.a`
  display: block;
  padding: var(--spacing-md, 1rem);
  background-color: var(--color-primary-500, #b8884a);
  color: white;
  text-decoration: none;
  font-weight: 600;
  position: absolute;
  left: -9999px;
  top: 0;

  &:focus {
    left: 0;
    outline: 3px solid var(--color-semantic-info, #3b82f6);
    outline-offset: 2px;
  }
`;

interface SkipLinksProps {
  links?: Array<{
    id: string;
    label: string;
  }>;
}

/**
 * Skip Links Component
 * Provides keyboard shortcuts to jump to main content areas
 */
export const SkipLinks: React.FC<SkipLinksProps> = ({
  links = [
    { id: 'main-content', label: 'Skip to main content' },
    { id: 'navigation', label: 'Skip to navigation' },
    { id: 'footer', label: 'Skip to footer' },
  ],
}) => {
  return (
    <SkipLinksContainer role="navigation" aria-label="Skip links">
      {links.map(link => (
        <SkipLink
          key={link.id}
          href={`#${link.id}`}
          onClick={e => {
            e.preventDefault();
            const target = document.getElementById(link.id);
            if (target) {
              target.focus();
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {link.label}
        </SkipLink>
      ))}
    </SkipLinksContainer>
  );
};

export default SkipLinks;
