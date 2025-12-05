'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
};

type CoreValue = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'John Doe',
    role: 'CEO & Founder',
    image: '/team-1.jpg',
    bio: '10+ years of experience in agricultural technology and pest management.'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Lead Entomologist',
    image: '/team-2.jpg',
    bio: 'Expert in pest behavior and integrated pest management solutions.'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    role: 'Tech Lead',
    image: '/team-3.jpg',
    bio: 'Specializes in developing cutting-edge pest detection algorithms.'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    role: 'Agricultural Specialist',
    image: '/team-4.jpg',
    bio: 'Focuses on sustainable farming practices and crop protection.'
  }
];

const coreValues: CoreValue[] = [
  {
    id: 1,
    title: 'Innovation',
    description: 'We constantly push boundaries to develop cutting-edge pest management solutions.',
    icon: '💡'
  },
  {
    id: 2,
    title: 'Sustainability',
    description: 'We prioritize eco-friendly and sustainable pest control methods.',
    icon: '🌱'
  },
  {
    id: 3,
    title: 'Excellence',
    description: 'We strive for the highest standards in all our services and products.',
    icon: '✨'
  },
  {
    id: 4,
    title: 'Integrity',
    description: 'We maintain transparency and honesty in all our operations.',
    icon: '🤝'
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/farm pic.jpg"
            alt="Farm field"
            fill
            className="object-cover"
            priority
            quality={100}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQ0NGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAIAAgAMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAAB//EACQQAAEDAwQBBQAAAAAAAAAAAAECAwQABRESIQYxQRMiUWGR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAYEQEBAQEBAAAAAAAAAAAAAAAAARECIf/aAAwDAQACEQMRAD8A1qiiq7kF3j2W0SLhKz0j0oHdZ9hH7QNvF3K4wYJQmW+lsrOkD3PwO5qM4tyiXf7s2xYrY+9b0KxJmPjpbHhA9z8VnXHrVcOZ3x2VcXFKbT9q8j0oH8QK9BsN4tVulJtUZtMRtB0JwMJWfO/3zQ//2Q=="
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        
        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
              >
                About PestLink
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-gray-200 max-w-3xl"
              >
                Revolutionizing pest management through technology and innovation
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="space-y-6 text-gray-300">
              <p>
                Founded in 2023, PestLink was born out of a simple yet powerful idea: to transform the way farmers and agricultural businesses manage pest control. Our journey began when our founder, an agronomist with years of field experience, witnessed firsthand the devastating impact of pest infestations on crop yields and farmers' livelihoods.
              </p>
              <p>
                What started as a small team of passionate agronomists and technologists has now grown into a leading force in agricultural technology. Today, PestLink serves farmers across the region, helping them protect their crops and maximize their yields through intelligent pest management solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900 p-8 rounded-xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-emerald-400">Our Mission</h3>
              <p className="text-gray-300">
                To empower farmers with innovative, sustainable, and effective pest management solutions that increase agricultural productivity while minimizing environmental impact.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900 p-8 rounded-xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-emerald-400">Our Vision</h3>
              <p className="text-gray-300">
                To become the global leader in smart pest management solutions, creating a future where agriculture thrives in harmony with nature through sustainable practices.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {coreValues.map((value) => (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: value.id * 0.1 }}
                className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: member.id * 0.1 }}
                className="bg-gray-900 rounded-xl overflow-hidden"
              >
                <div className="h-64 bg-gray-700 relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to a solid color if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23374151%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%22100%22%20font-family%3D%22Arial%22%20font-size%3D%2280%22%20fill%3D%22%236b7280%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E{member.name.charAt(0)}%3C%2Ftext%3E%3C%2Fsvg%3E';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-emerald-400 mb-3">{member.role}</p>
                  <p className="text-gray-400">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

<Footer />
    </div>
  );
}
