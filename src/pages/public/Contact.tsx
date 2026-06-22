import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Us</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">Have questions? We'd love to hear from you.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            {[
              { icon: Phone, label: 'Phone', value: '+254 700 123 456' },
              { icon: Mail, label: 'Email', value: 'hello@vestra.co.ke' },
              { icon: MapPin, label: 'Office', value: 'Westlands Business Park, Nairobi' },
              { icon: Clock, label: 'Hours', value: 'Mon-Fri, 8:00 AM - 6:00 PM' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                  <item.icon size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {submitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                <Send size={24} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Message Sent!</h3>
              <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Name" placeholder="Your name" required />
                <Input label="Email" type="email" placeholder="your@email.com" required />
              </div>
              <Input label="Subject" placeholder="How can we help?" required />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  placeholder="Tell us more..."
                  required
                />
              </div>
              <Button type="submit" className="w-full" onClick={() => {}}><Send size={16} /> Send Message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
