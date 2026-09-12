/**
 * BrainArena Sound Synthesizer Engine
 * Tạo hiệu ứng âm thanh trực tiếp qua Web Audio API (không cần tải file ngoài)
 */

class SoundEffects {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
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
            // Safe fallback
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

// Bắt sự kiện click tự động cho các phần tử tương tác
document.addEventListener('click', (e) => {
    const target = e.target.closest('button, .btn, .nav-link, .interactive-card, .clickable');
    if (target) {
        SFX.click();
    }
});
