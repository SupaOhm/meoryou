const { text } = require("express");

class GameManager {
    constructor(io) {
        this.io = io;
        this.players = {}; // { socketId: { id, name, role, x, y, targetX, targetY, pendingAnswer, confirmed } }
        this.gameState = 'WAITING'; // WAITING, PLAYING, FINISHED
        this.roundStage = 'PREVIEW'; // PREVIEW, ACTIVE, COMPLETE
        this.questions = [
            { text: "This is tutorial", options: ["Ohm", "Sand"] },
            { text: "ใครตื่นสายกว่ากัน?", options: ["Ohm", "Sand"] },
            { text: "ใครกินเยอะกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครขี้เกียจกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครกวนตีนกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครง้อเก่งกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครขี้อ้อนกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครขี้หวงกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครอยากเป็นเศรษฐี?", options: ["Ohm", "Sand"] },
            { text: "ใครชอบบอกว่าไม่เป็นไรแต่จริงๆเป็น?", options: ["Ohm", "Sand"] },
            { text: "ใครชอบช้อปปิ้งมากกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครน่ารักกว่ากัน?", options: ["Ohm", "Sand"] },
            { text: "ใครขี้ลืมกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครบ๊องกว่ากัน?", options: ["Ohm", "Sand"] },
            { text: "ใครชอบโกหก?", options: ["Ohm", "Sand"] },
            { text: "ใครตดเหม็นกว่ากัน?", options: ["Ohm", "Sand"] },
            { text: "ใครร้องไห้บ่อยกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครขี้งอนกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครเป็นคนขอเป็นแฟน?", options: ["Ohm", "Sand"] },
            { text: "ใครชอบอีกฝ่ายก่อน?", options: ["Ohm", "Sand"] },
            { text: "แล้วใครทักอีกฝ่ายก่อน?อิอิ", options: ["Ohm", "Sand"] },
            { text: "ใครเป็นคนเริ่มจับมือตอนกลับจากบางแสน", options: ["Ohm", "Sand"] },
            { text: "ใครชอบอึนาน?", options: ["Ohm", "Sand"] },
            { text: "ใครขี้น้อยใจกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครชอบเอาแต่ใจ?", options: ["Ohm", "Sand"] },
            { text: "ใครซุ่มซ่ามกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครติดเตียงกว่ากัน?", options: ["Ohm", "Sand"] },
            { text: "ใครชอบวีนมากกว่า?", options: ["Ohm", "Sand"] },
            { text: "ใครดื้อที่สุด?", options: ["Ohm", "Sand"] },
            { text: "ใครอยากอยู่ด้วยกันไปนานๆ?", options: ["Ohm", "Sand"] },
        ];
        this.currentQuestionIndex = 0;
        this.answers = {}; // { questionIndex: { socketId: answer } }
        this.countdown = 0;
        this.timerInterval = null;
    }

    handleJoin(socket, data) {
        const { name } = data;
        let role = 'neutral';

        const lowerName = name.toLowerCase().trim();
        if (lowerName === 'ohm' || lowerName === 'mhu') role = 'male';
        if (lowerName === 'sand' || lowerName === 'jiw') role = 'female';

        this.players[socket.id] = {
            id: socket.id,
            name: name,
            role: role,
            x: 50,
            y: 50,
            targetX: 50,
            targetY: 50,
            pendingAnswer: null,
            confirmed: false
        };

        console.log(`Player joined: ${name} as ${role}`);

        this.io.emit('state_update', {
            players: this.players,
            gameState: this.gameState,
            roundStage: this.roundStage,
            currentQuestionIndex: this.currentQuestionIndex,
            totalQuestions: this.questions.length,
            currentQuestion: (this.gameState === 'PLAYING') ? this.questions[this.currentQuestionIndex] : null
        });

        if (Object.keys(this.players).length >= 2 && this.gameState === 'WAITING') {
            this.startGame();
        }
    }

    handleMove(socket, data) {
        if (!this.players[socket.id]) return;

        // Cannot move if already confirmed
        if (this.players[socket.id].confirmed) return;

        this.players[socket.id].targetX = data.x;
        this.players[socket.id].targetY = data.y;

        this.io.emit('player_moved', {
            id: socket.id,
            targetX: data.x,
            targetY: data.y
        });

        if (this.gameState === 'PLAYING' && this.roundStage === 'ACTIVE') {
            this.checkAnswerZone(socket.id, data.x, data.y);
        }
    }

    checkAnswerZone(socketId, x, y) {
        let answer = null;
        if (x < 30) answer = 'Ohm';
        if (x > 70) answer = 'Sand';

        // Update pending answer
        if (this.players[socketId].pendingAnswer !== answer) {
            this.players[socketId].pendingAnswer = answer;
            this.io.emit('player_status_update', {
                id: socketId,
                pendingAnswer: answer,
                confirmed: this.players[socketId].confirmed
            });
        }
    }

    handleConfirm(socket) {
        if (!this.players[socket.id] || !this.players[socket.id].pendingAnswer) return;

        this.players[socket.id].confirmed = true;
        this.io.emit('player_status_update', {
            id: socket.id,
            pendingAnswer: this.players[socket.id].pendingAnswer,
            confirmed: true
        });

        // Check if both confirmed
        const allConfirmed = Object.values(this.players).every(p => p.confirmed);
        if (allConfirmed) {
            this.stopTimer();
            this.handleRoundComplete();
        }
    }

    startRound() {
        this.roundStage = 'PREVIEW';

        // Reset player statuses for new round
        Object.values(this.players).forEach(p => {
            p.pendingAnswer = null;
            p.confirmed = false;
        });

        this.io.emit('round_preview', {
            question: this.questions[this.currentQuestionIndex],
            index: this.currentQuestionIndex + 1,
            total: this.questions.length,
            players: this.players
        });

        setTimeout(() => {
            this.startCountdown();
        }, 3000);
    }

    startCountdown() {
        this.roundStage = 'ACTIVE';
        this.countdown = 15; // Increased to 15s to allow for confirming
        this.io.emit('round_active', {
            countdown: this.countdown
        });

        this.timerInterval = setInterval(() => {
            this.countdown--;
            this.io.emit('timer_update', { countdown: this.countdown });

            if (this.countdown <= 0) {
                this.stopTimer();
                this.handleRoundComplete();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    handleRoundComplete() {
        this.roundStage = 'COMPLETE';

        // Store answers (for potential summary at end, or just to sync)
        this.answers[this.currentQuestionIndex] = {};
        Object.values(this.players).forEach(p => {
            this.answers[this.currentQuestionIndex][p.id] = p.pendingAnswer;
        });

        this.io.emit('round_result', {
            message: "You both know well! ❤️",
            question: this.questions[this.currentQuestionIndex].text,
            answers: this.answers[this.currentQuestionIndex]
        });

        setTimeout(() => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex >= this.questions.length) {
                this.gameState = 'FINISHED';
                this.io.emit('game_finished', {});
            } else {
                this.startRound();
            }
        }, 3000);
    }

    startGame() {
        this.gameState = 'PLAYING';
        this.currentQuestionIndex = 0;
        this.startRound();
    }

    handleDisconnect(socket) {
        delete this.players[socket.id];
        this.io.emit('state_update', {
            players: this.players,
            gameState: this.gameState
        });

        if (Object.keys(this.players).length === 0) {
            this.gameState = 'WAITING';
            this.currentQuestionIndex = 0;
            this.answers = {};
            this.stopTimer();
        }
    }
}

module.exports = { GameManager };
