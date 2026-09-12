# BrainArena — Casual Mind E-sports (Static Frontend)

BrainArena là nền tảng rèn luyện trí tuệ và phản xạ theo phong cách **Casual Mind E-sports**: người chơi rèn luyện nhận thức và khả năng tập trung qua các mini-game (Bảng Schulte, Thử thách Stroop), mở khóa kỹ năng chiến thuật, thi đấu 1v1 đối kháng trực tiếp và theo dõi bảng xếp hạng vinh danh.

Phiên bản này được chuẩn hóa thành **Website tĩnh thuần (HTML5 + CSS3 + Vanilla JavaScript ES6+)** chạy độc lập bằng **VS Code Live Server**, không cần cài đặt Node.js, không cần chạy lệnh build và không phụ thuộc vào bất kỳ máy chủ backend nào.

---

## 1. Cấu Trúc Thư Mục

```text
frontend/
├── index.html                       # Entry Portal & Lối vào preview nhanh
├── README.md                        # Tài liệu hướng dẫn sử dụng và phát triển
├── assets/                          # Tài nguyên hình ảnh, biểu tượng
│   ├── icons/
│   └── images/
├── css/                             # Hệ thống CSS Design Tokens & Components
│   ├── variables.css                # Màu sắc Cyberpunk, Bo góc, Shadows
│   ├── reset.css                    # Chuẩn hóa Box-sizing, Scrollbar
│   ├── layout.css                   # Cấu trúc App Shell, Topbar, Sidebar, Mobile Nav
│   ├── components.css               # Nút bấm, Card Esports, HUD, Schulte, Stroop
│   └── responsive.css               # Responsive cho Mobile (< 576px) và Tablet
├── js/
│   ├── data/
│   │   └── mock-data.js             # Dữ liệu tĩnh (Player, Skills, Badges, Opponents)
│   ├── utils/
│   │   ├── sound.js                 # Web Audio API Synthesizer (Hiệu ứng âm thanh)
│   │   └── toast.js                 # Thông báo Toast notification nổi
│   ├── components/
│   │   └── navigation.js            # Render tự động Topbar, Sidebar, Bottom Nav
│   ├── core/
│   │   ├── app-state.js             # Quản lý State qua localStorage, EXP, Cúp
│   │   ├── schulte-engine.js        # Logic trò chơi Bảng Schulte
│   │   ├── stroop-engine.js         # Logic trò chơi Thử thách Stroop
│   │   ├── skill-manager.js         # Quản lý kho kỹ năng & 3 slot trang bị (Loadout)
│   │   ├── pvp-manager.js           # Ghép trận ngẫu nhiên & Phòng riêng mã PIN
│   │   ├── battle-controller.js     # Đấu trường 1v1 real-time & tương tác kỹ năng
│   │   ├── rewards-manager.js       # Cửa hàng đổi huy hiệu bằng Brain Points
│   │   └── leaderboard-manager.js   # Bảng xếp hạng tuần theo tab
│   └── pages/                       # Toàn bộ Page Script độc lập (Không inline script)
│       ├── index.page.js
│       ├── login.page.js
│       ├── home.page.js
│       ├── challenges.page.js
│       ├── schulte.page.js
│       ├── stroop.page.js
│       ├── pvp.page.js
│       ├── matchmaking.page.js
│       ├── private-room.page.js
│       ├── battle.page.js
│       ├── result.page.js
│       ├── loadout.page.js
│       ├── rewards.page.js
│       ├── leaderboard.page.js
│       └── profile.page.js
└── pages/                           # 14 màn hình HTML chuẩn ngữ nghĩa
    ├── login.html                   # Đăng nhập mô phỏng
    ├── home.html                    # Dashboard tổng quan người chơi
    ├── challenges.html              # Danh mục thử thách Solo
    ├── schulte.html                 # Màn hình chơi Schulte Solo
    ├── stroop.html                  # Màn hình chơi Stroop Solo
    ├── pvp.html                     # Sảnh chọn thể thức đối kháng 1v1
    ├── matchmaking.html             # Màn hình radar tìm đối thủ
    ├── private-room.html            # Phòng thi đấu riêng bằng mã PIN
    ├── battle.html                  # Đấu trường 1v1 thời gian thực
    ├── result.html                  # Màn hình kết quả & trao thưởng
    ├── loadout.html                 # Quản lý 3 ô kỹ năng chiến thuật
    ├── rewards.html                 # Cửa hàng huy hiệu
    ├── leaderboard.html             # Bảng xếp hạng tuần
    └── profile.html                 # Hồ sơ đấu thủ & lịch sử thi đấu
```

