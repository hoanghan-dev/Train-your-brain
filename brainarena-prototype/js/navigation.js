/**
 * BrainArena Universal Navigation Module
 * Sourced from Section 7 & 17 of PRODUCT_OVERVIEW_AND_USER_STORIES.md
 */

(function () {
    const isInsidePages = window.location.pathname.includes('/pages/');
    const basePath = isInsidePages ? '' : 'pages/';
    const rootPath = isInsidePages ? '../' : './';

    const NAV_ITEMS = [
        { id: 'nav-home', label: 'Trang chủ', icon: 'bi-house-door-fill', href: `${basePath}home.html` },
        { id: 'nav-challenges', label: 'Luyện tập', icon: 'bi-lightning-charge-fill', href: `${basePath}challenges.html` },
        { id: 'nav-pvp', label: 'Đấu 1v1', icon: 'bi-controller', href: `${basePath}pvp.html` },
        { id: 'nav-loadout', label: 'Kỹ năng', icon: 'bi-magic', href: `${basePath}loadout.html` },
        { id: 'nav-rewards', label: 'Huy hiệu', icon: 'bi-award-fill', href: `${basePath}rewards.html` },
        { id: 'nav-leaderboard', label: 'Xếp hạng', icon: 'bi-trophy-fill', href: `${basePath}leaderboard.html` },
        { id: 'nav-profile', label: 'Hồ sơ', icon: 'bi-person-circle', href: `${basePath}profile.html` }
    ];

    function getActiveItemId() {
        const path = window.location.pathname;
        if (path.includes('home.html') || path.endsWith('/') || path.endsWith('index.html')) return 'nav-home';
        if (path.includes('challenges.html') || path.includes('schulte.html') || path.includes('stroop.html')) return 'nav-challenges';
        if (path.includes('pvp.html') || path.includes('matchmaking.html') || path.includes('private-room.html') || path.includes('battle.html') || path.includes('result.html')) return 'nav-pvp';
        if (path.includes('loadout.html')) return 'nav-loadout';
        if (path.includes('rewards.html')) return 'nav-rewards';
        if (path.includes('leaderboard.html')) return 'nav-leaderboard';
        if (path.includes('profile.html')) return 'nav-profile';
        return 'nav-home';
    }

    function renderGlobalNavbar() {
        const player = (typeof AppState !== 'undefined') ? AppState.getPlayer() : { level: 3, brainPoints: 1250, exp: 720, maxExp: 1000, avatar: '⚡', username: 'BrainMaster' };
        const activeId = getActiveItemId();
        const isLoginPage = window.location.pathname.includes('login.html');
        if (isLoginPage) return; // Login doesn't need outer navbars

        // 1. Top Header
        const headerPlaceholder = document.getElementById('global-header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = `
                <header class="app-topbar d-flex align-items-center justify-content-between px-3 py-2 border-bottom border-secondary border-opacity-25 sticky-top bg-dark-panel">
                    <div class="d-flex align-items-center gap-2">
                        <a href="${basePath}home.html" class="d-flex align-items-center gap-2 text-decoration-none text-white">
                            <span class="brand-logo-badge"><i class="bi bi-cpu-fill text-cyan"></i></span>
                            <span class="fw-bold tracking-tight brand-title">BRAIN<span class="text-gradient-cyan">ARENA</span></span>
                        </a>
                        <span class="badge bg-primary-subtle text-cyan border border-info border-opacity-25 small-tag d-none d-md-inline-block">MVP v1.0</span>
                    </div>

                    <div class="d-flex align-items-center gap-3">
                        <!-- Brain Points Pill -->
                        <a href="${basePath}rewards.html" class="points-pill d-flex align-items-center gap-1 text-decoration-none px-2 py-1 rounded-pill" title="Điểm Brain Points tích lũy">
                            <i class="bi bi-gem text-amber"></i>
                            <span class="fw-bold text-amber points-value">${player.brainPoints}</span>
                            <span class="text-white-50 text-xs d-none d-sm-inline">BP</span>
                        </a>

                        <!-- Level Pill -->
                        <div class="level-pill d-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-secondary bg-opacity-25" title="Level hiện tại của người chơi">
                            <span class="text-xs text-white-50">Lv.</span>
                            <span class="fw-bold text-white">${player.level}</span>
                        </div>

                        <!-- Sound Toggle -->
                        <button id="btn-toggle-sound" class="btn btn-sm btn-icon-glass text-white-50 hover-white" title="Bật/Tắt âm thanh">
                            <i class="bi bi-volume-up-fill fs-6"></i>
                        </button>

                        <!-- User Profile Link -->
                        <a href="${basePath}profile.html" class="d-flex align-items-center gap-2 text-decoration-none text-white ms-1" title="Xem hồ sơ cá nhân">
                            <div class="avatar-ring-sm position-relative">
                                <span class="avatar-emoji">${player.avatar}</span>
                                <span class="position-absolute bottom-0 end-0 p-1 bg-success border border-dark rounded-circle online-dot"></span>
                            </div>
                            <span class="d-none d-lg-inline fw-semibold text-sm">${player.username}</span>
                        </a>
                    </div>
                </header>
            `;
        }

        // 2. Desktop Sidebar
        const sidebarPlaceholder = document.getElementById('desktop-sidebar-placeholder');
        if (sidebarPlaceholder) {
            let navLinksHtml = NAV_ITEMS.map(item => {
                const isActive = item.id === activeId ? 'active' : '';
                return `
                    <li class="nav-item mb-1">
                        <a href="${item.href}" class="nav-link sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${isActive}">
                            <i class="bi ${item.icon} fs-5"></i>
                            <span class="fw-medium">${item.label}</span>
                            ${item.id === 'nav-pvp' ? '<span class="badge bg-danger ms-auto text-xxs pulse-glow">1v1</span>' : ''}
                        </a>
                    </li>
                `;
            }).join('');

            sidebarPlaceholder.innerHTML = `
                <aside class="desktop-sidebar d-none d-md-flex flex-column justify-content-between p-3 border-end border-secondary border-opacity-25 bg-dark-panel">
                    <div>
                        <div class="mb-4 px-2">
                            <div class="text-xs text-white-50 text-uppercase fw-bold tracking-wider mb-2">Chế độ thi đấu</div>
                            <ul class="nav flex-column mb-0">
                                ${navLinksHtml}
                            </ul>
                        </div>

                        <div class="sidebar-action-card p-3 rounded-3 border border-primary border-opacity-25 bg-primary-subtle text-white mb-3">
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <i class="bi bi-fire text-amber fs-5"></i>
                                <span class="fw-bold text-sm">Đấu 1v1 Real-time</span>
                            </div>
                            <p class="text-xs text-white-70 mb-2">So tài phản xạ 90s, dùng kỹ năng để lật ngược thế cờ!</p>
                            <a href="${basePath}pvp.html" class="btn btn-sm btn-cyan w-100 fw-bold">Tham gia ngay</a>
                        </div>
                    </div>

                    <div class="border-top border-secondary border-opacity-25 pt-3">
                        <div class="d-flex align-items-center justify-content-between px-2">
                            <span class="text-xxs text-white-50">BrainArena MVP Prototype</span>
                            <button id="btn-reset-data-sidebar" class="btn btn-link btn-sm text-white-50 text-xxs text-decoration-none p-0 hover-danger" title="Khôi phục trạng thái ban đầu để test lại">Reset Data</button>
                        </div>
                    </div>
                </aside>
            `;
        }

        // 3. Mobile Bottom Navigation
        const bottomNavPlaceholder = document.getElementById('mobile-bottom-nav-placeholder');
        if (bottomNavPlaceholder) {
            const mobileItems = [
                { id: 'nav-home', label: 'Trang chủ', icon: 'bi-house-door-fill', href: `${basePath}home.html` },
                { id: 'nav-challenges', label: 'Luyện tập', icon: 'bi-lightning-charge-fill', href: `${basePath}challenges.html` },
                { id: 'nav-pvp', label: 'PvP 1v1', icon: 'bi-controller', href: `${basePath}pvp.html`, isHighlight: true },
                { id: 'nav-rewards', label: 'Huy hiệu', icon: 'bi-award-fill', href: `${basePath}rewards.html` },
                { id: 'nav-profile', label: 'Hồ sơ', icon: 'bi-person-circle', href: `${basePath}profile.html` }
            ];

            let mobileLinksHtml = mobileItems.map(item => {
                const isActive = item.id === activeId ? 'active' : '';
                if (item.isHighlight) {
                    return `
                        <a href="${item.href}" class="mobile-nav-item mobile-nav-highlight ${isActive}">
                            <div class="pvp-circle-button shadow-cyan">
                                <i class="bi ${item.icon}"></i>
                            </div>
                            <span class="nav-text">${item.label}</span>
                        </a>
                    `;
                }
                return `
                    <a href="${item.href}" class="mobile-nav-item ${isActive}">
                        <i class="bi ${item.icon} nav-icon"></i>
                        <span class="nav-text">${item.label}</span>
                    </a>
                `;
            }).join('');

            bottomNavPlaceholder.innerHTML = `
                <nav class="mobile-bottom-nav d-md-none fixed-bottom border-top border-secondary border-opacity-25 bg-dark-panel">
                    <div class="d-flex align-items-center justify-content-around py-1">
                        ${mobileLinksHtml}
                    </div>
                </nav>
            `;
        }

        // Setup sound toggle event
        const soundBtn = document.getElementById('btn-toggle-sound');
        if (soundBtn && typeof SFX !== 'undefined') {
            soundBtn.addEventListener('click', () => {
                SFX.enabled = !SFX.enabled;
                soundBtn.innerHTML = SFX.enabled 
                    ? '<i class="bi bi-volume-up-fill fs-6 text-white"></i>' 
                    : '<i class="bi bi-volume-mute-fill fs-6 text-danger"></i>';
                showToast(
                    SFX.enabled ? "Âm thanh: BẬT" : "Âm thanh: TẮT",
                    SFX.enabled ? "Đã bật hiệu ứng âm thanh." : "Đã tắt hiệu ứng âm thanh.",
                    "info"
                );
            });
        }

        // Setup reset data event
        const resetBtn = document.getElementById('btn-reset-data-sidebar');
        if (resetBtn && typeof AppState !== 'undefined') {
            resetBtn.addEventListener('click', () => {
                if (confirm("Khôi phục toàn bộ tiến trình người chơi về ban đầu để kiểm thử lại flow?")) {
                    AppState.resetPlayerToDefault();
                }
            });
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        renderGlobalNavbar();
        window.addEventListener('brainarena:player_updated', () => {
            renderGlobalNavbar();
        });
    });
})();
