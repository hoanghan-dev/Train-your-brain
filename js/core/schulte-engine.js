/**
 * BrainArena Schulte Table Mini-game Engine
 * Logic sinh lưới số, kiểm tra thứ tự bấm, tính giờ, phạt lỗi và cập nhật kết quả
 */

class SchulteGame {
    constructor() {
        this.level = 1;
        this.gridSize = 3; // 3x3 (1-9) mặc định cho level 1
        this.totalNumbers = 9;
        this.currentTarget = 1;
        this.startTime = null;
        this.timerInterval = null;
        this.elapsedSeconds = 0;
        this.penalties = 0; // Số lần bấm sai
        this.isGameOver = false;
        this.isStarted = false;
        this.mode = 'solo'; // 'solo' hoặc 'pvp'
        this.onProgressCallback = null;
        this.onFinishCallback = null;
    }

    init(level = 1, mode = 'solo', onProgress = null, onFinish = null) {
        this.level = parseInt(level) || 1;
        this.mode = mode;
        this.onProgressCallback = onProgress;
        this.onFinishCallback = onFinish;

        if (this.level === 1) {
            this.gridSize = 3;
            this.totalNumbers = 9;
        } else if (this.level === 2) {
            this.gridSize = 4;
            this.totalNumbers = 16;
        } else {
            this.gridSize = 5;
            this.totalNumbers = 25;
        }

        this.currentTarget = 1;
        this.elapsedSeconds = 0;
        this.penalties = 0;
        this.isGameOver = false;
        this.isStarted = false;

        this.renderBoard();
        this.updateHUD();
    }

