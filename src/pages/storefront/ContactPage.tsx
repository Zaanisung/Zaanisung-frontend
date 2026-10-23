import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { validateEmail } from '../../utils/validation';
import { useApp } from '../../context/AppContext';
import { MapPin, Mail, Phone, Clock, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('Private Fragrance Consultation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!validateEmail(email)) errs.email = 'Valid email address is required';
    if (!message.trim()) errs.message = 'Inquiry message cannot be empty';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitted(true);
    addToast({
      type: 'success',
      title: 'Inquiry Received',
      message: 'A concierge advisor will reach out to you within 24 business hours.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 text-left">
      <Breadcrumbs items={[{ label: 'Home', route: 'home' }, { label: 'Concierge & Contact' }]} />

      <div className="max-w-3xl mb-12">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#92733C] block mb-2">
          Client Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#171512] font-normal tracking-tight mb-4">
          Private Consultation & Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-[#716C64] font-light leading-relaxed">
          Whether arranging a bespoke flacon allocation, inquiring about order logistics, or scheduling an appointment at our Accra studio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 rounded-xs shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#171512] pb-3 border-b border-[#E4DED3]">
              Accra Boutique & Atelier
            </h3>

            <div className="flex items-start gap-3 text-xs text-[#716C64]">
              <MapPin size={16} className="text-[#92733C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#171512] block">Atelier Showroom (By Appointment)</strong>
                Patrice Lumumba Road, Airport Residential Area<br />
                Accra, Greater Accra, Ghana
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-[#716C64]">
              <Mail size={16} className="text-[#92733C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#171512] block">Concierge Email</strong>
                concierge@zaanisung.com
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-[#716C64]">
              <Phone size={16} className="text-[#92733C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#171512] block">Phone & WhatsApp Inquiries</strong>
                +233 (0) 24 400 0000
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-[#716C64]">
              <Clock size={16} className="text-[#92733C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#171512] block">Visiting Hours</strong>
                Monday – Friday: 10:00 AM – 6:00 PM GMT<br />
                Saturday: 11:00 AM – 4:00 PM GMT
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#F0ECE5] border border-[#E4DED3] rounded-xs text-xs text-[#716C64] leading-relaxed">
            <strong className="text-[#171512] block mb-1">Corporate & Wedding Gifting</strong>
            We accommodate custom wax-stamped flacon engraving and curated discovery sets for diplomatic and private events.
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E4DED3] p-6 sm:p-8 rounded-xs shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#171512]">
                Your Message Has Been Transmitted
              </h3>
              <p className="text-xs text-[#716C64] max-w-md mx-auto leading-relaxed">
                Thank you for contacting the ZAANISUNG atelier. Our fragrance specialist will respond via email or phone within 24 hours.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Send Another Inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-xl font-semibold text-[#171512] pb-3 border-b border-[#E4DED3]">
                Direct Concierge Inquiry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  placeholder="Nana Kwame"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  placeholder="kwame@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Ghana Phone Number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0244 123 456"
                />
                <Select
                  label="Nature of Inquiry"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  options={[
                    { value: 'Private Fragrance Consultation', label: 'Private Fragrance Consultation' },
                    { value: 'Order & Shipping Tracking', label: 'Order & Shipping Tracking' },
                    { value: 'Custom Gifting & Engraving', label: 'Custom Gifting & Engraving' },
                    { value: 'Wholesale & Stockist Application', label: 'Wholesale & Stockist Application' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#716C64] mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please specify your request or questions..."
                  className="w-full bg-[#FFFFFF] text-[#171512] px-3.5 py-2.5 text-sm border border-[#E4DED3] rounded-xs focus:border-[#171512] outline-none"
                  required
                />
                {errors.message && (
                  <p className="text-xs text-red-800 mt-1">{errors.message}</p>
                )}
              </div>

              <Button type="submit" variant="primary" size="md">
                Transmit Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
