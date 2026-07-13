/**
 * Reviewer avatar — Google-style INITIAL on a colored circle.
 *
 * Feedback Eric (jul 2026): the avatar next to the reviewer's name must NOT
 * be the photo attached to the review (a bouquet looked odd as a face). It
 * shows:
 *   - `profilePhoto` (the reviewer's real Google profile picture) when it
 *     exists in lib/reviewsData.ts — empty today, auto-filled when the
 *     Google API mirror lands (~20 jul 2026);
 *   - otherwise the reviewer's INITIAL on a Google-palette color, picked
 *     deterministically from the name (stable across SSR/hydration and
 *     stable when more reviews arrive).
 *
 * The bouquet photo attached to a review keeps rendering inside the review
 * card body (ReviewsCarousel) — this component only replaces the avatar.
 */

/** Google-account-style avatar colors (white initial on top of each). */
const AVATAR_COLORS = [
  "#4285F4", // blue
  "#0F9D58", // green
  "#DB4437", // red
  "#E37400", // dark amber (darker than Google yellow so white text stays legible)
  "#AB47BC", // purple
  "#00796B", // teal
];

/** Deterministic color per reviewer name (pure — SSR/hydration safe). */
const colorFor = (name: string): string => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

const SIZES = {
  /** Small — the overlapping cluster in the product rating bar. */
  sm: { box: "w-6 h-6", text: "text-[10px]", px: 24 },
  /** Medium — next to the reviewer name in the review cards. */
  md: { box: "w-8 h-8", text: "text-xs", px: 32 },
} as const;

const ReviewerAvatar = ({
  name,
  profilePhoto,
  size = "md",
  className = "",
}: {
  name: string;
  /** Real Google profile photo URL/path — empty until the API mirror lands. */
  profilePhoto?: string;
  size?: keyof typeof SIZES;
  className?: string;
}) => {
  const s = SIZES[size];
  if (profilePhoto) {
    return (
      <img
        src={profilePhoto}
        alt=""
        loading="lazy"
        decoding="async"
        width={s.px}
        height={s.px}
        className={`${s.box} rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${s.box} ${s.text} rounded-full shrink-0 flex items-center justify-center font-body font-semibold text-white select-none ${className}`}
      style={{ backgroundColor: colorFor(name) }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
};

export default ReviewerAvatar;
