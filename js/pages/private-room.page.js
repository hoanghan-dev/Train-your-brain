/**
 * BrainArena Private Room Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Khởi tạo phòng thi đấu mới với mã PIN 6 ký tự
    const roomData = PvPManager.createPrivateRoom('schulte', 2);
    const pinDisplay = document.getElementById('display-room-pin');
    if (pinDisplay) pinDisplay.textContent = roomData.pin;

    // Sao chép mã PIN
    const copyBtn = document.getElementById('btn-copy-pin');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(roomData.pin).then(() => {
                if (typeof showToast === 'function') {
                    showToast("Đã sao chép mã PIN", `Mã phòng: ${roomData.pin}`, "success");
                }
            }).catch(() => {
                if (typeof showToast === 'function') {
                    showToast("Mã phòng", roomData.pin, "info");
                }
            });
        });
    }

    // Giả lập bạn bè vào phòng (Prototype simulation)
    const simBtn = document.getElementById('btn-simulate-join');
    const startBtn = document.getElementById('btn-start-private-battle');
    const roomBadge = document.getElementById('room-status-badge');
    const friendName = document.getElementById('friend-name');
    const friendStatus = document.getElementById('friend-status');

    if (simBtn) {
        simBtn.addEventListener('click', () => {
            if (typeof SFX !== 'undefined') SFX.victory();
            if (roomBadge) {
                roomBadge.textContent = "Cả hai đã sẵn sàng (2/2)";
                roomBadge.className = "badge bg-success text-white text-xxs";
            }
            if (friendName) friendName.textContent = "NeuroAce (Bạn bè)";
            if (friendStatus) {
                friendStatus.textContent = "Sẵn sàng";
                friendStatus.className = "badge bg-success text-xxs mt-1";
            }
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.className = "btn btn-cyan btn-lg fw-bold flex-grow-1 text-sm pulse-glow";
            }
            if (typeof showToast === 'function') {
                showToast("Bạn bè đã vào phòng!", "NeuroAce vừa tham gia. Nhấn 'Bắt đầu thi đấu' để vào trận!", "success");
            }
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            localStorage.setItem(STORAGE_KEYS.OPPONENT, JSON.stringify(MOCK_OPPONENTS[0]));
            window.location.href = 'battle.html?challenge=schulte&level=2';
        });
    }

    // Xử lý tham gia bằng mã phòng bên cột phải
    const joinBtn = document.getElementById('btn-join-room-act');
    if (joinBtn) {
        joinBtn.addEventListener('click', () => {
            const pinInput = document.getElementById('join-pin-input');
            const pin = pinInput ? pinInput.value : '';
            PvPManager.joinPrivateRoom(pin);
        });
    }
});
