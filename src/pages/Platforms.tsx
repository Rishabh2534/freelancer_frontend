import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Users, DollarSign } from "lucide-react";

const Platforms = () => {
  const platforms = [
    {
      name: "Upwork",
      description: "Connect with clients and find quality freelance work worldwide",
      url: "https://www.upwork.com",
      rating: 4.5,
      users: "12M+",
      fee: "5-20%",
      features: ["Payment Protection", "Escrow System", "Time Tracking", "Large Client Base"],
      color: "bg-emerald-500",
    },
    {
      name: "Fiverr",
      description: "Marketplace for freelance services starting at $5",
      url: "https://www.fiverr.com",
      rating: 4.3,
      users: "3M+",
      fee: "20%",
      features: ["Gig-based Work", "Multiple Packages", "Quick Turnaround", "Easy to Start"],
      color: "bg-green-500",
    },
    {
      name: "Freelancer.com",
      description: "Find & hire expert freelancers or work on projects",
      url: "https://www.freelancer.com",
      rating: 4.2,
      users: "50M+",
      fee: "10%",
      features: ["Contest System", "Milestone Payments", "Global Reach", "Diverse Projects"],
      color: "bg-blue-500",
    },
    {
      name: "Toptal",
      description: "Hire the top 3% of freelance talent",
      url: "https://www.toptal.com",
      rating: 4.7,
      users: "10K+",
      fee: "Custom",
      features: ["Vetted Talent", "No-Risk Trial", "Premium Clients", "High-End Projects"],
      color: "bg-sky-600",
    },
    {
      name: "PeoplePerHour",
      description: "Find freelancers & get work done by the hour",
      url: "https://www.peopleperhour.com",
      rating: 4.1,
      users: "2M+",
      fee: "3.5-20%",
      features: ["Hourly & Fixed Price", "UK Market Focus", "Workspace Tools", "Free to Join"],
      color: "bg-orange-500",
    },
    {
      name: "Guru",
      description: "Find and hire quality freelancers for any job",
      url: "https://www.guru.com",
      rating: 4.0,
      users: "3M+",
      fee: "5-9%",
      features: ["WorkRoom", "SafePay", "Multiple Payment Options", "Daily Job Matches"],
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Similar Freelance Platforms
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore other popular freelancing platforms to expand your opportunities
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform, idx) => (
              <Card
                key={idx}
                className="group hover:shadow-glow transition-all duration-300 border-border animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`h-12 w-12 rounded-lg ${platform.color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {platform.name.charAt(0)}
                      </span>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      {platform.rating}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {platform.name}
                  </CardTitle>
                  <CardDescription>{platform.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{platform.users} users</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>{platform.fee} fee</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {platform.features.map((feature, featureIdx) => (
                        <Badge key={featureIdx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                    onClick={() => window.open(platform.url, "_blank")}
                  >
                    Visit Platform
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-card border-primary/20 shadow-glow">
            <CardHeader>
              <CardTitle>Why Choose FreelanceAI?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                While these platforms are great, FreelanceAI offers unique advantages:
              </p>
              <ul className="space-y-2">
                {[
                  "AI-powered skill roadmaps to grow your expertise",
                  "Smart job matching based on your skills and goals",
                  "Built-in chat for skill-based communities",
                  "Career path suggestions powered by AI",
                  "Integrated learning and earning platform",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Badge variant="success" className="mt-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      ✓
                    </Badge>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Platforms;
