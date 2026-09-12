/**
 * BrainArena Real-time Battle Controller
 * Điều phối vòng lặp thi đấu 1v1, overlay 3-2-1, tiến độ đối thủ bot,
 * và kích hoạt 3 kỹ năng chiến thuật có hồi chiêu
 */

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

        // Trạng thái kỹ năng
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
        if (typeof SFX !== 'undefined') SFX.countdown();

        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                countText.textContent = count;
                if (typeof SFX !== 'undefined') SFX.countdown();
            } else if (count === 0) {
                countText.textContent = "BẮT ĐẦU!";
                if (typeof SFX !== 'undefined') SFX.countdownStart();
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

        // Khởi động đồng hồ trận đấu
        this.battleTimerInterval = setInterval(() => {
            if (this.isBattleOver) return;
            this.elapsedSeconds += 0.1;
            const timerEl = document.getElementById('battle-timer');
            if (timerEl) timerEl.textContent = this.elapsedSeconds.toFixed(1) + 's';
        }, 100);

        // Gắn mini-game
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
                () => {}
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

        // Bắt đầu mô phỏng tiến độ đối thủ
        this.startOpponentSimulation();

        // Hiển thị 3 nút kỹ năng trang bị
        this.renderBattleSkills();
    }

    startOpponentSimulation() {
        this.opponentInterval = setInterval(() => {
            if (this.isBattleOver) return;

            if (this.opponentDisrupted) {
                return; // Đối thủ bị khựng khi dính debuff
            }

            const increment = (Math.random() * 3.5 + 2.0);
            this.opponentProgress = Math.min(100, this.opponentProgress + increment);
            this.updateHUD();

            // Xác suất đối thủ phản công ngẫu nhiên
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
            // Khiên tâm trí đỡ đòn
            if (typeof SFX !== 'undefined') SFX.shieldBlock();
            if (typeof showToast === 'function') {
                showToast("🛡️ KHIÊN ĐÃ CHẶN ĐÒN!", "Khiên tâm trí đã bảo vệ bạn khỏi kỹ năng của đối thủ!", "success");
            }
            this.shieldActive = false;
            document.body.classList.remove('shield-screen-active');
            return;
        }

        // Bị dính debuff làm mờ và rung màn hình
        if (typeof SFX !== 'undefined') SFX.wrong();
        if (typeof showToast === 'function') {
            showToast("⚠️ ĐỐI THỦ TẤN CÔNG!", "Màn hình của bạn bị làm mờ trong 1.5 giây!", "warning");
        }
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

        if (typeof SFX !== 'undefined') SFX.skillActivate();

        if (skill.type === 'buff') {
            if (skill.id === 'skill_hint' && this.gameInstance && this.gameInstance.applyHint) {
                this.gameInstance.applyHint();
                if (typeof showToast === 'function') {
                    showToast("✨ Kỹ năng kích hoạt!", "Đã định vị mục tiêu tiếp theo.", "info");
                }
            } else if (skill.id === 'skill_auto' && this.gameInstance && this.gameInstance.autoSolveNext) {
                this.gameInstance.autoSolveNext();
                if (typeof showToast === 'function') {
                    showToast("⚡ Kỹ năng kích hoạt!", "Đã tự động giải quyết 1 mục tiêu.", "info");
                }
            }
        } else if (skill.type === 'debuff') {
            this.opponentDisrupted = true;
            const oppTag = document.getElementById('opponent-hud-status');
            if (oppTag) {
                oppTag.textContent = "BỊ NHIỄU SÓNG!";
                oppTag.className = "badge bg-danger text-xxs animate-pulse";
            }
            if (typeof showToast === 'function') {
                showToast("⚡ Gây nhiễu thành công!", "Đối thủ bị đình trệ thao tác trong 1.5 giây.", "warning");
            }

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
            if (typeof showToast === 'function') {
                showToast("🛡️ Khiên tâm trí kích hoạt!", "Sẵn sàng chặn 1 đòn debuff trong 5 giây.", "success");
            }
            setTimeout(() => {
                this.shieldActive = false;
                document.body.classList.remove('shield-screen-active');
            }, 5000);
        }

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
            if (typeof SFX !== 'undefined') SFX.victory();
            expGain = 250;
            pointsGain = 75;
            cupsGain = 30;
        } else {
            if (typeof SFX !== 'undefined') SFX.defeat();
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

window.BattleController = BattleController;
