/**
 * BrainArena Entry Portal Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Tự động chuyển hướng vào Home nếu đã có phiên đăng nhập trước đó
    const userLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    if (userLoggedIn) {
        window.location.href = 'pages/home.html';
        return;
    }

    // Xử lý nút bỏ qua đăng nhập
    const skipBtn = document.getElementById('btn-skip-login');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
            localStorage.setItem(STORAGE_KEYS.LOGIN_TYPE, 'Khách');
            AppState.getPlayer(); // Đảm bảo dữ liệu mặc định được khởi tạo
        });
    }
});
