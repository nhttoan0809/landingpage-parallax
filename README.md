# Landing page collection

Repo tập hợp các mẫu landing page của tôi. Mỗi thương hiệu có câu chuyện,
phong cách thiết kế và trải nghiệm riêng; trang chủ là danh sách để khám phá.

## Các trang hiện có

| Endpoint | Mẫu                                 | Phong cách                        |
| -------- | ----------------------------------- | --------------------------------- |
| `/`      | Danh mục landing page               | Tối giản, tập trung vào danh sách |
| `/luma/` | Luma Field — máy ảnh du lịch hư cấu | Thiên nhiên, editorial, parallax  |

Luma giữ các hiệu ứng parallax nhiều lớp, gallery chuyển cảnh bằng bàn phím,
chọn màu máy và tải cấu hình sản phẩm ý tưởng. Sản phẩm, thông số và giá là hư cấu.

## Chạy dự án

```bash
bun install --frozen-lockfile
bun run dev
```

Mở `http://localhost:5173/` để xem danh mục hoặc
`http://localhost:5173/luma/` để vào Luma. Dev/preview chuyển `/luma` thành
`/luma/`; các liên kết trong repo dùng URL có dấu `/` cuối.

```bash
bun run lint
bun run test --run
bun run build
bun run preview
```

## Vì sao CSS độc lập?

Repo sử dụng **Vite multi-page app (MPA)**, không ghép tất cả mẫu vào một SPA.
Mỗi URL là một tài liệu HTML riêng, với entry JavaScript, stylesheet, reset,
font, favicon và provider riêng. Chuyển giữa các mẫu bằng liên kết HTML thông
thường sẽ tạo tài liệu mới; CSS của trang trước không còn trong trang sau.

Trang danh mục chỉ import **metadata** và ảnh preview. Nó không import component,
CSS, font hay Lenis của Luma. CSS Modules dùng cho component của danh mục; mỗi
landing tự quản lý hệ thống style. Các selector như `body`, `:root`, `.button`
trong Luma chỉ tác động đến tài liệu Luma.

Vite tách CSS theo entry. Bước build chạy `scripts/verify-build.mjs` để duyệt
manifest và báo lỗi nếu bất kỳ stylesheet nào được dùng chung giữa hai tài liệu.
Thư viện JavaScript nền tảng như React vẫn có thể được Vite dùng chung để tận dụng
cache; điều đó không tạo ra theme hay stylesheet dùng chung.

Tailwind hiện được giữ trong dependencies nhưng không bật toàn cục. Không có
preflight hoặc theme chung; trang mới muốn dùng Tailwind phải thiết lập riêng
trong phạm vi trang đó. CSS hiện tại được xử lý bằng Autoprefixer.

## Cấu trúc

```text
index.html                       # Tài liệu danh mục tại /
luma/index.html                  # Tài liệu Luma tại /luma/
src/
  catalog/                       # Entry, giao diện, CSS, tests của danh mục
  landings/
    registry.ts                  # Metadata và danh sách entry cho Vite
    luma/
      main.tsx                   # Mount React và provider riêng
      App.tsx
      index.css                  # Reset, token, CSS chỉ của Luma
      components/
      sections/
      lib/
      content/
      __tests__/
      AGENTS.md
  setupTests.ts                  # Hạ tầng kiểm thử
public/
  catalog.svg
  landings/luma/                 # Images và favicon của Luma
docs/
  strategy.md                    # Kiến trúc collection
  landings/luma/                 # Thiết kế, nguồn ảnh, prompt ảnh sản phẩm
scripts/verify-build.mjs          # Kiểm tra các tài liệu không dùng chung CSS
```

## Thêm landing page mới

Ví dụ tạo mẫu thương hiệu `orbit`:

1. Tạo `orbit/index.html`, khai báo metadata và font riêng. Entry script:
   `<script type="module" src="/src/landings/orbit/main.tsx"></script>`.
2. Tạo `src/landings/orbit/` chứa entry, component, reset, token, CSS và tests riêng.
   Provider/animation chỉ khởi tạo từ entry của Orbit.
3. Đặt tài nguyên vào `public/landings/orbit/`. Trong TSX dùng
   `${import.meta.env.BASE_URL}landings/orbit/...`; trong HTML dùng `%BASE_URL%`.
4. Thêm metadata vào `src/landings/registry.ts` với `slug: "orbit"`, tên,
   mô tả, phong cách và ảnh preview. Trang chủ tự liệt kê và Vite tự đưa
   `orbit/index.html` vào build.
5. Cập nhật bảng danh mục trong README và chạy đầy đủ kiểm tra.

Không import CSS hoặc component của các mẫu khác để tái sử dụng giao diện.
Tham khảo [AGENTS.md](AGENTS.md) cho quy tắc kỹ thuật đầy đủ.

## GitHub Pages

```bash
VITE_GITHUB_PAGES=true bun run build
VITE_GITHUB_PAGES=true bun run preview
```

Với tên repo hiện tại, các đường dẫn public là:

- Danh mục: `/landingpage-parallax/`
- Luma: `/landingpage-parallax/luma/`

Workflow `.github/workflows/deploy.yml` build và upload toàn bộ `dist/`, gồm
`dist/index.html` và `dist/luma/index.html`. Các URL con có file HTML thật nên
hỗ trợ mở trực tiếp và refresh mà không cần SPA rewrite hay trang 404 chuyển hướng.
Nếu đổi tên repo, sửa `repositoryBase` trong `vite.config.ts` và `homepage`
trong `package.json`.

## Thiết kế và skills

[Định hướng Luma, nguồn ảnh](docs/landings/luma/design.md) ·
[Prompt ảnh máy ảnh](docs/landings/luma/camera-image-prompt.txt) ·
[Skills frontend](docs/frontend-skills.md)

Ảnh máy ảnh được tạo bằng ImageGen; ảnh thiên nhiên từ Unsplash để minh họa.
Mỗi mẫu mới được tự chọn ngôn ngữ hình ảnh và cách tương tác phù hợp.
