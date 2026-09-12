/**
 * BrainArena Solo Challenges Page Script
 */

let selectedSchulteLvl = 2;
let selectedStroopLvl = 1;

function selectLevel(challenge, lvl) {
    const player = AppState.getPlayer();

    if (challenge === 'schulte') {
        const unlockedLvl = (player.challenges && player.challenges.schulte) ? player.challenges.schulte.level : 1;
        if (lvl > unlockedLvl) {
            if (typeof SFX !== 'undefined') SFX.wrong();
            if (typeof showToast === 'function') {
                showToast("Cấp độ bị khóa", `Hoàn thành Bảng Schulte Level ${lvl - 1} để mở khóa cấp độ này!`, "warning");
            }
            return;
        }

        selectedSchulteLvl = lvl;
        const selector = document.getElementById('schulte-level-selector');
        if (selector) {
            const btns = selector.querySelectorAll('button');
            btns.forEach((b, idx) => {
                const bLvl = idx + 1;
                if (bLvl === lvl) {
                    b.className = 'btn btn-sm btn-cyan flex-grow-1 fw-bold';
                } else if (bLvl <= unlockedLvl) {
                    b.className = 'btn btn-sm btn-glass flex-grow-1 text-white';
                }
            });
        }
        const linkPlay = document.getElementById('link-play-schulte');
        if (linkPlay) linkPlay.href = `schulte.html?level=${lvl}`;
        if (typeof showToast === 'function') {
            showToast("Đã chọn", `Bảng Schulte: Level ${lvl} (${lvl === 1 ? '3x3' : lvl === 2 ? '4x4' : '5x5'})`, "info");
        }
    } else if (challenge === 'stroop') {
        const unlockedLvl = (player.challenges && player.challenges.stroop) ? player.challenges.stroop.level : 1;
        if (lvl > unlockedLvl) {
            if (typeof SFX !== 'undefined') SFX.wrong();
            if (typeof showToast === 'function') {
                showToast("Cấp độ bị khóa", `Hoàn thành Thử Thách Stroop Level ${lvl - 1} với độ chính xác trên 70% để mở khóa!`, "warning");
            }
            return;
        }

        selectedStroopLvl = lvl;
        const selector = document.getElementById('stroop-level-selector');
        if (selector) {
            const btns = selector.querySelectorAll('button');
            btns.forEach((b, idx) => {
                const bLvl = idx + 1;
                if (bLvl === lvl) {
                    b.className = 'btn btn-sm btn-cyan flex-grow-1 fw-bold';
                } else if (bLvl <= unlockedLvl) {
                    b.className = 'btn btn-sm btn-glass flex-grow-1 text-white';
                }
            });
        }
        const linkPlay = document.getElementById('link-play-stroop');
        if (linkPlay) linkPlay.href = `stroop.html?level=${lvl}`;
        if (typeof showToast === 'function') {
            showToast("Đã chọn", `Thử Thách Stroop: Level ${lvl}`, "info");
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const player = AppState.getPlayer();

    // Schulte card
    if (player.challenges && player.challenges.schulte) {
        const sc = player.challenges.schulte;
        const cardLvl = document.getElementById('schulte-card-level');
        if (cardLvl) cardLvl.textContent = `Lv. ${sc.level} (${sc.level === 1 ? '3x3' : sc.level === 2 ? '4x4' : '5x5'})`;

        const cardBest = document.getElementById('schulte-card-best');
        if (cardBest) cardBest.textContent = sc.bestTime ? `${sc.bestTime}s` : 'Chưa có';

        const cardPlays = document.getElementById('schulte-card-plays');
        if (cardPlays) cardPlays.textContent = `${sc.totalPlays || 0} lượt`;

        // Mở khóa các nút level
        const btnLv2 = document.getElementById('btn-sc-lv2');
        if (btnLv2 && sc.level >= 2) {
            btnLv2.className = 'btn btn-sm btn-glass flex-grow-1 text-white';
            btnLv2.innerHTML = 'Lv.2 (4x4)';
        }

        const btnLv3 = document.getElementById('btn-sc-lv3');
        if (btnLv3 && sc.level >= 3) {
            btnLv3.className = 'btn btn-sm btn-glass flex-grow-1 text-white';
            btnLv3.innerHTML = 'Lv.3 (5x5)';
        }

        selectLevel('schulte', Math.min(sc.level, 2));
    }

    // Stroop card
    if (player.challenges && player.challenges.stroop) {
        const st = player.challenges.stroop;
        const cardLvl = document.getElementById('stroop-card-level');
        if (cardLvl) cardLvl.textContent = `Lv. ${st.level}`;

        const cardBest = document.getElementById('stroop-card-best');
        if (cardBest) cardBest.textContent = st.bestScore ? `${st.bestScore} pts` : 'Chưa có';

        const cardPlays = document.getElementById('stroop-card-plays');
        if (cardPlays) cardPlays.textContent = `${st.totalPlays || 0} lượt`;

        const btnStLv2 = document.getElementById('btn-st-lv2');
        if (btnStLv2 && st.level >= 2) {
            btnStLv2.className = 'btn btn-sm btn-glass flex-grow-1 text-white';
            btnStLv2.innerHTML = 'Lv.2 (15 câu)';
        }

        const btnStLv3 = document.getElementById('btn-st-lv3');
        if (btnStLv3 && st.level >= 3) {
            btnStLv3.className = 'btn btn-sm btn-glass flex-grow-1 text-white';
            btnStLv3.innerHTML = 'Lv.3 (20 câu)';
        }

        selectLevel('stroop', st.level || 1);
    }
});
