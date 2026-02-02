import { useState, useEffect } from 'react';
import { socket } from './socket';
import PasswordScreen from './components/PasswordScreen';
import JoinScreen from './components/JoinScreen';
import WaitingScreen from './components/WaitingScreen';
import GameScreen from './components/GameScreen';
import FinalScreen from './components/FinalScreen';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [gameState, setGameState] = useState('JOINING'); // JOINING, WAITING, PLAYING, FINISHED
  const [allPlayers, setAllPlayers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [roundStage, setRoundStage] = useState('PREVIEW'); // PREVIEW, ACTIVE, COMPLETE
  const [countdown, setCountdown] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(18);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [gameResults, setGameResults] = useState([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    function onConnect() {
      setIsConnected(true);
      console.log("Connected to server");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Disconnected from server");
    }

    function onConnectError(err) {
      console.error("Connection error:", err);
    }

    function onStateUpdate(data) {
      console.log("State update received:", data);

      if (data.players) {
        setAllPlayers(data.players);
      }

      if (data.gameState) {
        if (data.gameState === 'PLAYING' || data.gameState === 'FINISHED') {
          setGameState(data.gameState);
        }
      }

      if (data.roundStage) setRoundStage(data.roundStage);
      if (data.currentQuestionIndex !== undefined) setQuestionIndex(data.currentQuestionIndex + 1);
      if (data.totalQuestions) setTotalQuestions(data.totalQuestions);
      if (data.currentQuestion) setCurrentQuestion(data.currentQuestion);
    }

    function onPlayerMoved(data) {
      setAllPlayers(prev => ({
        ...prev,
        [data.id]: {
          ...prev[data.id],
          targetX: data.targetX,
          targetY: data.targetY
        }
      }));
    }

    function onPlayerStatusUpdate(data) {
      setAllPlayers(prev => ({
        ...prev,
        [data.id]: {
          ...prev[data.id],
          pendingAnswer: data.pendingAnswer,
          confirmed: data.confirmed
        }
      }));
    }

    function onRoundPreview(data) {
      console.log("Round preview received:", data);
      setGameState('PLAYING');
      setRoundStage('PREVIEW');
      setCurrentQuestion(data.question);
      setQuestionIndex(data.index);
      setTotalQuestions(data.total);
      if (data.players) setAllPlayers(data.players);
    }

    function onRoundActive(data) {
      setRoundStage('ACTIVE');
      setCountdown(data.countdown);
    }

    function onTimerUpdate(data) {
      setCountdown(data.countdown);
    }

    function onRoundResult(data) {
      setRoundStage('COMPLETE');

      // Add this round's info to results history
      setGameResults(prev => [
        ...prev,
        {
          question: data.question, // Now sent from server
          answers: data.answers // { socketId: choice }
        }
      ]);
    }

    function onGameFinished() {
      setGameState('FINISHED');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('state_update', onStateUpdate);
    socket.on('player_moved', onPlayerMoved);
    socket.on('player_status_update', onPlayerStatusUpdate);
    socket.on('round_preview', onRoundPreview);
    socket.on('round_active', onRoundActive);
    socket.on('timer_update', onTimerUpdate);
    socket.on('round_result', onRoundResult);
    socket.on('game_finished', onGameFinished);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('state_update', onStateUpdate);
      socket.off('player_moved', onPlayerMoved);
      socket.off('player_status_update', onPlayerStatusUpdate);
      socket.off('round_preview', onRoundPreview);
      socket.off('round_active', onRoundActive);
      socket.off('timer_update', onTimerUpdate);
      socket.off('round_result', onRoundResult);
      socket.off('game_finished', onGameFinished);
    };
  }, []); // Run ONCE on mount


  const handleJoin = (name) => {
    socket.emit('join_game', { name });
    setGameState('WAITING');
  };

  const handleConfirmChoice = () => {
    socket.emit('confirm_answer');
  };

  return (
    <div className="app-container">
      {!passwordVerified && <PasswordScreen onPasswordSubmit={() => setPasswordVerified(true)} isConnected={isConnected} />}
      {passwordVerified && gameState === 'JOINING' && <JoinScreen onJoin={handleJoin} isConnected={isConnected} />}
      {passwordVerified && gameState === 'WAITING' && <WaitingScreen players={allPlayers} />}
      {passwordVerified && gameState === 'PLAYING' && (
        <GameScreen
          myId={socket.id}
          players={allPlayers}
          question={currentQuestion}
          roundStage={roundStage}
          countdown={countdown}
          index={questionIndex}
          total={totalQuestions}
          onConfirm={handleConfirmChoice}
        />
      )}
      {passwordVerified && gameState === 'FINISHED' && <FinalScreen results={gameResults} players={allPlayers} />}
    </div>
  );
}

export default App;
