'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX, Settings, RefreshCw, MessageCircle, Home, Brain, Camera, Gamepad2, Users, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface VoiceCommand {
  command: string
  action: string
  description: string
  aliases: string[]
  category: 'navigation' | 'feature' | 'accessibility' | 'general'
}

interface VoiceSession {
  isListening: boolean
  isProcessing: boolean
  lastCommand: string
  confidence: number
  feedback: string
}

const voiceCommands: VoiceCommand[] = [
  {
    command: 'go home',
    action: 'navigate:/',
    description: 'Navigate to the home page',
    aliases: ['home', 'go to home', 'take me home', 'main page'],
    category: 'navigation'
  },
  {
    command: 'start assessment',
    action: 'navigate:/assessment',
    description: 'Open the AI assessment tool',
    aliases: ['assessment', 'test', 'evaluation', 'go to assessment'],
    category: 'feature'
  },
  {
    command: 'open video analysis',
    action: 'navigate:/video-analysis',
    description: 'Launch video behavior analysis',
    aliases: ['video', 'analyze video', 'video analysis', 'behavior analysis'],
    category: 'feature'
  },
  {
    command: 'play games',
    action: 'navigate:/games',
    description: 'Access cognitive games',
    aliases: ['games', 'cognitive games', 'play', 'activities'],
    category: 'feature'
  },
  {
    command: 'show dashboard',
    action: 'navigate:/dashboard',
    description: 'View progress dashboard',
    aliases: ['dashboard', 'progress', 'stats', 'my progress'],
    category: 'feature'
  },
  {
    command: 'open forum',
    action: 'navigate:/forum',
    description: 'Access parent community',
    aliases: ['forum', 'community', 'chat', 'parents'],
    category: 'feature'
  },
  {
    command: 'ask chatbot',
    action: 'navigate:/chatbot',
    description: 'Talk to AI assistant',
    aliases: ['chatbot', 'ask question', 'help', 'assistant'],
    category: 'feature'
  },
  {
    command: 'increase text size',
    action: 'accessibility:increase-font',
    description: 'Make text larger for better readability',
    aliases: ['bigger text', 'larger font', 'zoom text', 'increase font'],
    category: 'accessibility'
  },
  {
    command: 'decrease text size',
    action: 'accessibility:decrease-font',
    description: 'Make text smaller',
    aliases: ['smaller text', 'smaller font', 'decrease font'],
    category: 'accessibility'
  },
  {
    command: 'high contrast mode',
    action: 'accessibility:high-contrast',
    description: 'Toggle high contrast for better visibility',
    aliases: ['contrast', 'high contrast', 'better visibility'],
    category: 'accessibility'
  },
  {
    command: 'read page',
    action: 'accessibility:read-page',
    description: 'Read current page content aloud',
    aliases: ['read this', 'read aloud', 'speak page', 'text to speech'],
    category: 'accessibility'
  }
]

