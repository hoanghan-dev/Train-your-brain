/**
 * BrainArena Core App Engine & State Management
 * Sourced from PRODUCT_OVERVIEW_AND_USER_STORIES.md
 */

class SoundEffects {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type = 'sine', duration = 0.1, gainValue = 0.15) {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio error ignored safely
        }
    }

    click() {
        this.playTone(600, 'sine', 0.05, 0.08);
    }

    correct() {
        this.playTone(880, 'sine', 0.12, 0.15);
        setTimeout(() => this.playTone(1174, 'sine', 0.15, 0.12), 80);
    }

    wrong() {
        this.playTone(220, 'sawtooth', 0.2, 0.2);
        setTimeout(() => this.playTone(180, 'sawtooth', 0.25, 0.2), 100);
    }

    countdown() {
        this.playTone(440, 'triangle', 0.08, 0.15);
    }

    countdownStart() {
        this.playTone(880, 'triangle', 0.25, 0.2);
    }

    skillActivate() {
        this.playTone(523.25, 'sine', 0.1, 0.15);
        setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.15), 60);
        setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.2), 120);
    }

    shieldBlock() {
        this.playTone(330, 'square', 0.15, 0.15);
        setTimeout(() => this.playTone(660, 'sine', 0.2, 0.2), 80);
    }

    victory() {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.3, 0.2), i * 140);
        });
    }

    defeat() {
        [440, 415, 392, 349].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sawtooth', 0.25, 0.15), i * 160);
        });
    }
}

const SFX = new SoundEffects();

// State Manager
const AppState = {
    getPlayer() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.PLAYER);
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            console.error("Failed to load player from localStorage", e);
        }
        this.savePlayer(INITIAL_PLAYER);
        return INITIAL_PLAYER;
    },

    savePlayer(player) {
        try {
            localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(player));
            window.dispatchEvent(new CustomEvent('brainarena:player_updated', { detail: player }));
        } catch (e) {
            console.error("Failed to save player", e);
        }
    },

    resetPlayerToDefault() {
        this.savePlayer(INITIAL_PLAYER);
        showToast("Đã khôi phục dữ liệu gốc", "Dữ liệu người chơi đã được đưa về trạng thái khởi tạo.", "info");
        setTimeout(() => window.location.reload(), 600);
    },

    updateExpAndPoints(expGain, pointsGain, winStreakIncrement = 0) {
        const player = this.getPlayer();
        player.exp += expGain;
        player.brainPoints += pointsGain;

        let levelUpOccurred = false;
        let newlyUnlockedSkill = null;

        while (player.exp >= player.maxExp) {
            player.exp -= player.maxExp;
            player.level += 1;
            player.maxExp = Math.round(player.maxExp * 1.35);
            levelUpOccurred = true;

            // Check skill unlock criteria (US-06: Lv.2, Lv.3, Lv.5)
            SKILLS_DATA.forEach(skill => {
                if (player.level >= skill.unlockLevel && !player.unlockedSkills.includes(skill.id)) {
                    player.unlockedSkills.push(skill.id);
                    newlyUnlockedSkill = skill;
                }
            });
        }

        this.savePlayer(player);

        if (levelUpOccurred) {
            SFX.victory();
            showToast(
                `🎉 THĂNG CẤP! LEVEL ${player.level}`,
                newlyUnlockedSkill ? `Bạn đã mở khóa kỹ năng mới: <b>${newlyUnlockedSkill.name}</b>!` : "Chúc mừng bạn đã đạt cấp độ mới!",
                "success"
            );
        }

        return { levelUpOccurred, newlyUnlockedSkill, player };
    },

    recordMatchResult(matchRecord) {
        const player = this.getPlayer();
        player.recentMatches.unshift(matchRecord);
        if (player.recentMatches.length > 10) {
            player.recentMatches.pop();
        }

        if (matchRecord.result === "VICTORY") {
            player.cups = (player.cups || 1450) + 30;
            if (player.rank > 1) player.rank -= 1;
        } else if (matchRecord.result === "DEFEAT") {
            player.cups = Math.max(1000, (player.cups || 1450) - 15);
        }

        this.savePlayer(player);
    }
};

// Toast notification helper
function showToast(title, message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }

    const toastId = 'toast_' + Date.now();
    const typeIcons = {
        success: 'bi-check-circle-fill text-success',
        warning: 'bi-exclamation-triangle-fill text-warning',
        error: 'bi-x-circle-fill text-danger',
        info: 'bi-info-circle-fill text-primary'
    };

    const icon = typeIcons[type] || typeIcons.info;

    const toastEl = document.createElement('div');
    toastEl.id = toastId;
    toastEl.className = `toast align-items-center text-white bg-dark border-secondary show shadow-lg mb-2`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
        <div class="d-flex p-2">
            <div class="toast-body d-flex align-items-start gap-2">
                <i class="bi ${icon} fs-5 mt-0"></i>
                <div>
                    <div class="fw-bold mb-1">${title}</div>
                    <div class="small text-white-50">${message}</div>
                </div>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    container.appendChild(toastEl);

    toastEl.querySelector('.btn-close').addEventListener('click', () => {
        toastEl.remove();
    });

    setTimeout(() => {
        if (toastEl.parentNode) {
            toastEl.classList.remove('show');
            setTimeout(() => toastEl.remove(), 300);
        }
    }, 4000);
}

// Global click sound delegation
document.addEventListener('click', (e) => {
    const target = e.target.closest('button, .btn, .nav-link, .interactive-card, .clickable');
    if (target) {
        SFX.click();
    }
});

// User check for auth protection
function checkAuth() {
    const isLoginPage = window.location.pathname.includes('login.html');
    const userLoggedIn = localStorage.getItem('brainarena_is_logged_in') === 'true';

    if (!userLoggedIn && !isLoginPage) {
        // Redirect to login if unauthenticated
        const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
        window.location.href = prefix + 'login.html';
    }
}
