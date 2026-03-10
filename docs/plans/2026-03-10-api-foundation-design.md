# API Foundation Design

This skill will scaffold a shared API foundation under `src/modules/core/api` for Next.js projects.

## Goals

- Standardize third-party API access with Axios and React Query.
- Standardize Convex usage through the same API layer when Convex is enabled.
- Provide one top-level `APIProvider` that composes the relevant data providers.
- Replace the older `src/hooks/convex` examples with resource-scoped hooks under `src/modules/core/api`.

## Structure

The skill will create:

- `src/modules/core/api/config` for Axios and client helpers
- `src/modules/core/api/react-query` for QueryClient setup and provider
- `src/modules/core/api/convex` for Convex exports and provider when enabled
- `src/modules/core/api/resources` for example third-party and Convex-backed resources
- `src/modules/core/api/provider.tsx` and `src/modules/core/api/index.ts`

## Resource Strategy

- `countries`: third-party API example using Axios + React Query
- `settings`: Convex-backed example resource when Convex is enabled
- `users`: Convex-backed example resource when Convex is enabled

## Provider Strategy

- Always wrap the app with `ReactQueryProvider`
- Only wrap with `ConvexProvider` when Convex is enabled
- Export a single `APIProvider` for app integration

## Testing

- Keep one root `vitest.config.ts`
- Test app and Convex code via Vitest projects
- Enforce 95/95/90/95 coverage thresholds
- Include Convex source files in coverage when Convex is enabled
