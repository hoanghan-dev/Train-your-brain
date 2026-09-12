/**
 * BrainArena Battle Result Page Script
 */

function playAgain() {
    const rawResult = localStorage.getItem(STORAGE_KEYS.BATTLE_RESULT);
    if (rawResult) {
        try {
            const res = JSON.parse(rawResult);
            const challenge = (res.gameType && res.gameType.includes('Schulte')) ? 'schulte' : 'stroop';
            if (res.opponentName) {
                window.location.href = `battle.html?challenge=${challenge}&level=${res.level || 2}`;
                return;
            } else {
                window.location.href = `${challenge}.html?level=${res.level || 1}`;
                return;
            }
        } catch (e) {
            // fallback below
        }
    }
    window.location.href = 'challenges.html';
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const rawResult = localStorage.getItem(STORAGE_KEYS.BATTLE_RESULT);
    let result = null;

    if (rawResult) {
        try {
            result = JSON.parse(rawResult);
        } catch (e) {
            console.error(e);
        }
    }

    // Dữ liệu dự phòng nếu người dùng mở trực tiếp trang kết quả
    if (!result) {
        result = {
            outcome: 'VICTORY',
            gameType: 'Bảng Schulte',
            level: 2,
            userTime: 12.8,
            opponentName: 'NeuroAce',
            opponentTime: 15.2,
            accuracy: '100%',
            skillsUsed: 2,
            expGain: 250,
            pointsGain: 75,
            cupsGain: 30,
            levelUp: false
        };
    }

    const isWin = result.outcome === 'VICTORY' || result.outcome === 'COMPLETED';
    const outcomeTitle = document.getElementById('outcome-title');
    const outcomeIcon = document.getElementById('outcome-icon');
    const resultCard = document.getElementById('result-card');

    if (outcomeTitle && outcomeIcon && resultCard) {
        if (isWin) {
            outcomeTitle.textContent = result.outcome === 'COMPLETED' ? "HOÀN THÀNH!" : "CHIẾN THẮNG!";
            outcomeTitle.className = "display-6 fw-bold mb-1 text-gradient-cyan";
            outcomeIcon.textContent = "🏆";
            resultCard.classList.add('border-primary');
        } else {
            outcomeTitle.textContent = "THẤT BẠI!";
            outcomeTitle.className = "display-6 fw-bold mb-1 text-rose";
            outcomeIcon.textContent = "💀";
            resultCard.classList.add('border-danger');
        }
    }

    const subTitleEl = document.getElementById('outcome-subtitle');
    if (subTitleEl) subTitleEl.textContent = `${result.gameType} • Level ${result.level}`;

    const userTimeEl = document.getElementById('stat-user-time');
    if (userTimeEl) userTimeEl.textContent = `${result.userTime}s`;

    const rowOppTime = document.getElementById('row-opp-time');
    const colCups = document.getElementById('col-cups');

    if (result.opponentName) {
        const oppNameEl = document.getElementById('stat-opp-name');
        if (oppNameEl) oppNameEl.textContent = result.opponentName;

        const oppTimeEl = document.getElementById('stat-opp-time');
        if (oppTimeEl) oppTimeEl.textContent = `${result.opponentTime}s (${result.opponentName})`;
    } else {
        if (rowOppTime) rowOppTime.style.display = 'none';
        if (colCups) colCups.style.display = 'none';
    }

    const accEl = document.getElementById('stat-accuracy');
    if (accEl) accEl.textContent = result.accuracy || '96%';

    const skillsUsedEl = document.getElementById('stat-skills-used');
    if (skillsUsedEl) skillsUsedEl.textContent = `${result.skillsUsed || 0} lần`;

    const rewardExpEl = document.getElementById('reward-exp');
    if (rewardExpEl) rewardExpEl.textContent = `+${result.expGain} EXP`;

    const rewardBpEl = document.getElementById('reward-bp');
    if (rewardBpEl) rewardBpEl.textContent = `+${result.pointsGain} BP`;

    if (result.cupsGain !== undefined) {
        const cupsEl = document.getElementById('reward-cups');
        if (cupsEl) {
            if (result.cupsGain >= 0) {
                cupsEl.textContent = `+${result.cupsGain} 🏆`;
                cupsEl.className = "fw-bold text-success text-sm";
            } else {
                cupsEl.textContent = `${result.cupsGain} 🏆`;
                cupsEl.className = "fw-bold text-danger text-sm";
            }
        }
    }

    // Hiển thị banner thăng cấp nếu có
    if (result.levelUp) {
        const banner = document.getElementById('level-up-banner');
        if (banner) {
            banner.classList.remove('d-none');
            const detailEl = document.getElementById('level-up-detail');
            if (detailEl && result.unlockedSkill) {
                detailEl.innerHTML = `Bạn vừa mở khóa kỹ năng mới: <b>${result.unlockedSkill}</b>! Hãy vào Loadout trang bị ngay.`;
            }
        }
    }

    // Nút chơi lại
    const playAgainBtn = document.getElementById('btn-play-again');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', playAgain);
    }
});
