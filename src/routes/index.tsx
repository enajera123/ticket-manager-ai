import React from "react";
import { Route, Routes } from "react-router-dom";

type RouteEntry = {
    path: string;
    element: React.ReactElement;
};
const modules = import.meta.glob("./**/*.{tsx,jsx,ts,js}", { eager: true });

function filePathToRoute(filePath: string) {
    let p = filePath.replace(/^\.\//, "").replace(/\.(tsx|jsx|ts|js)$/, "");
    p = p.replace(/\/index$/, "");
    const segments = p.split("/").filter(Boolean).map((seg) => {
        if (seg.startsWith("[") && seg.endsWith("]")) {
            return ":" + seg.slice(1, -1);
        }
        return seg;
    });
    if (segments.length === 0) return "/";
    return "/" + segments.join("/");
}

const moduleMap: Record<string, any> = {};
for (const [filePath, module] of Object.entries(modules)) {
    const key = filePath.replace(/^\.\//, "").replace(/\.(tsx|jsx|ts|js)$/, "");
    moduleMap[key] = module;
}

const routes: RouteEntry[] = Object.entries(modules)
    .map(([filePath, module]) => {
        const mod: any = module;
        const Comp = mod.default;
        if (!Comp) return null;

        const key = filePath.replace(/^\.\//, "").replace(/\.(tsx|jsx|ts|js)$/, "");
        const baseName = key.split("/").pop() ?? "";

        if (baseName.startsWith("_")) return null;

        const dir = key.replace(/\/index$/, "");
        const parts = dir.split("/").filter(Boolean);
        const layouts: any[] = [];
        for (let i = 0; i <= parts.length; i++) {
            const layoutPath = i === 0 ? "_layout" : parts.slice(0, i).join("/") + "/_layout";
            const lm = moduleMap[layoutPath];
            if (lm?.default) {
                layouts.push(lm.default);
            }
        }

        const pageElement = React.createElement(Comp);
        const element = layouts.length
            ? layouts.reduceRight((child, Layout) => React.createElement(Layout, {}, child), pageElement)
            : pageElement;

        const path = mod.path ?? filePathToRoute(filePath);
        return { path, element } as RouteEntry;
    })
    .filter(Boolean) as RouteEntry[];

export function RoutesFromFiles() {
    return (
        <Routes>
            {routes.map((r) => (
                <Route key={r.path} path={r.path} element={r.element} />
            ))}
        </Routes>
    );
}

export { routes };
export default RoutesFromFiles;