const fs = require('fs');
const path = require('path');
const https = require('https');

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
};

async function main() {
    console.log("Fetching products from Shopify...");
    const res = await fetch('https://tabloria-3d.myshopify.com/products.json?limit=250');
    const data = await res.json();
    
    const products = [];
    const imagesDir = path.join(__dirname, 'assets', 'images');
    
    for (const p of data.products) {
        let imageUrl = '';
        let localImage = '';
        if (p.images && p.images.length > 0) {
            imageUrl = p.images[0].src;
            const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
            const filename = `${p.handle}${ext}`;
            localImage = `assets/images/${filename}`;
            console.log(`Downloading ${imageUrl} to ${localImage}...`);
            try {
                await downloadImage(imageUrl, path.join(imagesDir, filename));
            } catch(e) {
                console.error(`Failed to download ${imageUrl}: ${e.message}`);
            }
        }
        
        products.push({
            id: p.id,
            title: p.title,
            handle: p.handle,
            description: p.body_html.replace(/<[^>]*>?/gm, '').trim(),
            price: p.variants[0]?.price || "0.00",
            compareAtPrice: p.variants[0]?.compare_at_price || null,
            image: localImage
        });
    }
    
    const siteData = {
        siteInfo: {
            name: "TABLORIA 3D",
            contact: {
                phone: "01277073553",
                whatsapp: "01277073553",
                email: "tabloria3d@gmail.com"
            },
            colors: {
                primary: "#000000",
                secondary: "#ffffff",
                accent: "#e53e3e"
            }
        },
        products: products
    };
    
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(siteData, null, 2));
    console.log("data.json written successfully!");
}

main().catch(console.error);