---

## 2. Cách Chạy Bằng VS Code Live Server

1. **Cài đặt Extension:** Trong VS Code, tìm kiếm extension **Live Server** (của Ritwick Dey) và nhấn **Install**.
2. **Khởi chạy:**
   - **Cách 1 (Khuyên dùng):** Mở thư mục `frontend/` trong VS Code, nhấp chuột phải vào file `index.html` và chọn **Open with Live Server** (hoặc bấm nút *Go Live* ở thanh trạng thái góc dưới bên phải).
   - **Cách 2:** Mở thư mục gốc của project, nhấp chuột phải vào `frontend/index.html` -> **Open with Live Server**.
3. **Truy cập:** Trình duyệt sẽ tự động mở địa chỉ `http://127.0.0.1:5500/frontend/index.html` (hoặc `http://127.0.0.1:5500/index.html`).

---

## 3. Danh Sách CDN Đang Sử Dụng

Dự án chỉ sử dụng 2 thư viện CDN phổ biến và ổn định qua jsDelivr, không yêu cầu npm install:

1. **Bootstrap 5.3.3 CSS:**  
   `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`
2. **Bootstrap 5.3.3 JS Bundle:**  
   `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js`
3. **Bootstrap Icons 1.11.3:**  
   `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css`

---

## 4. Cách Tổ Chức CSS

Hệ thống style được chia thành các file có trách nhiệm rõ ràng trong thư mục `css/`:
- `variables.css`: Khai báo bảng màu neon cyberpunk (`--accent-cyan: #00f0ff`, `--bg-main: #0a0e17`), bo góc, bóng đổ và font chữ.
- `reset.css`: Chuẩn hóa box-sizing, custom scrollbar thanh mảnh, và các class tiện ích màu sắc.
- `layout.css`: Định nghĩa khung tổng thể của web application (Topbar cố định 57px, Desktop Sidebar 250px, Mobile Bottom Navigation 60px, Viewport cuộn độc lập).
- `components.css`: Chứa toàn bộ UI components tái sử dụng: Buttons gradient neon, Esports Card, Digital Timer, lưới Schulte, Stroop card, HUD thi đấu 1v1, slot Loadout kỹ năng, và hàng Bảng xếp hạng.
- `responsive.css`: Điều chỉnh chi tiết cho màn hình Mobile (< 576px, touch target 48px), Tablet và Desktop.

---

## 5. Cách Tổ Chức JavaScript

Toàn bộ JavaScript tuân thủ tiêu chuẩn ES6+ và được phân tầng nghiêm ngặt:
- **Tầng dữ liệu (`js/data/mock-data.js`):** Lưu trữ toàn bộ dữ liệu tĩnh gốc.
- **Tầng tiện ích (`js/utils/`):**
  - `sound.js`: Tạo âm thanh điện tử tổng hợp bằng Web Audio API không cần tải file MP3.
  - `toast.js`: Quản lý hiển thị thông báo góc trên bên phải.
- **Tầng điều khiển trung tâm (`js/core/`):**
  - `app-state.js`: Đọc/ghi `localStorage`, phát sự kiện `brainarena:player_updated` khi có thay đổi dữ liệu.
  - `schulte-engine.js`, `stroop-engine.js`: Xử lý thuật toán và luật chơi của mini-game.
  - `pvp-manager.js`, `battle-controller.js`: Xử lý logic ghép trận và vòng lặp đấu trường 1v1.
