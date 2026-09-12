/**
 * BrainArena Profile Page Script
 * Hiển thị hồ sơ cá nhân, chỉ số, danh sách kỹ năng loadout và lịch sử đấu
 */

function confirmReset() {
    if (confirm("Bạn có chắc chắn muốn khôi phục dữ liệu ban đầu? Thao tác này sẽ đặt lại level, điểm số và các kỹ năng để tiện test lại từ đầu.")) {
        AppState.resetPlayerToDefault();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    function renderProfile() {
        const player = AppState.getPlayer();

        const avatarEl = document.getElementById('prof-avatar');
        if (avatarEl) avatarEl.textContent = player.avatar;

        const usernameEl = document.getElementById('prof-username');
        if (usernameEl) usernameEl.textContent = player.username;

        const lvlEl = document.getElementById('prof-level-badge');
        if (lvlEl) lvlEl.textContent = `Lv.${player.level}`;

        const bpEl = document.getElementById('prof-bp');
        if (bpEl) bpEl.textContent = `${(player.brainPoints || 0).toLocaleString()} BP`;

        const cupsEl = document.getElementById('prof-cups');
        if (cupsEl) cupsEl.textContent = `${(player.cups || 1450).toLocaleString()} 🏆`;

        const badge = BADGES_DATA.find(b => b.id === player.equippedBadge);
        const badgeEl = document.getElementById('prof-badge');
        if (badgeEl && badge) {
            badgeEl.textContent = `${badge.icon} ${badge.name}`;
        }

        const expPct = Math.round((player.exp / player.maxExp) * 100);
        const expBarEl = document.getElementById('prof-exp-bar');
        if (expBarEl) expBarEl.style.width = `${expPct}%`;

        const expTextEl = document.getElementById('prof-exp-text');
        if (expTextEl) expTextEl.textContent = `${player.exp} / ${player.maxExp} EXP`;

        if (player.challenges) {
            if (player.challenges.schulte) {
                const scBestEl = document.getElementById('prof-sc-best');
                if (scBestEl) scBestEl.textContent = player.challenges.schulte.bestTime ? `${player.challenges.schulte.bestTime}s` : 'Chưa có';
            }
            if (player.challenges.stroop) {
                const stBestEl = document.getElementById('prof-st-best');
                if (stBestEl) stBestEl.textContent = player.challenges.stroop.bestScore ? `${player.challenges.stroop.bestScore} pts` : 'Chưa có';
            }
        }

        // Render 3 equipped skills
        const skillsList = document.getElementById('prof-skills-list');
        if (skillsList) {
            const equipped = SkillManager.getEquippedSkills();
            if (equipped.length === 0) {
                skillsList.innerHTML = `<div class="col-12 text-xs text-white-50">Chưa trang bị kỹ năng nào.</div>`;
            } else {
                skillsList.innerHTML = equipped.map(s => `
                    <div class="col-12 col-md-4">
                        <div class="p-2 rounded-2 bg-dark border border-secondary border-opacity-25 d-flex align-items-center gap-2">
                            <i class="bi ${s.icon} fs-4" style="color: ${s.badgeColor}"></i>
                            <div>
                                <div class="text-xs fw-bold text-white">${s.name}</div>
                                <div class="text-xxs text-white-50">${s.type.toUpperCase()} • Hồi ${s.cooldown}s</div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Render Match History
        const histContainer = document.getElementById('prof-match-history');
        if (histContainer) {
            const matches = player.recentMatches || [];
            if (matches.length === 0) {
                histContainer.innerHTML = `<div class="text-xs text-white-50 text-center py-3">Chưa có trận đấu nào.</div>`;
            } else {
                histContainer.innerHTML = matches.map(m => {
                    const isWin = m.result === 'VICTORY' || m.result === 'COMPLETED';
                    return `
                        <div class="d-flex align-items-center justify-content-between p-3 rounded-2 mb-2 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
                            <div class="d-flex align-items-center gap-3">
                                <span class="badge ${isWin ? 'bg-success' : 'bg-danger'} text-xxs px-2 py-1">${m.result}</span>
                                <div>
                                    <div class="text-sm fw-bold text-white">${m.challenge}</div>
                                    <div class="text-xs text-white-50">vs ${m.opponent} • ${m.date}</div>
                                </div>
                            </div>
                            <div class="text-end">
                                <div class="text-sm fw-bold text-cyan">${m.time}</div>
                                <span class="text-xs text-amber">${m.points} BP</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    renderProfile();
    window.addEventListener('brainarena:player_updated', renderProfile);

    // Gắn sự kiện nút reset dữ liệu
    const resetBtn = document.getElementById('btn-reset-data-profile');
    if (resetBtn) {
        resetBtn.addEventListener('click', confirmReset);
    }
});
