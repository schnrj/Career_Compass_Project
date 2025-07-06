import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileUpload from '@/components/ui/file-upload';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UploadPage = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescFile) {
      toast({
        title: "Missing Files",
        description: "Please upload both your resume and job description before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescFile);
      
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/analyze', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Analysis Complete!",
        description: "Your documents have been processed successfully."
      });
      
      // Navigate to results with mock data
      navigate('/results', { 
        state: { 
          resumeFile: resumeFile.name,
          jobDescFile: jobDescFile.name,
          analysisId: Date.now().toString()
        }
      });
      
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error processing your documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tips = [
    "Ensure your resume is up-to-date with your latest experience and skills",
    "Use clear, readable fonts and standard formatting",
    "Include relevant keywords from the job description in your resume",
    "Make sure both documents are complete and properly formatted"
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
            Upload Your Documents
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and the job description you're targeting to get personalized feedback and insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Upload */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Your Resume</h2>
            </div>
            
            <FileUpload
              onFileSelect={setResumeFile}
              label="Upload Resume"
              description="Upload your current resume for analysis"
              className="w-full"
            />
          </Card>

          {/* Job Description Upload */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Job Description</h2>
            </div>
            
            <FileUpload
              onFileSelect={setJobDescFile}
              label="Upload Job Description"
              description="Upload the job description you're targeting"
              className="w-full"
            />
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="p-6 mb-8">
          <div className="flex items-start space-x-3">
            <div className="bg-accent/10 p-2 rounded-lg mt-1">
              <Info className="h-5 w-5 text-accent" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Tips for Best Results</h3>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={!resumeFile || !jobDescFile || isSubmitting}
            size="lg"
            className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-all"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                <span>Analyzing Documents...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Analyze Match</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </Button>
          
          <p className="text-sm text-muted-foreground mt-3">
            Analysis typically takes 30-60 seconds
          </p>
        </div>

        {/* Help Section */}
        <Alert className="mt-8">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Having trouble? Make sure your files are in PDF or DOCX format and contain readable text. 
            Scanned images may not work as well as native text documents.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default UploadPage;