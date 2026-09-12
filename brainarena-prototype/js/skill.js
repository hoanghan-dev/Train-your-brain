/**
 * BrainArena Skill & Loadout System Engine
 * Sourced from US-06, US-07, US-08 of PRODUCT_OVERVIEW_AND_USER_STORIES.md
 */

const SkillManager = {
    getAllSkills() {
        return SKILLS_DATA;
    },

    getEquippedSkills() {
        const player = AppState.getPlayer();
        const equippedIds = player.equippedSkills || [];
        return equippedIds.map(id => SKILLS_DATA.find(s => s.id === id)).filter(Boolean);
    },

    equipSkill(skillId, targetSlotIndex = null) {
        const player = AppState.getPlayer();
        if (!player.unlockedSkills.includes(skillId)) {
            showToast("Kỹ năng chưa mở khóa", "Hãy đạt cấp độ yêu cầu để mở khóa kỹ năng này.", "warning");
            return false;
        }

        player.equippedSkills = player.equippedSkills || [];

        // Already equipped
        if (player.equippedSkills.includes(skillId)) {
            showToast("Đã trang bị", "Kỹ năng này đã nằm trong bộ trang bị.", "info");
            return false;
        }

        // Rule US-07: Max 3 skills
        if (player.equippedSkills.length >= 3 && targetSlotIndex === null) {
            // Must replace an existing skill
            return 'NEEDS_REPLACEMENT';
        }

        if (targetSlotIndex !== null && targetSlotIndex >= 0 && targetSlotIndex < 3) {
            player.equippedSkills[targetSlotIndex] = skillId;
        } else {
            player.equippedSkills.push(skillId);
        }

        AppState.savePlayer(player);
        showToast("Trang bị thành công", "Đã cập nhật kỹ năng chiến đấu.", "success");
        return true;
    },

    unequipSkill(skillId) {
        const player = AppState.getPlayer();
        player.equippedSkills = (player.equippedSkills || []).filter(id => id !== skillId);
        AppState.savePlayer(player);
        showToast("Đã tháo kỹ năng", "Ô trang bị đã được giải phóng.", "info");
    },

    renderLoadoutPage() {
        const player = AppState.getPlayer();
        const equippedContainer = document.getElementById('equipped-slots-container');
        const availableContainer = document.getElementById('available-skills-container');

        if (!equippedContainer || !availableContainer) return;

        // Render 3 slots
        equippedContainer.innerHTML = '';
        const equippedSkills = this.getEquippedSkills();

        for (let i = 0; i < 3; i++) {
            const skill = equippedSkills[i];
            const slotEl = document.createElement('div');
            slotEl.className = `skill-slot ${skill ? 'filled' : ''}`;
            slotEl.setAttribute('data-slot-index', i);

            if (skill) {
                slotEl.innerHTML = `
                    <button class="remove-btn" title="Tháo kỹ năng">&times;</button>
                    <i class="bi ${skill.icon} fs-4 mb-1" style="color: ${skill.badgeColor}"></i>
                    <span class="text-xxs text-center fw-bold text-truncate px-1">${skill.name}</span>
                    <span class="badge bg-dark text-xxs text-white-50 mt-1">${skill.cooldown}s</span>
                `;
                slotEl.querySelector('.remove-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.unequipSkill(skill.id);
                    this.renderLoadoutPage();
                });
            } else {
                slotEl.innerHTML = `
                    <i class="bi bi-plus-lg text-white-50 fs-4 mb-1"></i>
                    <span class="text-xxs text-white-50">Ô trống ${i + 1}</span>
                `;
            }
            equippedContainer.appendChild(slotEl);
        }

        // Render available skills list
        availableContainer.innerHTML = '';
        SKILLS_DATA.forEach(skill => {
            const isUnlocked = player.unlockedSkills.includes(skill.id);
            const isEquipped = (player.equippedSkills || []).includes(skill.id);

            const card = document.createElement('div');
            card.className = `card-esports p-3 mb-3 ${isUnlocked ? 'border-primary border-opacity-25' : 'opacity-60'}`;

            card.innerHTML = `
                <div class="d-flex align-items-start justify-content-between gap-2">
                    <div class="d-flex align-items-start gap-3">
                        <div class="p-2 rounded-3" style="background: rgba(255,255,255,0.06); border: 1px solid ${skill.badgeColor}">
                            <i class="bi ${skill.icon} fs-3" style="color: ${skill.badgeColor}"></i>
                        </div>
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <h6 class="mb-0 fw-bold text-white">${skill.name}</h6>
                                <span class="badge text-xxs text-uppercase" style="background: rgba(255,255,255,0.1); color: ${skill.badgeColor}">${skill.type}</span>
                                <span class="badge bg-dark border border-secondary text-xxs"><i class="bi bi-clock-history me-1"></i>${skill.cooldown}s</span>
                            </div>
                            <p class="text-xs text-white-70 mb-2">${skill.desc}</p>
                            <div class="text-xxs text-white-50">
                                ${isUnlocked ? '<span class="text-emerald"><i class="bi bi-unlock-fill me-1"></i>Đã mở khóa</span>' : `<span class="text-amber"><i class="bi bi-lock-fill me-1"></i>Mở khóa ở Cấp độ ${skill.unlockLevel}</span>`}
                            </div>
                        </div>
                    </div>
                    <div>
                        ${isUnlocked ? (
                            isEquipped ? 
                            `<button class="btn btn-sm btn-outline-danger" onclick="SkillManager.unequipSkill('${skill.id}'); SkillManager.renderLoadoutPage();">Tháo</button>` :
                            `<button class="btn btn-sm btn-cyan" onclick="SkillManager.handleEquipClick('${skill.id}')">Trang bị</button>`
                        ) : `
                            <button class="btn btn-sm btn-glass text-white-50" disabled><i class="bi bi-lock-fill"></i> Khóa</button>
                        `}
                    </div>
                </div>
            `;
            availableContainer.appendChild(card);
        });
    },

    handleEquipClick(skillId) {
        const result = this.equipSkill(skillId);
        if (result === 'NEEDS_REPLACEMENT') {
            this.showReplacementModal(skillId);
        } else {
            this.renderLoadoutPage();
        }
    },

    showReplacementModal(newSkillId) {
        const modalEl = document.getElementById('replace-skill-modal');
        const listEl = document.getElementById('replace-slot-list');
        const newSkill = SKILLS_DATA.find(s => s.id === newSkillId);

        if (!modalEl || !listEl || !newSkill) return;

        listEl.innerHTML = '';
        const equipped = this.getEquippedSkills();

        equipped.forEach((s, idx) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-glass w-100 d-flex align-items-center justify-content-between p-2 mb-2';
            btn.innerHTML = `
                <div class="d-flex align-items-center gap-2">
                    <i class="bi ${s.icon}" style="color: ${s.badgeColor}"></i>
                    <span class="text-sm fw-bold">${s.name}</span>
                </div>
                <span class="badge bg-danger text-xxs">Thay thế ô ${idx + 1}</span>
            `;
            btn.addEventListener('click', () => {
                this.equipSkill(newSkillId, idx);
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) bsModal.hide();
                this.renderLoadoutPage();
            });
            listEl.appendChild(btn);
        });

        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }
};

window.SkillManager = SkillManager;
