# BrainArena

BrainArena là prototype **casual mind e-sports**: người chơi rèn luyện phản xạ và khả năng tập trung qua các mini-game, mở khóa kỹ năng, sau đó thi đấu 1v1 và theo dõi tiến trình cá nhân.

## Tính năng

- Đăng nhập mô phỏng và trang tổng quan người chơi.
- Luyện tập Schulte Table và Stroop Test với nhiều cấp độ.
- Ghép trận PvP 1v1, tạo phòng riêng và mô phỏng kết quả trận đấu.
- Loadout kỹ năng, huy hiệu, kinh nghiệm và phần thưởng.
- Bảng xếp hạng, hồ sơ người chơi và lịch sử trận đấu.
- Lưu trạng thái người chơi trong `localStorage` để trải nghiệm prototype liền mạch.

## Công nghệ

- Vite và Node.js
- React 19, TypeScript và Tailwind CSS
- Bootstrap 5 và Bootstrap Icons qua CDN cho prototype tĩnh
- Lucide React và Motion trong phần nền React

## Yêu cầu

- Node.js 18 trở lên
- npm

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Trang gốc sẽ chuyển tới màn hình prototype tại `brainarena-prototype/index.html`.

## Các lệnh chính

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy máy chủ phát triển Vite tại cổng 3000 |
| `npm run build` | Build ứng dụng cho production |
| `npm run preview` | Xem thử bản build production |
| `npm run lint` | Kiểm tra kiểu TypeScript bằng `tsc --noEmit` |

## Cấu trúc thư mục

```text
brainarena/
├── brainarena-prototype/   # Giao diện prototype chính
│   ├── pages/              # Các màn hình HTML của sản phẩm
│   ├── js/                 # State, mock data và logic tương tác
│   └── css/                # Style dùng chung và responsive
├── src/                    # Entry React/Vite hiện tại
├── index.html              # Entry và chuyển hướng tới prototype
├── package.json
└── vite.config.ts
```

## Ghi chú phát triển

Đây là prototype frontend sử dụng dữ liệu mô phỏng, chưa có backend, xác thực thật hoặc matchmaking thời gian thực. Dữ liệu người chơi được lưu cục bộ trong trình duyệt; có thể xóa dữ liệu site để reset trạng thái trải nghiệm.

Các thư viện Gemini, Express và dotenv đã được khai báo trong dependencies để hỗ trợ mở rộng về sau, nhưng luồng prototype hiện tại không yêu cầu `GEMINI_API_KEY`.
