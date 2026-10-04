"use client";

import React from 'react';
import { Leaf, Recycle, HeartHandshake, Lightbulb, ArrowRight } from 'lucide-react'; 
import { useRouter } from 'next/navigation';
import StayUpdatedSection from '@/components/StayUpdatedSection';

const AboutPage = () => {
  const router = useRouter(); 
  return (
    <div className="py-6 space-y-16 text-[#1f1c18] dark:text-[#f4f0ea]">
      {/* Hero Section for About Page */}
      <div className="relative overflow-hidden bg-[#f1e9dc] dark:bg-[#18211c] py-16 md:py-24 rounded-2xl border border-[#e7e0d5] dark:border-[#2a3d33] shadow-card">
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#8d6b4f] dark:text-[#d4a373] mb-3">
            Our Philosophy
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium leading-tight mb-6 text-[#1f1c18] dark:text-[#f4f0ea] tracking-tight">
            Nurturing a <span className="text-[#2f4739] dark:text-[#489a69] italic font-serif">Greener</span> Tomorrow
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-[#4a443c] dark:text-[#d8d0c3] font-normal leading-relaxed">
            At The Green Turtles, we believe every conscious choice makes a monumental difference. Discover our passion for making verified sustainable products discoverable and accessible.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white dark:bg-[#1a241f] rounded-2xl border border-[#e7e0d5] dark:border-[#2a3d33] p-8 md:p-14 shadow-card">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="lg:w-1/2 w-full">
            <div className="relative">
              <img
                src="/mission.jpg"
                alt="Our Mission"
                className="rounded-xl border border-[#e7e0d5] dark:border-[#2a3d33] shadow-card w-full h-[380px] object-cover"
              />
            </div>
          </div>
          <div className="lg:w-1/2 space-y-4">
            <div className="eyebrow">
              <Leaf className="w-4 h-4" /> Our Mission
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1f1c18] dark:text-[#f4f0ea] leading-tight">
              Saving the planet, one mindful choice at a time.
            </h2>
            <p className="text-base md:text-lg text-[#4a443c] dark:text-[#d8d0c3] leading-relaxed font-normal">
              The Green Turtles is your curated online marketplace for authentic sustainable and eco-friendly products. Our mission is to make conscious living transparent, trustworthy, and rewarding.
            </p>
            <p className="text-base text-[#5e574d] dark:text-[#a49b8f] leading-relaxed font-normal">
              We carefully curate goods from circular textiles and zero-waste living essentials to clean technology, verifying every claim against strict environmental and ethical standards.
            </p>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="eyebrow">
            Built on Integrity
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1f1c18] dark:text-[#f4f0ea]">
            Our Core <span className="text-[#2f4739] dark:text-[#489a69] italic font-serif">Values</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Recycle, title: 'Sustainability', desc: 'Committed to products and packaging that protect our planet’s future.' },
            { icon: HeartHandshake, title: 'Integrity', desc: 'Transparent claims, verified certifications, and 0% greenwashing.' },
            { icon: Lightbulb, title: 'Innovation', desc: 'Championing circular design, natural materials, and carbon-negative tech.' },
            { icon: Leaf, title: 'Community', desc: 'Building a shared collective of conscious consumers and ethical makers.' }
          ].map((value, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1a241f] border border-[#e7e0d5] dark:border-[#2a3d33] p-8 rounded-xl text-center hover:border-[#2f4739] dark:hover:border-[#489a69] transition shadow-card group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#f7f4ee] dark:bg-[#223028] border border-[#ede4d5] dark:border-[#2f4739] flex items-center justify-center mx-auto mb-5 text-[#2f4739] dark:text-[#489a69] group-hover:scale-110 transition duration-300">
                <value.icon className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1f1c18] dark:text-[#f4f0ea] mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-[#5e574d] dark:text-[#a49b8f] font-normal leading-relaxed">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative overflow-hidden bg-[#2f4739] dark:bg-[#1a2c21] border border-[#2f4739] rounded-2xl p-10 md:p-16 text-center shadow-card text-[#f7f1e6]">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#f7f1e6] mb-4 relative z-10">
          Join The Green Turtles Movement!
        </h2>
        <p className="text-base sm:text-lg text-[#f7f1e6]/90 max-w-xl mx-auto mb-8 relative z-10 font-normal leading-relaxed">
          Every choice matters. Connect with our community and discover how simple choosing better can be.
        </p>
        <div className="flex flex-wrap justify-center gap-4 relative z-10">
          <button
            onClick={() => router.push('/contact')}
            className="bg-[#f7f1e6] hover:bg-white text-[#2f4739] font-semibold py-4 px-8 rounded-lg shadow-soft transition active:scale-95 text-base"
          >
            Get in Touch
          </button>
          <button
            onClick={() => router.push('/why-partner-us')}
            className="bg-transparent border border-[#f7f1e6] hover:bg-[#f7f1e6]/10 text-[#f7f1e6] font-semibold py-4 px-8 rounded-lg transition active:scale-95 text-base"
          >
            Partner With Us
          </button>
        </div>
      </div>

      {/* STAY UPDATED SECTION */}
      <StayUpdatedSection />
    </div>
  );
};

export default AboutPage;
