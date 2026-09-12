/**
 * BrainArena PvP & Matchmaking System Engine
 * Quản lý hàng chờ tìm trận ngẫu nhiên và phòng riêng mã PIN 6 ký tự
 */

const PvPManager = {
    // -------------------------------------------------------------
    // Ghép trận ngẫu nhiên
    // -------------------------------------------------------------
    startMatchmaking(challengeType = 'schulte', level = 2) {
        const modalEl = document.getElementById('matchmaking-modal');
        const statusText = document.getElementById('matchmaking-status-text');

        if (!modalEl) return;

        const bsModal = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false });
        bsModal.show();

        let elapsed = 0;
        const searchInterval = setInterval(() => {
            elapsed++;
            if (elapsed === 1) {
                if (statusText) statusText.textContent = "Đang quét người chơi trực tuyến...";
            } else if (elapsed === 2) {
                if (statusText) statusText.textContent = "Tìm thấy người chơi có trình độ tương đương...";
            } else if (elapsed >= 3) {
                clearInterval(searchInterval);
                this.onMatchFound(challengeType, level, bsModal);
            }
        }, 1000);

        const cancelBtn = document.getElementById('btn-cancel-matchmaking');
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                clearInterval(searchInterval);
                bsModal.hide();
                if (typeof showToast === 'function') {
                    showToast("Đã hủy", "Đã dừng quá trình ghép trận.", "info");
                }
            };
        }
    },

    onMatchFound(challengeType, level, bsModal) {
        if (typeof SFX !== 'undefined') SFX.victory();
        const opponent = MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];
        localStorage.setItem(STORAGE_KEYS.OPPONENT, JSON.stringify(opponent));

        const statusText = document.getElementById('matchmaking-status-text');
        if (statusText) {
            statusText.innerHTML = `<span class="text-cyan fw-bold"><i class="bi bi-check-circle-fill me-1"></i>Đã tìm thấy đối thủ: ${opponent.name}!</span>`;
        }

        setTimeout(() => {
            bsModal.hide();
            localStorage.setItem(STORAGE_KEYS.CURRENT_MATCH, JSON.stringify({
                challengeType,
                level,
                opponent,
                roomType: 'RANDOM'
            }));
            const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
            window.location.href = `${prefix}battle.html?challenge=${challengeType}&level=${level}`;
        }, 1200);
    },

    // -------------------------------------------------------------
    // Phòng thi đấu riêng
    // -------------------------------------------------------------
    generateRoomPIN() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let pin = '';
        for (let i = 0; i < 6; i++) {
            pin += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pin;
    },

    createPrivateRoom(challengeType = 'schulte', level = 2) {
        const pin = this.generateRoomPIN();
        const roomData = {
            pin,
            challengeType,
            level,
            host: AppState.getPlayer().username,
            status: 'WAITING_OPPONENT'
        };
        localStorage.setItem(STORAGE_KEYS.ROOM_DATA, JSON.stringify(roomData));
        return roomData;
    },

    joinPrivateRoom(pin) {
        const cleanPin = pin.trim().toUpperCase();
        if (!cleanPin || cleanPin.length < 5) {
            if (typeof showToast === 'function') {
                showToast("Mã phòng không hợp lệ", "Mã phòng gồm 6 ký tự viết hoa.", "error");
            }
            return false;
        }

        const opponent = MOCK_OPPONENTS[0];
        localStorage.setItem(STORAGE_KEYS.OPPONENT, JSON.stringify(opponent));
        localStorage.setItem(STORAGE_KEYS.CURRENT_MATCH, JSON.stringify({
            challengeType: 'schulte',
            level: 2,
            opponent,
            roomType: 'PRIVATE',
            pin: cleanPin
        }));

        if (typeof showToast === 'function') {
            showToast("Đã vào phòng!", "Kết nối phòng thành công. Trận đấu sắp bắt đầu!", "success");
        }
        setTimeout(() => {
            const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
            window.location.href = `${prefix}battle.html?challenge=schulte&level=2`;
        }, 1000);
        return true;
    }
};

window.PvPManager = PvPManager;
