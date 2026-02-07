import React, { useState } from 'react';
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ChatBubbleBottomCenterTextIcon,
    PaperAirplaneIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { enquiryAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            await enquiryAPI.createEnquiry(formData);
            setStatus('success');
            toast.success('Message sent! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });

            // Reset success status after 3 seconds to allow new submissions
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error('Contact form error:', error);
            setStatus('error');
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        }
    };

    const contactInfo = [
        {
            icon: <PhoneIcon className="w-6 h-6" />,
            title: 'Call Us',
            detail: '+91 9205601869',
            subDetail: 'Mon - Fri, 9am - 6pm',
            color: 'bg-blue-50 text-blue-600'
        },
        {
            icon: <EnvelopeIcon className="w-6 h-6" />,
            title: 'Email Us',
            detail: 'Arunvashisth80@gmail.com',
            subDetail: 'Online support 24/7',
            color: 'bg-orange-50 text-orange-600'
        },
        {
            icon: <MapPinIcon className="w-6 h-6" />,
            title: 'Visit Us',
            detail: 'Rohini, Delhi',
            subDetail: 'Delhi, India',
            color: 'bg-emerald-50 text-emerald-600'
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 mesh-gradient">
            <div className="container-custom">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16 px-4">
                    <h1 className="text-5xl md:text-7xl font-black text-[var(--charcoal)] mb-6 tracking-tighter">
                        Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--vibe-accent)] to-[var(--charcoal)]">Touch</span>
                    </h1>
                    <p className="text-xl text-stone-500 font-medium">
                        Have a question or feedback? We'd love to hear from you.
                        Our professional team is here to help you scaling your business.
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4">
                    {contactInfo.map((info, index) => (
                        <div
                            key={index}
                            className="bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-[2rem] shadow-xl shadow-black/5 hover-lift transition-all duration-500"
                        >
                            <div className={`w-14 h-14 ${info.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                                {info.icon}
                            </div>
                            <h3 className="text-xl font-black text-[var(--charcoal)] mb-2 tracking-tight">{info.title}</h3>
                            <p className="text-[var(--charcoal)] font-bold mb-1">{info.detail}</p>
                            <p className="text-sm text-stone-400 font-medium">{info.subDetail}</p>
                        </div>
                    ))}
                </div>

                {/* Main Section: Form & Meta */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start px-4">
                    {/* Form Side */}
                    <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-black/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--vibe-accent)]/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-2">Full Name</label>
                                    <input
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-premium py-4"
                                        placeholder="Arun Vashisth"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-2">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-premium py-4"
                                        placeholder="arun@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-2">Subject</label>
                                <input
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="input-premium py-4"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-2">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="input-premium py-4 resize-none"
                                    placeholder="Tell us about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="btn-premium w-full py-5 text-base shadow-2xl shadow-vibe-accent/30 group"
                            >
                                {status === 'sending' ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-[var(--charcoal)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : status === 'success' ? (
                                    <span className="flex items-center gap-2">
                                        ✅ Message Received
                                    </span>
                                ) : (
                                    <>
                                        <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        Dispatch Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Social & FAQ Side */}
                    <div className="space-y-10 py-6">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-black text-[var(--charcoal)] tracking-tight">Support Ecosystem</h2>
                            <p className="text-lg text-stone-500 font-medium leading-relaxed">
                                Connect with us across our digital platforms. We typically respond within 2 hours during business hours.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />,
                                    label: "Live Chat",
                                    desc: "Available for urgent vendor enquiries.",
                                    link: "#"
                                },
                                {
                                    icon: <GlobeAltIcon className="w-5 h-5" />,
                                    label: "Global Status",
                                    desc: "Check our system up-time and API health.",
                                    link: "#"
                                }
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.link}
                                    className="flex items-start gap-6 p-6 rounded-3xl hover:bg-white/50 transition-all border border-transparent hover:border-white group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-[var(--charcoal)] group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[var(--charcoal)] text-lg tracking-tight mb-1">{item.label}</h4>
                                        <p className="text-stone-400 font-medium">{item.desc}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Decoration */}
                        <div className="p-8 rounded-[2.5rem] bg-[var(--charcoal)] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--vibe-accent)]/20 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="text-2xl font-black mb-4 relative z-10">Direct Vendor Hotline</h4>
                            <p className="text-stone-400 mb-6 relative z-10 leading-relaxed font-medium">
                                Are you a registered vendor? Use your dashboard's 1-click support for priority response.
                            </p>
                            <button className="text-[var(--vibe-accent)] font-black uppercase tracking-widest text-[11px] flex items-center gap-2 hover:gap-3 transition-all relative z-10">
                                Go to Dashboard <span className="text-lg">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
