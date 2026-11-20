import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, borderRadius } from '@/utils/tokens';

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  itemCount: number;
}

interface OrderHistoryProps {
  orders: Order[];
  onViewOrder?: (orderId: string) => void;
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const StyledOrderCard = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
  }
`;

const StyledStatusBadge = styled.span<{ status: Order['status'] }>`
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'delivered': return colorTokens.interactive.success;
      case 'shipped': return colorTokens.interactive.info;
      case 'pending': return colorTokens.interactive.warning;
      default: return colorTokens.interactive.error;
    }
  }};
  color: white;
`;

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  onViewOrder
}) => {
  if (orders.length === 0) {
    return (
      <div style={{ color: colorTokens.text.secondary, textAlign: 'center', padding: spacing.lg }}>
        No orders yet
      </div>
    );
  }

  return (
    <StyledContainer>
      {orders.map(order => (
        <StyledOrderCard key={order.id} onClick={() => onViewOrder?.(order.id)}>
          <div>
            <div style={{ fontWeight: 600, color: colorTokens.text.primary }}>
              Order #{order.id}
            </div>
            <div style={{ fontSize: '12px', color: colorTokens.text.secondary }}>
              {order.itemCount} items • {new Date(order.date).toLocaleDateString()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
            <div style={{ fontWeight: 600, color: colorTokens.interactive.primary }}>
              ${order.total.toFixed(2)}
            </div>
            <StyledStatusBadge status={order.status}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </StyledStatusBadge>
          </div>
        </StyledOrderCard>
      ))}
    </StyledContainer>
  );
};
