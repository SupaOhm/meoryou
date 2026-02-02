import { useState } from 'react';
import { motion } from 'framer-motion';

const PasswordScreen = ({ onPasswordSubmit, isConnected }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === '2424') {
            setError('');
            onPasswordSubmit();
        } else {
            setError('Incorrect password');
            setPassword('');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.status}>
                <div style={styles.statusDot} />
                {isConnected ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
            </div>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={styles.card}
            >
                <h1 style={styles.title}>SECURE ACCESS REQUIRED</h1>
                <p style={styles.subtitle}>Enter Authorization Code</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        style={{...styles.input, borderColor: error ? '#cccccc' : '#444444'}}
                    />
                    {error && <p style={styles.error}>{error}</p>}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        style={styles.button}
                    >
                        AUTHORIZE ACCESS
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
        minHeight: '100vh',
        background: '#000000',
        fontFamily: '"Courier New", monospace',
        position: 'relative',
        overflow: 'hidden',
    },
    status: {
        position: 'absolute',
        top: 20,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'transparent',
        border: '1px solid #666666',
        color: '#aaaaaa',
        fontSize: '12px',
        letterSpacing: '1px',
        zIndex: 10,
    },
    statusDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#888888',
    },
    card: {
        background: '#0a0a0a',
        padding: '40px',
        border: '1px solid #333333',
        maxWidth: '450px',
        width: '90%',
        position: 'relative',
        zIndex: 5,
    },
    title: {
        textAlign: 'center',
        color: '#ffffff',
        marginBottom: '10px',
        fontSize: '20px',
        fontWeight: 'bold',
        letterSpacing: '1px',
    },
    subtitle: {
        textAlign: 'center',
        color: '#aaaaaa',
        marginBottom: '30px',
        fontSize: '12px',
        letterSpacing: '1px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    input: {
        padding: '12px',
        fontSize: '14px',
        border: '1px solid #444444',
        background: '#1a1a1a',
        color: '#ffffff',
        fontFamily: '"Courier New", monospace',
        transition: 'all 0.3s',
    },
    error: {
        color: '#cccccc',
        fontSize: '12px',
        margin: '-15px 0 5px 0',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    button: {
        padding: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        background: '#1a1a1a',
        color: '#ffffff',
        border: '1px solid #444444',
        cursor: 'pointer',
        transition: 'all 0.3s',
        letterSpacing: '1px',
    },
};

export default PasswordScreen;
