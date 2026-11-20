import React, { useMemo } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';
import { usePresence } from '@/hooks/usePresence';

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  inventory: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductCatalogProps {
  products: Product[];
  currency?: string;
  onAddToCart?: (product: Product) => void;
}

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${spacing.lg};
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
`;

const StyledCard = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.md};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const StyledTitle = styled.h3`
  margin: 0 0 ${spacing.sm} 0;
  color: ${colorTokens.text.primary};
  font-weight: 600;
`;

const StyledPrice = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${colorTokens.interactive.primary};
  margin: ${spacing.md} 0;
`;

const StyledButton = styled.button`
  background: ${colorTokens.interactive.primary};
  color: white;
  border: none;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  width: 100%;
`;

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  currency = 'USD',
  onAddToCart
}) => {
  const { setTyping } = usePresence({ entityId: 'catalog' });

  const handleAdd = (product: Product) => {
    setTyping(true);
    onAddToCart?.(product);
    setTimeout(() => setTyping(false), 1000);
  };

  return (
    <StyledContainer>
      {products.map(p => (
        <StyledCard key={p.id}>
          <StyledTitle>{p.name}</StyledTitle>
          <StyledPrice>${p.price.toFixed(2)}</StyledPrice>
          <div style={{ fontSize: '12px', marginBottom: spacing.md }}>
            ★ {p.rating} ({p.reviewCount} reviews)
          </div>
          <StyledButton 
            onClick={() => handleAdd(p)}
            disabled={!p.inStock}
          >
            {p.inStock ? 'Add to Cart' : 'Out of Stock'}
          </StyledButton>
        </StyledCard>
      ))}
    </StyledContainer>
  );
};
