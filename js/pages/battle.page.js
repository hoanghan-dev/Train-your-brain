/**
 * BrainArena Battle Arena Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const urlParams = new URLSearchParams(window.location.search);
    const challenge = urlParams.get('challenge') || 'schulte';
    const level = parseInt(urlParams.get('level')) || 2;

    const player = AppState.getPlayer();
    const opponent = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPONENT)) || MOCK_OPPONENTS[0];

    // Render HUD info
    const playerNameEl = document.getElementById('battle-player-name');
    if (playerNameEl) playerNameEl.textContent = player.username;

    const playerAvatarEl = document.getElementById('battle-player-avatar');
    if (playerAvatarEl) playerAvatarEl.textContent = player.avatar;

    const playerLvlEl = document.getElementById('battle-player-lvl');
    if (playerLvlEl) playerLvlEl.textContent = `Lv.${player.level}`;

    const oppNameEl = document.getElementById('battle-opp-name');
    if (oppNameEl) oppNameEl.textContent = opponent.name;

    const oppAvatarEl = document.getElementById('battle-opp-avatar');
    if (oppAvatarEl) oppAvatarEl.textContent = opponent.avatar;

    const oppLvlEl = document.getElementById('battle-opp-lvl');
    if (oppLvlEl) oppLvlEl.textContent = `Lv.${opponent.level}`;

    // Chuyển đổi giao diện mini-game con
    if (challenge === 'schulte') {
        const scView = document.getElementById('schulte-view');
        if (scView) scView.classList.remove('d-none');
    } else {
        const stView = document.getElementById('stroop-view');
        if (stView) stView.classList.remove('d-none');
    }

    // Khởi động Battle Controller
    window.activeBattle = new BattleController(challenge, level);
    window.activeBattle.initBattle();
});
