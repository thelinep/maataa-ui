/**
 * TypingIndicator Component Stories
 * Visual documentation for real-time typing status indicator
 */

import type { Meta, StoryObj } from '@storybook/react';
import { TypingIndicator } from './TypingIndicator';

const meta = {
  title: 'Components/Collaboration/TypingIndicator',
  component: TypingIndicator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Shows who is currently typing in real-time collaboration with animated dots.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    typists: {
      control: 'object',
      description: 'Array of user names currently typing',
    },
    variant: {
      control: 'select',
      options: ['compact', 'full'],
      description: 'Display variant',
    },
  },
} satisfies Meta<typeof TypingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * No Typists
 */
export const NoTypists: Story = {
  args: {
    typists: [],
    variant: 'compact',
  },
};

/**
 * Single Typist - Compact
 */
export const SingleTypistCompact: Story = {
  args: {
    typists: ['Alice'],
    variant: 'compact',
  },
};

/**
 * Single Typist - Full
 */
export const SingleTypistFull: Story = {
  args: {
    typists: ['Alice'],
    variant: 'full',
  },
};

/**
 * Two Typists - Compact
 */
export const TwoTypistsCompact: Story = {
  args: {
    typists: ['Alice', 'Bob'],
    variant: 'compact',
  },
};

/**
 * Two Typists - Full
 */
export const TwoTypistsFull: Story = {
  args: {
    typists: ['Alice', 'Bob'],
    variant: 'full',
  },
};

/**
 * Three Typists - Compact
 */
export const ThreeTypistsCompact: Story = {
  args: {
    typists: ['Alice', 'Bob', 'Charlie'],
    variant: 'compact',
  },
};

/**
 * Three Typists - Full
 */
export const ThreeTypistsFull: Story = {
  args: {
    typists: ['Alice', 'Bob', 'Charlie'],
    variant: 'full',
  },
};

/**
 * Many Typists
 */
export const ManyTypists: Story = {
  args: {
    typists: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    variant: 'compact',
  },
};

/**
 * Live Typing Simulation
 */
export const LiveTyping: Story = {
  render: () => {
    const typists = ['Alice', 'Bob'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Typing Status:
          </label>
          <TypingIndicator typists={typists} variant="full" />
        </div>

        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          padding: '12px',
          minHeight: '100px',
          backgroundColor: '#fafafa'
        }}>
          <p>Content being edited by team members...</p>
          <p>Start typing to see the indicator update!</p>
        </div>
      </div>
    );
  },
};

/**
 * In Form Context
 */
export const InFormContext: Story = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Project Name
        </label>
        <input
          type="text"
          placeholder="Enter project name..."
          defaultValue="New Project"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        />
        <TypingIndicator typists={['Alice', 'Bob']} variant="compact" />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Description
        </label>
        <textarea
          placeholder="Enter project description..."
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            minHeight: '100px',
          }}
        />
        <TypingIndicator typists={['Charlie']} variant="compact" />
      </div>

      <button style={{
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}>
        Save Project
      </button>
    </div>
  ),
};
