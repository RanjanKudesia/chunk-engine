import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  // Silences the "webpack config found" build failure path — we stay on Turbopack.
};

const withMDX = createMDX();

export default withMDX(nextConfig);
