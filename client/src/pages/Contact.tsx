import { useState, FormEvent } from "react";
import PageLayout from "@/components/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send
} from "lucide-react";
import { CONTACT } from "@/utils/apis";
import { showSuccess, showError } from "@/utils/toast";


const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      title: "Email Us",
      content: "support@Lectrahub.com",
      description: "Send us an email and we'll respond within 24 hours"
    },
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      title: "Call Us",
      content: "+917027888321",
      description: "Monday to Friday, 9 AM to 6 PM EST"
    },
    {
      icon: <MapPin className="w-6 h-6 text-red-600" />,
      title: "Visit Us",
      content: "Sec 99, Gurgaon 122505",
      description: "Our office is open for student visits"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
      title: "Live Chat",
      content: "Available 24/7",
      description: "Get instant help through our chat support"
    }
  ];

  // ✅ Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    university: "",
    subject: "",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Handle form submit
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    const { firstName, lastName, email, message } = formData;

    if (!firstName || !lastName || !email || !message) {
      showError("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    const response = await fetch(CONTACT.ADD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Something went wrong");
    }

    // ✅ Clear form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      university: "",
      subject: "",
      message: ""
    });

    showSuccess("Your message has been sent!");
  } catch (error: any) {
    console.error("Form submission error:", error);
    showError(error.message || "Oops! Something went wrong. Please try again.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with our team. We're here to help you succeed in your academic journey."
    >
      <div className="space-y-12">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <CardHeader>
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {info.icon}
                  </div>
                </div>
                <CardTitle className="text-lg">{info.title}</CardTitle>
                <CardDescription>{info.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-gray-900">{info.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Send className="w-6 h-6 mr-2 text-blue-600" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    University
                  </label>
                  <Input
                    name="university"
                    placeholder="Your University Name"
                    value={formData.university}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Subject
                  </label>
                  <Input
                    name="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Message<span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Tell us more about your question or feedback..."
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>

            {/* FAQ Cards */}
            {[
              {
                question: "How do I access study materials?",
                answer:
                  "Navigate through University → Course → Branch → Semester → Subject to find all study materials including notes, videos, and syllabus content."
              },
              {
                question: "Is LectraHub free to use?",
                answer:
                  "Yes! LectraHub is completely free for all students. Our mission is to make quality education accessible to everyone."
              },
              {
                question: "Can I contribute content?",
                answer:
                  "We welcome contributions from students and faculty. Contact us to learn about our content contribution process."
              },
              {
                question: "My university isn't listed. What should I do?",
                answer:
                  "We're constantly adding new universities. Send us a request with your university details and we'll prioritize adding it."
              }
            ].map((faq, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;




 