/**
 * Storybook Preview - Global Configuration & Decorators
 * Applies theme, tokens, and global styles to all stories
 */

import type { Preview } from '@storybook/react';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      description: {
        component: 'Component documentation and examples',
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
