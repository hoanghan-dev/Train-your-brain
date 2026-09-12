/**
 * BrainArena Stroop Effect Mini-game Engine
 * Sourced from US-03 of PRODUCT_OVERVIEW_AND_USER_STORIES.md
 */

class StroopGame {
    constructor() {
        this.level = 1;
        this.totalQuestions = 10;
        this.currentQuestionIndex = 0;
        this.timePerQuestion = 3.5;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.correctCount = 0;
        this.isGameOver = false;
        this.timer = null;
        this.remainingQuestionTime = 0;
        this.onProgressCallback = null;
        this.onFinishCallback = null;

        this.colors = [
            { name: "ĐỎ", hex: "#ef4444", key: "red" },
            { name: "XANH DƯƠNG", hex: "#3b82f6", key: "blue" },
            { name: "XANH LÁ", hex: "#10b981", key: "green" },
            { name: "VÀNG", hex: "#f59e0b", key: "yellow" },
            { name: "TÍM", hex: "#a855f7", key: "purple" }
        ];

        this.currentWord = null;
        this.currentColor = null;
    }

    init(level = 1, onProgress = null, onFinish = null) {
        this.level = parseInt(level) || 1;
        this.onProgressCallback = onProgress;
        this.onFinishCallback = onFinish;

        if (this.level === 1) {
            this.totalQuestions = 10;
            this.timePerQuestion = 3.5;
        } else if (this.level === 2) {
            this.totalQuestions = 15;
            this.timePerQuestion = 2.8;
        } else {
            this.totalQuestions = 20;
            this.timePerQuestion = 2.0;
        }

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.correctCount = 0;
        this.isGameOver = false;

        this.renderButtons();
        this.nextQuestion();
    }

