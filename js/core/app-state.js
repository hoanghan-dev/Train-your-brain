/**
 * BrainArena Core State Management & Player Engine
 * Điều phối dữ liệu qua localStorage và xử lý thăng cấp, lưu lịch sử đấu
 */

const AppState = {
    getPlayer() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.PLAYER);
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            console.error("Không thể nạp dữ liệu người chơi từ localStorage", e);
        }
        this.savePlayer(INITIAL_PLAYER);
        return INITIAL_PLAYER;
    },

    savePlayer(player) {
        try {
            localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(player));
            window.dispatchEvent(new CustomEvent('brainarena:player_updated', { detail: player }));
        } catch (e) {
            console.error("Không thể lưu người chơi vào localStorage", e);
        }
    },

    // Sửa lỗi: Đồng bộ tên hàm resetPlayerToDefault cho toàn bộ ứng dụng
    resetPlayerToDefault() {
        this.savePlayer(INITIAL_PLAYER);
        if (typeof showToast === 'function') {
            showToast("Đã khôi phục dữ liệu gốc", "Dữ liệu người chơi đã được đưa về trạng thái khởi tạo.", "info");
        }
        setTimeout(() => window.location.reload(), 600);
    },

    // Alias dự phòng để tránh lỗi gọi hàm
    resetToDefault() {
        this.resetPlayerToDefault();
    },

    updateExpAndPoints(expGain, pointsGain, winStreakIncrement = 0) {
        const player = this.getPlayer();
        player.exp += expGain;
        player.brainPoints += pointsGain;

        let levelUpOccurred = false;
        let newlyUnlockedSkill = null;

        while (player.exp >= player.maxExp) {
            player.exp -= player.maxExp;
            player.level += 1;
            player.maxExp = Math.round(player.maxExp * 1.35);
            levelUpOccurred = true;

            // Kiểm tra mở khóa kỹ năng mới theo Level (Lv.2, Lv.3, Lv.5, Lv.6)
            SKILLS_DATA.forEach(skill => {
                if (player.level >= skill.unlockLevel && !player.unlockedSkills.includes(skill.id)) {
                    player.unlockedSkills.push(skill.id);
                    newlyUnlockedSkill = skill;
                }
            });
        }

        this.savePlayer(player);

        if (levelUpOccurred) {
            if (typeof SFX !== 'undefined') SFX.victory();
            if (typeof showToast === 'function') {
                showToast(
                    `🎉 THĂNG CẤP! LEVEL ${player.level}`,
                    newlyUnlockedSkill ? `Bạn đã mở khóa kỹ năng mới: <b>${newlyUnlockedSkill.name}</b>!` : "Chúc mừng bạn đã đạt cấp độ mới!",
                    "success"
                );
            }
        }

        return { levelUpOccurred, newlyUnlockedSkill, player };
    },

    recordMatchResult(matchRecord) {
        const player = this.getPlayer();
        player.recentMatches = player.recentMatches || [];
        player.recentMatches.unshift(matchRecord);
        if (player.recentMatches.length > 10) {
            player.recentMatches.pop();
        }

        if (matchRecord.result === "VICTORY") {
            player.cups = (player.cups || 1450) + 30;
            if (player.rank > 1) player.rank -= 1;
        } else if (matchRecord.result === "DEFEAT") {
            player.cups = Math.max(1000, (player.cups || 1450) - 15);
        }

        this.savePlayer(player);
    }
};

// Helper kiểm tra xác thực
function checkAuth() {
    const isLoginPage = window.location.pathname.includes('login.html');
    const userLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';

    if (!userLoggedIn && !isLoginPage) {
        const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
        window.location.href = prefix + 'login.html';
    }
}
