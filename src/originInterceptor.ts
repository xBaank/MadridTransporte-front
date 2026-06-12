import {Capacitor, CapacitorHttp} from "@capacitor/core";
import {apiUrl} from "./components/Urls";

// The backend rejects native-app requests with a 403 because the WebView
// sends Origin/Referer of `https://localhost`. We want it to look like the
// web app instead.
//
// We can't just set the Origin header on `fetch`: Capacitor's native bridge
// funnels every fetch through `new Request(...)`, whose constructor strips
// the forbidden `Origin`/`Referer` headers before the request ever reaches
// native code. So for backend calls we bypass the patched fetch entirely and
// call CapacitorHttp directly, which passes headers straight to the native
// HTTP client (OkHttp) without any forbidden-header filtering.
const webOrigin = "https://app.madridtransporte.com";

// Statuses that must have a null body per the Response constructor spec.
const nullBodyStatuses = new Set([101, 204, 205, 304]);

export function setupOriginInterceptor() {
  // On web the browser sets a real Origin and forbidden headers can't be
  // overridden anyway, so only patch native platforms.
  if (Capacitor.getPlatform() === "web") return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;

    // Only spoof the origin for our backend; everything else (local assets,
    // tiles, other hosts) goes through the normal patched fetch.
    if (!url.startsWith(apiUrl)) return originalFetch(input, init);

    const headers: Record<string, string> = {};
    new Headers(init?.headers).forEach((value, key) => {
      headers[key] = value;
    });
    headers["Origin"] = webOrigin;
    headers["Referer"] = `${webOrigin}/`;

    const response = await CapacitorHttp.request({
      url,
      method: (init?.method ?? "GET").toUpperCase(),
      headers,
      data: init?.body as string | undefined,
      responseType: "text",
    });

    const body =
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data);

    return new Response(nullBodyStatuses.has(response.status) ? null : body, {
      status: response.status,
      headers: response.headers,
    });
  };
}
