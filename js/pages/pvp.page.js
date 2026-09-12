/**
 * BrainArena PvP Lobby Page Script
 */

let selectedPvPLevel = 2;

function selectPvPLevel(lvl) {
    selectedPvPLevel = lvl;
    const chips = document.querySelectorAll('#pvp-level-chips button');
    chips.forEach((btn, idx) => {
        if (idx + 1 === lvl) {
            btn.className = 'btn btn-sm btn-cyan flex-grow-1 fw-bold';
        } else {
            btn.className = 'btn btn-sm btn-glass text-white-50 flex-grow-1';
        }
    });
    if (typeof showToast === 'function') {
        showToast("Đã chọn", `Cấp độ thi đấu: Level ${lvl}`, "info");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Render xem trước 3 kỹ năng đang trang bị
    const equippedContainer = document.getElementById('lobby-equipped-skills');
    if (equippedContainer) {
        const skills = SkillManager.getEquippedSkills();
        if (skills.length === 0) {
            equippedContainer.innerHTML = '<span class="text-xxs text-warning">Chưa trang bị kỹ năng</span>';
        } else {
            equippedContainer.innerHTML = skills.map(s => `
                <span class="badge bg-dark border border-secondary text-xxs" style="color: ${s.badgeColor}">
                    <i class="bi ${s.icon} me-1"></i>${s.name}
                </span>
            `).join('');
        }
    }

    // Xử lý nút tìm trận ngẫu nhiên
    const findMatchBtn = document.getElementById('btn-find-match');
    if (findMatchBtn) {
        findMatchBtn.addEventListener('click', () => {
            const checkedRadio = document.querySelector('input[name="pvpChallenge"]:checked');
            const challengeType = checkedRadio ? checkedRadio.value : 'schulte';
            PvPManager.startMatchmaking(challengeType, selectedPvPLevel);
        });
    }

    // Xử lý nút tham gia phòng bằng mã PIN
    const joinSubmitBtn = document.getElementById('btn-join-room-submit');
    if (joinSubmitBtn) {
        joinSubmitBtn.addEventListener('click', () => {
            const pinInput = document.getElementById('input-room-pin');
            const pin = pinInput ? pinInput.value : '';
            PvPManager.joinPrivateRoom(pin);
        });
    }
});
