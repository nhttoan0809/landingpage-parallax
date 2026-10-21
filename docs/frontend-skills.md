# Skills frontend cho Codex

Bộ skill hỗ trợ bộ sưu tập landing page. Mỗi mẫu tự chọn phong cách và cách
triển khai; Luma hiện dùng React + TypeScript + CSS riêng + Framer Motion + Lenis.
Không đưa theme, CSS hoặc provider của một mẫu vào các mẫu khác.

## Skill đi kèm repo

`ui-ux-pro-max` được lưu tại `.agents/skills/ui-ux-pro-max/`, gồm `SKILL.md`,
references, dữ liệu tra cứu và các script Python. Codex có thể phát hiện skill
trong repo theo [tài liệu OpenAI](https://developers.openai.com/codex/skills/).
Chỉ cần clone repo và có Python 3, không cần cài CLI hoặc skill toàn cục.
Nguồn, commit và các điều chỉnh cho Codex được ghi trong
[`UPSTREAM.md`](../.agents/skills/ui-ux-pro-max/UPSTREAM.md); giấy phép MIT đi kèm.

## Các skill khác trên máy

| Skill | Trạng thái khi thiết lập | Vai trò | Nguồn |
| --- | --- | --- | --- |
| `frontend-design` | Đã có | Định hướng mỹ thuật và bố cục có bản sắc | Skill frontend-design hiện có trong Codex |
| `ui-styling` | Đã có | Styling và responsive với Tailwind | [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) |
| `vercel-react-best-practices` | Cài bổ sung | Hiệu năng React, render, bundle | [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) |
| `web-design-guidelines` | Cài bổ sung | Review UI, accessibility, tương tác | [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) |
| `gsap-scrolltrigger` | Cài bổ sung | Parallax, pinning, scrub theo cuộn khi dùng GSAP | [GSAP Skills](https://github.com/greensock/gsap-skills/tree/main/skills/gsap-scrolltrigger) |
| `gsap-react` | Cài bổ sung | Lifecycle và cleanup animation GSAP trong React | [GSAP Skills](https://github.com/greensock/gsap-skills/tree/main/skills/gsap-react) |

Các skill cài bổ sung nằm ở `~/.agents/skills/`, dùng được cho các repo khác.
`frontend-design` hiện nằm ở `~/.codex/skills/frontend-design/`; các skill UI/UX
còn lại đã có ở `~/.agents/skills/`. UI UX Pro Max có bản riêng trong repo;
các trạng thái cấp máy ở bảng trên không đảm bảo các skill khác đã có trên máy mới.

Theo [tài liệu OpenAI](https://developers.openai.com/codex/skills/), Codex hỗ trợ
skill cấp người dùng tại `~/.agents/skills/` và cấp repo tại `.agents/skills/`.
Các skill mới có thể dùng từ lượt trao đổi tiếp theo; khởi động lại Codex nếu
chúng chưa xuất hiện. Việc cài skill cung cấp hướng dẫn cho Codex; ứng dụng vẫn
cần được triển khai và kiểm tra khi thay đổi giao diện.

## Cách sử dụng

Mở repo `landingpage-parallax` trong Codex. `AGENTS.md` mô tả cách chọn skill và
các yêu cầu về animation. Có thể gọi trực tiếp bằng tên skill, ví dụ:

```text
$ui-ux-pro-max $frontend-design
Thiết kế lại mẫu /luma/ trong src/landings/luma theo phong cách cinematic.
Giữ CSS độc lập, dùng React, Framer Motion và Lenis hiện có; tạo hero parallax nhiều lớp,
gallery chuyển động theo cuộn, responsive và hỗ trợ prefers-reduced-motion.
```

```text
$vercel-react-best-practices $web-design-guidelines
Review src/landings/luma/ về hiệu năng khi cuộn, keyboard navigation, responsive và reduced motion.
```

Khi yêu cầu dùng GSAP cho pinning hoặc timeline phức tạp, gọi
`$gsap-scrolltrigger $gsap-react`. Ưu tiên Framer Motion + Lenis cho các hiệu ứng
đã được stack hiện tại hỗ trợ.

## Cài lại trên máy khác

UI UX Pro Max đã đi kèm repo tại `.agents/skills/ui-ux-pro-max/`, không cần cài
lại. Dùng từ lượt trao đổi tiếp theo khi mở repo trong Codex; khởi động lại
Codex nếu skill chưa xuất hiện.

Cài các skill bổ sung bằng `skill-installer` trong Codex:

```text
$skill-installer
Cài các skill sau vào ~/.agents/skills/:
- vercel-labs/agent-skills: skills/react-best-practices và skills/web-design-guidelines
- greensock/gsap-skills: skills/gsap-scrolltrigger và skills/gsap-react
Bỏ qua các skill đã có.
```

Skill UI UX Pro Max có công cụ tra cứu Python đi kèm. Ví dụ tìm gợi ý UX:

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "reduced motion" --domain ux
```

Lệnh trên chạy từ thư mục gốc repo. Khi chạy từ thư mục khác, dùng đường dẫn
tuyệt đối tới script. Giữ các tài liệu thiết kế tạo ra trong phạm vi từng landing
và tuân thủ quy tắc CSS độc lập trong `AGENTS.md`.
