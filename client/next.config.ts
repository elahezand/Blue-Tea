import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const toPattern = (value: string) => {
    const url = new URL(value);
    return {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: "/**",
    };
};

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            toPattern(apiUrl),
            toPattern(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
        ],
    },


    async rewrites() {
        return [
            { source: "/uploads/menu/:path*", destination: new URL("/uploads/menu/:path*", apiUrl).href },
        ]
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-DNS-Prefetch-Control", value: "on" },
                    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "origin-when-cross-origin" },
                ],
            },
        ];
    },
};

export default nextConfig;
