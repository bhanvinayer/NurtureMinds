'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Camera, Users, MessageCircle, BarChart, Sparkles } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Assessments",
      description: "Personalized cognitive assessments that adapt to your child's learning style and provide detailed insights.",
      href: "/assessment",
      color: "bg-blue-500"
    },
    {
      icon: Camera,
      title: "Video Behavior Analysis",
      description: "Advanced OpenCV analysis of facial expressions, emotions, and engagement levels from uploaded videos.",
      href: "/video-analysis",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Parent Community",
      description: "Connect with other families, share experiences, and get support from a caring community.",
      href: "/forum",
      color: "bg-purple-500"
    },
    {
      icon: MessageCircle,
      title: "AI Fact Checker",
      description: "Get verified, evidence-based answers about autism, ADHD, dyslexia, and child development.",
      href: "/chatbot",
      color: "bg-orange-500"
    },
    {
      icon: BarChart,
      title: "Progress Dashboard",
      description: "Track your child's development over time with detailed analytics and personalized recommendations.",
      href: "/dashboard",
      color: "bg-teal-500"
    },
    {
      icon: Sparkles,
      title: "Cognitive Games",
      description: "Engaging, adaptive games that build memory, attention, language, and social-emotional skills.",
      href: "/games",
      color: "bg-pink-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nurture Minds
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering neurodiverse children to grow, learn, and connect —<br />
            with AI that understands, not judges.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              href="/assessment" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Assessment
            </Link>
            <Link 
              href="/video-analysis" 
              className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Video Analysis
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Support Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to support your child's neurodivergent journey in one comprehensive platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link href={feature.href} className="block">
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built for Real Families
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nurture Minds combines cutting-edge AI technology with evidence-based approaches to provide 
              personalized support for children with autism, ADHD, dyslexia, and other learning differences. 
              Our platform is designed by families, for families.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">AI-Powered</div>
                <p className="text-gray-600">Advanced machine learning for personalized insights</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">Evidence-Based</div>
                <p className="text-gray-600">Backed by research and clinical best practices</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">Family-Centered</div>
                <p className="text-gray-600">Designed with real families and their needs in mind</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of families already using Nurture Minds to support their children's growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Started Free
              </Link>
              <Link 
                href="/demo" 
                className="border-2 border-white hover:bg-white hover:text-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
