# Task 01 — Apex Velocity: thương hiệu đua xe với 3D và cinematic scroll

## Chỉ thị thực hiện

Hãy triển khai **đến sản phẩm cuối cùng** một landing độc lập trong repository
`landingpage-parallax`, lấy cảm hứng từ ngôn ngữ tương tác của
[Lando Norris](https://landonorris.com/). Tạo thương hiệu hư cấu **Apex Velocity**
cho một tay đua và bộ sưu tập mũ đua, URL **`/apex-velocity/`**. Không cần lịch
sử chat, nghiên cứu trước hoặc kết quả task khác để làm task này. Tài liệu này
là brief thực thi; chưa có implementation đi kèm.

Tự quyết định chi tiết thiết kế trong phạm vi brief, tạo asset, viết code, chạy
kiểm tra và sửa lỗi đến khi nghiệm thu. Không kết thúc ở kế hoạch, ảnh mockup,
hero duy nhất hoặc skeleton có nút chưa hoạt động. Chỉ hỏi khi thiếu thông tin
bắt buộc không thể suy ra; tiếp tục phần độc lập trong khi chờ. Bàn giao bản
chạy local và build tĩnh; publish hoặc mua dịch vụ không thuộc phạm vi task.

## Bối cảnh, nguồn và lựa chọn công nghệ

- Repo là collection multi-page: catalog tại `/`, mỗi brand là một HTML document.
- Stack nền: **Bun, Vite 7, React 19, TypeScript**. Kiểm tra package.json thực tế.
- Nguồn tham khảo chính: [OFF+BRAND case study](https://www.itsoffbrand.com/our-work/lando-norris).
  Nguồn xác nhận Webflow/WebGL/3D/Rive/Motion. Bundle công khai đã từng cho thấy
  Three.js, GSAP, ScrollTrigger, SplitText và Lenis; kiểm tra lại nếu mô tả stack gốc.
- Stack triển khai **đề xuất cho repo này**: Three.js, GSAP + ScrollTrigger +
  `@gsap/react`; R3F là tùy chọn. Lenis/Rive chỉ thêm khi có vai trò cụ thể.
- Đọc tài liệu chính thức hiện hành về thư viện/API được chọn. Không thay kiến
  trúc bằng Webflow hoặc một framework khác chỉ vì site gốc dùng nó.
- Thuật ngữ: interactive product viewer, PBR, animated mask, scroll scrub,
  pinning, parallax, staggered text, microinteraction.
- Dùng ảnh, logo, tên tay đua, họa tiết và copy riêng. Không lấy logo nhà tài
  trợ, ảnh cá nhân hay texture mũ của Lando làm asset mặc định.

## Khởi động và quy tắc kiến trúc

1. Đọc `AGENTS.md`, `docs/strategy.md`, `docs/frontend-skills.md`, package.json,
   `src/landings/registry.ts`, catalog và các quy tắc con áp dụng cho file sẽ sửa.
   Kiểm tra git status; bảo toàn thay đổi hiện có của người dùng.
2. Dùng `ui-ux-pro-max` trong `.agents/skills/ui-ux-pro-max/`: đọc SKILL.md,
   chạy Python search đi kèm, lưu quyết định tại docs của Apex. Áp dụng
   `frontend-design`, `vercel-react-best-practices`, `gsap-react` và
   `gsap-scrolltrigger` khi có sẵn và phù hợp. Skill thiếu không được làm kẹt
   việc triển khai nếu tài liệu repo/chính thức đủ để tiếp tục; ghi rõ thiếu gì.
3. Tạo `apex-velocity/index.html`, `src/landings/apex-velocity/main.tsx`,
   toàn bộ code/CSS/test trong `src/landings/apex-velocity/`, asset trong
   `public/landings/apex-velocity/`, docs trong `docs/landings/apex-velocity/`.
4. Thêm metadata vào registry **data-only** và mục catalog trong README. Catalog
   dùng preview tĩnh; không import component/CSS/provider của Apex vào catalog.
5. Giữ `cssCodeSplit: true`, guard `scripts/verify-build.mjs`, HTML entry riêng,
   CSS Modules cho component và reset/token/font/metadata thuộc document Apex.
   Không thêm root App gom brand, router cross-brand hoặc Tailwind preflight toàn cục.
6. Asset TSX dùng `${import.meta.env.BASE_URL}landings/apex-velocity/...`;
   asset HTML dùng `%BASE_URL%`. Link sang brand dùng
   `${import.meta.env.BASE_URL}apex-velocity/`; trở về catalog dùng BASE_URL.
   Hash nội trang dạng `#collection`. Directory URL có trailing slash.
7. Giữ hoạt động catalog, Luma và mọi brand có sẵn. Nếu phải sửa Luma, đọc
   `src/landings/luma/AGENTS.md` trước và giới hạn thay đổi cần thiết.

## Thiết kế và nội dung bắt buộc

Tạo nhận diện thể thao sắc nét: nền sáng ấm kết hợp charcoal và màu accent tự
chọn; typography lớn, tương phản, đồ họa có tinh thần tốc độ. Tránh sao chép
bố cục và bộ màu nguyên xi. Viết nội dung có nghĩa, nhất quán bằng tiếng Anh;
đặt `lang="en"`. Ghi rõ concept hư cấu trong footer.

| Section / hash                    | Kết quả cần có                                                            |
| --------------------------------- | ------------------------------------------------------------------------- |
| Hero / `#intro`                   | Tên, thông điệp, mô hình mũ là visual chính, CTA đến collection           |
| Story / `#story`                  | Đoạn kể chuyện có một cảnh pin/scrub; tối thiểu 3 mốc nội dung            |
| On / Off Track / `#world`         | Hai nhóm nội dung rõ, có ảnh/đồ họa và link đến nội dung thật trong trang |
| Helmet collection / `#collection` | 3 phiên bản mũ, mỗi bản có tên, mô tả, màu/vật liệu riêng                 |
| Configuration / `#configure`      | Tóm tắt lựa chọn, nút tải cấu hình JSON hoạt động                         |
| Footer                            | Return to collection, credit asset và concept disclosure                  |

Header có điều hướng anchor, menu mobile và trạng thái focus rõ. Không thêm
form liên hệ giả hoặc kết quả thi đấu bị trình bày như dữ liệu thật.

## Hiệu ứng và tương tác phải hoạt động

- **3D thật:** mũ có shell, visor, rim/chin và ít nhất một chi tiết riêng; silhouette
  nhận ra mũ đua ở ba góc. Không dùng một quả cầu hoặc poster thay cho trải nghiệm chính.
- **Viewer:** pointer rotation nhẹ trên desktop; kéo để xoay trên touch mà không
  chiếm toàn bộ thao tác cuộn. Có nút trái/phải/reset bằng bàn phím và touch.
- **PBR:** thể hiện ít nhất hai loại bề mặt, ví dụ shell phủ bóng và visor tối;
  ánh sáng/phản xạ đủ để đọc hình dáng, không cháy sáng hoặc đen mất chi tiết.
- **Configurator:** chọn 3 phiên bản cập nhật trực tiếp mô hình và phần mô tả;
  dùng button/radio với selected state có thể đọc bởi screen reader.
- **Scroll:** một timeline đồng bộ tối thiểu góc/scale mũ, headline và lớp nền;
  có scrub hai chiều và pin desktop hữu hạn, không giữ người dùng mắc kẹt.
- **Mask/reveal:** ít nhất một SVG/CSS/shader mask có chuyển động được biên đạo;
  phần 3D có mặt nạ chỉ khi nó giúp câu chuyện, không thêm kỹ thuật dư thừa.
- **Typography:** stagger theo dòng/từ ở tối thiểu hai vị trí; giữ nguyên nội
  dung accessible, tránh đọc lặp do text được clone để animation.
- **Menu:** mở/đóng, Escape, điều hướng và trả focus đúng. Mọi CTA có tác dụng.
- **Download:** JSON có brand, variant id/name, màu/vật liệu, phiên bản schema;
  dữ liệu khớp lựa chọn hiện tại. Tạo file phía client, thu hồi object URL.

## Asset và phương án khi thiếu công cụ

Ưu tiên model riêng bằng Blender và export GLB. Nếu Blender không có, dựng
mũ procedural bằng Three.js/code với geometry có chủ đích, vẫn đạt silhouette
và chất lượng visual nêu trên. Tạo bản low-poly và lighting hoàn chỉnh trước,
rồi tinh chỉnh. Không dừng vì thiếu file model hoặc quyền truy cập site gốc.

Tài nguyên bên thứ ba phải có quyền sử dụng rõ. Ghi URL, tác giả, license,
ngày lấy và chỉnh sửa trong `docs/landings/apex-velocity/assets.md`. Asset tự
tạo ghi phương pháp/script và đường dẫn nguồn. Có poster/preview tĩnh local,
favicon và fallback. Font hệ thống là phương án hợp lệ; nếu tải font thì ghi nguồn.

## Runtime, responsive và khả năng tiếp cận

- Vòng render dùng RAF/useFrame; giá trị mỗi frame không đi qua React state.
  GSAP được scope theo landing và cleanup; dispose geometry/material/texture,
  listener, observer và canvas khi unmount. Tạm dừng animation khi tab ẩn.
- Có loading, lỗi tải asset và GPU/context-loss fallback có nội dung và CTA thật.
  Có cách chuyển sang chế độ tĩnh; không để canvas đen chặn nội dung.
- `prefers-reduced-motion`: bỏ parallax, tự xoay và pin kéo dài; viewer thao tác
  trực tiếp vẫn dùng được, nội dung đọc theo luồng bình thường.
- Thiết kế riêng cho 390 px: mũ không che chữ, viewer không chặn scroll, menu/CTA
  dễ chạm. Kiểm tra 360, 390, 768, 1440 px; không có horizontal overflow.
- Landmark/heading đúng thứ tự, skip link, alt hữu ích, contrast WCAG AA cho
  chữ thông thường, touch target chính ít nhất 44×44 CSS px; focus không bị che.
- Nội dung và cấu hình vẫn dùng được nếu 3D lỗi; animation chỉ tăng cường trải nghiệm.

## Tiêu chí hiệu năng và bằng chứng

- Mục tiêu: nội dung chính hiện trước khi model xong; không chờ asset ngoài
  mới thấy headline/CTA. Asset visual cần cho first experience tổng ≤12 MiB,
  model chính + texture của nó ≤4 MiB; ghi số đo từ build/network.
- Đo đoạn viewer/scroll 30 giây sau loading: desktop mục tiêu trung bình ≥50 FPS,
  p95 frame interval ≤33,3 ms; mobile thực mục tiêu ≥30 FPS. Ghi thiết bị,
  trình duyệt, viewport, DPR, chất lượng, cách đo và giới hạn đo. Giảm DPR,
  shadow hoặc độ phức tạp để đạt trên môi trường kiểm tra. Không gọi desktop
  responsive emulation là kiểm tra GPU mobile thật.
- Chụp hero, collection và mobile sau khi ổn định. Không lấy ảnh screenshot
  reference làm bằng chứng implementation. Nếu không có browser/tool đo, ghi
  blocker và tiêu chí chưa xác minh, không đánh dấu hoàn tất QA.

## Kiểm thử và Definition of Done

Viết test có giá trị cho lựa chọn variant, nội dung JSON export và menu keyboard/
focus. Test DOM không thay thế kiểm tra WebGL/visual trong browser. Chạy và sửa:

```bash
bun run lint
bun run test --run
bun run build
VITE_GITHUB_PAGES=true bun run build
VITE_GITHUB_PAGES=true bun run preview
```

Kiểm tra browser ở base thường và `/landingpage-parallax/`: catalog → Apex →
catalog, back, direct URL/reload, hash reload, viewer, cấu hình, download,
keyboard, mobile, reduced motion và fallback lỗi GPU. Kiểm tra network/console:
không 404 hoặc lỗi chưa xử lý; catalog không tải runtime/asset 3D Apex, không
khởi tạo Lenis; CSS/font của brand không tải sang catalog/Luma. Vendor JS chung
không có side effect là hợp lệ. Recheck Luma và các brand đã có.

Task hoàn tất khi tất cả section/tương tác/3D thật hoạt động, kiểm tra bắt buộc
pass và không có tiêu chí cốt lõi chưa đáp ứng. Lưu `design.md`, `assets.md`,
`validation.md` trong docs Apex: quyết định thiết kế, kiến trúc motion, số đo,
lệnh/exit status, ma trận browser/base, ảnh QA, limitation và cách chạy. Khi
bàn giao, nêu URL local, file chính, kiểm tra đã thực hiện và mức tương đồng/
giới hạn thực tế. Không tuyên bố đạt chất lượng hoặc FPS chưa được kiểm chứng.
