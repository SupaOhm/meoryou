import { useState } from 'react';
import { motion } from 'framer-motion';

const JoinScreen = ({ onJoin, isConnected }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && isConnected) {
            onJoin(name);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.status}>
                <div style={{
                    ...styles.statusDot,
                    background: isConnected ? '#4CAF50' : '#f44336'
                }} />
                {isConnected ? 'Server Connected' : 'Connecting...'}
            </div>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={styles.card}
            >
                <h1 style={styles.title}>21months game eiei</h1>
                <p style={styles.subtitle}>Who are you?</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Enter your name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        style={styles.button}
                    >
                        Join World
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        background: 'radial-gradient(circle, #ffebf2 0%, #fff0f5 100%)',
    },
    card: {
        background: 'white',
        padding: '40px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-soft)',
        textAlign: 'center',
        maxWidth: '90%',
        width: '320px',
    },
    status: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#888',
        background: 'rgba(255,255,255,0.8)',
        padding: '8px 12px',
        borderRadius: '20px',
    },
    statusDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
    },
    title: {
        color: 'var(--color-primary)',
        marginBottom: '8px',
        fontSize: '28px',
    },
    subtitle: {
        color: 'var(--color-text)',
        marginBottom: '24px',
        fontSize: '18px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    input: {
        padding: '12px 20px',
        borderRadius: 'var(--radius-md)',
        border: '2px solid #eee',
        fontSize: '16px',
        textAlign: 'center',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-primary)',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
    }
};

export default JoinScreen;
