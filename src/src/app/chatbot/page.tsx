'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, Send, Volume2, VolumeX, RotateCcw, CheckCircle, AlertTriangle, Info } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'fact-check'
  sources?: string[]
  confidence?: number
  category?: string
}

interface FactCheckResult {
  claim: string
  verdict: 'TRUE' | 'FALSE' | 'PARTIALLY_TRUE' | 'NEEDS_CONTEXT'
  confidence: number
  explanation: string
  sources: string[]
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: "Hi there! I'm your AI assistant, here to help you learn about neurodiversity and provide evidence-based information. You can ask me anything about autism, ADHD, dyslexia, learning strategies, or request a fact-check on information you've heard. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const quickQuestions = [
    "What are the signs of ADHD in children?",
    "How can I help my autistic child communicate better?",
    "What are effective learning strategies for dyslexia?",
    "Fact-check: Vaccines cause autism",
    "What support services are available?",
    "How do I talk to teachers about my child's needs?"
  ]

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputMessage.trim()
    if (!messageText || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate response based on message content
    let botResponse: Message
    
    if (messageText.toLowerCase().includes('fact-check') || messageText.toLowerCase().includes('is it true')) {
      botResponse = generateFactCheckResponse(messageText)
    } else {
      botResponse = generateChatResponse(messageText)
    }

    setMessages(prev => [...prev, botResponse])
    setIsLoading(false)
  }

  const generateChatResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()
    
    let response = ""
    let category = "general"

    if (lowerMessage.includes('adhd')) {
      category = "adhd"
      response = "ADHD (Attention-Deficit/Hyperactivity Disorder) affects how children focus and control their behavior. Common signs include difficulty paying attention, hyperactivity, and impulsivity. Each child is unique, and with the right support strategies like structured routines, clear expectations, and sometimes medication, children with ADHD can thrive. Would you like specific strategies for home or school?"
    } else if (lowerMessage.includes('autism') || lowerMessage.includes('autistic')) {
      category = "autism"
      response = "Autism is a neurodevelopmental difference that affects communication and social interaction. Autistic children often have unique strengths like attention to detail and deep interests. Support strategies include clear communication, sensory considerations, and celebrating their special interests. Every autistic person is different - it's truly a spectrum! What specific area would you like to know more about?"
    } else if (lowerMessage.includes('dyslexia')) {
      category = "dyslexia"
      response = "Dyslexia is a learning difference that affects reading and language processing. It has nothing to do with intelligence! Effective strategies include multisensory learning, phonics-based instruction, assistive technology, and plenty of encouragement. Many successful people have dyslexia. Would you like some specific learning techniques?"
    } else if (lowerMessage.includes('communication')) {
      response = "Communication support can include visual aids, social stories, clear and simple language, giving processing time, and using your child's interests to engage them. Many children benefit from alternative communication methods like picture cards or apps. The key is finding what works best for your unique child!"
    } else if (lowerMessage.includes('teacher') || lowerMessage.includes('school')) {
      response = "Talking to teachers about your child's needs is so important! Prepare by documenting your child's strengths and challenges, sharing successful strategies from home, and asking about classroom accommodations. Most teachers want to help and appreciate specific information. You can also request meetings with the special education team if needed."
    } else if (lowerMessage.includes('support') || lowerMessage.includes('services')) {
      response = "There are many support services available! These might include special education services at school, speech therapy, occupational therapy, behavioral support, parent support groups, and community programs. Your pediatrician or school counselor can help connect you with local resources. You're not alone in this journey!"
    } else {
      response = "Thank you for your question! I'm here to provide evidence-based information about neurodiversity and learning differences. Could you tell me more specifically what you'd like to know about? I can help with topics like autism, ADHD, dyslexia, learning strategies, or fact-checking information you've heard."
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      category
    }
  }

  const generateFactCheckResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()
    
    let factCheck: FactCheckResult
    
    if (lowerMessage.includes('vaccine') && lowerMessage.includes('autism')) {
      factCheck = {
        claim: "Vaccines cause autism",
        verdict: 'FALSE',
        confidence: 99,
        explanation: "This claim has been thoroughly debunked by extensive scientific research. Multiple large-scale studies involving millions of children have found no link between vaccines and autism. The original study suggesting this connection was fraudulent and has been retracted. Vaccines are safe and crucial for preventing serious diseases.",
        sources: [
          "CDC: Vaccine Safety Studies",
          "American Academy of Pediatrics",
          "The Lancet Retraction Notice",
          "WHO Vaccine Safety Guidelines"
        ]
      }
    } else if (lowerMessage.includes('screen time') && lowerMessage.includes('autism')) {
      factCheck = {
        claim: "Too much screen time causes autism",
        verdict: 'FALSE',
        confidence: 95,
        explanation: "Autism is a neurodevelopmental condition that people are born with - it's not caused by screen time or parenting choices. While excessive screen time can affect any child's development and behavior, it does not cause autism. The signs of autism are often noticed around the same age children start using screens, which may create confusion.",
        sources: [
          "Autism Science Foundation",
          "NIH: Understanding Autism",
          "Journal of Autism Research"
        ]
      }
    } else if (lowerMessage.includes('sugar') && (lowerMessage.includes('adhd') || lowerMessage.includes('hyperactivity'))) {
      factCheck = {
        claim: "Sugar causes ADHD or hyperactivity",
        verdict: 'PARTIALLY_TRUE',
        confidence: 75,
        explanation: "While sugar doesn't cause ADHD, it can temporarily affect behavior in all children by causing blood sugar spikes and crashes. Children with ADHD might be more sensitive to these effects. ADHD is a neurodevelopmental condition with genetic and brain-based causes, not dietary ones. However, a balanced diet can help manage symptoms.",
        sources: [
          "ADHD Foundation",
          "Pediatric Nutrition Guidelines",
          "Journal of Attention Disorders"
        ]
      }
    } else {
      factCheck = {
        claim: "General neurodiversity information",
        verdict: 'NEEDS_CONTEXT',
        confidence: 80,
        explanation: "I'd be happy to fact-check specific claims about autism, ADHD, dyslexia, or other neurodevelopmental conditions. Please share the specific statement you'd like me to verify, and I'll provide evidence-based information with reliable sources.",
        sources: [
          "National Institute of Mental Health",
          "Autism Research Institute",
          "Learning Disabilities Association"
        ]
      }
    }

    return {
      id: Date.now().toString(),
      content: `**FACT-CHECK RESULT**\n\n**Claim:** ${factCheck.claim}\n\n**Verdict:** ${factCheck.verdict}\n\n**Confidence:** ${factCheck.confidence}%\n\n**Explanation:** ${factCheck.explanation}`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'fact-check',
      sources: factCheck.sources,
      confidence: factCheck.confidence
    }
  }

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      setIsSpeaking(true)
      // In a real app, you'd implement text-to-speech for the last bot message
      setTimeout(() => setIsSpeaking(false), 3000)
    }
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: "Chat cleared! How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }])
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'TRUE':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'FALSE':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'PARTIALLY_TRUE':
        return <Info className="w-4 h-4 text-yellow-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'TRUE':
        return 'bg-green-50 border-green-200'
      case 'FALSE':
        return 'bg-red-50 border-red-200'
      case 'PARTIALLY_TRUE':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Assistant & Fact Checker</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get evidence-based information about neurodiversity and fact-check claims with reliable sources
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Quick Questions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions</h3>
              <div className="space-y-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    {question}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={toggleSpeech}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                    title="Text to Speech"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 mx-auto" /> : <Volume2 className="w-4 h-4 mx-auto" />}
                  </button>
                  <button
                    onClick={clearChat}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                    title="Clear Chat"
                  >
                    <RotateCcw className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Messages */}
              <div className="h-96 lg:h-[600px] overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                      }`}>
                        {message.sender === 'user' ? 
                          <User className="w-4 h-4 text-white" /> : 
                          <Bot className="w-4 h-4 text-white" />
                        }
                      </div>
                      
                      <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                        <div className={`rounded-2xl p-4 ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : message.type === 'fact-check'
                            ? `border-2 ${getVerdictColor('NEEDS_CONTEXT')}`
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          {message.type === 'fact-check' ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 font-semibold">
                                {getVerdictIcon('NEEDS_CONTEXT')}
                                Fact-Check Result
                              </div>
                              <div className="whitespace-pre-line text-sm">{message.content}</div>
                              {message.sources && (
                                <div className="pt-2 border-t border-gray-200">
                                  <div className="text-xs font-medium mb-1">Sources:</div>
                                  <ul className="text-xs space-y-1">
                                    {message.sources.map((source, idx) => (
                                      <li key={idx} className="flex items-start gap-1">
                                        <span>•</span>
                                        <span>{source}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="whitespace-pre-line">{message.content}</div>
                          )}
                        </div>
                        
                        <div className={`text-xs text-gray-500 mt-1 ${
                          message.sender === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about autism, ADHD, dyslexia, or request a fact-check..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 text-center">
                  This AI provides educational information and shouldn't replace professional medical advice
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}