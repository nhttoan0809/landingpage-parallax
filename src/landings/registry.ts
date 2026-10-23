// Metadata only. Do not import landing components, CSS, or providers here:
// this registry is consumed by both the catalog and Vite's HTML build inputs.
export type LandingPage = {
  slug: string;
  name: string;
  category: string;
  description: string;
  styles: readonly string[];
  preview: string;
  previewAlt: string;
};

export const landingPages: readonly LandingPage[] = [
  {
    slug: "aether-story",
    name: "Aether Studio",
    category: "Studio sáng tạo · Câu chuyện 3D",
    description:
      "Một ý tưởng cất cánh. Bốn chương về phượng hoàng kính, ba dự án concept và bảng tùy chỉnh ánh sáng của riêng bạn.",
    styles: ["WebGL", "Scrollytelling", "Tương tác"],
    preview: "landings/aether-story/preview.webp",
    previewAlt: "Phượng hoàng kính Aether trên nền bạc tím khói",
  },
  {
    slug: "luma",
    name: "Luma Field",
    category: "Máy ảnh du lịch",
    description:
      "Một chiếc máy ảnh nhỏ, một thế giới rộng lớn. Câu chuyện sản phẩm qua những lớp núi, ánh sáng và chuyển động theo cuộn.",
    styles: ["Thiên nhiên", "Editorial", "Parallax"],
    preview: "landings/luma/images/alpine-lake.jpg",
    previewAlt: "Hồ nước và dãy núi trong sương — cảm hứng của Luma Field",
  },
];
