# Từ điển Creative Web

Lưu trữ 23/10/2026. Đây là thuật ngữ để nghiên cứu, mô tả yêu cầu và trao đổi
implementation. Tên hiệu ứng không đồng nghĩa với một thư viện bắt buộc.

## Trải nghiệm và motion

| Thuật ngữ                               | Diễn giải                                             | Ví dụ áp dụng                                            |
| --------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| Creative Development / Creative Coding  | Lập trình phục vụ ý tưởng mỹ thuật và tương tác       | Cả ba trang tham chiếu                                   |
| Immersive web                           | Trải nghiệm tạo cảm giác đi vào một không gian        | Thế giới 3D của Noomo                                    |
| Scrollytelling                          | Kể chuyện theo tiến trình cuộn                        | Các chương phượng hoàng                                  |
| Cinematic scrolling                     | Cuộn được biên đạo như một chuỗi cảnh                 | Camera, composition, nhịp chuyển chương                  |
| Playable website / game-based portfolio | Website có cơ chế chơi để khám phá nội dung           | Lái xe ở Bruno                                           |
| Art direction                           | Hướng mỹ thuật nhất quán: hình, chữ, màu, composition | Nhận diện thể thao của Lando                             |
| Storyboard                              | Chuỗi khung thể hiện nội dung và chuyển cảnh          | Desktop/mobile trước khi code                            |
| Timeline / choreography                 | Sắp xếp và phối hợp chuyển động theo thời gian        | Camera, chữ và vật thể đồng bộ                           |
| Scroll-driven animation                 | Tiến độ hoặc trạng thái animation do cuộn điều khiển  | Camera đi qua cảnh                                       |
| Scrubbing                               | Ánh xạ vị trí cuộn sang thời điểm trong animation     | Cuộn ngược thì cảnh quay ngược                           |
| Pinning                                 | Giữ một phần tử trong viewport trong một đoạn cuộn    | Cảnh 3D đứng tại chỗ khi câu chuyện tiến triển           |
| Scroll-triggered animation              | Cuộn qua một ngưỡng để bắt đầu animation              | Section reveal; không nhất thiết scrub                   |
| Smooth scrolling / inertia              | Làm mềm chuyển động cuộn bằng nội suy                 | Lenis                                                    |
| Parallax / layered motion               | Các lớp chuyển động với biên độ hoặc tốc độ khác nhau | Ảnh nền, chữ, vật thể                                    |
| Pointer-driven rotation / parallax      | Input chuột điều chỉnh góc xoay hoặc góc nhìn         | Mũ bảo hiểm 3D                                           |
| Damping / interpolation / easing        | Làm mềm phản hồi, nội suy giá trị và định hình tốc độ | Camera theo xe; mỗi khái niệm có vai trò riêng           |
| Split text / staggered reveal           | Tách chữ và cho các phần xuất hiện lần lượt           | Headline                                                 |
| Kinetic typography                      | Chữ chuyển động đóng vai trò biểu đạt                 | Tiêu đề và chuyển chương                                 |
| Animated masking / reveal               | Che/mở hình ảnh bằng vùng mask thay đổi               | Hình dạng hữu cơ                                         |
| Page transition                         | Chuyển cảnh khi điều hướng                            | Trong cùng document hoặc qua cơ chế chuyển trang phù hợp |
| Microinteraction                        | Phản hồi nhỏ cho một hành động                        | Hover, focus, chọn màu, mute                             |
| State machine                           | Trạng thái và điều kiện chuyển giữa chúng             | Rive; loading/ready/playing/paused                       |

## 3D, vật liệu và GPU

| Thuật ngữ                           | Diễn giải                                                             | Vai trò                                        |
| ----------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| WebGL / WebGPU                      | API đồ họa truy cập GPU trong trình duyệt                             | Backend rendering                              |
| Three.js                            | Thư viện cảnh, camera, geometry, material và rendering                | Lớp lập trình 3D                               |
| React Three Fiber (R3F)             | React renderer cho Three.js                                           | Lựa chọn tổ chức scene bằng component          |
| Shader                              | Chương trình GPU xử lý dữ liệu đỉnh hoặc điểm ảnh                     | Kính, nước, gió, mask                          |
| Vertex / fragment shader            | Xử lý đỉnh / xử lý fragment đóng góp vào ảnh                          | Biến dạng geometry / shading                   |
| GLSL / WGSL / TSL                   | Ngôn ngữ shading WebGL / WebGPU / API shading của Three.js            | TSL có thể sinh shader cho backend được hỗ trợ |
| Mesh / geometry / material          | Vật thể render / dữ liệu hình học / cách bề mặt được vẽ               | Ba khái niệm liên quan nhưng khác nhau         |
| PBR                                 | Physically Based Rendering, mô hình shading dựa trên tính chất vật lý | Sơn, kim loại, nhựa, kính                      |
| Roughness / metalness / clearcoat   | Độ nhám / tính kim loại / lớp phủ bóng                                | Mũ bảo hiểm                                    |
| Transmission / refraction           | Ánh sáng xuyên qua / đổi hướng qua vật liệu                           | Kính                                           |
| Dispersion                          | Khúc xạ phụ thuộc bước sóng, tạo tách màu                             | Kính có viền màu                               |
| Iridescence                         | Màu thay đổi theo góc nhìn/ánh sáng do giao thoa lớp mỏng             | Hiệu ứng óng ánh; khác dispersion              |
| Environment mapping / HDRI          | Dùng môi trường ánh sáng/ảnh để chiếu sáng và phản xạ                 | Bề mặt bóng                                    |
| UV / texture mapping                | Tọa độ và phép ánh xạ texture lên bề mặt                              | Họa tiết trên mũ                               |
| Normal map                          | Texture làm thay đổi pháp tuyến shading                               | Chi tiết bề mặt không tăng geometry            |
| Baking / attribute baking           | Tính trước và lưu dữ liệu vào texture/thuộc tính                      | Dữ liệu kính, ánh sáng, animation              |
| Keyframe / animation clip           | Mốc giá trị / đoạn animation                                          | Cánh chim, camera                              |
| Camera choreography / camera path   | Biên đạo vị trí, hướng nhìn và tốc độ camera                          | Scrollytelling                                 |
| Procedural generation / VFX         | Sinh hình học hoặc hiệu ứng bằng quy tắc                              | Tinh thể, địa hình, lửa                        |
| Noise displacement                  | Dùng noise để dịch vị trí hoặc tọa độ lấy mẫu                         | Sóng, năng lượng, mask                         |
| Particle system                     | Hệ nhiều phần tử nhỏ được cập nhật/render                             | Bụi sáng, mưa, tia lửa                         |
| Post-processing / bloom             | Xử lý ảnh sau render / ánh sáng lan quanh vùng sáng                   | Tăng không khí thị giác                        |
| Transparency sorting / render order | Thứ tự vẽ vật thể trong suốt                                          | Giảm lỗi khi nhiều miếng kính chồng nhau       |

