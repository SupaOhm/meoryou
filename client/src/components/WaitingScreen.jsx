import { motion } from 'framer-motion';

const WaitingScreen = ({ players }) => {
    const playerCount = Object.keys(players).length;

    return (
        <div style={styles.container}>
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={styles.heartWrapper}
            >
                <span style={styles.heart}>❤️</span>
            </motion.div>
            <h2 style={styles.text}>Waiting for your partner...</h2>
            <p style={styles.subtext}>Connected: {playerCount} / 2</p>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        background: 'var(--color-bg)',
    },
    heartWrapper: {
        fontSize: '60px',
        marginBottom: '20px',
    },
    text: {
        color: 'var(--color-text)',
        fontSize: '20px',
        marginBottom: '8px',
    },
    subtext: {
        color: '#999',
        fontSize: '14px',
    }
};

export default WaitingScreen;
