/**
 * Applies the theme BEFORE first paint to avoid a flash of the wrong theme.
 * Runs inline in <head>; reads the saved choice, else falls back to the OS
 * `prefers-color-scheme` (docs/PLAN.md §6 — dark mode is first-class).
 *
 * <html> carries suppressHydrationWarning because this script mutates its
 * className before React hydrates.
 */
// Also marks the document as JS-enabled so scroll reveals may start hidden;
// without JS the `.js` class is absent and all content renders visible.
const script = `(function(){try{
document.documentElement.classList.add('js');
var s=localStorage.getItem('theme');
var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark',d);
document.documentElement.style.colorScheme=d?'dark':'light';
}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
