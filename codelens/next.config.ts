import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets `next dev` serve assets/HMR when the app is opened through the ngrok tunnel.
  allowedDevOrigins: ["gooey-lance-sediment.ngrok-free.dev"],
};

export default nextConfig;
