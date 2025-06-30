# 📏 Ruler Divide Visualizer

Ứng dụng mô phỏng quá trình chia thước kẻ bằng phương pháp đệ quy, được xây dựng bằng HTML, CSS và JavaScript thuần.

## ✨ Tính năng

- 🎯 **Mô phỏng trực quan**: Hiển thị từng bước chia thước một cách sinh động
- 📐 **Tùy chỉnh độ dài**: Cho phép nhập độ dài thước tùy ý (cm)
- ⏯️ **Điều khiển phát**: Play/Pause, Next/Previous, Reset
- 🎚️ **Slider điều hướng**: Nhảy đến bước bất kỳ
- ⌨️ **Phím tắt**: Mũi tên trái/phải, Space
- 📱 **Responsive**: Tự động thích ứng mọi kích thước màn hình
- 🎨 **Giao diện hiện đại**: Gradient, shadows, animations mượt mà

## 🚀 Cách sử dụng

### Chạy ứng dụng
1. Mở file `index.html` trong trình duyệt
2. Hoặc double-click vào `index.html`

### Điều khiển
- **Nhập độ dài thước**: Thay đổi số trong ô input và click "Khởi tạo"
- **⏮ Reset**: Về bước đầu tiên
- **▶ Play / ⏸ Pause**: Tự động chạy/tạm dừng
- **⏪ Prev / ⏩ Next**: Điều hướng từng bước
- **Slider**: Kéo để nhảy đến bước bất kỳ
- **Phím tắt**:
  - `←` / `→`: Bước trước/sau
  - `Space`: Play/Pause

## 🛠️ Công nghệ sử dụng

- **HTML5**: Cấu trúc semantic, Canvas API
- **CSS3**: Grid/Flexbox, Gradients, Animations
- **JavaScript ES6+**: Classes, Arrow functions, Modules
- **Canvas 2D**: Vẽ thước và các vạch chia
- **RequestAnimationFrame**: Animation 60fps mượt mà

## 📁 Cấu trúc dự án

```
Ruler-Divider/
├── index.html          # Giao diện chính
├── styles.css          # Styling và responsive
├── index.js            # Logic ứng dụng (class-based)
└── README.md           # Tài liệu này
```

## 🔧 Thuật toán

Ứng dụng sử dụng thuật toán đệ quy để chia thước:

1. **Bước đầu**: Chia đoạn [0, L] tại điểm giữa L/2
2. **Đệ quy**: Tiếp tục chia các đoạn con
3. **Điều kiện dừng**: Khi đoạn chia < 0.01cm hoặc độ cao vạch < 0.1cm
4. **Độ cao vạch**: Giảm dần 0.2cm mỗi lần chia

## 💡 Đặc điểm kỹ thuật

- **Độ dài vạch cố định**: Luôn theo quy ước thước 16cm
- **Responsive canvas**: Tự động resize theo container
- **Memory efficient**: Không phụ thuộc thư viện ngoài
- **Cross-browser**: Hỗ trợ tất cả trình duyệt hiện đại

## 🎯 Ưu điểm

- ⚡ **Tốc độ cao**: Không cần load thư viện ngoài
- 📦 **Nhẹ nhàng**: Tổng dung lượng < 50KB
- 🔧 **Dễ maintain**: Code structure rõ ràng, modular
- 🌐 **Universal**: Chạy trên mọi thiết bị có web browser

## 📝 Ghi chú

- Ứng dụng được tối ưu để chạy mượt mà trên cả desktop và mobile
- Sử dụng thuật toán đệ quy để mô phỏng chính xác quá trình chia thước thực tế
- Interface được thiết kế theo nguyên tắc UX hiện đại với feedback trực quan

---

*Phát triển bằng HTML/CSS/JavaScript thuần - Không phụ thuộc framework*