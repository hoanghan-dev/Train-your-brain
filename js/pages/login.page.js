/**
 * BrainArena Login Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    function doLogin(loginType) {
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
        localStorage.setItem(STORAGE_KEYS.LOGIN_TYPE, loginType);

        // Đảm bảo dữ liệu người chơi mặc định sẵn sàng
        AppState.getPlayer();
        if (typeof SFX !== 'undefined') SFX.correct();

        if (typeof showToast === 'function') {
            showToast("Đăng nhập thành công!", `Chào mừng bạn quay lại đấu trường BrainArena (${loginType}).`, "success");
        }
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 600);
    }

    const emailBtn = document.getElementById('btn-login-email');
    if (emailBtn) emailBtn.addEventListener('click', () => doLogin('Email'));

    const googleBtn = document.getElementById('btn-login-google');
    if (googleBtn) googleBtn.addEventListener('click', () => doLogin('Google'));

    const guestBtn = document.getElementById('btn-login-guest');
    if (guestBtn) guestBtn.addEventListener('click', () => doLogin('Khách'));
});
