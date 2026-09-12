/**
 * BrainArena Schulte Solo Game Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get('level')) || 1;

    const indicator = document.getElementById('game-level-indicator');
    if (indicator) {
        const sizeText = level === 1 ? '3x3 (1–9)' : (level === 2 ? '4x4 (1–16)' : '5x5 (1–25)');
        indicator.textContent = `Level ${level} • Lưới ${sizeText}`;
    }

    // Khởi tạo engine Schulte
    window.currentGame = new SchulteGame();
    window.currentGame.init(level, 'solo');

    // Nút dùng gợi ý
    const hintBtn = document.getElementById('btn-use-hint');
    if (hintBtn) {
        hintBtn.addEventListener('click', () => {
            if (window.currentGame && typeof window.currentGame.applyHint === 'function') {
                window.currentGame.applyHint();
            }
        });
    }
});
