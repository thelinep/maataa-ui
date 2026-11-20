import type { Meta, StoryObj } from '@storybook/react';
import { ShoppingCart } from './ShoppingCart';

const meta = {
  title: 'E-commerce/ShoppingCart',
  component: ShoppingCart,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta<typeof ShoppingCart>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockItems = [
  { productId: '1', productName: 'Wireless Headphones', price: 79.99, quantity: 1 },
  { productId: '2', productName: 'USB-C Cable', price: 12.99, quantity: 2 }
];

export const WithItems: Story = {
  args: { items: mockItems, currency: 'USD' }
};

export const SingleItem: Story = {
  args: { items: [mockItems[0]], currency: 'USD' }
};

export const Empty: Story = {
  args: { items: [], currency: 'USD' }
};

export const LargeQuantity: Story = {
  args: {
    items: [{ productId: '1', productName: 'Item', price: 99.99, quantity: 10 }],
    currency: 'USD'
  }
};
