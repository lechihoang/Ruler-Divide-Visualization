#include <raylib.h>
#include <vector>
#include <tuple>

// Lưu thông tin một vạch chia
struct RulerStep {
    float xm, y;
    int height;
};

// Duyệt đệ quy, lưu các bước vào vector
void collectRulerSteps(float x1, float x2, float y, int height, int level, std::vector<RulerStep>& steps) {
    if (level == 0) return;
    float xm = (x1 + x2) / 2;
    steps.push_back({xm, y, height});
    collectRulerSteps(x1, xm, y, height - 10, level - 1, steps);
    collectRulerSteps(xm, x2, y, height - 10, level - 1, steps);
}

int main() {
    InitWindow(800, 600, "Rod Cutting Visualizer");
    SetTargetFPS(60);

    // Load font Roboto cho giao diện đẹp hơn
    Font font = LoadFontEx("../font/Roboto-Regular.ttf", 20, 0, 0);

    std::vector<RulerStep> steps;
    int maxLevel = 6;
    collectRulerSteps(100, 700, 300, 60, maxLevel, steps);
    int currentStep = 0;
    bool isPlaying = false;
    double lastStepTime = GetTime();
    double stepInterval = 0.5; // giây

    int sliderX = 100, sliderW = 600, sliderH = 20;
    int sliderY = 400; // Đặt slider phía dưới thước (thước ở y=300, vạch nhỏ ở 320-330)

    while (!WindowShouldClose()) {
        // Điều khiển bước bằng phím trái/phải
        if (IsKeyPressed(KEY_RIGHT)) {
            if (currentStep < (int)steps.size()) currentStep++;
        }
        if (IsKeyPressed(KEY_LEFT)) {
            if (currentStep > 0) currentStep--;
        }
        // Play/Pause bằng phím SPACE
        if (IsKeyPressed(KEY_SPACE)) {
            isPlaying = !isPlaying;
        }
        // Nếu đang play, tự động tăng bước mỗi 0.5s
        if (isPlaying && currentStep < (int)steps.size()) {
            double now = GetTime();
            if (now - lastStepTime > stepInterval) {
                currentStep++;
                lastStepTime = now;
            }
        }
        // Thanh trượt chọn bước (thanh trượt mới bên phải)
        if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
            Vector2 mouse = GetMousePosition();
            
            // Kiểm tra click vào các nút
            Rectangle resetBtn = {10.0f, 450.0f, 120.0f, 30.0f};
            Rectangle playBtn = {140.0f, 450.0f, 120.0f, 30.0f};
            Rectangle prevBtn = {270.0f, 450.0f, 120.0f, 30.0f};
            Rectangle nextBtn = {400.0f, 450.0f, 120.0f, 30.0f};
            
            if (CheckCollisionPointRec(mouse, resetBtn)) {
                currentStep = 0;
            }
            else if (CheckCollisionPointRec(mouse, playBtn)) {
                isPlaying = !isPlaying;
            }
            else if (CheckCollisionPointRec(mouse, prevBtn)) {
                if (currentStep > 0) currentStep--;
            }
            else if (CheckCollisionPointRec(mouse, nextBtn)) {
                if (currentStep < (int)steps.size()) currentStep++;
            }
            // Thanh trượt (cập nhật vị trí Y)
            float sliderY2 = 450.0f + (30.0f - sliderH) / 2;
            if (mouse.y >= sliderY2 && mouse.y <= sliderY2 + sliderH && mouse.x >= 550 && mouse.x <= 780) {
                float percent = (mouse.x - 550) / 230;
                int newStep = (int)(percent * steps.size());
                if (newStep < 0) newStep = 0;
                if (newStep > (int)steps.size()) newStep = steps.size();
                currentStep = newStep;
            }
        }
        
        // Kéo thanh trượt
        if (IsMouseButtonDown(MOUSE_LEFT_BUTTON)) {
            Vector2 mouse = GetMousePosition();
            float sliderY2 = 450.0f + (30.0f - sliderH) / 2;
            if (mouse.y >= sliderY2 && mouse.y <= sliderY2 + sliderH && mouse.x >= 550 && mouse.x <= 780) {
                float percent = (mouse.x - 550) / 230;
                int newStep = (int)(percent * steps.size());
                if (newStep < 0) newStep = 0;
                if (newStep > (int)steps.size()) newStep = steps.size();
                currentStep = newStep;
            }
        }

        BeginDrawing();
        ClearBackground(RAYWHITE);

        // Vẽ cây thước
        DrawLine(100, 300, 700, 300, DARKGRAY);
        // Vẽ các vạch chia đến bước hiện tại
        for (int i = 0; i < currentStep; ++i) {
            DrawLine(steps[i].xm, steps[i].y, steps[i].xm, steps[i].y - steps[i].height, BLACK);
        }

        // Vẽ các vạch nhỏ và số thứ tự ở dưới thước (17 vạch từ 0-16 cho 16cm)
        int numTicks = 16; // 17 vạch = 16 khoảng cách
        float tickY1 = 320, tickY2 = 330;
        for (int i = 0; i <= numTicks; ++i) {
            float x = 100 + (700 - 100) * i / numTicks;
            DrawLine(x, tickY1, x, tickY2, BLACK);
            char label[8];
            snprintf(label, sizeof(label), "%d", i);
            int textWidth = MeasureTextEx(font, label, 14, 0).x;
            DrawTextEx(font, label, (Vector2){x - textWidth / 2, tickY2 + 2}, 14, 0, BLACK);
        }

        // Vẽ các nút điều khiển bên trái
        float buttonY = 450.0f;
        float buttonWidth = 120.0f, buttonHeight = 30.0f;
        float spacing = 10.0f;
        
        // Nút quay lại ban đầu
        Rectangle resetBtn = {10.0f, buttonY, buttonWidth, buttonHeight};
        DrawRectangle(resetBtn.x, resetBtn.y, resetBtn.width, resetBtn.height, LIGHTGRAY);
        DrawRectangleLines(resetBtn.x, resetBtn.y, resetBtn.width, resetBtn.height, DARKGRAY);
        Vector2 resetTextSize = MeasureTextEx(font, "⏮ Reset", 16, 0);
        DrawTextEx(font, "⏮ Reset", (Vector2){resetBtn.x + (resetBtn.width - resetTextSize.x)/2, resetBtn.y + 7}, 16, 0, BLACK);
        
        // Nút play/pause
        Rectangle playBtn = {resetBtn.x + buttonWidth + spacing, buttonY, buttonWidth, buttonHeight};
        DrawRectangle(playBtn.x, playBtn.y, playBtn.width, playBtn.height, LIGHTGRAY);
        DrawRectangleLines(playBtn.x, playBtn.y, playBtn.width, playBtn.height, DARKGRAY);
        const char* playText = isPlaying ? "⏸ Pause" : "▶ Play";
        Vector2 playTextSize = MeasureTextEx(font, playText, 16, 0);
        DrawTextEx(font, playText, (Vector2){playBtn.x + (playBtn.width - playTextSize.x)/2, playBtn.y + 7}, 16, 0, BLACK);
        
        // Nút bước trước
        Rectangle prevBtn = {playBtn.x + buttonWidth + spacing, buttonY, buttonWidth, buttonHeight};
        DrawRectangle(prevBtn.x, prevBtn.y, prevBtn.width, prevBtn.height, LIGHTGRAY);
        DrawRectangleLines(prevBtn.x, prevBtn.y, prevBtn.width, prevBtn.height, DARKGRAY);
        Vector2 prevTextSize = MeasureTextEx(font, "⏪ Prev", 16, 0);
        DrawTextEx(font, "⏪ Prev", (Vector2){prevBtn.x + (prevBtn.width - prevTextSize.x)/2, prevBtn.y + 7}, 16, 0, BLACK);
        
        // Nút bước tiếp
        Rectangle nextBtn = {prevBtn.x + buttonWidth + spacing, buttonY, buttonWidth, buttonHeight};
        DrawRectangle(nextBtn.x, nextBtn.y, nextBtn.width, nextBtn.height, LIGHTGRAY);
        DrawRectangleLines(nextBtn.x, nextBtn.y, nextBtn.width, nextBtn.height, DARKGRAY);
        Vector2 nextTextSize = MeasureTextEx(font, "⏩ Next", 16, 0);
        DrawTextEx(font, "⏩ Next", (Vector2){nextBtn.x + (nextBtn.width - nextTextSize.x)/2, nextBtn.y + 7}, 16, 0, BLACK);
        
        // Thanh trượt bên phải - cùng độ cao với các nút
        float sliderX2 = 550.0f;
        float sliderW2 = 230.0f;
        float sliderY2 = buttonY + (buttonHeight - sliderH) / 2; // Căn giữa thanh trượt với các nút
        DrawRectangle(sliderX2, sliderY2, sliderW2, sliderH, LIGHTGRAY);
        int sliderPos = sliderX2 + (int)((float)currentStep / steps.size() * sliderW2);
        DrawRectangle(sliderPos - 5, sliderY2 - 5, 10, sliderH + 10, DARKGRAY);
        DrawRectangleLines(sliderX2, sliderY2, sliderW2, sliderH, GRAY);

        // Hiển thị thông tin bước hiện tại ở chính giữa màn hình
        if (currentStep > 0 && currentStep <= (int)steps.size()) {
            const RulerStep& s = steps[currentStep-1];
            // Quy đổi x sang cm (giả sử 1cm = 37.8px, chuẩn màn hình 96dpi)
            float px_per_cm = 37.8f;
            float pos_cm = (s.xm - 100) / px_per_cm; // Tính từ điểm bắt đầu thước (x=100)
            float height_cm = s.height / px_per_cm;
            char info[256];
            snprintf(info, sizeof(info), "RulerDivide(%d, %d): ve vach o pos = %.1f cm, do cao = %.1f cm", 
                     currentStep, (int)steps.size(), pos_cm, height_cm);
            
            // Đưa thông báo về chính giữa màn hình (800x600)
            Vector2 textSize = MeasureTextEx(font, info, 16, 0);
            float textX = (400 - textSize.x) / 2;  // Căn giữa theo chiều rộng
            float textY = (200 - textSize.y) / 2;  // Căn giữa theo chiều cao
            
            DrawTextEx(font, info, (Vector2){textX, textY}, 16, 0, MAROON);
        }

        // Hướng dẫn
        DrawTextEx(font, "Click cac nut hoac su dung phim LEFT/RIGHT, SPACE", (Vector2){10, 10}, 18, 0, DARKGRAY);
        char buocText[64];
        snprintf(buocText, sizeof(buocText), "Step: %d/%d", currentStep, (int)steps.size());
        DrawTextEx(font, buocText, (Vector2){10, 35}, 18, 0, DARKGRAY);

        EndDrawing();
    }

    UnloadFont(font);
    CloseWindow();
    return 0;
}
