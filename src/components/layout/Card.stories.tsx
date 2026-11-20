/**
 * Card Component Stories
 * Visual documentation for card container with header, body, and footer
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Layout/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Container component for grouping related content with optional header and footer.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic Card
 */
export const Basic: Story = {
  render: () => (
    <Card>
      <div style={{ padding: '16px' }}>
        This is a basic card with content.
      </div>
    </Card>
  ),
};

/**
 * Card with Header
 */
export const WithHeader: Story = {
  render: () => (
    <Card>
      <div style={{ borderBottom: '1px solid #e0e0e0', padding: '16px' }}>
        <h3 style={{ margin: 0 }}>Card Title</h3>
      </div>
      <div style={{ padding: '16px' }}>
        This card has a header section.
      </div>
    </Card>
  ),
};

/**
 * Card with Header, Body, and Footer
 */
export const WithHeaderBodyFooter: Story = {
  render: () => (
    <Card>
      <div style={{ borderBottom: '1px solid #e0e0e0', padding: '16px' }}>
        <h3 style={{ margin: 0 }}>Project Information</h3>
      </div>
      <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
        <p>Project Name: Awesome Project</p>
        <p>Status: In Progress</p>
        <p>Team Size: 5 members</p>
      </div>
      <div style={{ padding: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button style={{ padding: '8px 16px' }}>Cancel</button>
        <button style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Save
        </button>
      </div>
    </Card>
  ),
};

/**
 * Card Grid Layout
 */
export const CardGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <Card>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h4 style={{ marginTop: 0 }}>📊 Projects</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>12</p>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Active projects</p>
        </div>
      </Card>
      <Card>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h4 style={{ marginTop: 0 }}>👥 Teams</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>3</p>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Active teams</p>
        </div>
      </Card>
      <Card>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h4 style={{ marginTop: 0 }}>💰 Budgets</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>$45K</p>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Total allocated</p>
        </div>
      </Card>
    </div>
  ),
};

/**
 * Card with Long Content
 */
export const LongContent: Story = {
  render: () => (
    <Card>
      <div style={{ borderBottom: '1px solid #e0e0e0', padding: '16px' }}>
        <h3 style={{ margin: 0 }}>About This Project</h3>
      </div>
      <div style={{ padding: '16px' }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </Card>
  ),
};

/**
 * Minimal Card
 */
export const Minimal: Story = {
  render: () => (
    <Card>
      <div style={{ padding: '12px 16px' }}>
        Simple content with minimal styling
      </div>
    </Card>
  ),
};