- **Tầng Component giao diện (`js/components/navigation.js`):** Tự động render Header, Sidebar, Mobile Nav và active đúng menu dựa theo URL hiện tại.
- **Tầng Page Scripts (`js/pages/[name].page.js`):** Mỗi file HTML có đúng 1 file script tương ứng được nạp cuối trang, bọc trong `document.addEventListener('DOMContentLoaded', ...)` để triệt tiêu lỗi `null` khi DOM chưa sẵn sàng. Tuyệt đối **không viết inline script**.

---

## 6. Cách Sử Dụng Mock Data & State

- Dữ liệu người chơi được lưu trong `localStorage` với khóa `brainarena_player`.
- Để khôi phục dữ liệu về trạng thái ban đầu để kiểm thử:
  - Bấm nút **"Reset Data"** ở chân Sidebar hoặc nút **"Reset Dữ Liệu"** trên trang Hồ sơ (`profile.html`).
  - Hoặc trong Console trình duyệt chạy: `AppState.resetPlayerToDefault();`.

---

## 7. Cách Thêm Một Trang Mới

1. Tạo file HTML mới trong `frontend/pages/[ten-trang].html`:
   - Liên kết các file CSS:
     ```html
     <link rel="stylesheet" href="../css/variables.css">
     <link rel="stylesheet" href="../css/reset.css">
     <link rel="stylesheet" href="../css/layout.css">
     <link rel="stylesheet" href="../css/components.css">
     <link rel="stylesheet" href="../css/responsive.css">
     ```
   - Nhúng bộ khung App Layout với các thẻ placeholder:
     ```html
     <div class="app-layout">
         <div id="global-header-placeholder"></div>
         <div class="app-body">
             <div id="desktop-sidebar-placeholder"></div>
             <main class="main-viewport">
                 <div class="content-container">
                     <!-- Nội dung trang ở đây -->
                 </div>
             </main>
         </div>
         <div id="mobile-bottom-nav-placeholder"></div>
     </div>
     ```
2. Tạo file script tương ứng `frontend/js/pages/[ten-trang].page.js`:
   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
       checkAuth();
       // Khởi tạo logic trang
   });
   ```
3. Nạp script theo thứ tự chuẩn ở cuối file HTML:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
   <script src="../js/data/mock-data.js"></script>
   <script src="../js/utils/sound.js"></script>
   <script src="../js/utils/toast.js"></script>
   <script src="../js/core/app-state.js"></script>
   <script src="../js/components/navigation.js"></script>
   <script src="../js/pages/[ten-trang].page.js"></script>
   ```

---

## 8. Những Chức Năng Mô Phỏng Frontend (Simulation)

Do đây là phiên bản preview tĩnh không có Backend:
1. **Đăng nhập:** Lưu cờ `brainarena_is_logged_in: true` trong `localStorage`, không xác thực mật khẩu thật qua server.
2. **Ghép trận ngẫu nhiên (Matchmaking):** Chạy `setInterval` trong 3 giây để giả lập quá trình tìm kiếm và chọn ngẫu nhiên 1 đối thủ trong danh sách `MOCK_OPPONENTS`.
3. **Đối thủ trong trận 1v1:** Được mô phỏng bằng timer tự động tăng thanh tiến độ mỗi 500ms và tung đòn tấn công debuff ngẫu nhiên.
4. **Tạo và vào phòng riêng:** Mã PIN 6 ký tự được sinh ngẫu nhiên ở client; nút *"Giả lập bạn bè vào phòng"* dùng để kích hoạt trạng thái sẵn sàng để kiểm thử flow.
5. **Bảng xếp hạng:** Đọc từ danh sách cố định trong `mock-data.js`.

---

## 9. Giới Hạn Của Phiên Bản Không Có Backend

- Dữ liệu chỉ tồn tại trên trình duyệt của người dùng hiện tại; xóa bộ nhớ duyệt web (Site Data) sẽ đưa ứng dụng về trạng thái mặc định ban đầu.
- Không thể thi đấu trực tiếp giữa hai máy tính/thiết bị khác nhau qua mạng Internet thật (cần WebSocket server trong phiên bản production).
- Không có bảo mật mật khẩu hay token JWT.