    renderButtons() {
        const container = document.getElementById('stroop-buttons');
        if (!container) return;

        container.innerHTML = '';
        this.colors.forEach(col => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn stroop-btn text-white';
            btn.style.backgroundColor = col.hex;
            btn.innerHTML = `<span class="fw-bold">${col.name}</span>`;
            btn.addEventListener('click', () => this.handleAnswer(col.key));
            container.appendChild(btn);
        });
    }

    nextQuestion() {
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.completeGame();
            return;
        }

        this.currentQuestionIndex++;
        this.updateHUD();

        // Pick random text and random distinct color
        const wordIndex = Math.floor(Math.random() * this.colors.length);
        let colorIndex = Math.floor(Math.random() * this.colors.length);
        // Ensure high incongruity for the Stroop effect (75% incongruent)
        if (Math.random() > 0.25 && colorIndex === wordIndex) {
            colorIndex = (wordIndex + 1) % this.colors.length;
        }

        this.currentWord = this.colors[wordIndex];
        this.currentColor = this.colors[colorIndex];

        // Render word on screen
        const wordEl = document.getElementById('stroop-word');
        if (wordEl) {
            wordEl.textContent = this.currentWord.name;
            wordEl.style.color = this.currentColor.hex;
            wordEl.classList.remove('pop-in');
            void wordEl.offsetWidth; // trigger reflow
            wordEl.classList.add('pop-in');
        }

        // Start countdown for this question
        this.startQuestionTimer();
    }

    startQuestionTimer() {
        if (this.timer) clearInterval(this.timer);

        this.remainingQuestionTime = this.timePerQuestion;
        this.updateQuestionTimerBar();

        this.timer = setInterval(() => {
            if (this.isGameOver) return;
            this.remainingQuestionTime -= 0.1;
            this.updateQuestionTimerBar();

            if (this.remainingQuestionTime <= 0) {
                clearInterval(this.timer);
                this.handleTimeout();
            }
        }, 100);
    }

    updateQuestionTimerBar() {
        const timerBar = document.getElementById('stroop-timer-bar');
        const timerText = document.getElementById('stroop-timer-text');
        if (timerBar) {
            const pct = Math.max(0, (this.remainingQuestionTime / this.timePerQuestion) * 100);
            timerBar.style.width = pct + '%';
            if (pct < 30) {
                timerBar.className = 'progress-bar bg-danger';
            } else if (pct < 60) {
                timerBar.className = 'progress-bar bg-warning';
            } else {
                timerBar.className = 'progress-bar progress-bar-cyan';
            }
        }
        if (timerText) {
            timerText.textContent = Math.max(0, this.remainingQuestionTime).toFixed(1) + 's';
        }
    }

    handleAnswer(selectedColorKey) {
        if (this.isGameOver) return;
        if (this.timer) clearInterval(this.timer);

        // Core rule: Match the INK COLOR (US-03)
        const isCorrect = selectedColorKey === this.currentColor.key;

        const feedbackEl = document.getElementById('stroop-feedback');

        if (isCorrect) {
            SFX.correct();
            this.correctCount++;
            this.streak++;
            if (this.streak > this.maxStreak) this.maxStreak = this.streak;

            const streakBonus = Math.min(this.streak * 5, 25);
            const timeBonus = Math.round(this.remainingQuestionTime * 10);
            this.score += 20 + streakBonus + timeBonus;

            if (feedbackEl) {
                feedbackEl.textContent = `Chính xác! +${20 + streakBonus + timeBonus} điểm (Streak x${this.streak})`;
                feedbackEl.className = 'badge bg-success bg-opacity-25 text-emerald border border-success border-opacity-50 p-2 text-sm';
            }
        } else {
            SFX.wrong();
            this.streak = 0; // reset streak on error per US-03
            if (feedbackEl) {
                feedbackEl.textContent = `Sai rồi! Màu đúng là: ${this.currentColor.name}`;
                feedbackEl.className = 'badge bg-danger bg-opacity-25 text-rose border border-danger border-opacity-50 p-2 text-sm';
            }
        }

        if (this.onProgressCallback) {
            const progressPct = (this.currentQuestionIndex / this.totalQuestions) * 100;
            this.onProgressCallback(progressPct, this.score);
        }

        setTimeout(() => {
            this.nextQuestion();
        }, 400);
    }

    handleTimeout() {
        SFX.wrong();
        this.streak = 0;
        const feedbackEl = document.getElementById('stroop-feedback');
        if (feedbackEl) {
            feedbackEl.textContent = 'Hết giờ câu này! Chuỗi đã bị ngắt.';
            feedbackEl.className = 'badge bg-danger bg-opacity-25 text-rose border border-danger border-opacity-50 p-2 text-sm';
        }
        setTimeout(() => {
            this.nextQuestion();
        }, 500);
    }

    updateHUD() {
        const countEl = document.getElementById('stroop-count');
        if (countEl) countEl.textContent = `${this.currentQuestionIndex}/${this.totalQuestions}`;

        const scoreEl = document.getElementById('stroop-score');
        if (scoreEl) scoreEl.textContent = this.score;

        const streakEl = document.getElementById('stroop-streak');
        if (streakEl) streakEl.textContent = this.streak;
    }

    completeGame() {
        this.isGameOver = true;
        if (this.timer) clearInterval(this.timer);
        SFX.victory();

        const accuracy = Math.round((this.correctCount / this.totalQuestions) * 100);

        const baseExp = this.level === 1 ? 100 : (this.level === 2 ? 200 : 320);
        const basePoints = this.level === 1 ? 30 : (this.level === 2 ? 60 : 90);

        const updateResult = AppState.updateExpAndPoints(baseExp, basePoints);
        const player = AppState.getPlayer();

        if (player.challenges && player.challenges.stroop) {
            player.challenges.stroop.totalPlays += 1;
            if (!player.challenges.stroop.bestScore || this.score > player.challenges.stroop.bestScore) {
                player.challenges.stroop.bestScore = this.score;
            }
            if (this.level === player.challenges.stroop.level && this.level < 3 && accuracy >= 70) {
                player.challenges.stroop.level += 1;
                showToast("MỞ KHÓA MỨC ĐỘ MỚI!", `Bạn đã mở khóa Thử Thách Stroop Level ${player.challenges.stroop.level}!`, "success");
            }
            AppState.savePlayer(player);
        }

        AppState.recordMatchResult({
            id: 'm_' + Date.now(),
            type: 'Solo',
            challenge: `Stroop Test Lv.${this.level}`,
            opponent: 'Solo Practice',
            result: 'COMPLETED',
            time: `${this.score} điểm`,
            points: `+${basePoints}`,
            date: 'Vừa xong'
        });

        const resultData = {
            outcome: 'COMPLETED',
            gameType: 'Stroop Test',
            level: this.level,
            userScore: this.score,
            accuracy: `${accuracy}% (${this.correctCount}/${this.totalQuestions})`,
            maxStreak: this.maxStreak,
            expGain: baseExp,
            pointsGain: basePoints,
            cupsGain: 0,
            levelUp: updateResult.levelUpOccurred,
            unlockedSkill: updateResult.newlyUnlockedSkill ? updateResult.newlyUnlockedSkill.name : null
        };
        localStorage.setItem(STORAGE_KEYS.BATTLE_RESULT, JSON.stringify(resultData));

        if (this.onFinishCallback) {
            this.onFinishCallback(resultData);
        } else {
            setTimeout(() => {
                const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
                window.location.href = prefix + 'result.html';
            }, 1000);
        }
    }
}

window.StroopGame = StroopGame;
