// Ambient declarations for non-code imports resolved by the Next.js bundler.
// TypeScript 6 rejects side-effect imports (e.g. `import './globals.css'`)
// unless the module has a declaration.
declare module '*.css';
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
