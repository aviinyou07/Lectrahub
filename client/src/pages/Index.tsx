
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, University, Users, Download } from "lucide-react";
import { GraduationCap, Award, Target, Heart, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { SUBSCRIBER } from "@/utils/apis"


const Index = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "Study Materials",
      description: "Access comprehensive notes, textbooks, and reference materials organized by subject and semester."
    },
    {
      icon: <University className="w-6 h-6 text-green-600" />,
      title: "Video Lectures",
      description: "Watch high-quality recorded lectures from experienced professors and industry experts."
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: "Syllabus & Curriculum",
      description: "Get detailed syllabus information and curriculum guidelines for all courses and branches."
    },
    {
      icon: <Download className="w-6 h-6 text-orange-600" />,
      title: "Easy Downloads",
      description: "Download study materials, previous year papers, and assignments with a single click."
    }
  ];

  const Approaches = [
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
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "The syllabus structure and expert guidance helped me excel in my studies. The content is comprehensive and easy to follow.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content: "Amazing platform for continuous learning. The expert consultation feature is incredibly valuable for professional development.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Data Science Student",
      content: "The organized curriculum and regular updates keep me on track with the latest industry trends. Highly recommended!",
      rating: 5
    }
  ];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // 'success' | 'error' | ''

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch(SUBSCRIBER.ADD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const err = await res.json();

        if (res.status === 409) {
          setStatus("exists");
        } else {
          setStatus("error");
        }

        console.error("Subscription error:", err.message);
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const galleryItems = [
  { src: "/learn-learning-education-studying-concept.jpg", alt: "Gallery 1" },
  { src: "/colleagues-learning-together-group-study.jpg", alt: "Gallery 2" },
  { src: "/international-day-education-futuristic-style.jpg", alt: "Gallery 3" },
  { src: "/student-online-cute-guy-checked-shirt-with-glasses-studying-computer-reading-book.jpg", alt: "Gallery 4" },
  { src: "/close-up-young-man-working-smart-phone-laptop.jpg", alt: "Gallery 5" },
  { src: "/beautiful-office-space-cartoon-style.jpg", alt: "Gallery 6" },
];



  // const successStories = [
  //   {
  //     name: "Ananya Sharma",
  //     university: "ABC University",
  //     quote:
  //       "This platform made it super easy to find all my semester notes. I topped my class last year!",
  //     // image: "https://source.unsplash.com/100x100/?student,girl"
  //   },
  //   {
  //     name: "Rahul Mehta",
  //     university: "XYZ College",
  //     quote:
  //       "I loved the video lectures — they helped me clear my backlogs and get my dream placement.",
  //     image: "https://source.unsplash.com/100x100/?student,boy"
  //   },
  //   {
  //     name: "Priya Singh",
  //     university: "LMN Institute",
  //     quote:
  //       "The syllabus and study materials are so well organized. I recommend this to all juniors!",
  //     image: "https://source.unsplash.com/100x100/?student,graduation"
  //   },
  //   // Add more stories as needed
  // ];

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // or 2/3 for multi
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50  ">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 ">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Gateway to
            <span className="text-blue-600 block mt-2">Academic Excellence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover a comprehensive platform designed for students to access notes, syllabus,
            video lectures, and study materials organized by university, course, and semester.
          </p>
          <Link to="/universities">
            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Start Exploring
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 shadow-md bg-white/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-50 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Approaches Section */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Approaches.map((approach, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {approach.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{approach.title}</CardTitle>
                      <CardDescription className="mt-2">{approach.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="text-center animate-fade-in delay-300 mb-10 mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-lg text-gray-600">
            <div className="flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 font-semibold">1</span>
              Choose University
            </div>
            <div className="hidden md:block text-gray-400">→</div>
            <div className="flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 font-semibold">2</span>
              Select Course & Branch
            </div>
            <div className="hidden md:block text-gray-400">→</div>
            <div className="flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 font-semibold">3</span>
              Pick Semester & Subject
            </div>
            <div className="hidden md:block text-gray-400">→</div>
            <div className="flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 font-semibold">4</span>
              Access Materials
            </div>
          </div>
        </div>

        {/* Sucess Stories */}

        {/* <div className="container mx-auto px-4 my-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Student Success Stories
          </h2>

          <Slider {...carouselSettings}>
            {successStories.map((story, index) => (
              <div key={index} className="flex flex-col items-center text-center px-4">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
                <p className="text-lg italic text-gray-600 mb-4">“{story.quote}”</p>
                <h4 className="font-bold text-gray-900">{story.name}</h4>
                <p className="text-sm text-gray-500">{story.university}</p>
              </div>
            ))}
          </Slider>
        </div> */}


        {/* 📸 Gallery Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {galleryItems.map((item, index) => (
    <div
      key={index}
      className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
    >
      <img src={item.src} alt={item.alt} className="w-full h-60 object-cover" />
    </div>
  ))}
</div>


        {/* Testimonials Carousel */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
            <Carousel className="max-w-4xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <Card className="text-center p-8">
                      <CardContent className="pt-6">
                        <div className="flex justify-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="text-lg italic mb-6">
                          "{testimonial.content}"
                        </blockquote>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="px-4 py-12 bg-gradient-to-br from-slate-100 to-slate-300">
          <div className="container mx-auto">
            <Card className="max-w-2xl mx-auto text-center p-10 backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-3xl font-semibold text-slate-800">Stay Updated</CardTitle>
                <CardDescription className="text-slate-700 mt-2">
                  Get the latest course updates, expert tips, and industry insights delivered to your inbox.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 mt-6">
                  <label htmlFor="newsletter-email" className="sr-only">Email Address</label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-slate-500"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="px-6 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </form>

                {/* Feedback Messages */}
                {status === "success" && (
                  <p className="mt-4 text-green-700 font-medium">You're subscribed! 🎉</p>
                )}
                {status === "exists" && (
                  <p className="mt-4 text-yellow-600 font-medium">You're already subscribed! ✅</p>
                )}
                {status === "error" && (
                  <p className="mt-4 text-red-600 font-medium">Oops! Something went wrong. Try again.</p>
                )}

              </CardContent>
            </Card>
          </div>
        </section>


      </div>
    </div>

  );
};

export default Index;