## Game và hiệu năng

| Thuật ngữ                            | Diễn giải                                                   | Vai trò                                          |
| ------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------ |
| Game loop / render loop              | Vòng cập nhật input, mô phỏng và hình ảnh                   | Trải nghiệm Bruno-inspired                       |
| Delta time / fixed timestep          | Thời gian giữa frame / bước mô phỏng cố định                | Hành vi không phụ thuộc FPS                      |
| Rigid body / collider                | Vật thể vật lý / hình dạng va chạm                          | Xe, thùng, mặt đất                               |
| Collision detection / response       | Phát hiện / phản ứng va chạm                                | Xe đẩy vật thể                                   |
| Vehicle controller                   | Logic điều khiển chuyển động xe                             | Lái, ga, phanh                                   |
| Trigger zone / proximity interaction | Vùng cảm biến / tương tác theo khoảng cách                  | Mở thẻ dự án                                     |
| Raycasting                           | Chiếu tia vào cảnh để tìm điểm/vật thể giao                 | Chọn vật thể, một số kiểu controller             |
| Spatial / positional audio           | Âm thanh có vị trí tương đối với người nghe                 | Tiếng sóng, va chạm                              |
| Instancing                           | Vẽ nhiều bản sao từ dữ liệu geometry/material chung         | Cỏ, cây, cọc                                     |
| Billboarding                         | Mặt phẳng hướng về camera                                   | Tán lá và sprite                                 |
| Draw call                            | Lệnh yêu cầu GPU vẽ                                         | Chỉ số cần kiểm soát khi nhiều vật thể           |
| LOD / culling                        | Đổi mức chi tiết / loại phần không cần vẽ                   | Tối ưu cảnh rộng                                 |
| DPR / render scale                   | Mật độ pixel / độ phân giải render tương đối                | Giảm chi phí GPU trên mobile                     |
| Frame time / FPS                     | Thời gian cho frame / số frame mỗi giây                     | 16,7 ms xấp xỉ 60 FPS; 33,3 ms xấp xỉ 30 FPS     |
| Asset budget                         | Giới hạn dung lượng, geometry, texture và số lượng asset    | Đặt từ brief, đo từ build/network                |
| glTF / GLB                           | Định dạng trao đổi 3D; GLB là dạng container nhị phân       | Đưa asset lên web                                |
| Draco                                | Nén geometry                                                | Giảm tải truyền tải; không phải nén texture      |
| KTX2 / ETC1S / UASTC                 | Container / dạng mã hóa texture dùng trong pipeline GPU     | Cần loader/transcoder và kiểm tra thiết bị       |
| Progressive loading / lazy loading   | Tải dần / tải khi cần                                       | Giữ nội dung xuất hiện sớm                       |
| Context loss / recovery              | Mất và khôi phục ngữ cảnh đồ họa                            | Hiển thị lỗi/fallback thay màn hình trống        |
| Reduced motion                       | Tôn trọng nhu cầu giảm chuyển động                          | Bỏ fly-through/pin dài, giữ nội dung và thao tác |
| Fallback / progressive enhancement   | Trải nghiệm cơ sở vẫn dùng được khi thiếu khả năng nâng cao | HTML nội dung khi không có GPU                   |

## Phân biệt công cụ

- **Figma**: thiết kế UI và storyboard; **Rive**: vector animation và logic tương tác.
- **Blender**: dựng cảnh, UV, model, animation; **ZBrush**: sculpt;
  **Houdini**: pipeline procedural, dữ liệu hình học và VFX.
- **Bun/Vite**: workflow phát triển/build; **React/Vue**: tổ chức giao diện;
  **Three.js**: cảnh 3D; **GSAP**: animation; **Rapier**: vật lý.
- **Pin/scrub** không tự tạo smooth scroll. **Smooth scroll** không tự tạo camera path.
- Kính 3D cần render/material; CSS `backdrop-filter` phục vụ kính giao diện 2D.
- Animation trong Blender không mặc nhiên được export đầy đủ sang GLB; kiểm tra
  những dữ liệu được hỗ trợ và bake/chuyển đổi các hệ procedural cần thiết.
- WebGPU fallback không bảo đảm mọi custom effect hoặc compute workload có
  hành vi tương đương WebGL; kiểm chứng scene cụ thể trên backend thực tế.

Xem [nguồn kỹ thuật](research.md#8-tài-liệu-kỹ-thuật-gốc) và
[phân tích theo website](research.md) để biết khái niệm nào được áp dụng ở đâu.
