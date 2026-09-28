export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") {
    const { installOutboundFetchGuard } = await import("@lreach/outbound-guard/edge");
    installOutboundFetchGuard();
  } else if (process.env.NEXT_RUNTIME === "nodejs") {
    const { installOutboundNetworkGuard } = await import("@lreach/outbound-guard/node");
    await installOutboundNetworkGuard();
  }
}
