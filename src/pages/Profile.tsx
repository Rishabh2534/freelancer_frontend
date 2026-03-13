import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, DollarSign, Briefcase, Edit, MapPin, Mail, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        const { profile } = await api.getProfile(user.id);
        setProfileData(profile);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);
  
  const skills = profileData?.skills || [
    { name: "React", proficiency: 95 },
    { name: "TypeScript", proficiency: 90 },
    { name: "Node.js", proficiency: 85 },
    { name: "Python", proficiency: 80 },
    { name: "UI/UX", proficiency: 75 },
  ];

  const reviews = profileData?.receivedReviews || [
    {
      id: 1,
      client: "Sarah Johnson",
      rating: 5,
      comment: "Excellent work! Very professional and delivered ahead of schedule.",
      project: "E-commerce Dashboard",
      date: "Dec 2024",
    },
    {
      id: 2,
      client: "Michael Chen",
      rating: 5,
      comment: "Great communication and technical skills. Highly recommended!",
      project: "Mobile App UI",
      date: "Nov 2024",
    },
    {
      id: 3,
      client: "Emma Williams",
      rating: 4,
      comment: "Good work overall. Minor revisions needed but very responsive.",
      project: "API Integration",
      date: "Oct 2024",
    },
  ];

  const stats = [
    { label: "Total Earnings", value: profileData?.stats?.totalEarnings || "$0", icon: DollarSign, color: "text-success" },
    { label: "Projects Completed", value: String(profileData?.stats?.projectsCompleted || profileData?._count?.projects || 0), icon: Briefcase, color: "text-primary" },
    { label: "Average Rating", value: profileData?.stats?.averageRating || "0.0", icon: Star, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Overview */}
          <Card className="lg:col-span-1 shadow-lg border-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={profileData?.avatarUrl || profileData?.avatar_url || ""} alt={profileData?.fullName || profileData?.full_name || "User"} />
                  <AvatarFallback className="text-4xl bg-gradient-primary text-white">
                    {(profileData?.fullName || profileData?.full_name) ? (profileData.fullName || profileData.full_name).charAt(0) : user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{profileData?.fullName || profileData?.full_name || user?.email?.split('@')[0] || "User"}</CardTitle>
              <Badge variant="default" className="mt-2 capitalize">{user?.role || "User"}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData?.location || "Location not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email || "Email not available"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                      <span className="font-semibold">{stat.value}</span>
                    </div>
                  );
                })}
              </div>

              <Button 
                variant="gradient" 
                className="w-full gap-2" 
                onClick={() => navigate("/edit-profile")}
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Bio & Skills */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-border">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profileData?.bio || "No bio available. Edit your profile to add a bio."}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border">
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skills.map((skill: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.proficiency || skill.level}%</span>
                    </div>
                    <Progress value={skill.proficiency || skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border">
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review: any) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{review.author?.profile?.fullName || review.author?.email || review.client}</p>
                        <p className="text-xs text-muted-foreground">{review.projectId || review.project}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">
                          {review.date || new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
