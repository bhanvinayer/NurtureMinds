'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Monitor, Headset, Smartphone, Play, Pause, RotateCw, ZoomIn, ZoomOut, Settings, Info } from 'lucide-react'

interface ARExperience {
  id: string
  title: string
  description: string
  type: 'ar' | 'vr'
  category: 'communication' | 'social-skills' | 'sensory' | 'cognitive'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  isAvailable: boolean
  requiresCamera: boolean
}

interface VRScene {
  id: string
  name: string
  description: string
  environment: string
  activities: string[]
  skillsFocus: string[]
  isLoaded: boolean
}

const arExperiences: ARExperience[] = [
  {
    id: 'emotion-recognition-ar',
    title: 'AR Emotion Recognition',
    description: 'Use your camera to practice recognizing facial expressions with interactive AR overlays',
    type: 'ar',
    category: 'communication',
    difficulty: 'beginner',
    duration: '10-15 min',
    isAvailable: true,
    requiresCamera: true
  },
  {
    id: 'social-scenarios-ar',
    title: 'AR Social Scenarios',
    description: 'Practice social interactions with AR characters in real-world environments',
    type: 'ar',
    category: 'social-skills',
    difficulty: 'intermediate',
    duration: '15-20 min',
    isAvailable: true,
    requiresCamera: true
  },
  {
    id: 'spatial-learning-ar',
    title: 'AR Spatial Learning',
    description: 'Explore 3D objects and spatial relationships through augmented reality',
    type: 'ar',
    category: 'cognitive',
    difficulty: 'beginner',
    duration: '8-12 min',
    isAvailable: true,
    requiresCamera: true
  }
]

const vrScenes: VRScene[] = [
  {
    id: 'calm-forest',
    name: 'Calm Forest',
    description: 'A peaceful forest environment for sensory regulation and mindfulness',
    environment: 'nature',
    activities: ['Deep breathing', 'Animal sounds', 'Tree identification', 'Meditation'],
    skillsFocus: ['Emotional regulation', 'Sensory processing', 'Mindfulness'],
    isLoaded: true
  },
  {
    id: 'playground-social',
    name: 'Virtual Playground',
    description: 'Practice social interactions in a safe, controlled playground environment',
    environment: 'social',
    activities: ['Peer interaction', 'Turn-taking games', 'Communication practice'],
    skillsFocus: ['Social skills', 'Communication', 'Peer interaction'],
    isLoaded: true
  },
  {
    id: 'learning-lab',
    name: 'Interactive Learning Lab',
    description: 'Hands-on science experiments and cognitive challenges in VR',
    environment: 'educational',
    activities: ['Science experiments', 'Problem solving', 'Pattern recognition'],
    skillsFocus: ['Cognitive skills', 'Problem solving', 'STEM learning'],
    isLoaded: false
  }
]

