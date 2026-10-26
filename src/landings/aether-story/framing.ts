export type Rect = { left: number; top: number; width: number; height: number };
/** A final portrait settles above the credits, instead of being covered by them. */
export function portraitFrame(
  slot: Rect,
  width: number,
  height: number,
  footerTop: number,
  compact: boolean,
) {
  if (compact)
    return {
      left: slot.left,
      top: slot.top,
      width: slot.width,
      height: slot.height,
      visible: slot.top + slot.height > 0 && slot.top < height,
    };
  const top = 76,
    bottom = Math.min(height - 24, footerTop - 28);
  const available = bottom - top;
  if (available < 130)
    return {
      left: slot.left,
      top: slot.top,
      width: slot.width,
      height: slot.height,
      visible: false,
    };
  const frameHeight = Math.min(slot.height, available);
  const frameTop = Math.max(top, Math.min(slot.top, bottom - frameHeight));
  return {
    left: Math.max(18, slot.left),
    top: frameTop,
    width: Math.min(slot.width, width - 36),
    height: frameHeight,
    visible: true,
  };
}