export default function VoiceNavigationComponent() {
  const [voiceSession, setVoiceSession] = useState<VoiceSession>({
    isListening: false,
    isProcessing: false,
    lastCommand: '',
    confidence: 0,
    feedback: ''
  })
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [isSpeechSynthesisEnabled, setIsSpeechSynthesisEnabled] = useState(true)
  const [recognitionSupported, setRecognitionSupported] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const speechSynthesis = window.speechSynthesis

    if (SpeechRecognition) {
      setRecognitionSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setVoiceSession(prev => ({ ...prev, isListening: true, feedback: 'Listening...' }))
      }

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        const confidence = event.results[0][0].confidence
        
        setVoiceSession(prev => ({
          ...prev,
          isListening: false,
          isProcessing: true,
          lastCommand: transcript,
          confidence: confidence
        }))

        processVoiceCommand(transcript, confidence)
      }

      recognitionRef.current.onerror = (event: any) => {
        setVoiceSession(prev => ({
          ...prev,
          isListening: false,
          isProcessing: false,
          feedback: `Speech recognition error: ${event.error}`
        }))
        speak(`Sorry, I didn't catch that. Please try again.`)
      }

      recognitionRef.current.onend = () => {
        setVoiceSession(prev => ({ ...prev, isListening: false }))
      }
    }

    if (speechSynthesis) {
      synthRef.current = speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const processVoiceCommand = (transcript: string, confidence: number) => {
    const command = findMatchingCommand(transcript)
    
    if (command && confidence > 0.7) {
      executeCommand(command, transcript)
      setVoiceSession(prev => ({
        ...prev,
        isProcessing: false,
        feedback: `Executing: ${command.description}`
      }))
    } else if (confidence <= 0.7) {
      setVoiceSession(prev => ({
        ...prev,
        isProcessing: false,
        feedback: `Low confidence. Did you mean: "${findBestMatch(transcript)?.command}"?`
      }))
      speak(`I'm not sure I understood. Did you mean ${findBestMatch(transcript)?.command}?`)
    } else {
      setVoiceSession(prev => ({
        ...prev,
        isProcessing: false,
        feedback: 'Command not recognized. Try saying "help" for available commands.'
      }))
      speak('Command not recognized. Say help to hear available commands.')
    }

    setTimeout(() => {
      setVoiceSession(prev => ({ ...prev, feedback: '' }))
    }, 5000)
  }

  const findMatchingCommand = (transcript: string): VoiceCommand | null => {
    const cleanTranscript = transcript.toLowerCase().trim()
    
    return voiceCommands.find(cmd => {
      const allPhrases = [cmd.command, ...cmd.aliases]
      return allPhrases.some(phrase => {
        const cleanPhrase = phrase.toLowerCase()
        return cleanTranscript.includes(cleanPhrase) || 
               cleanPhrase.includes(cleanTranscript) ||
               levenshteinDistance(cleanTranscript, cleanPhrase) <= 2
      })
    }) || null
  }

  const findBestMatch = (transcript: string): VoiceCommand | null => {
    let bestMatch = null
    let bestScore = Infinity
    
    voiceCommands.forEach(cmd => {
      const score = levenshteinDistance(transcript.toLowerCase(), cmd.command.toLowerCase())
      if (score < bestScore) {
        bestScore = score
        bestMatch = cmd
      }
    })
    
    return bestScore <= 5 ? bestMatch : null
  }

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  const executeCommand = (command: VoiceCommand, originalTranscript: string) => {
    const [action, param] = command.action.split(':')
    
    speak(command.description)
    
    switch (action) {
      case 'navigate':
        router.push(param)
        break
        
      case 'accessibility':
        executeAccessibilityCommand(param)
        break
        
      default:
        speak('Command recognized but not implemented yet.')
    }
  }

  const executeAccessibilityCommand = (param: string) => {
    switch (param) {
      case 'increase-font':
        document.documentElement.style.fontSize = 
          (parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.1) + 'px'
        speak('Text size increased')
        break
        
      case 'decrease-font':
        document.documentElement.style.fontSize = 
          (parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.9) + 'px'
        speak('Text size decreased')
        break
        
      case 'high-contrast':
        document.body.classList.toggle('high-contrast')
        speak('High contrast mode toggled')
        break
        
      case 'read-page':
        const pageText = document.body.innerText.substring(0, 500)
        speak(pageText)
        break
    }
  }

  const speak = (text: string) => {
    if (!isSpeechSynthesisEnabled || !synthRef.current) return
    
    synthRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8
    synthRef.current.speak(utterance)
  }

  const startListening = () => {
    if (!recognitionSupported || !recognitionRef.current) {
      speak('Speech recognition is not supported in this browser.')
      return
    }

    if (voiceSession.isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  const toggleVoiceNavigation = () => {
    setIsVoiceEnabled(!isVoiceEnabled)
    if (!isVoiceEnabled) {
      speak('Voice navigation enabled. Say a command or ask for help.')
    } else {
      speak('Voice navigation disabled.')
    }
  }

  const filteredCommands = selectedCategory === 'all' 
    ? voiceCommands 
    : voiceCommands.filter(cmd => cmd.category === selectedCategory)

  if (!isVoiceEnabled) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={toggleVoiceNavigation}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
          title="Enable Voice Navigation"
        >
          <Mic className="w-6 h-6" />
        </button>
      </motion.div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎤 Voice Navigation Assistant</h2>
              <p className="text-blue-100">Control the platform with your voice for hands-free navigation</p>
            </div>
            <button
              onClick={toggleVoiceNavigation}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Voice Session Status */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Voice Session Status</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSpeechSynthesisEnabled(!isSpeechSynthesisEnabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    isSpeechSynthesisEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}
                  title="Toggle Speech Output"
                >
                  {isSpeechSynthesisEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  title="Reset Voice Engine"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                  voiceSession.isListening ? 'bg-green-500 animate-pulse' : 
                  voiceSession.isProcessing ? 'bg-yellow-500 animate-spin' : 'bg-gray-300'
                }`}></div>
                <div className="text-sm font-medium text-gray-900">
                  {voiceSession.isListening ? 'Listening...' : 
                   voiceSession.isProcessing ? 'Processing...' : 'Ready'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {voiceSession.confidence > 0 ? `${Math.round(voiceSession.confidence * 100)}%` : '--'}
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {recognitionSupported ? '✓' : '✗'}
                </div>
                <div className="text-sm text-gray-600">Browser Support</div>
              </div>
            </div>

            {voiceSession.lastCommand && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <div className="text-sm font-medium text-blue-800 mb-1">Last Command:</div>
                <div className="text-blue-700">"{voiceSession.lastCommand}"</div>
              </div>
            )}

            {voiceSession.feedback && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <div className="text-green-800">{voiceSession.feedback}</div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={startListening}
                disabled={!recognitionSupported}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all ${
                  voiceSession.isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500'
                }`}
              >
                {voiceSession.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{voiceSession.isListening ? 'Stop Listening' : 'Start Listening'}</span>
              </button>
            </div>
          </div>

          {/* Command Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['all', 'navigation', 'feature', 'accessibility', 'general'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Commands' : `${category} Commands`}
              </button>
            ))}
          </div>

          {/* Voice Commands List */}
          <div className="max-h-96 overflow-y-auto">
            <div className="grid gap-3">
              {filteredCommands.map((command, index) => (
                <motion.div
                  key={command.command}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">"{command.command}"</h4>
                      <p className="text-sm text-gray-600">{command.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      command.category === 'navigation' ? 'bg-blue-100 text-blue-700' :
                      command.category === 'feature' ? 'bg-green-100 text-green-700' :
                      command.category === 'accessibility' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {command.category}
                    </span>
                  </div>
                  {command.aliases.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs text-gray-500">Also try:</span>
                      {command.aliases.slice(0, 3).map((alias, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          "{alias}"
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}