export default function ARVRPage() {
  const [activeTab, setActiveTab] = useState<'ar' | 'vr'>('ar')
  const [selectedExperience, setSelectedExperience] = useState<ARExperience | null>(null)
  const [selectedVRScene, setSelectedVRScene] = useState<VRScene | null>(null)
  const [isARActive, setIsARActive] = useState(false)
  const [isVRActive, setIsVRActive] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const [deviceSupport, setDeviceSupport] = useState({
    hasCamera: false,
    hasAccelerometer: false,
    hasVRSupport: false,
    isMobile: false
  })
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Check device capabilities
    const checkDeviceSupport = async () => {
      const hasCamera = navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      const hasAccelerometer = 'DeviceMotionEvent' in window
      const hasVRSupport = 'xr' in navigator
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      setDeviceSupport({
        hasCamera: !!hasCamera,
        hasAccelerometer,
        hasVRSupport: !!hasVRSupport,
        isMobile
      })
    }
    
    checkDeviceSupport()
  }, [])

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      })
      setCameraPermission('granted')
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      return stream
    } catch (error) {
      setCameraPermission('denied')
      console.error('Camera access denied:', error)
      return null
    }
  }

  const startARExperience = async (experience: ARExperience) => {
    if (experience.requiresCamera && cameraPermission !== 'granted') {
      const stream = await requestCameraPermission()
      if (!stream) return
    }
    
    setSelectedExperience(experience)
    setIsARActive(true)
  }

  const stopARExperience = () => {
    setIsARActive(false)
    setSelectedExperience(null)
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
  }

  const startVRExperience = (scene: VRScene) => {
    setSelectedVRScene(scene)
    setIsVRActive(true)
  }

  const stopVRExperience = () => {
    setIsVRActive(false)
    setSelectedVRScene(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🥽 Immersive Learning Experiences
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Step into the future of learning with Augmented Reality and Virtual Reality experiences 
            designed specifically for neurodivergent children.
          </p>
        </motion.div>

        {/* Device Support Check */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 mb-8 shadow-lg"
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Device Compatibility
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded-lg text-center ${deviceSupport.hasCamera ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <Camera className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm font-medium">Camera</div>
              <div className="text-xs">{deviceSupport.hasCamera ? 'Available' : 'Not Available'}</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${deviceSupport.hasAccelerometer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <Smartphone className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm font-medium">Motion Sensors</div>
              <div className="text-xs">{deviceSupport.hasAccelerometer ? 'Available' : 'Not Available'}</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${deviceSupport.hasVRSupport ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
              <Headset className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm font-medium">VR Support</div>
              <div className="text-xs">{deviceSupport.hasVRSupport ? 'Native VR' : 'Web VR'}</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${deviceSupport.isMobile ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
              <Monitor className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm font-medium">Platform</div>
              <div className="text-xs">{deviceSupport.isMobile ? 'Mobile' : 'Desktop'}</div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('ar')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'ar'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>Augmented Reality</span>
            </button>
            <button
              onClick={() => setActiveTab('vr')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'vr'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Headset className="w-5 h-5" />
              <span>Virtual Reality</span>
            </button>
          </div>
        </div>

        {/* AR Section */}
        {activeTab === 'ar' && (
          <AnimatePresence mode="wait">
            {!isARActive ? (
              <motion.div
                key="ar-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {arExperiences.map((experience, index) => (
                    <motion.div
                      key={experience.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-purple-100"
                    >
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.title}</h3>
                        <p className="text-gray-600 text-sm">{experience.description}</p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Category:</span>
                          <span className="font-medium capitalize">{experience.category.replace('-', ' ')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium">{experience.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Difficulty:</span>
                          <span className={`font-medium capitalize ${
                            experience.difficulty === 'beginner' ? 'text-green-600' :
                            experience.difficulty === 'intermediate' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>{experience.difficulty}</span>
                        </div>
                      </div>

                      {experience.requiresCamera && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2 text-blue-800 text-sm">
                            <Camera className="w-4 h-4" />
                            <span>Requires camera access</span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => startARExperience(experience)}
                        disabled={!experience.isAvailable || (experience.requiresCamera && !deviceSupport.hasCamera)}
                        className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                          experience.isAvailable && (!experience.requiresCamera || deviceSupport.hasCamera)
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Play className="w-4 h-4" />
                        <span>Start AR Experience</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ar-experience"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* AR Experience Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold">{selectedExperience?.title}</h3>
                      <p className="text-purple-100">{selectedExperience?.description}</p>
                    </div>
                    <button
                      onClick={stopARExperience}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                    >
                      <Pause className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* AR Camera View */}
                <div className="relative p-6">
                  <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full"
                    />
                    
                    {/* AR Overlays */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Face Detection Frame */}
                      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-green-500 rounded-lg">
                        <div className="absolute -top-8 left-0 bg-green-500 text-white px-2 py-1 rounded text-sm">
                          Face Detected ✓
                        </div>
                      </div>
                      
                      {/* Emotion Indicators */}
                      <div className="absolute top-4 right-4 bg-black/50 text-white rounded-lg p-3">
                        <div className="text-sm font-medium mb-2">Detected Emotions</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-center">
                            <span>😊 Happy</span>
                            <div className="w-16 h-1 bg-gray-600 rounded">
                              <div className="w-3/4 h-1 bg-yellow-400 rounded"></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>😮 Surprised</span>
                            <div className="w-16 h-1 bg-gray-600 rounded">
                              <div className="w-1/4 h-1 bg-blue-400 rounded"></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>😐 Neutral</span>
                            <div className="w-16 h-1 bg-gray-600 rounded">
                              <div className="w-1/2 h-1 bg-gray-400 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white rounded-lg p-4 max-w-md">
                        <p className="text-sm text-center">
                          Try different facial expressions! The AI will detect and analyze your emotions in real-time.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AR Controls */}
                  <div className="flex justify-center space-x-4 mt-4">
                    <button className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-3 rounded-lg transition-colors">
                      <RotateCw className="w-5 h-5" />
                    </button>
                    <button className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-3 rounded-lg transition-colors">
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <button className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-3 rounded-lg transition-colors">
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <button className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-3 rounded-lg transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* VR Section */}
        {activeTab === 'vr' && (
          <AnimatePresence mode="wait">
            {!isVRActive ? (
              <motion.div
                key="vr-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vrScenes.map((scene, index) => (
                    <motion.div
                      key={scene.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-blue-100"
                    >
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{scene.name}</h3>
                          <span className={`w-3 h-3 rounded-full ${scene.isLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        </div>
                        <p className="text-gray-600 text-sm">{scene.description}</p>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Activities:</h4>
                          <div className="flex flex-wrap gap-1">
                            {scene.activities.map((activity, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs">
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Skills Focus:</h4>
                          <div className="flex flex-wrap gap-1">
                            {scene.skillsFocus.map((skill, idx) => (
                              <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => startVRExperience(scene)}
                        disabled={!scene.isLoaded}
                        className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                          scene.isLoaded
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Headset className="w-4 h-4" />
                        <span>{scene.isLoaded ? 'Enter VR Scene' : 'Loading...'}</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="vr-experience"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* VR Experience Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold">{selectedVRScene?.name}</h3>
                      <p className="text-blue-100">{selectedVRScene?.description}</p>
                    </div>
                    <button
                      onClick={stopVRExperience}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                    >
                      <Pause className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* VR Scene Simulation */}
                <div className="relative p-6">
                  <div className="relative bg-gradient-to-b from-sky-300 to-green-300 rounded-xl overflow-hidden aspect-video">
                    {/* 3D Scene Simulation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4">🌲🌲🌲</div>
                        <div className="text-2xl mb-2">🦋 🐛 🦋</div>
                        <div className="text-4xl">🌸 🌼 🌸</div>
                      </div>
                    </div>

                    {/* VR Interaction Points */}
                    <div className="absolute top-4 left-4 bg-white/90 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-900 mb-2">Interaction Points</div>
                      <div className="space-y-1 text-xs text-gray-700">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span>Tree (Touch to hear sounds)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Butterfly (Follow with gaze)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Flowers (Smell interaction)</span>
                        </div>
                      </div>
                    </div>

                    {/* VR Progress */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white rounded-lg p-3">
                      <div className="text-sm font-medium mb-2">Session Progress</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-600 rounded">
                          <div className="w-1/3 h-2 bg-green-400 rounded"></div>
                        </div>
                        <span className="text-xs">5/15 min</span>
                      </div>
                    </div>

                    {/* VR Instructions */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white rounded-lg p-4 max-w-md">
                      <p className="text-sm text-center">
                        Use head movements to look around. Focus on interactive elements to engage with them.
                      </p>
                    </div>
                  </div>

                  {/* VR Controls */}
                  <div className="flex justify-center space-x-4 mt-4">
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-3 rounded-lg transition-colors">
                      <RotateCw className="w-5 h-5" />
                    </button>
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-3 rounded-lg transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-3 rounded-lg transition-colors">
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}