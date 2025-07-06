import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ScoreGaugeProps {
  score: number;
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'accent';
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  title,
  subtitle,
  size = 'md',
  showPercentage = true,
  color = 'primary'
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-secondary';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-accent';
    return 'text-destructive';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-secondary';
    if (score >= 60) return 'bg-primary';
    if (score >= 40) return 'bg-accent';
    return 'bg-destructive';
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const textSizes = {
    sm: { title: 'text-lg', score: 'text-2xl', subtitle: 'text-xs' },
    md: { title: 'text-xl', score: 'text-3xl', subtitle: 'text-sm' },
    lg: { title: 'text-2xl', score: 'text-4xl', subtitle: 'text-base' }
  };

  return (
    <Card className={`${sizeClasses[size]} text-center space-y-4 hover:shadow-elegant transition-shadow`}>
      <div className="space-y-2">
        <h3 className={`font-bold text-foreground ${textSizes[size].title}`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`text-muted-foreground ${textSizes[size].subtitle}`}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className={`font-bold ${getScoreColor(score)} ${textSizes[size].score}`}>
          {score}{showPercentage && '%'}
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={score} 
            className="h-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {score >= 80 && "Excellent match!"}
        {score >= 60 && score < 80 && "Good match"}
        {score >= 40 && score < 60 && "Fair match"}
        {score < 40 && "Needs improvement"}
      </div>
    </Card>
  );
};

export default ScoreGauge;