document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Data
    let siteData;
    try {
        const response = await fetch('data.json');
        siteData = await response.json();
    } catch (error) {
        console.error("Failed to load data.json:", error);
        document.getElementById('products-container').innerHTML = '<p class="text-center col-span-full text-red-500">Failed to load products. Please try again later.</p>';
        return;
    }

    // 2. Render Contact Info
    const infoContainer = document.getElementById('contact-info-container');
    if (infoContainer && siteData.siteInfo) {
        const { contact } = siteData.siteInfo;
        infoContainer.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <i class="fab fa-whatsapp text-2xl"></i>
                </div>
                <div>
                    <h4 class="text-white font-medium">WhatsApp</h4>
                    <a href="https://wa.me/${contact.whatsapp}" class="text-gray-400 hover:text-accent transition-colors">${contact.whatsapp}</a>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <i class="fas fa-phone text-xl"></i>
                </div>
                <div>
                    <h4 class="text-white font-medium">Phone</h4>
                    <a href="tel:${contact.phone}" class="text-gray-400 hover:text-accent transition-colors">${contact.phone}</a>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <i class="fas fa-envelope text-xl"></i>
                </div>
                <div>
                    <h4 class="text-white font-medium">Email</h4>
                    <a href="mailto:${contact.email}" class="text-gray-400 hover:text-accent transition-colors">${contact.email}</a>
                </div>
            </div>
        `;
    }

    // 3. Render Products
    const productsContainer = document.getElementById('products-container');
    const productSelect = document.getElementById('product');
    
    if (productsContainer && siteData.products) {
        productsContainer.innerHTML = ''; // clear loading spinner
        
        siteData.products.forEach((product, index) => {
            // Add to select dropdown
            if (productSelect) {
                const option = document.createElement('option');
                option.value = product.title;
                option.textContent = product.title;
                productSelect.appendChild(option);
            }

            // Create product card
            const priceHtml = product.compareAtPrice 
                ? `<span class="text-gray-500 line-through text-sm mr-2">${product.compareAtPrice} LE</span><span class="text-accent font-bold text-lg">${product.price} LE</span>`
                : `<span class="text-accent font-bold text-lg">${product.price} LE</span>`;

            const card = document.createElement('div');
            card.className = `glass-card group overflow-hidden product-card animate-slide-up`;
            card.style.animationDelay = `${index * 100}ms`;
            
            // Image with fallback
            const imgSrc = product.image || 'https://via.placeholder.com/400x400?text=Tabloria+3D';
            
            card.innerHTML = `
                <div class="relative h-64 overflow-hidden bg-gray-900">
                    <img src="${imgSrc}" alt="${product.title}" class="w-full h-full object-cover transition-transform duration-500" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400?text=Tabloria+3D'">
                    <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button class="btn-primary" onclick="document.getElementById('product').value='${product.title}'; document.getElementById('contact').scrollIntoView({behavior: 'smooth'})">Order Now</button>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-white mb-2 line-clamp-1">${product.title}</h3>
                    <p class="text-gray-400 text-sm mb-4 line-clamp-2">${product.description || 'Premium 3D printed figure.'}</p>
                    <div class="flex justify-between items-center mt-auto">
                        <div>
                            ${priceHtml}
                        </div>
                    </div>
                </div>
            `;
            productsContainer.appendChild(card);
        });
    }

    // 4. Form Submission (Google Apps Script)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const statusDiv = document.getElementById('form-status');
            
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
            
            const formData = new FormData(contactForm);
            const data = new URLSearchParams(formData);
            
            // NOTE: Replace this URL with the deployed Google Apps Script Web App URL
            const scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; 
            
            try {
                if (scriptUrl === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
                    // Simulate success if not configured yet
                    setTimeout(() => {
                        statusDiv.className = 'mt-4 text-center p-3 rounded-md bg-green-500/20 text-green-400 border border-green-500/50';
                        statusDiv.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Message prepared! (Configure GAS URL to actually send)';
                        statusDiv.classList.remove('hidden');
                        contactForm.reset();
                        btn.disabled = false;
                        btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane ml-2"></i>';
                    }, 1000);
                    return;
                }

                const response = await fetch(scriptUrl, {
                    method: 'POST',
                    body: data,
                    mode: 'no-cors' // Important for GAS to avoid CORS issues on client side if headers aren't perfect
                });
                
                statusDiv.className = 'mt-4 text-center p-3 rounded-md bg-green-500/20 text-green-400 border border-green-500/50';
                statusDiv.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Message sent successfully!';
                statusDiv.classList.remove('hidden');
                contactForm.reset();
            } catch (error) {
                console.error('Error!', error.message);
                statusDiv.className = 'mt-4 text-center p-3 rounded-md bg-red-500/20 text-red-400 border border-red-500/50';
                statusDiv.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i>Failed to send message. Please try again.';
                statusDiv.classList.remove('hidden');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane ml-2 group-hover:translate-x-1 transition-transform"></i>';
                
                setTimeout(() => {
                    statusDiv.classList.add('hidden');
                }, 5000);
            }
        });
    }

    // 5. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 6. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-lg', 'bg-primary/95');
            navbar.classList.remove('bg-primary/90');
        } else {
            navbar.classList.remove('shadow-lg', 'bg-primary/95');
            navbar.classList.add('bg-primary/90');
        }
    });
});
