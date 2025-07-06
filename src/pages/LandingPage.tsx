import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Target, Upload, BarChart3, History, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const LandingPage = () => {
  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Upload your resume and job description in seconds. We support PDF and DOCX formats.'
    },
    {
      icon: Target,
      title: 'AI-Powered Analysis',
      description: 'Our advanced algorithms analyze the match between your skills and job requirements.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Insights',
      description: 'Get comprehensive feedback on skills, experience, and areas for improvement.'
    },
    {
      icon: History,
      title: 'Track Progress',
      description: 'Monitor your improvement over time and see how your scores evolve.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-primary-foreground py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Career Compass
                </h1>
                <p className="text-xl lg:text-2xl text-primary-foreground/90">
                  Tailor your resume. Land your dream job.
                </p>
              </div>
              
              <p className="text-lg text-primary-foreground/80 max-w-xl">
                Get personalized feedback on how well your resume matches job descriptions. 
                Improve your chances with AI-powered insights and actionable recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow"
                >
                  <Link to="/upload" className="flex items-center space-x-2">
                    <span>Get Started</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Career Compass Dashboard" 
                className="rounded-lg shadow-elegant w-full animate-scale-in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant feedback on your resume-job match in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Upload Documents</h3>
              <p className="text-muted-foreground">
                Upload your resume and the job description you're targeting
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-secondary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI analyzes the match between your skills and job requirements
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Get Insights</h3>
              <p className="text-muted-foreground">
                Receive detailed feedback and actionable improvement suggestions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to optimize your job application success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center space-y-4 hover:shadow-elegant transition-shadow">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Join thousands of job seekers who have improved their application success rate with Career Compass.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow"
            >
              <Link to="/upload" className="flex items-center space-x-2">
                <span>Start Your Analysis</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;