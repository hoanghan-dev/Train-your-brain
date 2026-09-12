/**
 * BrainArena PvP & Real-time Battle Engine
 * Sourced from US-04, US-05, US-08 and Sections 10, 11, 12 of PRODUCT_OVERVIEW_AND_USER_STORIES.md
 */

const PvPManager = {
    // -------------------------------------------------------------
    // US-04: Random Matchmaking
    // -------------------------------------------------------------
    startMatchmaking(challengeType = 'schulte', level = 2) {
        const modalEl = document.getElementById('matchmaking-modal');
        const statusText = document.getElementById('matchmaking-status-text');
        const dotsEl = document.getElementById('matchmaking-dots');

        if (!modalEl) return;

        const bsModal = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false });
        bsModal.show();

        let elapsed = 0;
        const searchInterval = setInterval(() => {
            elapsed++;
            if (elapsed === 1) {
                if (statusText) statusText.textContent = "Đang quét người chơi trực tuyến...";
            } else if (elapsed === 2) {
                if (statusText) statusText.textContent = "Tìm thấy người chơi có trình độ tương đương...";
            } else if (elapsed >= 3) {
                clearInterval(searchInterval);
                this.onMatchFound(challengeType, level, bsModal);
            }
        }, 1000);

        const cancelBtn = document.getElementById('btn-cancel-matchmaking');
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                clearInterval(searchInterval);
                bsModal.hide();
                showToast("Đã hủy", "Đã dừng quá trình ghép trận.", "info");
            };
        }
    },

    onMatchFound(challengeType, level, bsModal) {
        SFX.victory();
        const opponent = MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];
        localStorage.setItem(STORAGE_KEYS.OPPONENT, JSON.stringify(opponent));

        const statusText = document.getElementById('matchmaking-status-text');
        if (statusText) {
            statusText.innerHTML = `<span class="text-cyan fw-bold"><i class="bi bi-check-circle-fill me-1"></i>Đã tìm thấy đối thủ: ${opponent.name}!</span>`;
        }

        setTimeout(() => {
            bsModal.hide();
            // Store match details and redirect to battle
            localStorage.setItem(STORAGE_KEYS.CURRENT_MATCH, JSON.stringify({
                challengeType,
                level,
                opponent,
                roomType: 'RANDOM'
            }));
            const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
            window.location.href = `${prefix}battle.html?challenge=${challengeType}&level=${level}`;
        }, 1200);
    },

    // -------------------------------------------------------------
    // US-05: Private Room Code
    // -------------------------------------------------------------
    generateRoomPIN() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let pin = '';
        for (let i = 0; i < 6; i++) {
            pin += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pin;
    },

    createPrivateRoom(challengeType = 'schulte', level = 2) {
        const pin = this.generateRoomPIN();
        const roomData = {
            pin,
            challengeType,
            level,
            host: AppState.getPlayer().username,
            status: 'WAITING_OPPONENT'
        };
        localStorage.setItem(STORAGE_KEYS.ROOM_DATA, JSON.stringify(roomData));
        return roomData;
    },

    joinPrivateRoom(pin) {
        const cleanPin = pin.trim().toUpperCase();
        if (!cleanPin || cleanPin.length < 5) {
            showToast("Mã phòng không hợp lệ", "Mã phòng gồm 6 ký tự viết hoa.", "error");
            return false;
        }

        // Mock opponent joining room
        const opponent = MOCK_OPPONENTS[0];
        localStorage.setItem(STORAGE_KEYS.OPPONENT, JSON.stringify(opponent));
        localStorage.setItem(STORAGE_KEYS.CURRENT_MATCH, JSON.stringify({
            challengeType: 'schulte',
            level: 2,
            opponent,
            roomType: 'PRIVATE',
            pin: cleanPin
        }));

        showToast("Đã vào phòng!", "Kết nối phòng thành công. Trận đấu sắp bắt đầu!", "success");
        setTimeout(() => {
            const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
            window.location.href = `${prefix}battle.html?challenge=schulte&level=2`;
        }, 1000);
        return true;
    }
};

