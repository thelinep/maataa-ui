import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

interface Feedback {
  id: string;
  name: string;
  rating: number;
  comment: string;
  timestamp: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface FeedbackStats {
  avgRating: number;
  totalResponses: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const Container = styled.div`
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
`;

const Header = styled.div`
  margin-bottom: ${spacing.lg};
`;

const Title = styled.h1`
  font-family: ${typography.heading2.fontFamily};
  font-size: ${typography.heading2.fontSize};
  color: ${colorTokens.text.primary};
  margin: 0 0 ${spacing.md} 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing.lg};
`;

const StatCard = styled.div`
  background: ${colorTokens.background.secondary};
  padding: ${spacing.lg};
  border-radius: 8px;
  border-left: 4px solid ${colorTokens.primary.main};
`;

const StatLabel = styled.div`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${spacing.sm};
`;

const StatValue = styled.div`
  font-size: 2em;
  font-weight: 700;
  color: ${colorTokens.text.primary};
`;

const SentimentBar = styled.div`
  display: flex;
  height: 8px;
  gap: 2px;
  margin-top: ${spacing.md};
  border-radius: 4px;
  overflow: hidden;
`;

const SentimentSegment = styled.div<{ percentage: number; sentiment: string }>`
  flex: ${(props) => props.percentage};
  background: ${(props) => {
    switch (props.sentiment) {
      case 'positive':
        return '#28a745';
      case 'neutral':
        return '#ffc107';
      case 'negative':
        return '#dc3545';
      default:
        return '#e9ecef';
    }
  }};
`;

const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const FeedbackCard = styled.div<{ sentiment: string }>`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 8px;
  padding: ${spacing.lg};
  border-left: 4px solid ${(props) => {
    switch (props.sentiment) {
      case 'positive':
        return '#28a745';
      case 'neutral':
        return '#ffc107';
      case 'negative':
        return '#dc3545';
      default:
        return '#e9ecef';
    }
  }};
`;

const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
`;

const FeedbackName = styled.div`
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const RatingStars = styled.div`
  font-size: 1.1em;
  letter-spacing: 2px;
`;

const FeedbackDate = styled.div`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const FeedbackComment = styled.p`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.secondary};
  line-height: 1.6;
  margin: 0;
`;

const EmptyState = styled.div`
  padding: ${spacing.xl};
  text-align: center;
  background: ${colorTokens.background.secondary};
  border-radius: 8px;
  color: ${colorTokens.text.secondary};
`;

const FeedbackCollection: React.FC<{ screeningId?: string }> = ({ screeningId }) => {
  // Mock data
  const [feedbackList] = useState<Feedback[]>([
    {
      id: 'f1',
      name: 'Abhishek D.',
      rating: 5,
      comment: 'Outstanding cinematography and compelling narrative. The highway scenes are absolutely stunning.',
      timestamp: new Date('2026-11-15 20:30'),
      sentiment: 'positive',
    },
    {
      id: 'f2',
      name: 'Priya S.',
      rating: 4,
      comment: 'Strong first half, pacing could be tighter in Act 2. Character development is excellent.',
      timestamp: new Date('2026-11-15 20:45'),
      sentiment: 'neutral',
    },
    {
      id: 'f3',
      name: 'Rajesh K.',
      rating: 5,
      comment: 'This is cinema. Every frame tells a story. The music elevates the narrative beautifully.',
      timestamp: new Date('2026-11-15 21:00'),
      sentiment: 'positive',
    },
    {
      id: 'f4',
      name: 'Meera P.',
      rating: 3,
      comment: 'Good attempt but the ending felt rushed. Too many plot threads left unresolved.',
      timestamp: new Date('2026-11-15 21:15'),
      sentiment: 'negative',
    },
    {
      id: 'f5',
      name: 'Amit S.',
      rating: 4,
      comment: 'Well-crafted thriller with excellent performances. Minor issues with sound mixing.',
      timestamp: new Date('2026-11-15 21:30'),
      sentiment: 'neutral',
    },
  ]);

  const calculateStats = (): FeedbackStats => {
    const avgRating = feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length;
    const sentimentCounts = {
      positive: feedbackList.filter((f) => f.sentiment === 'positive').length,
      neutral: feedbackList.filter((f) => f.sentiment === 'neutral').length,
      negative: feedbackList.filter((f) => f.sentiment === 'negative').length,
    };

    return {
      avgRating: Math.round(avgRating * 10) / 10,
      totalResponses: feedbackList.length,
      sentimentBreakdown: sentimentCounts,
    };
  };

  const stats = calculateStats();
  const sentimentTotal = stats.sentimentBreakdown.positive + stats.sentimentBreakdown.neutral + stats.sentimentBreakdown.negative;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? '⭐' : '☆');
    }
    return stars.join('');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Container>
      <Header>
        <Title>📊 Feedback Results</Title>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatLabel>Average Rating</StatLabel>
          <StatValue>{stats.avgRating}/5 ⭐</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Responses</StatLabel>
          <StatValue>{stats.totalResponses}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Sentiment</StatLabel>
          <SentimentBar>
            <SentimentSegment
              percentage={stats.sentimentBreakdown.positive}
              sentiment="positive"
              title={`Positive: ${stats.sentimentBreakdown.positive}`}
            />
            <SentimentSegment
              percentage={stats.sentimentBreakdown.neutral}
              sentiment="neutral"
              title={`Neutral: ${stats.sentimentBreakdown.neutral}`}
            />
            <SentimentSegment
              percentage={stats.sentimentBreakdown.negative}
              sentiment="negative"
              title={`Negative: ${stats.sentimentBreakdown.negative}`}
            />
          </SentimentBar>
        </StatCard>
      </StatsGrid>

      {feedbackList.length > 0 ? (
        <FeedbackList>
          {feedbackList.map((feedback) => (
            <FeedbackCard key={feedback.id} sentiment={feedback.sentiment}>
              <FeedbackHeader>
                <div>
                  <FeedbackName>{feedback.name}</FeedbackName>
                  <FeedbackDate>{formatDate(feedback.timestamp)}</FeedbackDate>
                </div>
                <RatingStars>{renderStars(feedback.rating)}</RatingStars>
              </FeedbackHeader>
              <FeedbackComment>{feedback.comment}</FeedbackComment>
            </FeedbackCard>
          ))}
        </FeedbackList>
      ) : (
        <EmptyState>No feedback collected yet</EmptyState>
      )}
    </Container>
  );
};

export default FeedbackCollection;
