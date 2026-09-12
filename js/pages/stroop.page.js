/**
 * BrainArena Stroop Solo Game Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get('level')) || 1;

    const indicator = document.getElementById('game-level-indicator');
    if (indicator) {
        indicator.textContent = `Level ${level} (${level === 1 ? '10 câu' : level === 2 ? '15 câu' : '20 câu'})`;
    }

    window.currentStroopGame = new StroopGame();
    window.currentStroopGame.init(level);
});
