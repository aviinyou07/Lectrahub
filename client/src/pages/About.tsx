
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, BookOpen, Award, Target, Heart } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: "Comprehensive Study Materials",
      description: "Access notes, videos, syllabus, and resources for all subjects across multiple universities and courses."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Student-Centered Approach",
      description: "Designed by students, for students. We understand the challenges of academic life and provide solutions."
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-purple-600" />,
      title: "Multiple Universities",
      description: "Supporting students from top universities with standardized, high-quality educational content."
    },
    {
      icon: <Award className="w-8 h-8 text-orange-600" />,
      title: "Quality Assured",
      description: "All materials are reviewed by academic experts and experienced faculty members."
    }
  ];

  const stats = [
    { label: "Universities", value: "50+", color: "bg-blue-100 text-blue-700" },
    { label: "Courses", value: "200+", color: "bg-green-100 text-green-700" },
    { label: "Students Helped", value: "100K+", color: "bg-purple-100 text-purple-700" },
    { label: "Study Materials", value: "10K+", color: "bg-orange-100 text-orange-700" }
  ];

  return (
    <PageLayout
      title="About LectraHub"
      description="Empowering students with comprehensive study resources and academic support."
      backgroundImage="/public/close-up-hand-taking-notes.jpg"
    >
      <div className="space-y-12">
        {/* Mission Section */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Our Mission
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 max-w-3xl mx-auto">
                  To empower every student to achieve academic success by providing free,
                  high-quality, and organized study materials, syllabus details, and video
                  lectures for every university, course, and semester.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Vision */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Our Vision
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 max-w-3xl mx-auto">
                  To become the most trusted and comprehensive digital learning hub for
                  students worldwide, bridging gaps in education through accessible,
                  well-structured, and collaborative resources that inspire lifelong
                  learning and academic excellence.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-md">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <Badge className={`${stat.color} text-sm`}>{stat.label}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="mt-2">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              {/* <Heart className="w-12 h-12 text-red-500" /> */}
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Our Values</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Accessibility */}
              <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Education should be accessible to everyone, regardless of their background or circumstances.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Quality */}
              <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    We maintain the highest standards in all our educational content and resources.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Community */}
              <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Building a supportive community where students help each other succeed.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Innovation */}
              <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    We embrace new ideas and technologies to create engaging learning experiences.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Integrity */}
              <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    Integrity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Acting with honesty and transparency in everything we do.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Growth */}
              <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Encouraging continuous learning and personal development for everyone.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

      </div>
    </PageLayout>
  );
};

export default About;
