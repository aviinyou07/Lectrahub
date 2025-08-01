
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {Search} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { BookOpen, ArrowLeft, MessageCircle, Star, Users, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AskExperts = () => {
 const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    question: "",
    urgency: ""
  });

  const experts = [
    {
      name: "Dr. Sarah Chen",
      expertise: "Machine Learning & AI",
      avatar: "/placeholder.svg",
      rating: 4.9,
      responses: 324,
      responseTime: "< 12 hours",
      specialties: ["Deep Learning", "Neural Networks", "Computer Vision"]
    },
    {
      name: "Mark Rodriguez",
      expertise: "Full-Stack Development",
      avatar: "/placeholder.svg",
      rating: 4.8,
      responses: 267,
      responseTime: "< 24 hours",
      specialties: ["React", "Node.js", "MongoDB", "AWS"]
    },
    {
      name: "Emily Johnson",
      expertise: "Data Science & Analytics",
      avatar: "/placeholder.svg",
      rating: 4.9,
      responses: 298,
      responseTime: "< 18 hours",
      specialties: ["Python", "R", "Statistics", "Visualization"]
    },
    {
      name: "David Kim",
      expertise: "Cybersecurity",
      avatar: "/placeholder.svg",
      rating: 4.7,
      responses: 189,
      responseTime: "< 36 hours",
      specialties: ["Network Security", "Penetration Testing", "Compliance"]
    }
  ];

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I get started with the platform?",
          answer: "Simply create an account and explore our structured syllabus. Start with the beginner courses and progress at your own pace. You can also book consultation sessions with our experts for personalized guidance."
        },
        {
          question: "What prerequisites do I need?",
          answer: "Most of our courses are designed for beginners, but some advanced topics may require basic programming knowledge. Each course page lists specific prerequisites if any."
        },
        {
          question: "How long does it take to complete a course?",
          answer: "Course duration varies depending on the topic and your pace. Typically, our courses range from 2-8 weeks for completion. You can learn at your own schedule."
        }
      ]
    },
    {
      category: "Courses & Content",
      questions: [
        {
          question: "What programming languages are covered?",
          answer: "We cover popular languages including JavaScript, Python, Java, C++, and more. Our curriculum is regularly updated to include emerging technologies and frameworks."
        },
        {
          question: "Are the courses updated regularly?",
          answer: "Yes! We update our content quarterly and add new courses based on industry trends. You'll receive notifications about updates to courses you're enrolled in."
        },
        {
          question: "Can I access course materials offline?",
          answer: "Currently, our platform requires an internet connection. However, you can download PDF resources and coding examples for offline reference."
        }
      ]
    },
    {
      category: "Expert Consultation",
      questions: [
        {
          question: "How does the expert consultation work?",
          answer: "You can submit questions through our 'Ask Experts' section. Our industry professionals will respond within 24-48 hours with detailed explanations and guidance."
        },
        {
          question: "What kind of questions can I ask experts?",
          answer: "You can ask about technical concepts, career guidance, project reviews, interview preparation, or any learning-related queries. Our experts cover various domains including web development, data science, AI/ML, and more."
        },
        {
          question: "Is there a limit to how many questions I can ask?",
          answer: "Free users can ask up to 3 questions per month. Premium members have unlimited access to expert consultations with faster response times."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "I'm having trouble accessing my account",
          answer: "Try resetting your password first. If the issue persists, contact our support team at support@eduplatform.com with your account details."
        },
        {
          question: "The video content isn't loading properly",
          answer: "Check your internet connection and try refreshing the page. If problems continue, try clearing your browser cache or switching to a different browser."
        },
        {
          question: "How do I report a bug or technical issue?",
          answer: "Use the feedback form in your dashboard or email us at support@eduplatform.com with a detailed description of the issue and screenshots if possible."
        }
      ]
    }
  ];

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);
  const recentQuestions = [
    {
      question: "How to optimize React component re-renders?",
      category: "Web Development",
      askedBy: "Anonymous User",
      timeAgo: "2 hours ago",
      expert: "Mark Rodriguez",
      status: "Answered"
    },
    {
      question: "Best practices for neural network training?",
      category: "Machine Learning",
      askedBy: "Anonymous User",
      timeAgo: "5 hours ago",
      expert: "Dr. Sarah Chen",
      status: "In Progress"
    },
    {
      question: "Data preprocessing techniques for time series?",
      category: "Data Science",
      askedBy: "Anonymous User",
      timeAgo: "1 day ago",
      expert: "Emily Johnson",
      status: "Answered"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.question) {
      toast.success("Your question has been submitted successfully! Our experts will respond within 24-48 hours.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        question: "",
        urgency: ""
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">

      {true && ( // Toggle this to false to remove the layer
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
    <div className="bg-white rounded-xl shadow-lg px-8 py-6 text-center max-w-sm">
      <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
      <p className="text-muted-foreground">This feature is currently under development.</p>
    </div>
  </div>
)}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            {/* <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">EduPlatform</span>
            </div> */}
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Ask Our Experts</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get personalized guidance from industry professionals. Submit your questions and receive expert responses within 24-48 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Question Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Submit Your Question
                </CardTitle>
                <CardDescription>
                  Provide as much detail as possible to get the most helpful response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Brief subject of your question"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web-development">Web Development</SelectItem>
                          <SelectItem value="machine-learning">Machine Learning</SelectItem>
                          <SelectItem value="data-science">Data Science</SelectItem>
                          <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="mobile-development">Mobile Development</SelectItem>
                          <SelectItem value="career-guidance">Career Guidance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General inquiry</SelectItem>
                          <SelectItem value="medium">Medium - Assignment help</SelectItem>
                          <SelectItem value="high">High - Project deadline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="question">Your Question</Label>
                    <Textarea
                      id="question"
                      value={formData.question}
                      onChange={(e) => handleInputChange("question", e.target.value)}
                      placeholder="Describe your question in detail. Include any relevant context, code snippets, or specific challenges you're facing..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Submit Question
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Experts & Recent Questions */}
          <div className="space-y-8">
            {/* Our Experts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Our Expert Panel
                </CardTitle>
                <CardDescription>
                  Industry professionals ready to help you succeed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {experts.map((expert, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <Avatar>
                      <AvatarImage src={expert.avatar} alt={expert.name} />
                      <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{expert.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{expert.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{expert.expertise}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span>{expert.responses} responses</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {expert.responseTime}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {expert.specialties.map((specialty, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Questions</CardTitle>
                <CardDescription>
                  See what other learners are asking about
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentQuestions.map((q, index) => (
                  <div key={index} className="border-l-4 border-primary/20 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{q.question}</h4>
                      <Badge 
                        variant={q.status === "Answered" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {q.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Category: {q.category}</div>
                      <div>Asked by {q.askedBy} • {q.timeAgo}</div>
                      <div>Expert: {q.expert}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

         <div className="text-center mb-12 mt-10">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to common questions about our platform and courses
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

         <div className="max-w-4xl mx-auto">
          {filteredFAQ.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <p className="text-muted-foreground mb-4">No FAQs found matching your search.</p>
                <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {filteredFAQ.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="text-2xl">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem 
                          key={faqIndex} 
                          value={`${categoryIndex}-${faqIndex}`}
                        >
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AskExperts;
