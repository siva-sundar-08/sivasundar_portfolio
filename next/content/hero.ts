/**
 * How the hero's scroll sequence is rendered.
 *
 * - "realtime" (default): the React Three Fiber scene in features/hero/scene.
 * - "frames": a pre-rendered image sequence scrubbed on a <canvas>.
 *   Generate frames with `npm run frames -- path/to/video.mp4` (see README),
 *   then switch `type` to "frames" and set `count` to the number produced.
 */
export type HeroSequence =
  | { type: "realtime" }
  | {
      type: "frames";
      count: number;
      /** Path pattern; `{i}` is replaced by the 1-based frame number padded to 4 digits. */
      pattern: string;
      width: number;
      height: number;
    };

export const heroSequence: HeroSequence = { type: "realtime" };
