import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { FileText, TrendingUp, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HistoryEntry {
  id: string;
  date: string;
  resumeName: string;
  jobTitle: string;
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  improvement?: number;
}

const HistoryPage = () => {
  // Mock data - replace with actual API call
  const [historyData] = useState<HistoryEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      resumeName: 'John_Doe_Resume_v3.pdf',
      jobTitle: 'Senior React Developer',
      overallScore: 85,
      skillsScore: 90,
      experienceScore: 82,
      educationScore: 78,
      improvement: 12
    },
    {
      id: '2',
      date: '2024-01-12',
      resumeName: 'John_Doe_Resume_v2.pdf',
      jobTitle: 'Senior React Developer',
      overallScore: 73,
      skillsScore: 78,
      experienceScore: 70,
      educationScore: 71,
      improvement: 8
    },
    {
      id: '3',
      date: '2024-01-10',
      resumeName: 'John_Doe_Resume_v1.pdf',
      jobTitle: 'Senior React Developer',
      overallScore: 65,
      skillsScore: 70,
      experienceScore: 62,
      educationScore: 63
    },
    {
      id: '4',
      date: '2024-01-08',
      resumeName: 'John_Doe_Resume_v1.pdf',
      jobTitle: 'Frontend Developer',
      overallScore: 88,
      skillsScore: 92,
      experienceScore: 85,
      educationScore: 87,
      improvement: 15
    },
    {
      id: '5',
      date: '2024-01-05',
      resumeName: 'John_Doe_Resume_original.pdf',
      jobTitle: 'Frontend Developer',
      overallScore: 73,
      skillsScore: 77,
      experienceScore: 70,
      educationScore: 72
    }
  ]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-secondary';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-accent';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const avgScore = Math.round(historyData.reduce((sum, entry) => sum + entry.overallScore, 0) / historyData.length);
  const latestScore = historyData[0]?.overallScore || 0;
  const totalAnalyses = historyData.length;

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Analysis History</h1>
          <p className="text-muted-foreground">
            Track your progress and see how your resume improvements affect your match scores over time.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="space-y-2">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{latestScore}%</h3>
              <p className="text-sm text-muted-foreground">Latest Score</p>
            </div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="space-y-2">
              <div className="bg-secondary/10 p-3 rounded-lg w-fit mx-auto">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{avgScore}%</h3>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="space-y-2">
              <div className="bg-accent/10 p-3 rounded-lg w-fit mx-auto">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{totalAnalyses}</h3>
              <p className="text-sm text-muted-foreground">Total Analyses</p>
            </div>
          </Card>
        </div>

        {/* Progress Chart Placeholder */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Score Trends</h3>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Interactive chart coming soon</p>
              <p className="text-sm text-muted-foreground">
                Track your score improvements over time
              </p>
            </div>
          </div>
        </Card>

        {/* History Table */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Recent Analyses</h3>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Improvement</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(entry.date)}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate text-sm font-medium">
                        {entry.resumeName}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {entry.jobTitle}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getScoreBadgeVariant(entry.overallScore)}>
                          {entry.overallScore}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-16">
                        <Progress value={entry.skillsScore} className="h-2" />
                        <span className="text-xs text-muted-foreground">{entry.skillsScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-16">
                        <Progress value={entry.experienceScore} className="h-2" />
                        <span className="text-xs text-muted-foreground">{entry.experienceScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-16">
                        <Progress value={entry.educationScore} className="h-2" />
                        <span className="text-xs text-muted-foreground">{entry.educationScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.improvement ? (
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3 text-secondary" />
                          <span className="text-xs text-secondary font-medium">
                            +{entry.improvement}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/results`} state={{ analysisId: entry.id }}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-8">
          <Card className="p-8 bg-gradient-primary text-primary-foreground">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Ready for Another Analysis?</h3>
              <p className="text-primary-foreground/90">
                Upload an updated resume or try matching against a new job description.
              </p>
              <Button 
                asChild 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <Link to="/upload">New Analysis</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;