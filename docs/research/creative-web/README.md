# Nghiên cứu Creative Web và bộ task triển khai

Lưu trữ ngày **23/10/2026** từ nghiên cứu trong conversation ngày 21–22/10/2026.
Đây là hồ sơ tham chiếu có thời điểm; website, dependency và tài liệu bên ngoài
có thể thay đổi sau đó. Lần biên soạn này tổ chức lại kết quả đã nghiên cứu,
không phải một lần xác minh mới toàn bộ website.

| Tài liệu                                               | Nội dung                                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| [Nghiên cứu và nhận định](research.md)                 | 12 hướng trình bày, URL tham khảo, phân tích Lando/Noomo/Bruno, công nghệ, công cụ và lựa chọn cho repo |
| [Từ điển thuật ngữ](glossary.md)                       | Tên tiếng Anh, diễn giải, ứng dụng và những khái niệm dễ nhầm                                           |
| [Task 01 — Apex Velocity](tasks/01-apex-velocity.md)   | Website thương hiệu đua xe lấy cảm hứng từ Lando Norris                                                 |
| [Task 02 — Aether Story](tasks/02-aether-story.md)     | Câu chuyện 3D với vật liệu kính lấy cảm hứng từ Noomo                                                   |
| [Task 03 — Waypoint World](tasks/03-waypoint-world.md) | Portfolio có thể lái xe khám phá lấy cảm hứng từ Bruno Simon                                            |

## Sử dụng trong conversation mới

Mở repository này làm workspace. Chọn **một** task và gửi một trong các prompt:

```text
Đọc docs/research/creative-web/tasks/01-apex-velocity.md và thực hiện toàn bộ task
đến sản phẩm cuối cùng. Trước khi triển khai, tạo Git worktree riêng tại
../landingpage-parallax-worktrees/apex-velocity với branch feat/apex-velocity
từ HEAD hiện tại; nếu tên đã tồn tại, chọn hậu tố duy nhất. Chuyển sang worktree
đó và thực hiện toàn bộ tạo asset, cài dependency, sửa code, kiểm tra và preview
trong worktree. Bảo toàn checkout nguồn và thay đổi chưa commit; không tự merge,
push hoặc xóa worktree. Tuân thủ AGENTS.md và tiêu chí trong task. Khi bàn giao,
ghi đường dẫn worktree, branch và lệnh chạy. Không dừng ở kế hoạch hoặc mockup.
```

```text
Đọc docs/research/creative-web/tasks/02-aether-story.md và thực hiện toàn bộ task
đến sản phẩm cuối cùng. Trước khi triển khai, tạo Git worktree riêng tại
../landingpage-parallax-worktrees/aether-story với branch feat/aether-story
từ HEAD hiện tại; nếu tên đã tồn tại, chọn hậu tố duy nhất. Chuyển sang worktree
đó và thực hiện toàn bộ tạo asset, cài dependency, sửa code, kiểm tra và preview
trong worktree. Bảo toàn checkout nguồn và thay đổi chưa commit; không tự merge,
push hoặc xóa worktree. Tuân thủ AGENTS.md và tiêu chí trong task. Khi bàn giao,
ghi đường dẫn worktree, branch và lệnh chạy. Không dừng ở kế hoạch hoặc mockup.
```

```text
Đọc docs/research/creative-web/tasks/03-waypoint-world.md và thực hiện toàn bộ task
đến sản phẩm cuối cùng. Trước khi triển khai, tạo Git worktree riêng tại
../landingpage-parallax-worktrees/waypoint-world với branch feat/waypoint-world
từ HEAD hiện tại; nếu tên đã tồn tại, chọn hậu tố duy nhất. Chuyển sang worktree
đó và thực hiện toàn bộ tạo asset, cài dependency, sửa code, kiểm tra và preview
trong worktree. Bảo toàn checkout nguồn và thay đổi chưa commit; không tự merge,
push hoặc xóa worktree. Tuân thủ AGENTS.md và tiêu chí trong task. Khi bàn giao,
ghi đường dẫn worktree, branch và lệnh chạy. Không dừng ở kế hoạch hoặc mockup.
```

Cũng có thể dán toàn bộ nội dung một task vào conversation mới. Mỗi task lặp lại
bối cảnh, kiến trúc, nguồn, phạm vi, phương án asset, kiểm thử và Definition of Done;
không cần lịch sử chat hoặc kết quả của hai task còn lại. Các tài liệu nghiên cứu
là nguồn bổ sung, không phải điều kiện để hiểu task.

## Phạm vi và trạng thái

- Ba task là **ba sản phẩm độc lập**, không phải ba giai đoạn phụ thuộc nhau.
- Đây là brief triển khai mới; chưa có trang Apex, Aether hoặc Waypoint được tạo.
- Thương hiệu và nội dung sản phẩm trong task là hư cấu. Học ngôn ngữ tương tác;
  tạo nhận diện và asset riêng, ghi nguồn khi dùng tài nguyên bên thứ ba.
- Nghiệm thu là website chạy được trong repo và bản build tĩnh, kèm bằng chứng QA.
  Publish, mua asset, tạo tài khoản dịch vụ và gửi thông tin cho người khác nằm
  ngoài phạm vi mặc định.
- Mỗi task bắt buộc tạo worktree và branch riêng, triển khai/kiểm tra trong
  worktree đó và giữ lại để review. Registry, README và lockfile có thể cần
  tích hợp khi merge sau này; task không tự merge vào checkout nguồn.

## Quy ước về độ tin cậy

**Tác giả xác nhận**: có case study do nhóm sản xuất viết.
**Quan sát/mã công khai**: thấy trên trang hoặc mã được phân phối; thư viện có
trong bundle/package chưa chứng minh nó chạy ở mọi section.
**Đề xuất**: lựa chọn để xây dựng sản phẩm tương tự trong repo này.
**Cần kiểm tra lại**: phiên bản, API, license, giá hoặc khả năng tương thích ở
thời điểm triển khai.
