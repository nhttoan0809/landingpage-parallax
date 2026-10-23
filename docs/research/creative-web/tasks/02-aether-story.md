# Task 02 — Aether Story: câu chuyện 3D với phượng hoàng kính

## Chỉ thị thực hiện

Hãy triển khai **đến sản phẩm cuối cùng** một landing độc lập trong repository
`landingpage-parallax`, lấy cảm hứng từ
[Noomo — The Power of Digital Storytelling](https://storytelling.noomoagency.com/).
Tạo thương hiệu sáng tạo hư cấu **Aether Studio**, URL **`/aether-story/`**,
với câu chuyện bốn chương về một phượng hoàng kính và một bộ tùy chỉnh ngoại hình.
Task này tự đủ bối cảnh, không cần lịch sử chat hoặc sản phẩm của task khác.

Tự quyết định chi tiết mỹ thuật/kỹ thuật, sản xuất asset, viết code, kiểm tra và
sửa đến khi nghiệm thu. Không kết thúc ở kế hoạch, mockup, video dựng sẵn hoặc
canvas thử nghiệm chưa có nội dung. Chỉ hỏi khi thiếu thông tin bắt buộc không
thể suy ra; tiếp tục phần độc lập trong khi chờ. Bàn giao local/build tĩnh;
publish, mua asset và tạo tài khoản dịch vụ nằm ngoài phạm vi task.

## Bối cảnh và nguồn

- Repo dùng **Bun, Vite 7, React 19, TypeScript**, catalog tại `/`, mỗi brand có
  HTML document riêng. Kiểm tra package.json và hướng dẫn repo hiện tại trước khi sửa.
- Nguồn chính: [case study do Noomo viết](https://noomoagency.com/insights/the-power-of-digital-storytelling-website).
  Dự án gốc xác nhận Three.js/WebGL, Nuxt/Vue, GSAP/ScrollTrigger; Figma,
  Blender, ZBrush và Houdini trong pipeline asset. Đây là site phượng hoàng,
  không phải Noomo ValenTime hay một dự án WebGPU khác của Noomo.
- Stack **đề xuất cho bản triển khai**: Three.js/WebGL + GSAP/ScrollTrigger +
  `@gsap/react`, React/TS hiện tại. R3F tùy chọn. Giữ kiến trúc repo; không đổi
  sang Nuxt. Đọc tài liệu chính thức hiện hành và kiểm tra license dependency.
- Từ khóa: immersive scrollytelling, camera choreography, animation scrubbing,
  refraction, dispersion, procedural VFX, attribute baking, transparency sorting.
- Tạo nhận diện, copy, hình dáng và asset riêng; mục tiêu là học cách kể chuyện
  và rendering, không phải sao chép logo, UI hoặc mô hình gốc.

## Khởi động và kiến trúc bắt buộc

1. Đọc `AGENTS.md`, `docs/strategy.md`, `docs/frontend-skills.md`, `src/landings/registry.ts`,
   package.json, catalog và hướng dẫn con áp dụng cho file sẽ sửa. Kiểm tra
   git status, bảo toàn thay đổi người dùng và mọi landing đã có.
2. Đọc skill repo `.agents/skills/ui-ux-pro-max/SKILL.md`, dùng Python search
   đi kèm và lưu quyết định tại docs Aether. Áp dụng `frontend-design`,
   `vercel-react-best-practices`, `gsap-react`, `gsap-scrolltrigger` nếu có
   và phù hợp. Nếu skill ngoài máy thiếu, tiếp tục bằng docs chính thức và
   hướng dẫn repo khi đủ thông tin; báo thiếu cụ thể, không tự làm kẹt task.
3. Tạo `aether-story/index.html`, `src/landings/aether-story/main.tsx`,
   code/CSS/test trong `src/landings/aether-story/`, asset trong
   `public/landings/aether-story/`, docs trong `docs/landings/aether-story/`.
4. Registry chỉ thêm metadata data-only; cập nhật README và preview tĩnh catalog.
   Không import scene/CSS/provider của Aether vào catalog hoặc các brand khác.
5. Giữ `cssCodeSplit: true` và CSS guard. CSS Modules cho component, reset,
   token, font và metadata thuộc riêng document. Không root App gom brand,
   SPA router cross-brand hoặc stylesheet/theme/preflight chung.
6. Trong TSX dùng `${import.meta.env.BASE_URL}landings/aether-story/...` cho asset;
   HTML dùng `%BASE_URL%`. Link brand dùng BASE_URL + slug + `/`, return link
   dùng BASE_URL, nội trang dùng hash. Bảo toàn deploy MPA trên GitHub Pages.
7. Nếu phải sửa Luma, đọc `src/landings/luma/AGENTS.md` trước; hạn chế thay đổi.

## Art direction, nội dung và storyboard

Thiết kế mang tinh thần triển lãm: khoảng trắng, serif biểu cảm kết hợp sans
gọn; ánh sáng bạc, tím khói hoặc màu riêng có chủ đích, chuyển sang nền tối ở
phần case study để nội dung dễ đọc. Copy tiếng Anh, `lang="en"`, thông báo
concept hư cấu và nguồn asset ở footer. Không dùng placeholder/lorem ipsum.

| Chương / hash            | Nội dung và hành động                                                          |
| ------------------------ | ------------------------------------------------------------------------------ |
| Spark / `#spark`         | Hero phượng hoàng kính, thông điệp ngắn, Start story và Read without motion    |
| Formation / `#formation` | Cánh/lông mở theo tiến độ; camera đổi góc, giải thích việc ý tưởng thành hình  |
| Resonance / `#resonance` | 3 tinh thể đại diện 3 case study có nội dung hoàn chỉnh                        |
| Rebirth / `#rebirth`     | Phượng hoàng trở về hình dáng đầy đủ, kết thúc thị giác rõ, CTA đến customizer |
| Reimagine / `#reimagine` | Đổi palette, mức dispersion/độ óng phù hợp và cường độ glow; reset, lưu preset |
| Footer                   | Return to collection, credit, concept disclosure                               |

Mỗi case study có tên dự án hư cấu, bài toán, giải pháp, kết quả minh họa được
ghi rõ là concept và visual riêng. Có chapter navigation HTML, trạng thái
chương hiện tại và lối đọc toàn bộ nội dung theo luồng bình thường.

## Yêu cầu 3D và motion

- **Scene thật:** phượng hoàng có thân, đầu, mỏ, đuôi và hai cánh gồm nhiều lông;
  nhận ra silhouette từ trước và nghiêng. Không thay bằng một khối abstract,
  ảnh nền hoặc video. Mô hình có hierarchy để điều khiển cánh.
- **Kính thật trong 3D:** có transparency/transmission, refraction và phản xạ
  môi trường; ánh sáng/độ dày giúp đọc form. Có tách màu/dispersion hoặc hiệu
  ứng xấp xỉ được giải thích trung thực; không chỉ tô gradient lên mesh đục.
- **Shader riêng:** ít nhất một shader/noise effect tự viết cho kính hoặc VFX
  năng lượng, có tham số runtime và source dễ tìm. Ghi phương trình/ý tưởng,
  input và điều gì là xấp xỉ trong docs; không chỉ gắn nhãn shader lên CSS.
- **Timeline:** cuộn ánh xạ liên tục vào camera + cánh + bố cục/chuyển ánh sáng.
  Cuộn ngược phải hoạt động. Có nhịp nghỉ để đọc; không xoay camera đột ngột.
- **Desktop/mobile:** tối thiểu hai camera path/composition riêng; mobile giảm
  quãng bay và pin, sắp tinh thể để đọc được trên màn hẹp. Không chỉ scale desktop.
- **Parallax chuột:** nhỏ, có giới hạn; không làm lộ lỗi render kính. Tắt khi
  reduced motion, không yêu cầu hover để tiếp cận nội dung.
- **Tinh thể:** hover/focus phản hồi thị giác; click/Enter mở case study HTML.
  Nếu modal: Escape, focus trap và trả focus về trigger; không tự đóng vì cuộn.
- **Customizer:** ít nhất 3 palette và 2 mức/slider điều chỉnh vật liệu/VFX;
  cập nhật thật trong scene. Preset lưu/tải bằng JSON local có schema/version,
  kiểm tra dữ liệu khi nhập, báo lỗi rõ và không crash. Không cần backend.
- **Âm thanh:** có ít nhất một ambient nhẹ và phản hồi tinh thể; mặc định mute,
  chỉ phát sau người dùng bật. Có thể tạo bằng Web Audio để tránh thiếu file.
  Hover keyboard focus tương đương; không biến mọi mouse move thành tiếng ồn.

## Pipeline asset và phương án khả thi

Ưu tiên Blender để dựng/bake/export GLB. Nếu thiếu Blender, tự dựng bằng code
với mesh lông có tổ chức; hoàn thiện silhouette, vật liệu và animation trước
khi thêm chi tiết. Houdini/ZBrush là công cụ pipeline gốc, không phải điều kiện
để task này hoàn thành. Khi không có chúng, tính thuộc tính bằng Blender/script/
code và ghi đúng phương án thay thế. Không yêu cầu người dùng cung cấp model
mới có thể tiếp tục.

Giữ số layer kính có chủ đích, xử lý render order, tránh feedback khi dùng
render target, dọn tài nguyên theo lifecycle. Nếu dùng Draco/KTX2, đóng gói
loader/transcoder đúng BASE_URL và kiểm tra offline sau tải cần thiết; không
phụ thuộc một CDN thiếu ổn định. Tạo poster/fallback/preview local.

Ghi URL, tác giả, license, chỉnh sửa và đường dẫn asset trong `assets.md` của
Aether; asset tự tạo ghi công cụ/script. Không suy ra quyền dùng model/nhạc gốc
từ việc website hoặc code có thể xem công khai.

## Accessibility, responsive và runtime

- Có semantic HTML cho tất cả chương/case study và customizer. Nội dung vẫn
  đọc được khi scene không tải, người dùng chọn chế độ tĩnh hoặc không có GPU.
- `prefers-reduced-motion`: dùng composition tĩnh, bỏ fly-through, parallax,
  auto animation và pin dài; chapter/hash/CTA vẫn tới đúng nội dung. Có toggle
  Read without motion cả khi OS không bật giảm chuyển động.
- Header/menu/controls keyboard accessible, skip link, focus rõ, contrast WCAG
  AA cho chữ thường, target chính ≥44×44 CSS px; tránh chữ lẫn vào kính sáng.
- Kiểm tra 360, 390, 768, 1440 px, portrait và landscape; không overflow hay
  canvas che control. Scroll không bị customizer và touch viewer chiếm mất.
- Scope GSAP; không React setState mỗi frame. Cleanup timeline, RAF, audio,
  event, observer, geometry, texture, material và render target. Tab ẩn thì
  pause phần render/audio phù hợp; tiếp tục không nhảy camera hoặc âm lượng.
- Có loading progress/status accessible, timeout/error + retry hoặc static
  mode, xử lý mất context; không khóa nội dung vô thời hạn bởi màn hình loading.

## Hiệu năng và kiểm chứng

- Ngân sách first experience ≤18 MiB; geometry/texture cần cho scene đầu ≤8 MiB.
  HTML headline/CTA hiện trong lúc tải. Case study nặng có thể lazy load.
- Có quality tier giảm DPR, sample kính, particle và shadow. Đo 30 giây qua
  bốn chương sau loading: desktop mục tiêu trung bình ≥45 FPS, p95 frame
  interval ≤40 ms; mobile thực ≥30 FPS với tier thấp. Ghi môi trường, viewport,
  DPR, tier và phương pháp. Responsive emulation không chứng minh FPS mobile thật.
- Kiểm tra ít nhất trước/sau và góc nghiêng của phượng hoàng, không có lông
  nhấp nháy/lỗi xếp lớp nghiêm trọng; visual không cháy sáng, tinh thể đọc được.
- Lưu ảnh QA hero, formation, resonance, rebirth và mobile. Tự review visual
  sau render, sửa các lỗi composition. Nếu không có công cụ kiểm tra browser/
  thiết bị, ghi rõ tiêu chí chưa xác minh; không đánh dấu đạt bằng suy đoán.

## Kiểm thử và Definition of Done

Viết test có ý nghĩa cho mapping chapter/scroll progress (clamp và chiều ngược),
schema/import-export preset (kể cả dữ liệu lỗi), case study keyboard và chế độ
tĩnh. Test jsdom không chứng minh chất lượng shader hoặc WebGL. Chạy và sửa:

```bash
bun run lint
bun run test --run
bun run build
VITE_GITHUB_PAGES=true bun run build
VITE_GITHUB_PAGES=true bun run preview
```

Kiểm tra base thường và `/landingpage-parallax/`: `/`, brand, direct reload,
hash reload, catalog → Aether → catalog, back, mobile, reduced motion, âm
thanh opt-in, customizer, preset lỗi, GPU fallback. Kiểm tra console/network
không 404, lỗi chưa xử lý hoặc request sai base; catalog không tải scene,
texture/font riêng Aether hoặc khởi tạo smooth scroll. CSS guard phải pass;
vendor JS chung không có side effect là hợp lệ. Recheck Luma và brand hiện có.

Task hoàn tất khi câu chuyện bốn chương, phượng hoàng kính 3D, shader/VFX,
case study, tùy chỉnh và fallback hoạt động, kiểm tra bắt buộc pass và không
còn tiêu chí cốt lõi bỏ ngỏ. Lưu `design.md`, `assets.md`, `validation.md` tại
docs Aether, gồm storyboard, pipeline, giới hạn xấp xỉ kính, dependency,
quality tier, số đo, lệnh/exit status, ma trận QA và ảnh. Bàn giao URL local,
file chính, kết quả kiểm tra và limitation; không tuyên bố ngang chất lượng
Noomo hoặc đạt hiệu năng trên thiết bị chưa đo.
