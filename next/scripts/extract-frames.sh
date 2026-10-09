#!/usr/bin/env bash
# Turn a video into an optimised WebP frame sequence for the hero (Option A).
#
#   npm run frames -- path/to/video.mp4 [fps] [width]
#
# Writes public/sequence/frame_0001.webp … and prints the values to put in
# content/hero.ts. Requires ffmpeg (brew install ffmpeg).
set -euo pipefail

VIDEO="${1:?Usage: npm run frames -- path/to/video.mp4 [fps] [width]}"
FPS="${2:-30}"
WIDTH="${3:-1600}"
OUT="public/sequence"

command -v ffmpeg >/dev/null || { echo "ffmpeg not found. Install it with: brew install ffmpeg" >&2; exit 1; }

rm -rf "$OUT"
mkdir -p "$OUT"

ffmpeg -loglevel error -i "$VIDEO" \
  -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
  -c:v libwebp -quality 72 -compression_level 6 -preset picture \
  "$OUT/frame_%04d.webp"

COUNT=$(find "$OUT" -name 'frame_*.webp' | wc -l | tr -d ' ')
HEIGHT=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$OUT/frame_0001.webp")
SIZE=$(du -sh "$OUT" | cut -f1)

cat <<MSG
Extracted $COUNT frames ($SIZE) to $OUT.

Set this in content/hero.ts:

export const heroSequence: HeroSequence = {
  type: "frames",
  count: $COUNT,
  pattern: "/sequence/frame_{i}.webp",
  width: $WIDTH,
  height: $HEIGHT,
};
MSG
