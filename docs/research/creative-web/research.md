# Phong cách web, hiệu ứng và quy trình sản xuất

Nghiên cứu thực hiện 21–22/10/2026; lưu trữ 23/10/2026. Xem
[quy ước độ tin cậy](README.md#quy-ước-về-độ-tin-cậy). Các URL dưới đây là nguồn
tham khảo của lần nghiên cứu đó, không phải cam kết website giữ nguyên thiết kế.

## 1. Bản đồ phong cách và URL review

Phân nhóm là nhận định thiết kế, không phải hệ phân loại tiêu chuẩn hay bảng xếp
hạng mức độ phổ biến. Một website thường kết hợp nhiều hướng; một số ví dụ đã có
từ trước năm 2026 nhưng còn giá trị tham khảo tại thời điểm nghiên cứu.

| Hướng trình bày              | Website                                                                                                              | Điểm học hỏi                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Immersive 3D                 | [Lusion](https://lusion.co/), [Unseen](https://unseen.co/)                                                           | Không gian có chiều sâu, điều hướng và phản ứng với người xem |
| Gamified / playable          | [Bruno Simon](https://bruno-simon.com/)                                                                              | Điều hướng trở thành hoạt động khám phá bằng xe               |
| Scrollytelling               | [Noomo Storytelling](https://storytelling.noomoagency.com/), [Apple AirPods Pro](https://www.apple.com/airpods-pro/) | Cuộn dẫn dắt các chương, thông điệp và chuyển cảnh            |
| Cinematic                    | [Milledollars](https://milledollars.fr/), [Lando Norris](https://landonorris.com/)                                   | Hình ảnh lớn, nhịp chuyển cảnh và cá tính thương hiệu         |
| Illustrated storytelling     | [Santioni Spirits](https://santionispirits.com/)                                                                     | Thế giới minh họa mang tinh thần truyện tranh                 |
| Editorial / Swiss            | [Obys](https://obys.agency/), [Pentagram](https://www.pentagram.com/)                                                | Typography, khoảng trắng, hệ lưới, cách trình bày dự án       |
| Typography & motion          | [Studio Dumbar](https://studiodumbar.com/), [Osmo](https://www.osmo.supply/)                                         | Chữ và đồ họa chuyển động; Osmo có nhiều mẫu tương tác nhỏ    |
| Dark minimalism              | [Linear](https://linear.app/)                                                                                        | Phân cấp chữ, màu tiết chế, sản phẩm làm trọng tâm            |
| Bento / modular              | [Raycast](https://www.raycast.com/)                                                                                  | Chia nhóm tính năng thành các khối nội dung                   |
| Gradient & product graphics  | [Stripe](https://stripe.com/)                                                                                        | Diễn giải hệ sản phẩm bằng màu và đồ họa giao diện            |
| Neo-brutalist / graphic bold | [Gumroad](https://www.gumroad.com/)                                                                                  | Tương phản cao, chữ lớn, minh họa và CTA trực tiếp            |
| Industrial / technical       | [Teenage Engineering](https://teenage.engineering/)                                                                  | Tinh thần thiết bị, hình ảnh sản phẩm, trình bày tiết chế     |

Các mốc Awwwards đã đối chiếu: Santioni Spirits SOTD 05/10/2026; Milledollars
02/10/2026; Noomo Storytelling 08/06/2026; Bruno's Portfolio 21/01/2026.
Đây là ngày giải thưởng, không phải ngày ra mắt. Nguồn:
[Santioni](https://www.awwwards.com/sites/santioni-spirits),
[Milledollars](https://www.awwwards.com/sites/milledollars),
[Noomo](https://www.awwwards.com/sites/the-power-of-storytelling),
[Bruno](https://www.awwwards.com/sites/brunos-portfolio).

## 2. Ba nhánh của Creative Development

| Website            | Bản chất                                       | Trọng tâm kỹ năng                                            |
| ------------------ | ---------------------------------------------- | ------------------------------------------------------------ |
| Lando Norris       | Website thương hiệu kết hợp HTML, motion và 3D | Frontend, art direction, điều phối timeline, tích hợp 3D     |
| Noomo Storytelling | Immersive 3D scrollytelling                    | Technical art, shader kính, camera choreography, pipeline 3D |
| Bruno Simon        | Game-based portfolio / playable website        | Game loop, vật lý, input, thế giới 3D, tối ưu rendering      |

Nhận định: độ ấn tượng đến từ nhận diện, chất lượng asset, nhịp kể chuyện và phản
hồi tương tác. Chỉ cài thư viện animation hoặc thêm nhiều parallax chưa tạo ra
chất lượng tương đương. Các sản phẩm này kết hợp công việc của frontend developer,
motion designer, 3D artist và technical artist; một người có thể kiêm nhiều vai trò.

## 3. Lando Norris

Tham chiếu: [website](https://landonorris.com/),
[case study OFF+BRAND](https://www.itsoffbrand.com/our-work/lando-norris),
[bundle công khai](https://assets.itsoffbrand.io/lando/dev-js/lando-by-OFF+BRAND.js),
[bundle chuyển cảnh](https://assets.itsoffbrand.io/lando/dev-js/transitions-rive-isolate.js).

| Thành phần                    | Thuật ngữ để tìm hiểu                                   | Hướng tái tạo đề xuất                        |
| ----------------------------- | ------------------------------------------------------- | -------------------------------------------- |
| Mũ 3D phản ứng tương tác      | Interactive product viewer, pointer-driven rotation     | GLB + Three.js; làm mềm góc xoay theo input  |
| Sơn bóng, kim loại, họa tiết  | PBR, texture mapping, environment mapping               | UV, texture và ánh sáng môi trường           |
| Hé lộ bằng hình dạng hữu cơ   | Animated masking, shader-based reveal                   | Shader mask cho canvas; SVG/CSS mask cho DOM |
| Cuộn dẫn chuỗi cảnh           | Scroll-driven animation, scrub, pinning                 | GSAP timeline + ScrollTrigger                |
| Chữ vào lần lượt              | Split-text animation, stagger, kinetic typography       | Tách dòng/từ/ký tự và stagger                |
| Các lớp chuyển động lệch nhau | Parallax, layered motion                                | Khác tốc độ hoặc biên độ giữa các lớp        |
| Menu và chuyển cảnh           | Animated navigation, vector animation, page transitions | Rive và/hoặc timeline frontend               |

**Độ tin cậy:** OFF+BRAND xác nhận Webflow, WebGL, 3D, Rive và Motion trong
case study. Mã phân phối được kiểm tra có Three.js, GSAP/ScrollTrigger,
SplitText, Lenis và Rive; có dấu hiệu khởi tạo Lenis. Không suy ra rằng mọi
hiệu ứng đều do tất cả thư viện này cùng xử lý. Bảng trên là ánh xạ kỹ thuật
để tái tạo, không phải bản giải mã đầy đủ từng dòng implementation gốc.

**Công cụ thiết kế đề xuất:** Figma cho hệ thống giao diện và storyboard;
Blender cho mô hình, UV và asset 3D; Rive cho vector tương tác; Photoshop hoặc
Affinity Photo cho ảnh/texture. Chưa xác minh đầy đủ phần mềm sản xuất asset
của OFF+BRAND, nên không ghi các đề xuất này thành stack thiết kế gốc.

**Nhận định triển khai:** đây là điểm bắt đầu phù hợp với collection hiện tại.
Có thể làm một hero 3D, một đoạn pin/scrub và một hệ typography chuyển động,
rồi mở rộng nội dung. Chuyển cảnh liên thương hiệu vẫn phải tải document mới.

## 4. Noomo — The Power of Digital Storytelling

Tham chiếu: [website phượng hoàng](https://storytelling.noomoagency.com/),
[case study kỹ thuật của Noomo](https://noomoagency.com/insights/the-power-of-digital-storytelling-website).
Không đồng nhất dự án này với Noomo Labs, Noomo Beat hay Noomo ValenTime.

| Thành phần                   | Thuật ngữ                                           | Vấn đề kỹ thuật                                           |
| ---------------------------- | --------------------------------------------------- | --------------------------------------------------------- |
| Camera xuyên qua các chương  | Scroll-driven camera animation, camera choreography | Ánh xạ cuộn vào đường đi và hướng nhìn camera             |
| Phượng hoàng kính tách màu   | Refraction, dispersion, custom glass shading        | Khúc xạ, dữ liệu hình học và thứ tự vẽ vật thể trong suốt |
| Cánh/lông chuyển động        | Keyframe animation, animation scrubbing             | Timeline dựng trước kết nối với tiến độ cuộn              |
| Góc nhìn dịch nhẹ theo chuột | Pointer-based parallax                              | Điều chỉnh góc nhìn trong giới hạn mỹ thuật               |
| Lửa, năng lượng, hạt         | Procedural VFX, noise displacement, particles       | Kết hợp shader, texture và hệ hạt                         |
| Tinh thể phát âm khi hover   | Interactive sound design, hover audio feedback      | Âm thanh phản hồi tương tác                               |
| Thay diện mạo phượng hoàng   | Real-time 3D customization                          | Đổi tham số hình ảnh ngay trong cảnh                      |

**Tác giả xác nhận:** Nuxt/Vue, Three.js + WebGL, GSAP/ScrollTrigger;
Figma cho art direction, Blender cho timeline, ZBrush cho sculpt, Houdini cho
dữ liệu kính/tinh thể/VFX, glTF với Draco để phân phối hình học.

**Điểm kỹ thuật đáng giữ lại:** kính dùng shader riêng cùng thuộc tính được
bake từ Houdini; camera và animation đi theo timeline Blender. Desktop/mobile
có timeline riêng. Dự án này dùng WebGL; việc Noomo có dự án WebGPU khác không
chứng minh trang phượng hoàng dùng WebGPU. Nhóm có thử KTX nhưng không chọn
cho dự án này; không gán pipeline texture của Bruno sang Noomo.

**Nhận định triển khai:** có thể prototype bằng Blender + Three.js + GSAP và
vật liệu kính tiêu chuẩn. Muốn đạt chiều sâu kính đặc trưng cần shader,
art direction và dữ liệu hình học tốt hơn. Houdini/ZBrush là công cụ của
pipeline gốc; với brief nhỏ, có thể tự dựng asset và thuộc tính tương đương
bằng Blender/code. Phải ghi rõ mức độ xấp xỉ khi bàn giao.

## 5. Bruno Simon — bản hiện tại folio-2025

Tham chiếu: [website](https://bruno-simon.com/),
[case study của Bruno](https://www.awwwards.com/brunos-portfolio-case-study.html),
[repo tác giả](https://github.com/brunosimon/folio-2025),
[dependencies](https://github.com/brunosimon/folio-2025/blob/main/package.json),
[bản 2019](https://2019.bruno-simon.com/).

| Hệ thống                   | Thuật ngữ                                          | Thành phần cần xây dựng                      |
| -------------------------- | -------------------------------------------------- | -------------------------------------------- |
| Lái, phanh, nhảy           | Vehicle controller, input system                   | Bàn phím, cảm ứng, ánh xạ hành vi            |
| Xe đẩy/ngã vật thể         | Rigid-body physics, collision detection, colliders | Lực, khối lượng, ma sát, hình va chạm        |
| Camera theo xe             | Follow camera, camera damping                      | Camera theo mục tiêu với nội suy mềm         |
| Cây, cỏ, nước, thời tiết   | Procedural environment, vertex animation           | Chuyển động môi trường bằng shader           |
| Nhiều vật thể lặp          | GPU instancing, billboarding                       | Tái sử dụng hình học, mặt phẳng hướng camera |
| Tới vị trí để đọc nội dung | Trigger zones, proximity interaction, 3D UI        | Vùng tương tác, điểm khám phá, giao diện     |
| Âm thanh theo vị trí       | Spatial / positional audio                         | Nguồn âm có vị trí trong thế giới            |
| Không khí thị giác         | Real-time lighting, fog, custom shading            | Ánh sáng, sương, phối màu và shader          |

**Mã nguồn xác nhận dependency:** JavaScript, Vite, Three.js, Rapier 3D, GSAP,
Howler, glTF Transform, Tweakpane và stats-gl. Repo có game loop và các hệ
physics, input, weather, audio. Dependency là bằng chứng về project; phạm vi
sử dụng từng thư viện cần đọc module tương ứng khi tái sử dụng.

**Tác giả xác nhận quy trình:** Blender để xây thế giới, TSL cho shading,
instancing/tối ưu geometry/nén texture cho hiệu năng, GarageBand cho một số
âm thanh. Bản hiện tại ưu tiên WebGPU khi khả dụng. Bản 2019 dùng Cannon.js;
không dùng thông tin đó để mô tả physics của bản mới. Khả năng fallback WebGL 2
là hành vi được mô tả trong tài liệu WebGPURenderer; phải kiểm tra cả feature
thực tế của project khi triển khai.

**Nhận định triển khai:** đây là game nhỏ phục vụ portfolio. Cần thiết kế cả
đường đi, điều khiển và cách đọc thông tin; người xem vẫn cần lối truy cập nội
dung bằng HTML khi không muốn/chưa thể chơi. Không cần tái tạo toàn bộ thế
giới của Bruno mới có sản phẩm hoàn chỉnh; cần một thế giới nhỏ có vòng khám
phá trọn vẹn.

## 6. Chọn công nghệ cho repository

Giữ Bun + Vite 7 + React 19 + TypeScript và kiến trúc multi-page hiện tại.
Ba stack dưới đây là **đề xuất**, không phải mô tả lại stack gốc.

| Hướng          | Runtime đề xuất                                                 | Sản xuất asset                                          |
| -------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| Lando-inspired | Three.js + GSAP/ScrollTrigger; Rive/Lenis khi có nhu cầu cụ thể | Figma, Blender, editor ảnh                              |
| Noomo-inspired | Three.js/WebGL + shader riêng + GSAP/ScrollTrigger              | Blender; Houdini/ZBrush tùy nhu cầu và khả năng sử dụng |
| Bruno-inspired | Three.js + Rapier + Howler + game loop                          | Blender, công cụ âm thanh                               |

React Three Fiber là lựa chọn tổ chức cảnh Three.js qua React; không phải
điều kiện bắt buộc. Next.js/Nuxt/Webflow cũng không phải điều kiện để tái tạo
ngôn ngữ tương tác. Bun/Vite phục vụ workflow; GPU API phục vụ rendering;
Blender/Houdini phục vụ sản xuất dữ liệu. Tránh coi chúng là các công cụ thay thế
trực tiếp cho nhau.

Tại thời điểm lưu tài liệu, repo có React, Framer Motion và package Lenis cũ
`@studio-freight/lenis`; chưa có Three.js/GSAP/Rapier trong package.json.
Đây không phải yêu cầu migration toàn repo. Khi bổ sung dependency, kiểm tra
package/API tương thích hiện tại, giữ lifecycle và CSS của mỗi landing độc lập.

## 7. Quy trình và tiêu chí đánh giá

1. Chốt câu chuyện, CTA, audience, nhận diện và storyboard desktop/mobile.
2. Dựng một vertical slice: một cảnh với asset, input, motion và fallback thật.
3. Sản xuất/tối ưu asset: geometry, UV, texture, animation, GLB; ghi nguồn/license.
4. Kết nối UI, timeline, shader, âm thanh và nội dung bằng bàn phím.
5. Kiểm tra bản build, đường dẫn base, thiết bị, reduced motion và mất GPU.

Nhận định độ khó chỉ có tính tương đối: Lando dễ tiếp cận hơn cho frontend
hiện tại; Noomo đặt nặng technical art; Bruno đặt nặng hệ thống game. Không đưa
ước lượng thời gian cố định khi chưa biết năng lực, asset và mức độ tương đồng.

Chất lượng phải được đánh giá ở website chạy được: thông điệp rõ, tương tác
có tác dụng, mobile có bố cục chủ động, loading/error/fallback đầy đủ, frame
time được đo, nội dung không bị khóa bởi animation và CSS không rò giữa document.
FPS cao không tự chứng minh visual đạt; ảnh đẹp không tự chứng minh physics
hoặc tương tác hoạt động.

## 8. Tài liệu kỹ thuật gốc

- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): pin, scrub, timeline.
- [Lenis](https://github.com/darkroomengineering/lenis): smooth scrolling.
- [Three.js MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html): transmission, clearcoat, iridescence.
- [Three.js WebGPURenderer](https://threejs.org/docs/pages/WebGPURenderer.html): lựa chọn backend và fallback.
- [Three.js TSL](https://threejs.org/docs/pages/TSL.html): API shading.
- [Rive state machines](https://rive.app/docs/editor/state-machine/state-machine): logic animation tương tác.
- [Rapier](https://rapier.rs/docs/): physics engine.
- [glTF Transform](https://gltf-transform.dev/): xử lý và tối ưu mô hình.
- [React Three Fiber](https://pmndrs.github.io/react-three-fiber/tutorials/how-it-works): React renderer cho Three.js.

Trước khi cài đặt hoặc viết code theo API cụ thể, đọc lại tài liệu chính thức
và license hiện hành. License code, asset, nhạc và thương hiệu là các vấn đề
riêng; không suy ra quyền dùng toàn bộ asset từ một dependency hoặc repo công khai.