// -------------------------------------------------------------
// Real-time Battle Controller (In Battle Screen)
// -------------------------------------------------------------
class BattleController {
    constructor(challengeType = 'schulte', level = 2) {
        this.challengeType = challengeType;
        this.level = parseInt(level) || 2;
        this.player = AppState.getPlayer();
        this.opponent = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPONENT)) || MOCK_OPPONENTS[0];

        this.playerProgress = 0;
        this.opponentProgress = 0;
        this.gameInstance = null;
        this.opponentInterval = null;
        this.battleTimerInterval = null;
        this.elapsedSeconds = 0;
        this.isBattleOver = false;

        // Skill states
        this.shieldActive = false;
        this.opponentDisrupted = false;
        this.skillsCooldowns = {};
    }

    startCountdown(onReady) {
        const overlay = document.getElementById('battle-countdown-overlay');
        const countText = document.getElementById('battle-countdown-number');
        if (!overlay || !countText) {
            onReady();
            return;
        }

        overlay.classList.remove('d-none');
        let count = 3;
        countText.textContent = count;
        SFX.countdown();

        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                countText.textContent = count;
                SFX.countdown();
            } else if (count === 0) {
                countText.textContent = "BẮT ĐẦU!";
                SFX.countdownStart();
            } else {
                clearInterval(timer);
                overlay.classList.add('d-none');
                onReady();
            }
        }, 900);
    }

    initBattle() {
        this.startCountdown(() => {
            this.runBattleLoop();
        });
    }

    runBattleLoop() {
        this.isBattleOver = false;
        this.elapsedSeconds = 0;

        // Start timer
        this.battleTimerInterval = setInterval(() => {
            if (this.isBattleOver) return;
            this.elapsedSeconds += 0.1;
            const timerEl = document.getElementById('battle-timer');
            if (timerEl) timerEl.textContent = this.elapsedSeconds.toFixed(1) + 's';
        }, 100);

        // Mount mini-game
        if (this.challengeType === 'schulte') {
            this.gameInstance = new SchulteGame();
            this.gameInstance.init(
                this.level,
                'pvp',
                (progressPct) => {
                    this.playerProgress = progressPct;
                    this.updateHUD();
                    if (this.playerProgress >= 100) {
                        this.endBattle('VICTORY');
                    }
                },
                () => {} // Handled via progress check
            );
        } else {
            this.gameInstance = new StroopGame();
            this.gameInstance.init(
                this.level,
                (progressPct) => {
                    this.playerProgress = progressPct;
                    this.updateHUD();
                    if (this.playerProgress >= 100) {
                        this.endBattle('VICTORY');
                    }
                },
                () => {}
            );
        }

        // Simulate Opponent Behavior (Section 11)
        this.startOpponentSimulation();

        // Setup 3 equipped skill buttons
        this.renderBattleSkills();
    }

    startOpponentSimulation() {
        // Realistic pace: opponent makes progress every 400-600ms
        this.opponentInterval = setInterval(() => {
            if (this.isBattleOver) return;

            if (this.opponentDisrupted) {
                // Progress paused while disrupted
                return;
            }

            // Normal pace: 2% - 5.5% progress per tick
            const increment = (Math.random() * 3.5 + 2.0);
            this.opponentProgress = Math.min(100, this.opponentProgress + increment);
            this.updateHUD();

            // Opponent random skill attack chance (5% chance every tick after 30% progress)
            if (this.opponentProgress > 30 && Math.random() < 0.05) {
                this.handleOpponentSkillAttack();
            }

            if (this.opponentProgress >= 100) {
                this.endBattle('DEFEAT');
            }
        }, 500);
    }

    handleOpponentSkillAttack() {
        if (this.isBattleOver) return;

        if (this.shieldActive) {
            // Shield absorbed it!
            SFX.shieldBlock();
            showToast("🛡️ KHIÊN ĐÃ CHẶN ĐÒN!", "Khiên tâm trí đã bảo vệ bạn khỏi kỹ năng của đối thủ!", "success");
            this.shieldActive = false;
            document.body.classList.remove('shield-screen-active');
            return;
        }

        // Player gets disrupted!
        SFX.wrong();
        showToast("⚠️ ĐỐI THỦ TẤN CÔNG!", "Màn hình của bạn bị làm mờ trong 1.5 giây!", "warning");
        const gameArea = document.getElementById('battle-game-area');
        if (gameArea) {
            gameArea.classList.add('disrupt-screen-active');
            setTimeout(() => {
                if (gameArea) gameArea.classList.remove('disrupt-screen-active');
            }, 1500);
        }
    }

    updateHUD() {
        const playerBar = document.getElementById('battle-player-bar');
        const playerPctText = document.getElementById('battle-player-pct');
        const opponentBar = document.getElementById('battle-opponent-bar');
        const opponentPctText = document.getElementById('battle-opponent-pct');

        if (playerBar) playerBar.style.width = `${Math.min(100, Math.round(this.playerProgress))}%`;
        if (playerPctText) playerPctText.textContent = `${Math.min(100, Math.round(this.playerProgress))}%`;

        if (opponentBar) opponentBar.style.width = `${Math.min(100, Math.round(this.opponentProgress))}%`;
        if (opponentPctText) opponentPctText.textContent = `${Math.min(100, Math.round(this.opponentProgress))}%`;
    }

    renderBattleSkills() {
        const container = document.getElementById('battle-skills-container');
        if (!container) return;

        container.innerHTML = '';
        const equipped = SkillManager.getEquippedSkills();

        if (equipped.length === 0) {
            container.innerHTML = `<span class="text-xs text-white-50">Chưa trang bị kỹ năng nào.</span>`;
            return;
        }

        equipped.forEach(skill => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.id = `btn-skill-${skill.id}`;
            btn.className = 'battle-skill-btn text-white';
            btn.innerHTML = `
                <i class="bi ${skill.icon} fs-5" style="color: ${skill.badgeColor}"></i>
                <span class="text-xxs fw-bold mt-1 text-truncate px-1">${skill.name}</span>
                <div class="cooldown-overlay d-none" id="cd-${skill.id}"></div>
            `;
            btn.addEventListener('click', () => this.activateSkill(skill));
            container.appendChild(btn);
        });
    }

    activateSkill(skill) {
        if (this.isBattleOver) return;
        if (this.skillsCooldowns[skill.id]) return;

        SFX.skillActivate();

        // 1. Trigger skill mechanical effect
        if (skill.type === 'buff') {
            if (skill.id === 'skill_hint' && this.gameInstance && this.gameInstance.applyHint) {
                this.gameInstance.applyHint();
                showToast("✨ Kỹ năng kích hoạt!", "Đã định vị mục tiêu tiếp theo.", "info");
            } else if (skill.id === 'skill_auto' && this.gameInstance && this.gameInstance.autoSolveNext) {
                this.gameInstance.autoSolveNext();
                showToast("⚡ Kỹ năng kích hoạt!", "Đã tự động giải quyết 1 mục tiêu.", "info");
            }
        } else if (skill.type === 'debuff') {
            this.opponentDisrupted = true;
            const oppTag = document.getElementById('opponent-hud-status');
            if (oppTag) {
                oppTag.textContent = "BỊ NHIỄU SÓNG!";
                oppTag.className = "badge bg-danger text-xxs animate-pulse";
            }
            showToast("⚡ Gây nhiễu thành công!", "Đối thủ bị đình trệ thao tác trong 1.5 giây.", "warning");

            setTimeout(() => {
                this.opponentDisrupted = false;
                if (oppTag) {
                    oppTag.textContent = "Bình thường";
                    oppTag.className = "badge bg-secondary text-xxs";
                }
            }, 1500);
        } else if (skill.type === 'shield') {
            this.shieldActive = true;
            document.body.classList.add('shield-screen-active');
            showToast("🛡️ Khiên tâm trí kích hoạt!", "Sẵn sàng chặn 1 đòn debuff trong 5 giây.", "success");
            setTimeout(() => {
                this.shieldActive = false;
                document.body.classList.remove('shield-screen-active');
            }, 5000);
        }

        // 2. Start Cooldown
        this.startSkillCooldown(skill);
    }

    startSkillCooldown(skill) {
        this.skillsCooldowns[skill.id] = true;
        const btn = document.getElementById(`btn-skill-${skill.id}`);
        const overlay = document.getElementById(`cd-${skill.id}`);

        if (btn) btn.disabled = true;
        if (overlay) overlay.classList.remove('d-none');

        let cd = skill.cooldown;
        if (overlay) overlay.textContent = `${cd}s`;

        const cdInterval = setInterval(() => {
            cd--;
            if (overlay) overlay.textContent = `${cd}s`;
            if (cd <= 0) {
                clearInterval(cdInterval);
                this.skillsCooldowns[skill.id] = false;
                if (btn) btn.disabled = false;
                if (overlay) overlay.classList.add('d-none');
            }
        }, 1000);
    }

    endBattle(outcome) {
        if (this.isBattleOver) return;
        this.isBattleOver = true;

        if (this.opponentInterval) clearInterval(this.opponentInterval);
        if (this.battleTimerInterval) clearInterval(this.battleTimerInterval);
        if (this.gameInstance && this.gameInstance.stopTimer) this.gameInstance.stopTimer();

        const finalUserTime = parseFloat(this.elapsedSeconds.toFixed(1));
        const finalOpponentTime = outcome === 'VICTORY' ? parseFloat((finalUserTime + 1.8).toFixed(1)) : finalUserTime;

        let expGain = 0;
        let pointsGain = 0;
        let cupsGain = 0;

        if (outcome === 'VICTORY') {
            SFX.victory();
            expGain = 250;
            pointsGain = 75;
            cupsGain = 30;
        } else {
            SFX.defeat();
            expGain = 80;
            pointsGain = 20;
            cupsGain = -15;
        }

        const updateResult = AppState.updateExpAndPoints(expGain, pointsGain);

        AppState.recordMatchResult({
            id: 'm_' + Date.now(),
            type: 'PvP 1v1',
            challenge: `${this.challengeType === 'schulte' ? 'Schulte Table' : 'Stroop Test'} Lv.${this.level}`,
            opponent: this.opponent.name,
            result: outcome,
            time: `${finalUserTime}s`,
            points: `+${pointsGain}`,
            date: 'Vừa xong'
        });

        const battleResult = {
            outcome,
            gameType: this.challengeType === 'schulte' ? 'Bảng Schulte' : 'Thử Thách Stroop',
            level: this.level,
            userTime: finalUserTime,
            opponentName: this.opponent.name,
            opponentAvatar: this.opponent.avatar,
            opponentTime: finalOpponentTime,
            accuracy: '96%',
            skillsUsed: Object.keys(this.skillsCooldowns).length,
            expGain,
            pointsGain,
            cupsGain,
            levelUp: updateResult.levelUpOccurred,
            unlockedSkill: updateResult.newlyUnlockedSkill ? updateResult.newlyUnlockedSkill.name : null
        };
        localStorage.setItem(STORAGE_KEYS.BATTLE_RESULT, JSON.stringify(battleResult));

        setTimeout(() => {
            const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
            window.location.href = `${prefix}result.html`;
        }, 1200);
    }
}

window.PvPManager = PvPManager;
window.BattleController = BattleController;