    renderBoard() {
        const gridEl = document.getElementById('schulte-grid');
        if (!gridEl) return;

        gridEl.innerHTML = '';
        gridEl.className = `schulte-grid schulte-grid-${this.gridSize}x${this.gridSize}`;

        // Sinh danh sách số ngẫu nhiên từ 1 đến totalNumbers
        const numbers = Array.from({ length: this.totalNumbers }, (_, i) => i + 1);
        this.shuffle(numbers);

        numbers.forEach(num => {
            const cell = document.createElement('div');
            cell.className = 'schulte-cell';
            cell.id = `schulte-cell-${num}`;
            cell.setAttribute('data-number', num);
            cell.textContent = num;
            cell.addEventListener('click', () => this.handleCellClick(num, cell));
            gridEl.appendChild(cell);
        });
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startTimer() {
        if (this.isStarted) return;
        this.isStarted = true;
        this.startTime = Date.now();

        this.timerInterval = setInterval(() => {
            if (this.isGameOver) return;
            const now = Date.now();
            this.elapsedSeconds = (now - this.startTime) / 1000 + this.penalties;
            this.updateTimerDisplay();
        }, 50);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const timerEl = document.getElementById('schulte-timer');
        if (timerEl) {
            timerEl.textContent = this.elapsedSeconds.toFixed(2) + 's';
        }
    }

    updateHUD() {
        const targetEl = document.getElementById('schulte-target');
        if (targetEl) {
            targetEl.textContent = this.currentTarget <= this.totalNumbers ? this.currentTarget : 'Xong!';
        }

        const progressEl = document.getElementById('schulte-progress-bar');
        if (progressEl) {
            const pct = Math.round(((this.currentTarget - 1) / this.totalNumbers) * 100);
            progressEl.style.width = pct + '%';
        }

        const progressText = document.getElementById('schulte-progress-text');
        if (progressText) {
            progressText.textContent = `${this.currentTarget - 1}/${this.totalNumbers}`;
        }
    }

    handleCellClick(num, cellEl) {
        if (this.isGameOver) return;

        // Tự động khởi động đồng hồ ở lượt bấm đầu tiên
        if (!this.isStarted) {
            this.startTimer();
        }

        if (num === this.currentTarget) {
            // Bấm đúng
            if (typeof SFX !== 'undefined') SFX.correct();
            cellEl.classList.remove('hint-highlight');
            cellEl.classList.add('completed');
            this.currentTarget++;

            this.updateHUD();

            if (this.onProgressCallback) {
                const progressPct = ((this.currentTarget - 1) / this.totalNumbers) * 100;
                this.onProgressCallback(progressPct, this.currentTarget);
            }

            // Kiểm tra hoàn thành
            if (this.currentTarget > this.totalNumbers) {
                this.completeGame();
            }
        } else if (num > this.currentTarget) {
            // Bấm sai -> Phạt +1s thời gian
            if (typeof SFX !== 'undefined') SFX.wrong();
            this.penalties += 1;
            cellEl.classList.add('error-shake');
            setTimeout(() => cellEl.classList.remove('error-shake'), 400);

            const penaltyIndicator = document.getElementById('penalty-indicator');
            if (penaltyIndicator) {
                penaltyIndicator.textContent = '+1.0s Phạt!';
                penaltyIndicator.classList.remove('d-none');
                setTimeout(() => penaltyIndicator.classList.add('d-none'), 800);
            }
        }
    }

    applyHint() {
        const targetCell = document.getElementById(`schulte-cell-${this.currentTarget}`);
        if (targetCell) {
            targetCell.classList.add('hint-highlight');
            setTimeout(() => {
                if (targetCell) targetCell.classList.remove('hint-highlight');
            }, 2500);
        }
    }

    autoSolveNext() {
        if (this.currentTarget <= this.totalNumbers) {
            const targetCell = document.getElementById(`schulte-cell-${this.currentTarget}`);
            if (targetCell) {
                this.handleCellClick(this.currentTarget, targetCell);
            }
        }
    }

    completeGame() {
        this.isGameOver = true;
        this.stopTimer();
        if (typeof SFX !== 'undefined') SFX.victory();

        const finalTime = parseFloat(this.elapsedSeconds.toFixed(2));
        const accuracy = Math.max(50, Math.round(((this.totalNumbers) / (this.totalNumbers + this.penalties)) * 100));

        // Tính toán phần thưởng
        const baseExp = this.level === 1 ? 100 : (this.level === 2 ? 180 : 300);
        const basePoints = this.level === 1 ? 30 : (this.level === 2 ? 50 : 80);

        // Cập nhật người chơi
        const updateResult = AppState.updateExpAndPoints(baseExp, basePoints);
        const player = AppState.getPlayer();

        if (player.challenges && player.challenges.schulte) {
            player.challenges.schulte.totalPlays = (player.challenges.schulte.totalPlays || 0) + 1;
            if (!player.challenges.schulte.bestTime || finalTime < player.challenges.schulte.bestTime) {
                player.challenges.schulte.bestTime = finalTime;
            }
            if (this.level === player.challenges.schulte.level && this.level < 3) {
                player.challenges.schulte.currentStreak = (player.challenges.schulte.currentStreak || 0) + 1;
                if (player.challenges.schulte.currentStreak >= 1) {
                    player.challenges.schulte.level += 1;
                    if (typeof showToast === 'function') {
                        showToast("MỞ KHÓA MỨC ĐỘ MỚI!", `Bạn đã mở khóa Bảng Schulte Level ${player.challenges.schulte.level}!`, "success");
                    }
                }
            }
            AppState.savePlayer(player);
        }

        AppState.recordMatchResult({
            id: 'm_' + Date.now(),
            type: 'Solo',
            challenge: `Schulte Table Lv.${this.level}`,
            opponent: 'Solo Practice',
            result: 'COMPLETED',
            time: `${finalTime}s`,
            points: `+${basePoints}`,
            date: 'Vừa xong'
        });

        const resultData = {
            outcome: 'COMPLETED',
            gameType: 'Schulte Table',
            level: this.level,
            userTime: finalTime,
            opponentTime: null,
            accuracy: `${accuracy}%`,
            penalties: this.penalties,
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

window.SchulteGame = SchulteGame;
