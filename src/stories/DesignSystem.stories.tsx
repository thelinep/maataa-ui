import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';

const meta = {
  title: 'Design System/Overview',
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta;

export default meta;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
`;

const ColorCard = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const ColorSwatch = styled.div<{ color: string }>`
  height: 120px;
  background: ${props => props.color};
`;

const ColorLabel = styled.div`
  padding: 16px;
  background: white;
  color: #3d3835;
  font-size: 12px;
  font-weight: 600;
`;

export const Colors: StoryObj = {
  render: () => (
    <div>
      <h2>Color Tokens</h2>
      <ColorGrid>
        <ColorCard>
          <ColorSwatch color="#faf9f4" />
          <ColorLabel>Background Primary</ColorLabel>
        </ColorCard>
        <ColorCard>
          <ColorSwatch color="#3d3835" />
          <ColorLabel>Text Primary</ColorLabel>
        </ColorCard>
        <ColorCard>
          <ColorSwatch color="#0066cc" />
          <ColorLabel>Interactive Primary</ColorLabel>
        </ColorCard>
        <ColorCard>
          <ColorSwatch color="#28a745" />
          <ColorLabel>Success</ColorLabel>
        </ColorCard>
        <ColorCard>
          <ColorSwatch color="#dc3545" />
          <ColorLabel>Error</ColorLabel>
        </ColorCard>
        <ColorCard>
          <ColorSwatch color="#ffc107" />
          <ColorLabel>Warning</ColorLabel>
        </ColorCard>
      </ColorGrid>
    </div>
  )
};

export const Typography: StoryObj = {
  render: () => (
    <div>
      <h2>Typography Scales</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 700 }}>Heading 1</div>
          <div style={{ fontSize: '12px', color: '#8a8784' }}>
            24px, 700 weight
          </div>
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>Heading 2</div>
          <div style={{ fontSize: '12px', color: '#8a8784' }}>
            20px, 600 weight
          </div>
        </div>
        <div>
          <div style={{ fontSize: '16px' }}>Body Text</div>
          <div style={{ fontSize: '12px', color: '#8a8784' }}>
            16px, 400 weight
          </div>
        </div>
      </div>
    </div>
  )
};
