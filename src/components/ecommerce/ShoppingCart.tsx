import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  currency?: string;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
  onCheckout?: () => void;
}

const StyledContainer = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
`;

const StyledItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md} 0;
  border-bottom: 1px solid ${colorTokens.border.primary};

  &:last-child {
    border-bottom: none;
  }
`;

const StyledTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${spacing.lg};
  padding-top: ${spacing.lg};
  border-top: 2px solid ${colorTokens.border.primary};
  font-weight: 700;
  color: ${colorTokens.text.primary};
  font-size: 18px;
`;

const StyledButton = styled.button`
  background: ${colorTokens.interactive.primary};
  color: white;
  border: none;
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  width: 100%;
  margin-top: ${spacing.md};
  font-weight: 600;
`;

export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  currency = 'USD',
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <StyledContainer>
        <div style={{ color: colorTokens.text.secondary, textAlign: 'center' }}>
          Your cart is empty
        </div>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <h2 style={{ color: colorTokens.text.primary, marginTop: 0 }}>Shopping Cart ({items.length})</h2>
      
      {items.map(item => (
        <StyledItem key={item.productId}>
          <div>
            <div style={{ fontWeight: 500, color: colorTokens.text.primary }}>
              {item.productName}
            </div>
            <div style={{ fontSize: '12px', color: colorTokens.text.secondary }}>
              ${item.price.toFixed(2)} × {item.quantity}
            </div>
          </div>
          <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
            <div style={{ fontWeight: 600, color: colorTokens.interactive.primary }}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button 
              onClick={() => onRemoveItem?.(item.productId)}
              style={{ background: 'none', border: 'none', color: colorTokens.interactive.error, cursor: 'pointer' }}
            >
              Remove
            </button>
          </div>
        </StyledItem>
      ))}

      <StyledTotal>
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </StyledTotal>

      <StyledButton onClick={onCheckout}>
        Proceed to Checkout
      </StyledButton>
    </StyledContainer>
  );
};
