"use-strict";
const fs = require("fs");
const pages = [
  "/",
  "/signin",
  "/signup",
  "/forgot-password",
  "/verify",
  "/reset-password",
  "/dashboard",
];
const domainLink =
  process.env.REACT_APP_DOMAIN_LINK || "https://test.quicklabs.in";
const date = new Date().toISOString();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
${pages
  .map((page) => {
    let priorityValue = 0.8;
    if (page === "/") priorityValue = 1;
    if (page === "/dashboard") priorityValue = 1;
    return `
    <url>
        <loc>${`${domainLink}${page}`}</loc>
        <lastmod>${date}</lastmod>
        <priority>${priorityValue}</priority>
    </url>`;
  })
  .join("\n")}

</urlset>`;

try {
  fs.writeFileSync("build/sitemap.xml", sitemap);
} catch (err) {
  console.error(err);
}
