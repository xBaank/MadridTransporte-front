import {Capacitor} from "@capacitor/core";

// Backend CORS treats requests from the web origin differently than the
// native app (which has no browser-enforced Origin). On native platforms
// CapacitorHttp patches window.fetch to go through native HTTP, which lets
// us set arbitrary headers — so we spoof the web Origin to bypass CORS.
const webOrigin = "https://app.madridtransporte.com";

export function setupOriginInterceptor() {
  // On web the Origin header is forbidden and silently dropped, so only
  // wrap fetch on native platforms (where CapacitorHttp routes natively).
  if (Capacitor.getPlatform() === "web") return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (!headers.has("Origin")) headers.set("Origin", webOrigin);
    return originalFetch(input, {...init, headers});
  };
}
