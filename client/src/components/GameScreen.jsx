import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '../socket';

// Heart Pop Component for visual feedback
const HeartPop = ({ x, y, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                fontSize: '30px',
                pointerEvents: 'none',
                zIndex: 9999,
                transform: 'translate(-50%, -50%)',
            }}
        >
            ❤️
        </motion.div>
    );
};

// Chibi Character with Status Indicator
const Character = ({ role, name, isMe, confirmed }) => {
    const color = role === 'male' ? '#87CEFA' : '#FFB6C1';

    return (
        <div style={{
            position: 'relative',
            width: '60px',
            height: '80px',
            transform: 'translate(-50%, -100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {/* Ready Status Icon */}
            {confirmed && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                        position: 'absolute',
                        top: '-50px',
                        fontSize: '24px',
                        zIndex: 20
                    }}
                >
                    💖
                </motion.div>
            )}

            <div style={{
                marginTop: '-20px',
                background: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#555',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap',
                zIndex: 10,
                marginBottom: '4px'
            }}>
                {name} {isMe && '(You)'}
            </div>

            <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                style={{ width: '100%', height: '100%', position: 'relative' }}
            >
                <div style={{
                    width: '50px',
                    height: '50px',
                    background: color,
                    borderRadius: '50%',
                    position: 'absolute',
                    top: 0,
                    left: '5px',
                    border: '3px solid white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ position: 'absolute', top: '20px', left: '12px', width: '6px', height: '6px', background: '#333', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', top: '20px', right: '12px', width: '6px', height: '6px', background: '#333', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', top: '28px', left: '8px', width: '8px', height: '4px', background: '#ff9999', borderRadius: '50%', opacity: 0.6 }} />
                    <div style={{ position: 'absolute', top: '28px', right: '8px', width: '8px', height: '4px', background: '#ff9999', borderRadius: '50%', opacity: 0.6 }} />
                </div>
                <div style={{ width: '30px', height: '25px', background: color, borderRadius: '15px', position: 'absolute', bottom: '5px', left: '15px', zIndex: -1 }} />
            </motion.div>
        </div>
    );
};

const GameScreen = ({ myId, players, question, roundStage, countdown, index, total, onConfirm }) => {
    const containerRef = useRef(null);
    const [pops, setPops] = useState([]);
    const myData = players[myId];

    const handleTap = (e) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Send movement to server (if not confirmed)
        if (roundStage === 'ACTIVE' && !myData?.confirmed) {
            socket.emit('move_player', { x, y });
        }

        // Visual feedback (Always pop hearts!)
        const pId = Date.now();
        setPops(prev => [...prev, { id: pId, x, y }]);
    };

    return (
        <div
            ref={containerRef}
            onClick={handleTap}
            onTouchStart={(e) => {
                const touch = e.touches[0];
                handleTap({ clientX: touch.clientX, clientY: touch.clientY });
            }}
            style={styles.container}
        >
            {/* Visual Feedback Layer */}
            {pops.map(p => (
                <HeartPop
                    key={p.id}
                    x={p.x}
                    y={p.y}
                    onComplete={() => setPops(prev => prev.filter(item => item.id !== p.id))}
                />
            ))}

            {/* Background Decor */}
            <div style={styles.cloud1}>☁️</div>
            <div style={styles.cloud2}>☁️</div>

            {/* Header Info */}
            <div style={styles.header}>
                <div style={styles.questionCounter}>Question {index} / {total}</div>
            </div>

            {/* Answer Zones */}
            <AnimatePresence>
                {(roundStage === 'ACTIVE' || roundStage === 'COMPLETE') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                    >
                        <div style={{ ...styles.zone, left: 0, background: myData?.pendingAnswer === 'Ohm' ? 'rgba(135, 206, 250, 0.3)' : 'rgba(135, 206, 250, 0.1)' }}>
                            <span style={styles.zoneLabel}>Ohm</span>
                        </div>
                        <div style={{ ...styles.zone, right: 0, background: myData?.pendingAnswer === 'Sand' ? 'rgba(255, 182, 193, 0.3)' : 'rgba(255, 182, 193, 0.1)' }}>
                            <span style={styles.zoneLabel}>Sand</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main UI Layer */}
            <div style={styles.uiLayer}>
                <AnimatePresence mode="wait">
                    {roundStage === 'PREVIEW' && (
                        <motion.div
                            key="preview"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.2, opacity: 0 }}
                            style={styles.previewCard}
                        >
                            <div style={styles.previewTag}>Next Question...</div>
                            <div style={styles.questionBig}>{question?.text}</div>
                        </motion.div>
                    )}

                    {roundStage === 'ACTIVE' && (
                        <motion.div
                            key="active"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 20, opacity: 1 }}
                            style={styles.activeQuestionCard}
                        >
                            <div style={styles.timer}>{countdown}s</div>
                            <div style={styles.questionSmall}>{question?.text}</div>
                        </motion.div>
                    )}

                    {roundStage === 'COMPLETE' && (
                        <motion.div
                            key="complete"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={styles.resultCard}
                        >
                            <div style={styles.resultEmoji}>❤️</div>
                            <div style={styles.resultText}>Perfect Match!</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Players */}
            {Object.values(players).map(player => (
                <motion.div
                    key={player.id}
                    initial={false}
                    animate={{ left: `${player.targetX}%`, top: `${player.targetY}%` }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    style={{ position: 'absolute', pointerEvents: 'none', zIndex: player.y }}
                >
                    <Character
                        role={player.role}
                        name={player.name}
                        isMe={player.id === myId}
                        confirmed={player.confirmed}
                    />
                </motion.div>
            ))}

            {/* Confirm Button Overlay */}
            <AnimatePresence>
                {roundStage === 'ACTIVE' && myData?.pendingAnswer && !myData?.confirmed && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        style={styles.confirmOverlay}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onConfirm();
                            }}
                            onTouchStart={(e) => {
                                e.stopPropagation();
                            }}
                            style={styles.confirmButton}
                        >
                            Confirm "{myData.pendingAnswer}" Choice! ❤️
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {roundStage === 'ACTIVE' && !myData?.pendingAnswer && (
                <div style={styles.instruction}>Tap a zone to see the button!</div>
            )}
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#FFF0F5',
        overflow: 'hidden',
        userSelect: 'none',
    },
    header: {
        position: 'absolute',
        top: '20px',
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 10,
    },
    questionCounter: {
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '4px 12px',
        borderRadius: '15px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#FF69B4',
    },
    uiLayer: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 100,
    },
    previewCard: {
        background: 'white',
        padding: '40px 30px',
        borderRadius: '32px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '85%',
    },
    previewTag: {
        fontSize: '14px',
        color: '#FFB6C1',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '10px',
    },
    questionBig: {
        fontSize: '28px',
        color: '#555',
        fontWeight: 'bold',
        lineHeight: '1.2',
    },
    activeQuestionCard: {
        background: 'white',
        padding: '16px 24px',
        borderRadius: '24px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        maxWidth: '90%',
        position: 'absolute',
        top: '60px',
        pointerEvents: 'auto',
    },
    timer: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#FF69B4',
        background: '#FFF0F5',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionSmall: {
        fontSize: '18px',
        color: '#555',
    },
    resultCard: {
        background: 'white',
        padding: '30px',
        borderRadius: '50%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    resultEmoji: {
        fontSize: '50px',
    },
    resultText: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#FF69B4',
    },
    zone: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '30%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: '2px dashed rgba(0,0,0,0.05)',
        transition: 'background 0.3s ease',
    },
    zoneLabel: {
        fontSize: '40px',
        opacity: 0.2,
        fontWeight: 'bold',
    },
    confirmOverlay: {
        position: 'absolute',
        bottom: '40px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1000,
    },
    confirmButton: {
        background: '#FF69B4',
        color: 'white',
        padding: '16px 32px',
        borderRadius: '30px',
        fontSize: '18px',
        fontWeight: 'bold',
        boxShadow: '0 8px 20px rgba(255, 182, 193, 0.4)',
        border: '4px solid white',
        cursor: 'pointer',
    },
    instruction: {
        position: 'absolute',
        bottom: '40px',
        width: '100%',
        textAlign: 'center',
        color: '#FFB6C1',
        fontWeight: '600',
        fontSize: '16px',
        pointerEvents: 'none',
    },
    cloud1: { position: 'absolute', top: '10%', left: '10%', fontSize: '40px', opacity: 0.5 },
    cloud2: { position: 'absolute', top: '20%', right: '15%', fontSize: '50px', opacity: 0.5 }
};

export default GameScreen;
