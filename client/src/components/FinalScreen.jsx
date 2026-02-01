import { motion } from 'framer-motion';

const FinalScreen = ({ results = [], players = {} }) => {
    // Find who is who for the summary
    const ohmPlayer = Object.values(players).find(p => p.role === 'male');
    const sandPlayer = Object.values(players).find(p => p.role === 'female');

    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.content}
            >
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={styles.heart}
                >
                    ❤️
                </motion.div>

                <h1 style={styles.title}>21 Months Together!</h1>
                <p style={styles.subtitle}>and I still choose you every day.</p>

                <div style={styles.summaryContainer}>
                    <h2 style={styles.summaryTitle}>How we answered:</h2>
                    <div style={styles.scrollArea}>
                        {results.map((res, i) => {
                            const ohmAnswer = ohmPlayer ? res.answers[ohmPlayer.id] : 'No one';
                            const sandAnswer = sandPlayer ? res.answers[sandPlayer.id] : 'No one';
                            const match = ohmAnswer === sandAnswer;

                            return (
                                <div key={i} style={styles.resultItem}>
                                    <div style={styles.qText}>{i + 1}. {res.question}</div>
                                    <div style={styles.answersRow}>
                                        <div style={styles.playerAnswer}>
                                            <span style={styles.label}>Ohm answered</span> {ohmAnswer || '??'}
                                        </div>
                                        <div style={styles.playerAnswer}>
                                            <span style={styles.label}>Sand answered</span> {sandAnswer || '??'}
                                        </div>
                                        {match ? (
                                            <div style={styles.matchTag}>100% Match! ✨</div>
                                        ) : (
                                            <div style={styles.diffTag}>Disagreed! 🤭</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                    style={styles.button}
                >
                    Play Again! ❤️
                </motion.button>
            </motion.div>

            {/* Floating Hearts Background */}
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
                    animate={{ y: '-10vh', opacity: [0, 1, 0] }}
                    transition={{
                        duration: 5 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 5
                    }}
                    style={styles.floatingHeart}
                >
                    ❤️
                </motion.div>
            ))}
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFF0F5',
        position: 'relative',
        overflow: 'hidden',
    },
    content: {
        textAlign: 'center',
        zIndex: 1,
        width: '90%',
        maxHeight: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    heart: {
        fontSize: '80px',
        marginBottom: '20px',
    },
    title: {
        fontFamily: "'Fredoka', sans-serif",
        fontSize: '32px',
        color: '#FF69B4',
        margin: '0 0 10px 0',
    },
    subtitle: {
        fontSize: '18px',
        color: '#555',
        margin: '0 0 30px 0',
    },
    summaryContainer: {
        background: 'white',
        borderRadius: '24px',
        width: '100%',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        marginBottom: '30px',
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    summaryTitle: {
        fontSize: '20px',
        color: '#FF69B4',
        marginBottom: '15px',
        textAlign: 'left',
    },
    scrollArea: {
        overflowY: 'auto',
        flex: 1,
        paddingRight: '5px',
    },
    resultItem: {
        padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
        textAlign: 'left',
    },
    qText: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#555',
        marginBottom: '4px',
    },
    answersRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
    },
    playerAnswer: {
        fontSize: '13px',
        color: '#777',
    },
    label: {
        fontWeight: 'bold',
        color: '#aaa',
    },
    matchTag: {
        fontSize: '11px',
        color: '#4CAF50',
        background: '#E8F5E9',
        padding: '2px 8px',
        borderRadius: '10px',
        fontWeight: 'bold',
    },
    diffTag: {
        fontSize: '11px',
        color: '#FF5722',
        background: '#FBE9E7',
        padding: '2px 8px',
        borderRadius: '10px',
        fontWeight: 'bold',
    },
    button: {
        background: '#FF69B4',
        color: 'white',
        border: 'none',
        padding: '15px 40px',
        borderRadius: '30px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 10px 20px rgba(255, 105, 180, 0.3)',
    },
    floatingHeart: {
        position: 'absolute',
        fontSize: '20px',
        pointerEvents: 'none',
    }
};

export default FinalScreen;
