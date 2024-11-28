export function isSafari() {
  const userAgent = window.navigator.userAgent;
  return (
    userAgent.includes("Safari") &&
    !userAgent.includes("Chrome") &&
    !userAgent.includes("Android")
  );
}

export function isMobile() {
  const userAgent = window.navigator.userAgent.toLowerCase();

  return /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(
    userAgent,
  );
}
