import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, borderRadius } from '@/utils/tokens';
import { usePresence } from '@/hooks/usePresence';

export interface CheckoutData {
  email: string;
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  cardLast4: string;
}

interface CheckoutFlowProps {
  items: Array<{ name: string; price: number; quantity: number }>;
  onComplete?: (data: CheckoutData) => void;
  onCancel?: () => void;
}

const StyledContainer = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  max-width: 500px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const StyledInput = styled.input`
  padding: ${spacing.md};
  border: 1px solid ${colorTokens.border.control};
  border-radius: ${borderRadius.md};
  font-size: 14px;
  color: ${colorTokens.text.primary};

  &:focus {
    outline: none;
    border-color: ${colorTokens.interactive.primary};
    box-shadow: 0 0 0 2px ${colorTokens.interactive.primary}22;
  }
`;

const StyledButton = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  border: none;
  border-radius: ${borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.primary {
    background: ${colorTokens.interactive.primary};
    color: white;
  }

  &.secondary {
    background: ${colorTokens.background.tertiary};
    color: ${colorTokens.text.primary};
  }
`;

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  items,
  onComplete,
  onCancel
}) => {
  const { setTyping } = usePresence({ entityId: 'checkout' });
  const [formData, setFormData] = useState<Partial<CheckoutData>>({});
  const [step, setStep] = useState(1);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTyping(true);
    
    if (step === 1) {
      setStep(2);
    } else {
      onComplete?.(formData as CheckoutData);
    }
    
    setTimeout(() => setTyping(false), 1000);
  };

  return (
    <StyledContainer>
      <h2 style={{ color: colorTokens.text.primary, marginTop: 0 }}>
        Checkout - Step {step} of 2
      </h2>

      <StyledForm onSubmit={handleSubmit}>
        {step === 1 ? (
          <>
            <StyledInput
              type="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <StyledInput
              type="text"
              placeholder="Full Name"
              value={formData.fullName || ''}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <StyledInput
              type="text"
              placeholder="Address"
              value={formData.address || ''}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              required
            />
            <StyledInput
              type="text"
              placeholder="City"
              value={formData.city || ''}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              required
            />
            <StyledInput
              type="text"
              placeholder="Zip Code"
              value={formData.zipCode || ''}
              onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
              required
            />
          </>
        ) : (
          <>
            <StyledInput
              type="text"
              placeholder="Card Number (last 4 digits)"
              value={formData.cardLast4 || ''}
              onChange={e => setFormData({ ...formData, cardLast4: e.target.value })}
              maxLength={4}
              required
            />
            <div style={{ padding: spacing.md, background: colorTokens.background.tertiary, borderRadius: borderRadius.md }}>
              <div style={{ fontSize: '12px', color: colorTokens.text.secondary }}>Order Total:</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: colorTokens.interactive.primary }}>
                ${total.toFixed(2)}
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: spacing.md }}>
          <StyledButton className="secondary" type="button" onClick={onCancel} style={{ flex: 1 }}>
            Cancel
          </StyledButton>
          <StyledButton className="primary" type="submit" style={{ flex: 1 }}>
            {step === 1 ? 'Next' : 'Complete Purchase'}
          </StyledButton>
        </div>
      </StyledForm>
    </StyledContainer>
  );
};
