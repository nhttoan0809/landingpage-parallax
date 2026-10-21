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
