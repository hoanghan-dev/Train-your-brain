/**
 * BrainArena Home Dashboard Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    function renderHomeDashboard() {
        const player = AppState.getPlayer();

        // Populate player header
        const avatarEl = document.getElementById('player-avatar');
        if (avatarEl) avatarEl.textContent = player.avatar;

        const usernameEl = document.getElementById('player-username');
        if (usernameEl) usernameEl.textContent = player.username;

        const levelBadgeEl = document.getElementById('player-level-badge');
        if (levelBadgeEl) levelBadgeEl.textContent = `Lv.${player.level}`;

        const rankEl = document.getElementById('player-rank');
        if (rankEl) rankEl.textContent = `#${player.rank}`;

        const cupsEl = document.getElementById('player-cups');
        if (cupsEl) cupsEl.textContent = (player.cups || 1450).toLocaleString();

        const badge = BADGES_DATA.find(b => b.id === player.equippedBadge);
        const badgeNameEl = document.getElementById('player-badge-name');
        if (badgeNameEl && badge) {
            badgeNameEl.textContent = `${badge.icon} ${badge.name}`;
        }

        const expPct = Math.round((player.exp / player.maxExp) * 100);
        const expBarEl = document.getElementById('player-exp-bar');
        if (expBarEl) expBarEl.style.width = `${expPct}%`;

        const expTextEl = document.getElementById('player-exp-text');
        if (expTextEl) expTextEl.textContent = `${player.exp} / ${player.maxExp} EXP`;

        // Thống kê Challenges
        if (player.challenges) {
            if (player.challenges.schulte) {
                const sc = player.challenges.schulte;
                const scLvlEl = document.getElementById('schulte-lvl-tag');
                if (scLvlEl) scLvlEl.textContent = `Level ${sc.level} (${sc.level === 1 ? '3x3' : sc.level === 2 ? '4x4' : '5x5'})`;

                const scBestEl = document.getElementById('schulte-best');
                if (scBestEl) scBestEl.textContent = sc.bestTime ? `${sc.bestTime}s` : 'Chưa có';

                const scPct = sc.level === 3 ? 100 : (sc.currentStreak > 0 ? 80 : 30);
                const scPctText = document.getElementById('schulte-pct-text');
                if (scPctText) scPctText.textContent = `${scPct}%`;

                const scBarEl = document.getElementById('schulte-progress-bar');
                if (scBarEl) scBarEl.style.width = `${scPct}%`;
            }

            if (player.challenges.stroop) {
                const st = player.challenges.stroop;
                const stLvlEl = document.getElementById('stroop-lvl-tag');
                if (stLvlEl) stLvlEl.textContent = `Level ${st.level}`;

                const stBestEl = document.getElementById('stroop-best');
                if (stBestEl) stBestEl.textContent = st.bestScore ? `${st.bestScore} pts` : 'Chưa có';

                const stPct = st.level === 3 ? 100 : (st.currentStreak > 0 ? 70 : 40);
                const stPctText = document.getElementById('stroop-pct-text');
                if (stPctText) stPctText.textContent = `${stPct}%`;

                const stBarEl = document.getElementById('stroop-progress-bar');
                if (stBarEl) stBarEl.style.width = `${stPct}%`;
            }
        }

        // Lịch sử trận đấu gần đây
        const matchesContainer = document.getElementById('recent-matches-container');
        if (matchesContainer) {
            const matches = player.recentMatches || [];
            if (matches.length === 0) {
                matchesContainer.innerHTML = `<div class="text-xs text-white-50 text-center py-3">Chưa có dữ liệu trận đấu. Hãy bắt đầu một trận ngay!</div>`;
            } else {
                matchesContainer.innerHTML = matches.slice(0, 3).map(m => {
                    const isWin = m.result === 'VICTORY' || m.result === 'COMPLETED';
                    return `
                        <div class="d-flex align-items-center justify-content-between p-2 rounded-2 mb-2 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge ${isWin ? 'bg-success' : 'bg-danger'} text-xxs">${m.result}</span>
                                <div>
                                    <div class="text-xs fw-bold text-white">${m.challenge}</div>
                                    <div class="text-xxs text-white-50">vs ${m.opponent} • ${m.date}</div>
                                </div>
                            </div>
                            <div class="text-end">
                                <div class="text-xs fw-bold text-cyan">${m.time}</div>
                                <span class="text-xxs text-amber">${m.points} BP</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    renderHomeDashboard();
    window.addEventListener('brainarena:player_updated', renderHomeDashboard);
});
