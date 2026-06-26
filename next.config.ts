import type { NextConfig } from "next";

const basePath = "/Module_10";

const nextConfig: NextConfig = {
    basePath,
    reactCompiler: true,
    async headers() {
        return [
            {
                source: "/mockServiceWorker.js",
                headers: [
                    {
                        key: "Service-Worker-Allowed",
                        value: "/",
                    },
                ],
            },
        ];
    },
};


export default nextConfig;