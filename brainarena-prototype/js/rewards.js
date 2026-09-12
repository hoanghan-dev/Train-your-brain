/**
 * BrainArena Rewards & Badges Store Module
 * Sourced from US-09 of PRODUCT_OVERVIEW_AND_USER_STORIES.md
 */

const RewardsManager = {
    renderBadgeStore() {
        const player = AppState.getPlayer();
        const container = document.getElementById('badges-grid-container');
        const pointsDisplay = document.getElementById('user-points-display');

        if (pointsDisplay) {
            pointsDisplay.textContent = player.brainPoints;
        }

        if (!container) return;
        container.innerHTML = '';

        BADGES_DATA.forEach(badge => {
            const isOwned = (player.ownedBadges || []).includes(badge.id);
            const isEquipped = player.equippedBadge === badge.id;
            const canAfford = player.brainPoints >= badge.price;

            const card = document.createElement('div');
            card.className = 'col-12 col-md-6 col-lg-4 mb-3';

            card.innerHTML = `
                <div class="card-esports p-3 h-100 d-flex flex-column justify-content-between position-relative ${isEquipped ? 'border-primary' : ''}">
                    ${isEquipped ? '<span class="badge bg-primary position-absolute top-0 end-0 m-2 text-xxs">Đang trưng bày</span>' : ''}
                    <div>
                        <div class="d-flex align-items-center gap-3 mb-2">
                            <div class="avatar-ring-sm fs-4" style="border-color: ${badge.rarityColor}">
                                ${badge.icon}
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold text-white">${badge.name}</h6>
                                <span class="badge text-xxs" style="background: rgba(255,255,255,0.08); color: ${badge.rarityColor}">${badge.rarity}</span>
                            </div>
                        </div>
                        <p class="text-xs text-white-70 mb-3">${badge.desc}</p>
                    </div>

                    <div class="border-top border-secondary border-opacity-25 pt-2 d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-1 text-amber fw-bold text-sm">
                            <i class="bi bi-gem"></i>
                            <span>${badge.price > 0 ? `${badge.price} BP` : 'Miễn phí'}</span>
                        </div>

                        <div>
                            ${isOwned ? (
                                isEquipped ? 
                                `<button class="btn btn-sm btn-glass text-white-50" disabled><i class="bi bi-check2"></i> Đang chọn</button>` :
                                `<button class="btn btn-sm btn-outline-info" onclick="RewardsManager.equipBadge('${badge.id}')">Đeo huy hiệu</button>`
                            ) : (
                                canAfford ? 
                                `<button class="btn btn-sm btn-cyan" onclick="RewardsManager.buyBadge('${badge.id}')">Đổi ngay</button>` :
                                `<button class="btn btn-sm btn-glass text-white-50" title="Chưa đủ điểm" onclick="RewardsManager.buyBadge('${badge.id}')">Thiếu ${badge.price - player.brainPoints} BP</button>`
                            )}
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    },

    buyBadge(badgeId) {
        const badge = BADGES_DATA.find(b => b.id === badgeId);
        if (!badge) return;

        const player = AppState.getPlayer();
        if ((player.ownedBadges || []).includes(badgeId)) {
            showToast("Đã sở hữu", "Bạn đã sở hữu huy hiệu này rồi.", "info");
            return;
        }

        if (player.brainPoints < badge.price) {
            SFX.wrong();
            showToast("Không đủ Brain Points", `Bạn cần thêm ${badge.price - player.brainPoints} BP để đổi huy hiệu này. Hãy luyện tập thêm!`, "warning");
            return;
        }

        // Deduct points and award badge per US-09
        player.brainPoints -= badge.price;
        player.ownedBadges.push(badgeId);
        if (!player.equippedBadge) {
            player.equippedBadge = badgeId;
        }

        AppState.savePlayer(player);
        SFX.victory();
        showToast(
            "🎉 ĐỔI HUY HIỆU THÀNH CÔNG!",
            `Đã trừ ${badge.price} BP. Bạn nhận được huy hiệu: <b>${badge.name}</b>!`,
            "success"
        );

        this.renderBadgeStore();
    },

    equipBadge(badgeId) {
        const player = AppState.getPlayer();
        player.equippedBadge = badgeId;
        AppState.savePlayer(player);
        SFX.click();
        showToast("Đã gắn huy hiệu", "Huy hiệu chính trên hồ sơ đã được cập nhật.", "success");
        this.renderBadgeStore();
    }
};

window.RewardsManager = RewardsManager;
