import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ScoreGauge from '@/components/ScoreGauge';
import { ArrowLeft, Upload, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AnalysisResult {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    missing: string[];
  };
  matchedKeywords: string[];
  missingKeywords: string[];
}

const ResultsPage = () => {
  const location = useLocation();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockResult: AnalysisResult = {
      overallScore: 78,
      skillsScore: 85,
      experienceScore: 72,
      educationScore: 76,
      feedback: {
        strengths: [
          "Strong technical skills in React and JavaScript",
          "Relevant experience in software development",
          "Good educational background in Computer Science",
          "Experience with modern development tools and frameworks"
        ],
        improvements: [
          "Consider adding more specific examples of project outcomes",
          "Highlight leadership and team collaboration experience",
          "Include metrics and quantifiable achievements",
          "Add relevant certifications or continuous learning activities"
        ],
        missing: [
          "Docker containerization experience",
          "Cloud platform experience (AWS, Azure)",
          "Agile/Scrum methodology experience",
          "Database design and optimization skills"
        ]
      },
      matchedKeywords: ["React", "JavaScript", "TypeScript", "Node.js", "Git", "HTML", "CSS"],
      missingKeywords: ["Docker", "AWS", "Kubernetes", "PostgreSQL", "Agile", "Scrum"]
    };

    // Simulate loading
    setTimeout(() => {
      setResult(mockResult);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-foreground">Analyzing Your Documents</h2>
          <p className="text-muted-foreground">This may take a few moments...</p>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Analysis Error</h2>
          <p className="text-muted-foreground">We couldn't process your documents. Please try again.</p>
          <Button asChild>
            <Link to="/upload">Back to Upload</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/upload" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analysis Results</h1>
              <p className="text-muted-foreground">
                {location.state?.resumeFile} vs {location.state?.jobDescFile}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm" asChild>
              <Link to="/upload" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload Revised Resume</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <ScoreGauge
            score={result.overallScore}
            title="Overall Match"
            subtitle="Total compatibility score"
            size="lg"
          />
          <ScoreGauge
            score={result.skillsScore}
            title="Skills"
            subtitle="Technical & soft skills"
            color="secondary"
          />
          <ScoreGauge
            score={result.experienceScore}
            title="Experience"
            subtitle="Relevant work history"
            color="accent"
          />
          <ScoreGauge
            score={result.educationScore}
            title="Education"
            subtitle="Academic background"
            color="primary"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feedback */}
          <div className="space-y-6">
            {/* Strengths */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <h3 className="text-lg font-semibold text-foreground">Strengths</h3>
              </div>
              <ul className="space-y-3">
                {result.feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Areas for Improvement */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-semibold text-foreground">Areas for Improvement</h3>
              </div>
              <ul className="space-y-3">
                {result.feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{improvement}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Missing Requirements */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <XCircle className="h-5 w-5 text-destructive" />
                <h3 className="text-lg font-semibold text-foreground">Missing Requirements</h3>
              </div>
              <ul className="space-y-3">
                {result.feedback.missing.map((missing, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{missing}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Keywords Analysis */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Keyword Analysis</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Matched Keywords</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-secondary/10 text-secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span>Missing Keywords</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-destructive/30 text-destructive">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Items */}
            <Card className="p-6 bg-gradient-subtle border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Next Steps</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1 rounded-full mt-1">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add missing keywords naturally throughout your resume
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1 rounded-full mt-1">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quantify your achievements with specific metrics
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1 rounded-full mt-1">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload your revised resume to see improved scores
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;