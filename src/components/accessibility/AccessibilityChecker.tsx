/**
 * Accessibility Checker Component
 * Phase I Day 3: Advanced Accessibility
 * 
 * Runtime accessibility validation (dev mode only)
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  hasAccessibleName,
  isKeyboardAccessible,
  meetsWCAG_AA,
  getAccessibleName,
} from '../../utils/accessibility';

interface AccessibilityIssue {
  type: 'warning' | 'error';
  element: HTMLElement;
  message: string;
}

const CheckerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border: 2px solid #ef4444;
  border-radius: 8px;
  padding: 16px;
  max-width: 300px;
  max-height: 400px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const IssueItem = styled.div<{ type: 'warning' | 'error' }>`
  padding: 8px;
  margin: 4px 0;
  border-left: 3px solid ${props => props.type === 'error' ? '#ef4444' : '#f59e0b'};
  background: ${props => props.type === 'error' ? '#fef2f2' : '#fffbeb'};
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
`;

const Count = styled.span`
  display: inline-block;
  background: #ef4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: bold;
`;

interface AccessibilityCheckerProps {
  enabled?: boolean;
}

/**
 * Accessibility Checker Component
 * Displays accessibility issues in development mode
 */
export const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({
  enabled = process.env.NODE_ENV === 'development',
}) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [showChecker, setShowChecker] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const checkAccessibility = () => {
      const foundIssues: AccessibilityIssue[] = [];

      // Check all interactive elements
      const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"]'
      );

      interactiveElements.forEach(element => {
        const el = element as HTMLElement;

        // Check for accessible name
        if (!hasAccessibleName(el)) {
          foundIssues.push({
            type: 'error',
            element: el,
            message: `Interactive element missing accessible name: ${el.tagName}`,
          });
        }

        // Check keyboard accessibility
        if (!isKeyboardAccessible(el)) {
          foundIssues.push({
            type: 'warning',
            element: el,
            message: `Element may not be keyboard accessible: ${el.tagName}`,
          });
        }
      });

      // Check color contrast
      const elementsWithColor = document.querySelectorAll('[style*="color"]');
      elementsWithColor.forEach(element => {
        const el = element as HTMLElement;
        const computedStyle = window.getComputedStyle(el);
        const color = computedStyle.color;
        const bgColor = computedStyle.backgroundColor;

        if (color && bgColor && !meetsWCAG_AA(color, bgColor)) {
          foundIssues.push({
            type: 'warning',
            element: el,
            message: `Color contrast may not meet WCAG AA: ${getAccessibleName(el)}`,
          });
        }
      });

      setIssues(foundIssues);
    };

    // Check on mount and when DOM changes
    checkAccessibility();

    const observer = new MutationObserver(checkAccessibility);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label', 'aria-labelledby', 'title'],
    });

    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled || issues.length === 0) return null;

  return (
    <CheckerContainer onClick={() => setShowChecker(!showChecker)}>
      <Title>
        ♿ Accessibility Issues
        <Count>{issues.length}</Count>
      </Title>
      {showChecker && (
        <>
          {issues.map((issue, index) => (
            <IssueItem key={index} type={issue.type}>
              <strong>[{issue.type.toUpperCase()}]</strong> {issue.message}
            </IssueItem>
          ))}
        </>
      )}
    </CheckerContainer>
  );
};

export default AccessibilityChecker;
