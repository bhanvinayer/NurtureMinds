'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Brain, Zap, Target, Clock, Star, Trophy, Play, Pause, RotateCcw } from 'lucide-react'

interface Game {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: 'memory' | 'attention' | 'processing' | 'language'
  duration: string
  icon: React.ReactNode
  color: string
}

interface MemoryCard {
  id: number
  content: string
  isFlipped: boolean
  isMatched: boolean
}

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'completed'>('menu')
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [level, setLevel] = useState(1)

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)

  const games: Game[] = [
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Match pairs of colorful cards to improve working memory and concentration',
      difficulty: 'Easy',
      category: 'memory',
      duration: '5-10 min',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'attention-focus',
      title: 'Focus Challenge',
      description: 'Follow moving objects and respond to specific patterns to enhance attention',
      difficulty: 'Medium',
      category: 'attention',
      duration: '3-7 min',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'speed-processing',
      title: 'Quick Think',
      description: 'Rapid decision-making games to improve processing speed and reaction time',
      difficulty: 'Hard',
      category: 'processing',
      duration: '2-5 min',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-yellow-500'
    },
    {
      id: 'word-builder',
      title: 'Word Builder',
      description: 'Create words from letters to strengthen language and reading skills',
      difficulty: 'Medium',
      category: 'language',
      duration: '5-15 min',
      icon: <Star className="w-6 h-6" />,
      color: 'bg-purple-500'
    }
  ]

  const initializeMemoryGame = () => {
    const symbols = ['🌟', '🎈', '🌈', '🦋', '🌸', '🎵', '🍎', '⚽']
    const gameCards: MemoryCard[] = []
    
    symbols.slice(0, 8).forEach((symbol, index) => {
      gameCards.push(
        { id: index * 2, content: symbol, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, content: symbol, isFlipped: false, isMatched: false }
      )
    })
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]]
    }
    
    setMemoryCards(gameCards)
    setFlippedCards([])
    setMoves(0)
    setScore(0)
  }

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return
    if (flippedCards.includes(cardId)) return
    if (memoryCards[cardId].isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    const newCards = [...memoryCards]
    newCards[cardId].isFlipped = true
    setMemoryCards(newCards)

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      
      const [firstCard, secondCard] = newFlippedCards
      if (newCards[firstCard].content === newCards[secondCard].content) {
        // Match found
        setTimeout(() => {
          const updatedCards = [...newCards]
          updatedCards[firstCard].isMatched = true
          updatedCards[secondCard].isMatched = true
          setMemoryCards(updatedCards)
          setFlippedCards([])
          setScore(prev => prev + 100)
          
          // Check if game is completed
          if (updatedCards.every(card => card.isMatched)) {
            setGameState('completed')
          }
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards]
          resetCards[firstCard].isFlipped = false
          resetCards[secondCard].isFlipped = false
          setMemoryCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const startGame = (gameId: string) => {
    setSelectedGame(gameId)
    setGameState('playing')
    
    if (gameId === 'memory-match') {
      initializeMemoryGame()
    }
  }

  const resetGame = () => {
    setSelectedGame(null)
    setGameState('menu')
    setScore(0)
    setTimeElapsed(0)
    setLevel(1)
    setMemoryCards([])
    setFlippedCards([])
    setMoves(0)
  }

  const renderGameMenu = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Gamepad2 className="w-10 h-10 text-blue-600" />
          Cognitive Games
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Fun, adaptive games designed to strengthen cognitive skills while having a great time!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => (
          <motion.div
            key={game.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`h-24 ${game.color} flex items-center justify-center text-white`}>
              {game.icon}
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{game.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  game.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {game.difficulty}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{game.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {game.duration}
                  </span>
                  <span className="capitalize">{game.category}</span>
                </div>
                
                <button
                  onClick={() => startGame(game.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Play
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Your Progress
        </h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
            <div className="text-gray-600">Games Played</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">2,340</div>
            <div className="text-gray-600">Total Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">Level 3</div>
            <div className="text-gray-600">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">5</div>
            <div className="text-gray-600">Achievements</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMemoryGame = () => (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Memory Match</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{moves}</div>
              <div className="text-sm text-gray-600">Moves</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetGame}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {memoryCards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-lg text-2xl font-bold transition-all ${
                card.isMatched 
                  ? 'bg-green-100 border-2 border-green-300' 
                  : card.isFlipped 
                  ? 'bg-blue-100 border-2 border-blue-300' 
                  : 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-300'
              }`}
              whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={card.isMatched || flippedCards.length === 2}
            >
              {card.isFlipped || card.isMatched ? card.content : '?'}
            </motion.button>
          ))}
        </div>
        
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-8"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Congratulations!</h3>
              <p className="text-green-700 mb-4">
                You completed the game in {moves} moves with a score of {score}!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    initializeMemoryGame()
                    setGameState('playing')
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={resetGame}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )

  const renderOtherGame = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            {games.find(g => g.id === selectedGame)?.title}
          </h2>
          <button
            onClick={resetGame}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <Gamepad2 className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Game Coming Soon!</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          This exciting cognitive game is currently in development. 
          Check back soon for more brain-training fun!
        </p>
        <button
          onClick={resetGame}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Games Menu
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {gameState === 'menu' && renderGameMenu()}
        {gameState !== 'menu' && selectedGame === 'memory-match' && renderMemoryGame()}
        {gameState !== 'menu' && selectedGame !== 'memory-match' && renderOtherGame()}
      </div>
    </div>
  )
}