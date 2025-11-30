import { useState } from 'react';
import type React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Card, CardContent } from '@/Components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Send,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  User,
  Building,
  CheckCircle,
} from 'lucide-react';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
};

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Our Showroom',
    lines: ['3 Simba Road', 'Sunninghill, Johannesburg' ],
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+27 78 076 6039', '+27 72 139 8501 '],
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['contact@luxefurnish.com', 'sales@luxefurnish.com'],
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
  },
];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const submitInquiry = useMutation<unknown, Error, ContactFormData>({
    mutationFn: (data: ContactFormData) =>
      base44.entities.ContactInquiry.create(data),
    onSuccess: () => {
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    submitInquiry.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Contact us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-gold text-sm font-semibold uppercase tracking-wider">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
              Let's Create Something Beautiful
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Have a question or ready to start your project? We'd love to hear
              from you. Our team is here to help bring your vision to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-4">
                      <info.icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    {info.lines.map((line, i) => (
                      <p key={i} className="text-gray-600 text-sm">
                        {line}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Message Sent!
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="bg-gold hover:bg-[#b8944d] text-white"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-gold text-sm font-semibold uppercase tracking-wider">
                    Contact Form
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-8">
                    Send Us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                name: e.target.value,
                              })
                            }
                            placeholder="John Doe"
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            placeholder="john@example.com"
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+27 78 076 6039"
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                company: e.target.value,
                              })
                            }
                            placeholder="Company Name"
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                          placeholder="How can we help?"
                          className="pl-10 h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            message: e.target.value,
                          })
                        }
                        placeholder="Tell us about your project or inquiry..."
                        rows={6}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gold hover:bg-[#b8944d] text-white h-14 text-base"
                      disabled={submitInquiry.isPending}
                    >
                      {submitInquiry.isPending ? 'Sending...' : 'Send Message'}
                      <Send className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </>
              )}
            </motion.div>

            {/* Map / Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square lg:aspect-auto lg:h-full rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"
                  alt="Our showroom"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-white p-6 rounded-2xl shadow-xl">
                <h3 className="font-bold text-gray-900 mb-2">
                  Visit Our Showroom
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Experience our furniture collection in person. Book a free
                  consultation with our design experts.
                </p>
                <div className="flex items-center gap-2 text-gold font-medium">
                  <MapPin className="w-4 h-4" />
                  3 Simba Road, Sunninghill, Johannesburg
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold text-sm font-semibold uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-8">
              Common Questions
            </h2>

            <div className="grid gap-4 text-left">
              {[
                {
                  q: 'What are your delivery options?',
                  a: 'We offer free white-glove delivery for orders over $500. Standard delivery is available for all orders.',
                },
                {
                  q: 'Do you offer customization?',
                  a: 'Yes! Many of our products can be customized in terms of size, materials, and finishes. Contact us for details.',
                },
                {
                  q: 'What is your return policy?',
                  a: 'We offer a 30-day return policy for most items. Custom orders are final sale.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 bg-white/5 rounded-xl border border-white/10"
                >
                  <h4 className="font-semibold text-white mb-2">{item.q}</h4>
                  <p className="text-gray-400">{item.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

