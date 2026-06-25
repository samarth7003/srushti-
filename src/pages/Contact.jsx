import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Check } from "lucide-react";

export const Contact = ({ addToast }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [subject, setSubject] = useState("General Enquiry");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast("Please fill in all required fields.", "error");
      return;
    }

    setSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setSubmitting(false);
      addToast("Namaste! Your message has been sent to our concierge desk.", "success");
      setName("");
      setEmail("");
      setMobile("");
      setMessage("");
    }, 1500);
  };

  const getWhatsAppChatUrl = () => {
    const num = "+919876543210";
    const text = "Namaste Srushti Jewellery. I am visiting your contact page and would like to chat with your concierge.";
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans text-left py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-left space-y-2">
          <h1 className="font-serif text-4xl font-light text-luxury-black dark:text-gold-200">
            Contact Concierge
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
            We are here to assist you with boutique purchases, custom orders, or showroom visits.
          </p>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left panel: Info cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-luxury-charcoal p-6 rounded-2xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-luxury-black dark:text-white border-b border-gold-100/10 dark:border-stone-800/20 pb-3">
                Boutique Channels
              </h3>

              <div className="space-y-4 text-xs font-light text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gold-50 dark:bg-stone-900 rounded-xl text-gold-500 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-luxury-black dark:text-white">Call Us Directly</h4>
                    <p className="mt-0.5">+91 98765 43210</p>
                    <p className="text-gray-400">Toll Free: 1800-419-8900</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gold-50 dark:bg-stone-900 rounded-xl text-emerald-500 shrink-0">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-luxury-black dark:text-white">WhatsApp Chat</h4>
                    <p className="mt-0.5">+91 98765 43210</p>
                    <a
                      href={getWhatsAppChatUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 dark:text-emerald-400 font-semibold hover:underline block mt-1"
                    >
                      Click to Chat Now &rarr;
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gold-50 dark:bg-stone-900 rounded-xl text-gold-500 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-luxury-black dark:text-white">Boutique Email</h4>
                    <p className="mt-0.5">concierge@srushtijewellery.com</p>
                    <p className="text-gray-400">customercare@srushtijewellery.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gold-50 dark:bg-stone-900 rounded-xl text-gold-500 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-luxury-black dark:text-white">Flagship Showroom</h4>
                    <p className="mt-0.5">Grand Heritage Arcade, Suite 101, MG Road, Bangalore, KA - 560001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gold-50 dark:bg-stone-900 rounded-xl text-gold-500 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-luxury-black dark:text-white">Business Hours</h4>
                    <p className="mt-0.5">Monday - Saturday: 10:30 AM - 8:30 PM</p>
                    <p className="mt-0.5">Sunday Showroom Hours: 11:30 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-luxury-charcoal p-6 sm:p-8 rounded-2xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-luxury-black dark:text-white border-b border-gold-100/10 dark:border-stone-800/20 pb-3">
                Send a Message
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Mobile (Optional)</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white font-medium"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Custom Order Consult">Bespoke Design / Custom Consultation</option>
                      <option value="Bridal Booking">Bridal Lounge Booking</option>
                      <option value="Feedback">Store Feedback</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase">Your Message *</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Details of your request..."
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white min-h-[120px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-200 text-stone-950 font-bold uppercase tracking-wider py-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? "Sending..." : "Submit Message"}
                  <Send size={12} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Visit Store section Map */}
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold text-luxury-black dark:text-white">
            Showroom Location Map
          </h3>
          <div className="rounded-3xl overflow-hidden border border-gold-200/50 dark:border-stone-850/60 shadow-lg aspect-[16/9] md:aspect-[21/9] bg-stone-100 dark:bg-stone-950">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9254395892557!2d77.6083161!3d12.976594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1680d2260f87%3A0x6e287ff27d2c3ae9!2sMG%20Road%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "contrast(1.1) brightness(0.95)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Showroom Location Map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};
