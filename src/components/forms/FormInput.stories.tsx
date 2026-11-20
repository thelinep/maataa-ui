/**
 * FormInput Component Stories
 * Visual documentation for text inputs, validation states, and variations
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FormInput } from './FormInput';

const meta = {
  title: 'Components/Forms/FormInput',
  component: FormInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Text input field with label, hint, and error states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'url'],
    },
    placeholder: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
    hint: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic Text Input
 */
export const Basic: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    label: 'Text Input',
  },
};

/**
 * With Hint Text
 */
export const WithHint: Story = {
  args: {
    type: 'text',
    placeholder: 'john@example.com',
    label: 'Email Address',
    hint: "We'll never share your email",
  },
};

/**
 * Email Input
 */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com',
    label: 'Email',
    hint: 'Enter a valid email address',
  },
};

/**
 * Password Input
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '••••••••',
    label: 'Password',
    hint: 'At least 8 characters',
  },
};

/**
 * Number Input
 */
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0.00',
    label: 'Amount',
  },
};

/**
 * With Error State
 */
export const Error: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com',
    label: 'Email',
    error: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
};

/**
 * Disabled State
 */
export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    label: 'Disabled Field',
    disabled: true,
    defaultValue: 'Cannot edit',
  },
};

/**
 * Required Field
 */
export const Required: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter project name',
    label: 'Project Name *',
    hint: 'This field is required',
  },
};

/**
 * All Input Types
 */
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <FormInput type="text" label="Text" placeholder="Enter text..." />
      <FormInput type="email" label="Email" placeholder="you@example.com" />
      <FormInput type="password" label="Password" placeholder="••••••••" />
      <FormInput type="number" label="Number" placeholder="0.00" />
      <FormInput type="url" label="Website" placeholder="https://example.com" />
    </div>
  ),
};

/**
 * Form Group Example
 */
export const FormGroup: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
      <FormInput
        type="text"
        label="Project Name *"
        placeholder="My Awesome Project"
        hint="Give your project a unique name"
      />
      <FormInput
        type="text"
        label="Description"
        placeholder="What is this project about?"
        hint="Optional: Help your team understand the project"
      />
      <FormInput
        type="email"
        label="Project Lead Email *"
        placeholder="lead@example.com"
        hint="Notifications will be sent to this address"
      />
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button type="submit" style={{ padding: '8px 16px', flex: 1 }}>
          Create Project
        </button>
        <button type="reset" style={{ padding: '8px 16px', flex: 1 }}>
          Cancel
        </button>
      </div>
    </form>
  ),
};
