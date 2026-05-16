let cart = JSON.parse(localStorage.getItem('tabloria_cart')) || [];

function saveCart() {
    localStorage.setItem('tabloria_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const mobileCartCount = document.getElementById('mobile-cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if(cartCount) cartCount.innerText = totalItems;
    if(mobileCartCount) mobileCartCount.innerText = totalItems;
    if(cartTotal) cartTotal.innerText = totalPrice.toFixed(2) + ' EGP';
    
    if(cartItems) {
        if(cart.length === 0) {
            cartItems.innerHTML = '<p class="text-gray-400 text-center mt-10">Your cart is empty.</p>';
        } else {
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="flex gap-4 items-center bg-black/30 p-3 rounded-lg border border-gray-800">
                    <img src="${item.image}" class="w-16 h-16 object-cover rounded">
                    <div class="flex-1">
                        <h4 class="text-white text-sm font-bold line-clamp-1">${item.title}</h4>
                        <p class="text-accent text-sm">${item.price} EGP</p>
                        <div class="flex items-center gap-3 mt-2">
                            <button onclick="changeQuantity(${index}, -1)" class="w-6 h-6 rounded bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700">-</button>
                            <span class="text-white text-sm">${item.quantity}</span>
                            <button onclick="changeQuantity(${index}, 1)" class="w-6 h-6 rounded bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700">+</button>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${index})" class="text-gray-500 hover:text-red-500"><i class="fas fa-trash"></i></button>
                </div>
            `).join('');
        }
    }
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if(cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function addToCart(title, price, image) {
    const existing = cart.find(item => item.title === title);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ title, price: parseFloat(price), image, quantity: 1 });
    }
    saveCart();
    openCart();
}

function openCart() {
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    setTimeout(() => {
        drawer.classList.remove('translate-x-full');
    }, 10);
}

function closeCart() {
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');
    drawer.classList.add('translate-x-full');
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
    }, 300); // match transition duration
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    
    document.getElementById('cart-btn')?.addEventListener('click', openCart);
    document.getElementById('mobile-cart-btn')?.addEventListener('click', openCart);
    document.getElementById('close-cart')?.addEventListener('click', closeCart);
    
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if(cart.length === 0) return alert("Your cart is empty!");
        document.getElementById('checkout-modal').classList.remove('hidden');
        document.getElementById('checkout-modal').classList.add('flex');
    });
    
    document.getElementById('close-checkout')?.addEventListener('click', () => {
        document.getElementById('checkout-modal').classList.add('hidden');
        document.getElementById('checkout-modal').classList.remove('flex');
    });
    
    document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('checkout-name').value;
        const phone = document.getElementById('checkout-phone').value;
        const email = document.getElementById('checkout-email').value;
        
        const orderDetails = cart.map(item => `${item.quantity}x ${item.title} (${item.price} EGP)`).join('%0A');
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const messageText = `New Order from Tabloria 3D!%0A%0A*Customer Info:*%0AName: ${name}%0APhone: ${phone}%0AEmail: ${email}%0A%0A*Order Details:*%0A${orderDetails}%0A%0A*Total:* ${totalPrice} EGP`;
        
        // 1. Send via CallMeBot WhatsApp API silently
        const waApiUrl = `https://api.callmebot.com/whatsapp.php?phone=201067826826&text=${messageText}&apikey=7695586`;
        fetch(waApiUrl, { mode: 'no-cors' }).catch(e => console.log(e));
        
        // 2. Clear Cart
        cart = [];
        saveCart();
        
        // 3. Close Modal & notify
        document.getElementById('checkout-modal').classList.add('hidden');
        document.getElementById('checkout-modal').classList.remove('flex');
        closeCart();
        alert('Order submitted successfully! We will contact you soon on WhatsApp.');
    });
});
