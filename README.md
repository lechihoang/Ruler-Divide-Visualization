# 📷 Screenshot

![Ruler Divide Visualization](assets/screenshot.png)

# 📏 Ruler Divide Visualization

Ứng dụng mô phỏng quá trình chia thước kẻ bằng phương pháp đệ quy, được xây dựng bằng HTML, CSS và JavaScript

🌐 **[Demo trực tiếp tại đây](https://ruler-divider.vercel.app/)** - Trải nghiệm ngay không cần cài đặt!

> **📚 Bài tập Bonus** - Môn **Phân tích và thiết kế thuật toán (CS112.P21)**, Trường **Đại học Công nghệ Thông tin - ĐHQG-HCM(UIT)**  
> Thực hiện dưới sự hướng dẫn của **TS. Huỳnh Thị Thanh Thương** - Khoa Khoa học Máy tính

## ✨ Tính năng

- 🎯 **Mô phỏng trực quan**: Hiển thị từng bước chia thước một cách sinh động
- 📐 **Tùy chỉnh độ dài**: Cho phép nhập độ dài thước tùy ý (cm)
- ⏯️ **Điều khiển phát**: Play/Pause, Next/Previous, Reset
- 🎚️ **Slider điều hướng**: Nhảy đến bước bất kỳ
- ⌨️ **Phím tắt**: Mũi tên trái/phải, Space
- 📱 **Responsive**: Tự động thích ứng mọi kích thước màn hình
- 🎨 **Giao diện hiện đại**: Gradient, shadows, animations mượt mà

## 🚀 Cách sử dụng

### Clone dự án về máy
```bash
# Clone repository về máy
git clone https://github.com/yourusername/Ruler-Divide-Visualization.git

# Di chuyển vào thư mục dự án
cd Ruler-Divide-Visualization
```

### Chạy ứng dụng
1. Mở file `index.html` trong trình duyệt web
2. Hoặc double-click vào file `index.html`
3. Hoặc sử dụng Live Server (nếu có extension trong VS Code)

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
Ruler-Divide-Visualization/
├── index.html          # Giao diện chính
├── styles.css          # Styling và responsive
├── index.js            # Logic ứng dụng (class-based)
├── README.md           # Tài liệu này
└── assets/
    └── screenshot.png  # Ảnh chụp màn hình
```

## 🔧 Thuật toán

Ứng dụng sử dụng thuật toán đệ quy đơn giản để chia thước:

1. **Bắt đầu**: Khởi tạo đoạn thước có độ dài L (cm) - Người dùng có thể nhập bất kỳ độ dài nào
2. **Chia đôi**: Tìm điểm giữa của đoạn đang xét và vẽ vạch chia ở điểm đó, độ dài vạch chia sẽ giảm dần khi level đệ quy tăng. Sau đó thực hiện tương tự đối với hai đoạn con được chia bởi điểm giữa
3. **Lặp lại**: Tiếp tục chia đôi các đoạn nhỏ hơn - Áp dụng cùng quy tắc cho tất cả đoạn con
4. **Điều kiện dừng**: Khi đạt số level tối đa hoặc đoạn đang tính toán có độ dài quá nhỏ 
