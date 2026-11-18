/**
 * An unknown root URL (`/zz-not-a-page`) reaches the landing route, finds no
 * CMS page and 404s here — rendered inside ./layout.tsx with the normal header
 * and footer. Same branded 404 as the rest of the site.
 */
export { default } from "../../(site)/not-found";
