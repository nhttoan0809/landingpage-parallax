# Task 03 — Waypoint World: portfolio lái xe khám phá thế giới 3D

## Chỉ thị thực hiện

Hãy triển khai **đến sản phẩm cuối cùng** một portfolio độc lập trong repository
`landingpage-parallax`, lấy cảm hứng từ
[Bruno Simon](https://bruno-simon.com/). Tạo studio hư cấu **Waypoint Studio**,
URL **`/waypoint-world/`**, với thế giới nhỏ có thể lái xe để khám phá dự án.
Task này độc lập, đủ bối cảnh để dùng trong conversation mới; không cần task
Lando/Noomo hay lịch sử chat. Đây là brief thực thi, chưa có implementation.

Tự quyết định chi tiết trong phạm vi, tạo asset, viết code, kiểm tra và sửa
đến khi nghiệm thu. Không kết thúc ở scene demo, một chiếc xe chạy trên mặt
phẳng trống, mockup hoặc kế hoạch. Chỉ hỏi khi thiếu thông tin bắt buộc không
thể suy ra; tiếp tục phần độc lập trong khi chờ. Bàn giao local/build tĩnh;
publish, backend production, mua asset và tạo tài khoản nằm ngoài phạm vi task.

## Nguồn, bối cảnh và phạm vi game

- Repo dùng **Bun, Vite 7, React 19, TypeScript**, multi-page với catalog `/`.
  Kiểm tra package.json hiện tại trước khi cài bổ sung.
- Tham khảo [case study của Bruno](https://www.awwwards.com/brunos-portfolio-case-study.html),
  [folio-2025](https://github.com/brunosimon/folio-2025),
  [package.json](https://github.com/brunosimon/folio-2025/blob/main/package.json).
  Bản mới có Three.js/TSL, Rapier, GSAP, Howler và Vite; bản 2019 dùng Cannon.js.
  Không áp dụng mô tả bản cũ cho physics của bản hiện tại.
- Stack **đề xuất cho task**: Three.js + Rapier 3D + React/TS; Howler hoặc Web
  Audio cho âm thanh. R3F và wrapper Rapier là tùy chọn, kiểm tra tương thích.
  Ưu tiên scene WebGL ổn định; WebGPU/TSL chỉ chọn khi đã kiểm tra backend/
  fallback thực tế. Không bắt buộc copy toàn bộ stack hoặc source của Bruno.
- Đọc tài liệu chính thức hiện hành về physics, rendering và audio. Asset,
  code, nhạc và trademark có license riêng. Tạo tên, world và model của mình.
- Làm game một người chơi có mục tiêu khám phá và nội dung portfolio đầy đủ.
  Multiplayer, server, tài khoản, bảng xếp hạng, thời tiết/mùa phức tạp và mobile
  app native nằm ngoài phạm vi; không cần chúng để có sản phẩm hoàn chỉnh.
- Thuật ngữ: game loop, fixed timestep, vehicle controller, rigid body,
  collider, follow camera, trigger zone, instancing, spatial audio.

## Khởi động và kiến trúc bắt buộc

1. Đọc `AGENTS.md`, `docs/strategy.md`, `docs/frontend-skills.md`, `src/landings/registry.ts`,
   package.json, catalog và các quy tắc con áp dụng. Kiểm tra git status và
   bảo toàn thay đổi người dùng, catalog, Luma và mọi brand đã tồn tại.
2. Đọc `.agents/skills/ui-ux-pro-max/SKILL.md`, chạy Python search đi kèm,
   lưu hướng thiết kế tại docs Waypoint. Dùng `frontend-design` và
   `vercel-react-best-practices` khi có và phù hợp. Với GSAP thì đọc skill React
   tương ứng. Nếu skill cấp máy thiếu, tiếp tục bằng tài liệu repo/chính thức
   khi đủ thông tin và báo thiếu cụ thể; không tự dừng task vì thiếu skill tùy chọn.
3. Tạo `waypoint-world/index.html`, `src/landings/waypoint-world/main.tsx`,
   toàn bộ code/CSS/test trong `src/landings/waypoint-world/`, asset trong
   `public/landings/waypoint-world/`, docs trong `docs/landings/waypoint-world/`.
4. Registry chỉ chứa metadata, không import scene/CSS/provider. Thêm preview
   tĩnh và mục catalog README. Catalog không tải game để render thumbnail.
5. Giữ HTML entry riêng, `cssCodeSplit: true`, CSS guard và deploy nhiều
   document. CSS Modules cho UI; reset/token/font/metadata thuộc Waypoint.
   Không root App gom brand, SPA routing cross-brand hoặc preflight/theme chung.
6. Asset TSX dùng `${import.meta.env.BASE_URL}landings/waypoint-world/...`;
   HTML dùng `%BASE_URL%`. Link brand/return dùng BASE_URL và trailing slash;
   nội dung nội trang dùng hash. Không hardcode đường dẫn bắt đầu `/images/`.
7. Nếu cần sửa Luma thì đọc `src/landings/luma/AGENTS.md` trước, giới hạn phạm vi.

## Art direction và nội dung

Tạo một diorama đảo nhỏ với nhận diện riêng: low-poly có chủ đích, màu ấm/lạnh
tương phản, typography dễ đọc và landmark dễ nhận ra. Camera kiểu nhìn từ
trên nghiêng; hướng camera không được làm người chơi khó điều khiển. Copy
tiếng Anh, `lang="en"`, nội dung studio/project hư cấu được ghi rõ là concept.

| Khu vực / hash HTML      | Nội dung và hành vi                                                  |
| ------------------------ | -------------------------------------------------------------------- |
| Welcome / `#welcome`     | Loading, Start exploring, Read portfolio, hướng dẫn ngắn             |
| Studio / `#studio`       | Giới thiệu studio, vai trò và chuyên môn                             |
| Projects / `#projects`   | Ít nhất 3 dự án có tên, bài toán, giải pháp, vai trò và visual riêng |
| Lab / `#lab`             | Khu thử xe với vật thể có physics và một hoạt động phụ               |
| Visit log / `#visit-log` | Theo dõi 3 điểm dự án đã khám phá, trạng thái 0–3 và Reset progress  |
| Footer / `#credits`      | Return to collection, credit và concept disclosure                   |

HTML portfolio luôn tồn tại cùng document, có điều hướng anchor, đọc được khi
không chơi, không có GPU hoặc dùng screen reader. Mỗi dự án có permalink hash
riêng, không chỉ hiển thị chữ rasterized trên canvas. Không form hoặc email giả.

## Thế giới và cơ chế bắt buộc

- **World có thiết kế:** mặt đất/đường đi, spawn, biển chỉ dẫn, khu studio,
  3 điểm dự án, lab, cây/đá/đèn và ranh giới an toàn. Bố cục giúp tìm được
  cả ba dự án trong khoảng 2–4 phút chơi bình thường; ghi nhận playthrough thật.
- **Xe nhận ra được:** body, cabin và 4 bánh; có steering/wheel visual phản hồi
  chuyển động. Dựng model riêng bằng Blender hoặc procedural geometry chất lượng.
- **Physics thật bằng Rapier:** ít nhất chassis động, mặt đất/tường tĩnh, phanh/
  tăng tốc bằng lực/impulse/controller thích hợp và ít nhất 6 prop có thể đẩy.
  Prop và xe phản ứng va chạm. Không chỉ đổi tọa độ mesh để giả vật lý.
- **Điều khiển:** WASD/arrows, phanh bằng Space, reset xe bằng R; mobile có
  trái/phải/ga/phanh hoặc joystick tương đương. Không bắt buộc gamepad.
- **Bước mô phỏng:** fixed timestep + giới hạn catch-up hoặc cơ chế tương
  đương có giải thích; xử lý delta lớn khi tab hoạt động lại. Chạy ổn ở 30/60
  FPS, không tăng tốc gấp đôi khi FPS đổi. Không làm xe xuyên đất dễ dàng.
- **Camera:** follow camera có damping, giới hạn khoảng nhìn; không rung quá
  mức hoặc kẹt sau vật thể. Có reset view; tắt shake/auto orbit ở reduced motion.
- **Vùng dự án:** proximity trigger hiển thị prompt; E/Enter hoặc nút touch
  mở nội dung HTML. Có indicator landmark và tên dự án, không cần va vào chữ.
- **Khi mở nội dung/menu:** dừng input xe, pause mô phỏng phù hợp; Escape đóng,
  focus trap nếu là modal và trả focus đúng. Đóng xong không bị giữ ga vì key cũ.
- **Vòng hoàn thành:** ghé 3 điểm dự án cập nhật log; có thông báo hoàn thành
  gọn và link đọc lại dự án. Persist tiến độ local có version, xử lý dữ liệu
  hỏng/quyền storage bị chặn; có nút reset. Không cần leaderboard/server.
- **Lab:** có hoạt động phụ cụ thể, ví dụ đẩy 3 thùng vào ô để bật đèn; thành
  công được phản hồi trực quan. Đây là tương tác hoàn chỉnh, không placeholder.
- **Recovery:** rơi khỏi world, lật xe hoặc kẹt thì có reset hữu dụng; reset
  cập nhật cả transform, linear/angular velocity và input. Không cần reload trang.

## Âm thanh, môi trường và tối ưu

- Mặc định mute; user gesture bật audio. Có ambience, engine theo tốc độ và
  một âm va chạm. Ít nhất một nguồn âm theo vị trí, ví dụ đèn/lab/biển.
  Có volume/mute accessible và tạm dừng khi tab ẩn. Web Audio tổng hợp là
  phương án hợp lệ khi không có file âm thanh phù hợp.
- Có ít nhất một môi trường chuyển động nhẹ (gió ở cỏ/lá hoặc nước); có thể
  dùng shader/noise. Không bắt buộc mô phỏng mưa/tuyết/ngày đêm như Bruno.
- Với vật thể lặp, dùng instancing hoặc merge phù hợp; collision shape đơn
  giản riêng với visual mesh. Kiểm soát shadow, draw call, DPR và số rigid body.
- Duy trì một loop rõ thứ tự input → physics → sync visual → camera → render;
  không tạo hai loop vô tình đẩy physics hai lần. Không React setState mỗi frame.
- Cleanup WASM world/body theo API, canvas, controls, listener, RAF, texture,
  geometry, material và audio. Tôn trọng lifecycle React và tab visibility.

## Asset, fallback và accessibility

Blender là lựa chọn tạo model; nếu không có, dựng world/xe/props bằng code.
Đảm bảo art direction và silhouette, không dừng vì thiếu asset gốc. Giữ
script/nguồn để tái tạo. Ghi nguồn, tác giả, license, sửa đổi và đường dẫn của
từng nhóm asset trong `docs/landings/waypoint-world/assets.md`; model tự tạo
ghi rõ phương pháp. Tạo poster/preview/favicon local; đóng gói decoder/audio
cần thiết đúng BASE_URL. Tránh phụ thuộc asset hotlink của Bruno.

- Loading có trạng thái dễ hiểu, không yêu cầu audio để start; có error/retry/
  Read portfolio nếu tải model/WASM thất bại hoặc mất graphics context.
- `prefers-reduced-motion`: ưu tiên vào HTML portfolio, chỉ bắt đầu game khi
  người dùng chủ động; giảm camera motion/effect và không ép trải nghiệm lái.
- Menu, control, nội dung và điều hướng dùng keyboard được. Phím game chỉ
  được chặn khi game đang active/focused; không chiếm phím trong input/dialog,
  không cản Tab hoặc scroll khi đọc HTML. Có cách thoát focus game rõ ràng.
- Skip link, landmark/heading, focus rõ, contrast WCAG AA cho chữ thường,
  target chính ≥44×44 CSS px; thông báo tiến độ dùng live region tiết chế.
- Kiểm tra 360, 390, 768, 1440 px và mobile landscape; HUD không che đường đi
  hoặc CTA, touch controls không phụ thuộc hover, không horizontal overflow.

## Ngân sách hiệu năng và bằng chứng

- Asset cần cho first experience ≤20 MiB; world/model/texture đầu tiên ≤10 MiB.
  Headline, hướng dẫn và HTML portfolio xuất hiện trước khi game tải xong.
- Có quality tier giảm DPR, shadow, vegetation và số effect. Đo playthrough
  30 giây có va chạm: desktop mục tiêu trung bình ≥45 FPS, p95 frame interval
  ≤40 ms; mobile thực mục tiêu ≥30 FPS ở tier thấp. Đo sau loading, ghi máy,
  browser, viewport, DPR, tier và cách đo; không coi emulation là GPU mobile thật.
- Thực hiện ít nhất một vòng: start → lái tới 3 project → mở/đóng → hoàn thành
  log → lab → reset xe → reload để kiểm tra tiến độ. Ghi kết quả, thời gian và lỗi.
- Chụp world tổng thể, tương tác dự án, log hoàn thành và mobile. Nếu không có
  browser/thiết bị đo, ghi blocker/tiêu chí chưa xác minh; không ghi pass suy đoán.

## Kiểm thử và Definition of Done

Viết test có giá trị cho trigger/progress (không đếm lặp, storage hỏng), reset
xe, input release khi blur/dialog và keyboard của panel. Kiểm tra physics bằng
API/headless phù hợp nếu khả thi; jsdom không thay thế playtest WebGL/WASM.
Chạy, sửa lỗi và ghi kết quả:

```bash
bun run lint
bun run test --run
bun run build
VITE_GITHUB_PAGES=true bun run build
VITE_GITHUB_PAGES=true bun run preview
```

Browser QA tại base thường và `/landingpage-parallax/`: catalog → Waypoint →
catalog, back, direct reload, project hash reload, loading, start, physics,
keyboard/touch, modal, reset, persist, mute, reduced motion, GPU/WASM failure
fallback. Không console error chưa xử lý, 404 hoặc request sai base. Catalog
không tải game, WASM physics, audio/font riêng Waypoint hoặc khởi tạo Lenis.
CSS guard pass; vendor JS chung không có side effect hợp lệ. Recheck Luma và
các brand khác để không làm hỏng collection.

Task hoàn tất khi world có vòng khám phá trọn vẹn, physics thật, 3 dự án đọc
được, lab có kết quả, HTML fallback hoạt động và kiểm tra bắt buộc pass. Lưu
`design.md`, `assets.md`, `validation.md` trong docs Waypoint: bản đồ world,
input/game-loop/state, physics quyết định, pipeline asset, số đo, lệnh/exit
status, playtest, ma trận QA và ảnh. Bàn giao URL local, file chính, kết quả
kiểm tra và limitation. Không tuyên bố tương đương toàn bộ game Bruno hoặc
đã kiểm tra thiết bị/backend chưa thực sự dùng.
