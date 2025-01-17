require("babel-register")({
    presets: ["es2015", "react"]
});

const router = require("../Router/SitemapRouting").default;
const Sitemap = require("react-router-sitemap").default;

function generateSitemap() {
    return (
        new Sitemap(router)
            .build("https://allshack.lukaku.tech")
            .save("./public/sitemap.xml")
    );
}

generateSitemap();