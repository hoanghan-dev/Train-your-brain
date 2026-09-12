/**
 * BrainArena Matchmaking Page Script
 */

let seconds = 0;
let matchTimer = null;

function cancelMatch() {
    if (matchTimer) clearInterval(matchTimer);
    if (typeof showToast === 'function') {
        showToast("Đã hủy", "Đã hủy tìm kiếm trận đấu.", "info");
    }
    setTimeout(() => {
        window.location.href = 'pvp.html';
    }, 400);
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const urlParams = new URLSearchParams(window.location.search);
    const challenge = urlParams.get('challenge') || 'schulte';
    const level = parseInt(urlParams.get('level')) || 2;

    const titleEl = document.getElementById('mm-title');
    const subtitleEl = document.getElementById('mm-subtitle');
    const stepEl = document.getElementById('mm-step');
    const timerEl = document.getElementById('mm-timer');
    const modeEl = document.getElementById('mm-mode');
    const oppCard = document.getElementById('opponent-found-card');

    if (modeEl) {
        modeEl.textContent = `${challenge === 'schulte' ? 'Bảng Schulte' : 'Thử Thách Stroop'} • Level ${level}`;
    }

    function onFound() {
        if (typeof SFX !== 'undefined') SFX.victory();
        const opponent = MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];

        if (titleEl) titleEl.textContent = "ĐÃ TÌM THẤY ĐỐI THỦ!";
        if (subtitleEl) subtitleEl.textContent = "Đang chuyển vào đấu trường...";
        if (stepEl) stepEl.innerHTML = `<span class="text-success fw-bold">Sẵn sàng!</span>`;

        if (oppCard) {
            document.getElementById('opp-avatar').textContent = opponent.avatar;
            document.getElementById('opp-name').textContent = opponent.name;
            document.getElementById('opp-stats').textContent = `Lv.${opponent.level} • Rank #${opponent.rank} • Winrate ${opponent.winRate}`;
            oppCard.classList.remove('d-none');
        }

        localStorage.setItem(STORAGE_KEYS.OPPONENT, JSON.stringify(opponent));
        localStorage.setItem(STORAGE_KEYS.CURRENT_MATCH, JSON.stringify({
            challengeType: challenge,
            level,
            opponent,
            roomType: 'RANDOM'
        }));

        setTimeout(() => {
            window.location.href = `battle.html?challenge=${challenge}&level=${level}`;
        }, 1500);
    }

    matchTimer = setInterval(() => {
        seconds++;
        if (timerEl) timerEl.textContent = `00:0${seconds}s`;

        if (seconds === 1) {
            if (stepEl) stepEl.textContent = "Tìm thấy phòng đấu phù hợp...";
        } else if (seconds === 2) {
            if (stepEl) stepEl.textContent = "Đang đồng bộ dữ liệu hai người chơi...";
        } else if (seconds >= 3) {
            clearInterval(matchTimer);
            onFound();
        }
    }, 1000);

    const cancelBtn = document.getElementById('btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelMatch);
    }
});
