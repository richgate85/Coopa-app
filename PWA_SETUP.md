# Coopa PWA Setup Guide

This document provides a complete guide to the Progressive Web App (PWA) implementation for Coopa.

## Overview

Coopa is now a fully-featured PWA that works offline, supports installation on home screens, and provides background sync capabilities for Nigerian users with intermittent connectivity.

## Features Implemented

### 1. Offline-First Architecture
- **Cache-First Strategy**: Static assets (CSS, JS, images) are cached on first load
- **Network-First Strategy**: API calls attempt network first, fall back to cache
- **Stale-While-Revalidate**: HTML pages serve cached version immediately while updating in background

### 2. Offline Data Storage
- **IndexedDB**: Persistent storage for dashboard data, bulk buy requests, payment tracker, and draft forms
- **Request Queuing**: Failed POST/PUT/DELETE requests are queued and synced when online
- **Background Sync**: Automatic retry of queued requests when connection is restored

### 3. Installation & Home Screen
- **Install Prompt**: Mobile users see an install banner after 30 seconds of activity
- **Standalone Mode**: App runs in full-screen mode without browser UI
- **App Icons**: Multiple icon sizes for different devices and contexts
- **Maskable Icons**: Better support for Android adaptive icons

### 4. User Experience
- **Offline Indicator**: Banner shows connection status with smooth animations
- **Sync Status Badges**: Items show "Synced", "Pending Sync", or "Online Only" status
- **Offline Fallback Page**: Friendly page when user navigates to uncached content
- **Auto-Reconnect**: Automatically reloads when connection is restored

## File Structure

\`\`\`
public/
├── manifest.json              # PWA manifest with app metadata
├── sw.js                      # Service worker with caching strategies
├── offline.html               # Offline fallback page
└── icons/                     # App icons (generated)
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    ├── icon-512x512.png
    ├── icon-maskable-192x192.png
    ├── icon-maskable-512x512.png
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    └── apple-touch-icon.png

lib/
└── offline-storage.ts         # IndexedDB utilities

components/pwa/
├── install-pwa-prompt.tsx     # PWA installation prompt
├── offline-indicator.tsx      # Connection status indicator
└── sync-status-badge.tsx      # Sync status display

scripts/
└── generate-icons.js          # Icon generation script

app/
└── layout.tsx                 # Updated with PWA meta tags
\`\`\`

## Setup Instructions

### 1. Generate Icons

\`\`\`bash
npm run generate-icons
\`\`\`

This creates all required icon sizes in `public/icons/`.

### 2. Build PWA

\`\`\`bash
npm run build:pwa
\`\`\`

This builds the Next.js app and generates icons.

### 3. Add PWA Components to Pages

Import and add the PWA components to your layout or pages:

\`\`\`tsx
import { InstallPWAPrompt } from '@/components/pwa/install-pwa-prompt'
import { OfflineIndicator } from '@/components/pwa/offline-indicator'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <OfflineIndicator />
        {children}
        <InstallPWAPrompt />
      </body>
    </html>
  )
}
\`\`\`

### 4. Use Offline Storage in Components

\`\`\`tsx
import { saveDashboardData, getDashboardData } from '@/lib/offline-storage'

// Save data when fetched
const data = await fetchDashboard()
await saveDashboardData(data)

// Load cached data when offline
const cachedData = await getDashboardData()
\`\`\`

## Offline Features

### Priority 1 - Works Offline
- View Dashboard (cached data)
- Browse Bulk Buy Requests (cached list)
- View Request Details (cached)
- View Member Payment Tracker (cached list)
- View Co-op Profile

### Priority 2 - Queued for Sync
- Mark payments as received
- Join bulk buy request
- Update profile

### Priority 3 - Requires Online
- Post new bulk buy request
- Upload images
- Real-time price updates
- Admin supplier matching

## Testing Checklist

### Desktop Testing
- [ ] Service worker registers successfully (check DevTools > Application > Service Workers)
- [ ] Static assets are cached (check DevTools > Application > Cache Storage)
- [ ] Manifest loads correctly (check DevTools > Application > Manifest)
- [ ] Offline page displays when network is disabled

### Mobile Testing (Android)
- [ ] Install prompt appears after 30 seconds
- [ ] App installs to home screen
- [ ] App runs in standalone mode (no browser UI)
- [ ] Icons display correctly
- [ ] Offline mode works
- [ ] Background sync retries failed requests

### Mobile Testing (iOS)
- [ ] Add to Home Screen works
- [ ] App opens in full screen
- [ ] Status bar styling is correct
- [ ] Offline mode works
- [ ] Cached data persists

### Network Testing
- [ ] Toggle airplane mode to test offline
- [ ] Disable WiFi to test mobile network
- [ ] Test on slow 3G connection (DevTools > Network > Throttling)
- [ ] Verify queued requests sync when online
- [ ] Check offline indicator appears/disappears correctly

### Lighthouse Audit
\`\`\`bash
npm run lighthouse
\`\`\`

Target scores:
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90
- PWA: >90

## Nigerian Context Optimizations

### Data Usage
- Images are heavily compressed
- Aggressive caching reduces repeated downloads
- Offline-first approach minimizes data usage
- Show data usage estimates in UI

### Network Reliability
- Handles intermittent connectivity gracefully
- Queues actions for later sync
- Retries failed requests automatically
- Shows clear offline/online status

### Performance
- Fast load times with cached assets
- Minimal JavaScript bundle
- Optimized for slow networks
- Progressive enhancement

## Troubleshooting

### Service Worker Not Registering
1. Check browser console for errors
2. Verify `public/sw.js` exists
3. Check HTTPS is enabled (required for service workers)
4. Clear browser cache and reload

### Icons Not Displaying
1. Run `npm run generate-icons`
2. Verify icons exist in `public/icons/`
3. Check manifest.json paths are correct
4. Clear browser cache

### Offline Data Not Persisting
1. Check IndexedDB is enabled in browser
2. Verify `lib/offline-storage.ts` is imported correctly
3. Check browser storage quota hasn't been exceeded
4. Look for errors in browser console

### Background Sync Not Working
1. Verify service worker is registered
2. Check browser supports Background Sync API
3. Ensure requests are queued with `queueRequest()`
4. Check browser console for sync errors

## Performance Tips

1. **Cache Aggressively**: Static assets are cached indefinitely
2. **Update Strategically**: Service worker checks for updates on page load
3. **Compress Images**: Use WebP format where possible
4. **Minimize JavaScript**: Tree-shake unused code
5. **Lazy Load**: Load non-critical components on demand

## Security Considerations

1. **HTTPS Only**: Service workers require HTTPS (except localhost)
2. **Content Security Policy**: Ensure CSP headers allow service worker
3. **Trusted Content**: Only cache content from trusted sources
4. **Data Encryption**: Sensitive data should be encrypted before caching
5. **Cache Expiration**: Implement TTL for sensitive cached data

## Future Enhancements

1. **Push Notifications**: Notify users of new opportunities
2. **Periodic Background Sync**: Sync data periodically
3. **Shared Workers**: Share cache across tabs
4. **Service Worker Updates**: Prompt users to update app
5. **Analytics**: Track offline usage patterns

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Sync_API)

## Support

For issues or questions about the PWA implementation, refer to the browser console logs (prefixed with `[v0]`) for debugging information.
