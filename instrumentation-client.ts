// Client-side instrumentation for analytics and monitoring
export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse'
) {
  // Hook for monitoring services like Google Analytics or Vercel Speed Insights
  if (process.env.NODE_ENV === 'production') {
    console.log(`[Monitoring] Navigating to ${url} via ${navigationType}`);
  }
}