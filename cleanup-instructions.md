# TypeScript to JavaScript Conversion Cleanup

To complete the conversion from TypeScript to JavaScript, you should remove the following files to avoid conflicts and potential deployment errors:

## Configuration Files to Remove
- `tsconfig.json`
- `vite.config.ts` (already replaced with `vite.config.js`)
- `tailwind.config.ts` (already replaced with `tailwind.config.js`)

## TypeScript Files to Remove
These files have been converted to JavaScript equivalents:

### Main Application Files
- `client/src/App.tsx` (replaced by `App.jsx`)
- `client/src/main.tsx` (replaced by `main.jsx`)

### Pages
- `client/src/pages/Home.tsx` (replaced by `Home.jsx`)
- `client/src/pages/not-found.tsx` (replaced by `not-found.jsx`)
- `client/src/pages/VideoChat.tsx` (replaced by `VideoChat.jsx`)
- `client/src/pages/TextChat.tsx` (if you're using `TextChat.jsx`)

### Library Files
- `client/src/lib/utils.ts` (replaced by `utils.js`)
- `client/src/lib/queryClient.ts` (replaced by `queryClient.js`)

### Server Files
- `server/index.ts` (use `server/index.js` instead)
- `server/routes.ts` (use `server/routes.js` instead)
- `server/storage.ts` (use `server/storage.js` instead)
- `server/matchLogic.ts` (use `server/matchLogic.js` instead)
- `server/geoService.ts` (use `server/geoService.js` instead)
- `server/production.ts` (use `server/production.js` instead)
- `server/vite.ts` (use `server/vite.js` instead)

### Shared Files
- `shared/schema.ts` (use `shared/schema.js` instead)

## Component Files to Convert
You should convert these TypeScript component files to JavaScript:

### UI Components
All files in `client/src/components/ui/*.tsx` should be converted to `.jsx`

### Custom Components
- `client/src/components/AppHeader.tsx`
- `client/src/components/AppFooter.tsx`
- `client/src/components/ConnectionButtons.tsx`
- `client/src/components/FeatureHighlights.tsx`
- `client/src/components/GenderSelector.tsx`
- `client/src/components/MatchPreferenceSelector.tsx`
- `client/src/components/TextChatComponents.tsx`
- `client/src/components/VideoChatComponents.tsx`

### Contexts and Hooks
- `client/src/contexts/OnlineUsersContext.tsx`
- `client/src/hooks/use-mobile.tsx`
- `client/src/hooks/use-toast.ts`
- `client/src/hooks/useChat.ts`
- `client/src/hooks/useGeoLocation.ts`
- `client/src/hooks/useVideoChat.ts`

## How to Convert Remaining Files

For each TypeScript file (`.tsx` or `.ts`), create a JavaScript equivalent (`.jsx` or `.js`) by:

1. Copy the content of the TypeScript file
2. Remove type annotations, interfaces, and type declarations
3. Replace TypeScript-specific syntax with JavaScript equivalents
4. Save the file with the appropriate JavaScript extension

## Update Import Statements

After converting files, make sure to update import statements in your JavaScript files to reference the `.js` or `.jsx` files instead of `.ts` or `.tsx` files.

## Testing

After removing TypeScript files and converting to JavaScript, test your application thoroughly to ensure everything works as expected.