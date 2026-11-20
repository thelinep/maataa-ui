import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

import type { ConceptData } from '@/core/film/types';

export type ConceptFormData = Pick<ConceptData, 'title' | 'vision' | 'genre' | 'format' | 'duration' | 'budgetEstimate'>;

const FormContainer = styled.div`
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
  max-width: 1000px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const FormSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const Label = styled.label`
  font-family: ${typography.body.fontFamily};
  font-weight: 600;
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: ${spacing.md};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 6px;
  font-family: ${typography.body.fontFamily};
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.primary};
  background: ${colorTokens.background.secondary};

  &:focus {
    outline: none;
    border-color: ${colorTokens.primary.main};
    box-shadow: 0 0 0 3px ${colorTokens.primary.light}30;
  }

  &::placeholder {
    color: ${colorTokens.text.disabled};
  }
`;

const Select = styled.select`
  padding: ${spacing.md};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 6px;
  font-family: ${typography.body.fontFamily};
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.primary};
  background: ${colorTokens.background.secondary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colorTokens.primary.main};
    box-shadow: 0 0 0 3px ${colorTokens.primary.light}30;
  }
`;

const TextArea = styled.textarea`
  padding: ${spacing.md};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 6px;
  font-family: ${typography.body.fontFamily};
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.primary};
  background: ${colorTokens.background.secondary};
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: ${colorTokens.primary.main};
    box-shadow: 0 0 0 3px ${colorTokens.primary.light}30;
  }

  &::placeholder {
    color: ${colorTokens.text.disabled};
  }
`;

const GenreContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;

const GenreCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  cursor: pointer;
  padding: ${spacing.sm} ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${colorTokens.neutral.lighter};
  }

  input {
    cursor: pointer;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${spacing.md};
  justify-content: flex-end;
  margin-top: ${spacing.lg};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${spacing.md} ${spacing.lg};
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-family: ${typography.body.fontFamily};
  font-size: ${typography.body.fontSize};
  transition: all 0.2s;

  ${(props) =>
    props.variant === 'secondary'
      ? `
    background: ${colorTokens.background.secondary};
    color: ${colorTokens.text.primary};
    border: 1px solid ${colorTokens.border.primary};

    &:hover {
      background: ${colorTokens.neutral.light};
    }
  `
      : `
    background: ${colorTokens.primary.main};
    color: white;

    &:hover {
      background: ${colorTokens.primary.dark};
    }
  `}
`;

const GENRES = ['Drama', 'Thriller', 'Comedy', 'Sci-Fi', 'Documentary', 'Animation', 'Experimental'];

export interface ConceptFormProps {
  onSubmit?: (data: ConceptFormData) => void | Promise<void>;
  onCancel?: () => void;
  initialData?: ConceptFormData;
  submitLabel?: string;
}

const ConceptForm: React.FC<ConceptFormProps> = ({ onSubmit, onCancel, initialData, submitLabel = 'Save Concept' }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ConceptFormData>(
    initialData || {
      title: '',
      vision: '',
      genre: [],
      format: 'feature',
      duration: 120,
      budgetEstimate: 1000000,
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'duration' || name === 'budgetEstimate') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(genre) ? prev.genre.filter((g) => g !== genre) : [...prev.genre, genre],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <FormGroup style={{ gridColumn: '1 / -1' }}>
            <Label htmlFor="title">Concept Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., The Lost Highway"
              required
            />
          </FormGroup>
        </FormSection>

        <FormSection style={{ gridColumn: '1 / -1' }}>
          <FormGroup>
            <Label htmlFor="vision">Vision & Concept</Label>
            <TextArea
              id="vision"
              name="vision"
              value={formData.vision}
              onChange={handleInputChange}
              placeholder="Describe your creative vision for this concept..."
              required
            />
          </FormGroup>
        </FormSection>

        <FormSection>
          <FormGroup>
            <Label htmlFor="format">Format</Label>
            <Select id="format" name="format" value={formData.format} onChange={handleInputChange}>
              <option value="feature">Feature Film (90-180 min)</option>
              <option value="short">Short Film (5-45 min)</option>
              <option value="series">Web Series (ongoing)</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              max="300"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="budgetEstimate">Budget Estimate (₹)</Label>
            <Input
              id="budgetEstimate"
              name="budgetEstimate"
              type="number"
              value={formData.budgetEstimate}
              onChange={handleInputChange}
              min="0"
              step="100000"
            />
          </FormGroup>
        </FormSection>

        <FormGroup>
          <Label>Genre(s)</Label>
          <GenreContainer>
            {GENRES.map((genre) => (
              <GenreCheckbox key={genre}>
                <input
                  type="checkbox"
                  checked={formData.genre.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                />
                {genre}
              </GenreCheckbox>
            ))}
          </GenreContainer>
        </FormGroup>

        <ButtonContainer>
          <Button variant="secondary" type="button" onClick={() => onCancel?.()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : submitLabel}
          </Button>
        </ButtonContainer>
      </Form>
    </FormContainer>
  );
};

export default ConceptForm;
