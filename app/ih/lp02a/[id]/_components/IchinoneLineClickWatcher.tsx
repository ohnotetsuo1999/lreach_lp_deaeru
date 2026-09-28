"use client";

import { useEffect } from "react";

export function IchinoneLineClickWatcher() {
  useEffect(() => {
    const dataLayer: any[] = ((window as any).dataLayer =
      (window as any).dataLayer || []);
    if ((window as any).__ichinoneLineBound) return;
    (window as any).__ichinoneLineBound = true;

    const RE =
      /^(https?:\/\/)(?:line\.me|page\.line\.me)\/(?:R\/)?ti\/p\/(?:@|%40)984xglsa(?:[\/?].*)?$/i;

    const extractUrlFromNode = (node: any) => {
      if (!node || !node.getAttribute) return null;
      if (node.href) return node.href;
      const u =
        node.getAttribute("href") ||
        node.getAttribute("data-href") ||
        node.getAttribute("data-url");
      if (u) return u;
      const oc = node.getAttribute("onclick");
      if (oc) {
        const m = oc.match(/https?:\/\/[^\s'"]+/);
        if (m) return m[0];
      }
      return null;
    };

    const findUrlFromEvent = (e: any) => {
      const path = (e.composedPath && e.composedPath()) || [];
      if (!path.length) {
        let n = e.target;
        while (n && path.length < 10) {
          path.push(n);
          n = n.parentNode;
        }
      }
      for (let i = 0; i < path.length; i++) {
        const url = extractUrlFromNode(path[i]);
        if (url) return url;
      }
      return null;
    };

    const onClick = (e: any) => {
      try {
        const url = findUrlFromEvent(e);
        if (url && RE.test(url)) dataLayer.push({ event: "ichinone_line_add" });
      } catch {}
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
