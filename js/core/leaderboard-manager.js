/**
 * BrainArena Leaderboard Module
 * Bảng xếp hạng thành tích vinh danh tuần cho Bảng Schulte và Thử thách Stroop
 */

const LeaderboardManager = {
    currentTab: 'schulte',

    init() {
        this.render();
        this.bindEvents();
    },

    bindEvents() {
        const tabSchulte = document.getElementById('tab-leaderboard-schulte');
        const tabStroop = document.getElementById('tab-leaderboard-stroop');

        if (tabSchulte && tabStroop) {
            tabSchulte.addEventListener('click', () => {
                this.currentTab = 'schulte';
                tabSchulte.classList.add('active', 'btn-cyan');
                tabSchulte.classList.remove('btn-glass');
                tabStroop.classList.remove('active', 'btn-cyan');
                tabStroop.classList.add('btn-glass');
                this.render();
            });

            tabStroop.addEventListener('click', () => {
                this.currentTab = 'stroop';
                tabStroop.classList.add('active', 'btn-cyan');
                tabStroop.classList.remove('btn-glass');
                tabSchulte.classList.remove('active', 'btn-cyan');
                tabSchulte.classList.add('btn-glass');
                this.render();
            });
        }
    },

    render() {
        const listContainer = document.getElementById('leaderboard-list');
        if (!listContainer) return;

        const data = MOCK_LEADERBOARDS[this.currentTab] || [];
        listContainer.innerHTML = '';

        data.forEach(item => {
            const isTop1 = item.rank === 1;
            const isTop2 = item.rank === 2;
            const isTop3 = item.rank === 3;
            const isUser = item.isUser === true;

            const rankClass = isTop1 ? 'rank-1' : (isTop2 ? 'rank-2' : (isTop3 ? 'rank-3' : 'rank-default'));

            const row = document.createElement('div');
            row.className = `leaderboard-row ${isUser ? 'current-user' : ''}`;

            row.innerHTML = `
                <div class="d-flex align-items-center gap-3 flex-grow-1">
                    <div class="rank-badge ${rankClass}">
                        ${item.rank}
                    </div>

                    <div class="avatar-ring-sm fs-5">
                        ${item.avatar}
                    </div>

                    <div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="fw-bold ${isUser ? 'text-cyan' : 'text-white'} text-sm">${item.name}</span>
                            ${isUser ? '<span class="badge bg-primary text-xxs">Bạn</span>' : ''}
                        </div>
                        <span class="text-xxs text-white-50">Cấp độ ${item.level}</span>
                    </div>
                </div>

                <div class="text-end">
                    <div class="fw-bold text-sm ${this.currentTab === 'schulte' ? 'text-cyan' : 'text-pink'}">
                        ${this.currentTab === 'schulte' ? item.time : item.score}
                    </div>
                    <div class="text-xxs text-white-50">Kỷ lục tuần</div>
                </div>
            `;
            listContainer.appendChild(row);
        });
    }
};

window.LeaderboardManager = LeaderboardManager;
