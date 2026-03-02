'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Play, Brain, Target, TrendingUp, AlertCircle, CheckCircle, Camera } from 'lucide-react'

export default function VideoAnalysisPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setAnalysisResult(null)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      setAnalysisResult(null)
    }
  }

  const startAnalysis = async () => {
    if (!videoFile) return

    setIsAnalyzing(true)
    setProgress(0)

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 500)

    try {
      // In a real implementation, this would upload to the backend
      // For demo purposes, we'll simulate the analysis
      await new Promise(resolve => setTimeout(resolve, 5000))

      // Mock analysis results
      const mockResult = {
        duration: 45.2,
        behavior_metrics: {
          average_attention: 78.5,
          attention_span_seconds: 180,
          engagement_level: 0.72,
          overall_wellbeing_score: 85,
          stress_indicators: ['Low attention span detected at 15s mark'],
          emotion_distribution: {
            Happy: 0.45,
            Neutral: 0.30,
            Surprised: 0.15,
            Sad: 0.10
          }
        },
        insights: [
          'Child maintained good focus for the first 3 minutes of the session',
          'High engagement levels observed during hands-on activities',
          'Positive emotional state throughout most of the session',
          'Brief attention dip around the midpoint - consider shorter activity blocks'
        ],
        recommendations: [
          'Continue current learning approaches - child is responding well',
          'Try breaking activities into 5-7 minute segments',
          'Include more interactive elements to maintain engagement',
          'Consider morning sessions when attention levels are naturally higher'
        ],
        emotions_timeline: [
          { timestamp: 0, dominant_emotion: 'Neutral', confidence: 0.8 },
          { timestamp: 10, dominant_emotion: 'Happy', confidence: 0.9 },
          { timestamp: 20, dominant_emotion: 'Happy', confidence: 0.85 },
          { timestamp: 30, dominant_emotion: 'Surprised', confidence: 0.7 },
          { timestamp: 40, dominant_emotion: 'Happy', confidence: 0.8 }
        ]
      }

      setProgress(100)
      setAnalysisResult(mockResult)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
      clearInterval(progressInterval)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Camera className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Video Behavior Analysis
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a video of your child during learning or play activities to receive AI-powered insights about 
            attention, engagement, emotions, and behavioral patterns using advanced computer vision technology.
          </p>
        </motion.div>

        {/* Upload Section */}
        {!analysisResult && (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Upload Video for Analysis
            </h2>
            
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {videoFile ? (
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">{videoFile.name}</p>
                    <p className="text-gray-500">Size: {(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); startAnalysis(); }}
                    disabled={isAnalyzing}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Drop your video here or click to browse
                    </p>
                    <p className="text-gray-500">
                      Supports MP4, MOV, AVI files up to 100MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Guidelines */}
            <div className="mt-8 bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">📹 Video Guidelines</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Record 30 seconds to 5 minutes of learning or play activity</li>
                <li>• Ensure good lighting and clear view of the child's face</li>
                <li>• Avoid background noise or distractions when possible</li>
                <li>• Child should be engaged in an activity (reading, playing, etc.)</li>
                <li>• Videos are processed securely and can be deleted anytime</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Analysis Progress */}
        {isAnalyzing && (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-6">
              <Brain className="w-16 h-16 text-blue-600 mx-auto animate-pulse" />
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  AI Analysis in Progress
                </h3>
                <p className="text-gray-600">
                  Analyzing facial expressions, attention patterns, and behavioral cues...
                </p>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{Math.round(progress)}% Complete</p>
            </div>
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Overview Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-gray-500">Attention Span</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(analysisResult.behavior_metrics.attention_span_seconds / 60)}m {analysisResult.behavior_metrics.attention_span_seconds % 60}s
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-gray-500">Engagement</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(analysisResult.behavior_metrics.engagement_level * 100)}%
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-gray-500">Wellbeing</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResult.behavior_metrics.overall_wellbeing_score}/100
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  <span className="text-sm font-medium text-gray-500">Stress Indicators</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResult.behavior_metrics.stress_indicators.length}
                </div>
              </div>
            </div>

            {/* Emotion Distribution */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Emotion Distribution</h3>
              <div className="space-y-4">
                {Object.entries(analysisResult.behavior_metrics.emotion_distribution).map(([emotion, percentage]: [string, any]) => (
                  <div key={emotion} className="flex items-center gap-4">
                    <span className="w-20 text-sm font-medium text-gray-600">{emotion}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12">
                      {Math.round(percentage * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights & Recommendations */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Key Insights
                </h3>
                <ul className="space-y-3">
                  {analysisResult.insights.map((insight: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Recommendations
                </h3>
                <ul className="space-y-3">
                  {analysisResult.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {setAnalysisResult(null); setVideoFile(null)}}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Analyze Another Video
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Download Report
              </button>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                View Progress History
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}