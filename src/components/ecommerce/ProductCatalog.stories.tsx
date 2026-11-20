import type { Meta, StoryObj } from '@storybook/react';
import { ProductCatalog } from './ProductCatalog';

const meta = {
  title: 'E-commerce/ProductCatalog',
  component: ProductCatalog,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta<typeof ProductCatalog>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProducts = [
  { id: '1', name: 'Wireless Headphones', price: 79.99, currency: 'USD', inventory: 15, inStock: true, rating: 4.5, reviewCount: 328 },
  { id: '2', name: 'USB-C Cable', price: 12.99, currency: 'USD', inventory: 50, inStock: true, rating: 4.8, reviewCount: 1203 },
  { id: '3', name: 'Phone Stand', price: 24.99, currency: 'USD', inventory: 0, inStock: false, rating: 4.2, reviewCount: 156 }
];

export const Default: Story = {
  args: { products: mockProducts, currency: 'USD' }
};

export const SingleProduct: Story = {
  args: { products: [mockProducts[0]], currency: 'USD' }
};

export const OutOfStock: Story = {
  args: { products: [mockProducts[2]], currency: 'USD' }
};

export const HighRating: Story = {
  args: {
    products: [{
      ...mockProducts[1],
      rating: 4.9,
      reviewCount: 2500
    }],
    currency: 'USD'
  }
};
