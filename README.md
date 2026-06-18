# @fractionax/web

FractionAX web application — [Next.js](https://nextjs.org) App Router + TypeScript.

> **This repo is a submodule** of the [`fractionaxapp`](https://github.com/fractionaxapp/fractionaxapp)
> meta-monorepo and is developed from there. It depends on workspace packages
> (`@fractionax/ui`, `@fractionax/core`) via `workspace:*`, so install and run it
> from inside the meta-repo rather than cloning standalone.

## Develop (from the meta-repo root)

```bash
moon run web:dev         # next dev
moon run web:build       # next build (builds @fractionax/ui + core first)
moon run web:lint        # eslint
moon run web:typecheck   # tsc --noEmit
```

## Layout

```
app/            # App Router routes (layout.tsx, page.tsx)
next.config.mjs # transpiles shared workspace packages
moon.yml        # task + dependency wiring for the monorepo
```
