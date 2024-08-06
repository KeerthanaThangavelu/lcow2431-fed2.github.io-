document.addEventListener('DOMContentLoaded', () => {

    const homeSection = document.getElementById('home');
    const productSection = document.getElementById('product');
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');
    const cartCount = document.getElementById("cart-count");

    document.getElementById('home-button').addEventListener('click', function() {
        homeSection.classList.remove('hidden');
        productSection.classList.add('hidden');
        aboutSection.classList.add('hidden');
        contactSection.classList.add('hidden');
    });
    
    document.getElementById('product-button').addEventListener('click', function() {
        productSection.classList.remove('hidden');
        aboutSection.classList.add('hidden');
        contactSection.classList.add('hidden');
        homeSection.classList.add('hidden');
    });

    document.getElementById('about-button').addEventListener('click', function() {
        productSection.classList.add('hidden');
        aboutSection.classList.remove('hidden');
        contactSection.classList.add('hidden');
        homeSection.classList.add('hidden');
    });

    document.getElementById('contact-button').addEventListener('click', function() {
        productSection.classList.add('hidden');
        aboutSection.classList.add('hidden');
        contactSection.classList.remove('hidden');
        homeSection.classList.add('hidden');
    });

    const updateCartCount = () => {
        const cartItems = getDataFromLocalStore();
        //const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        //cartCount.textContent = totalItems;
        cartCount.textContent = cartItems.length;
    };


    let productsData = [];
    const taxRate = 0.13;

    fetch('https://mocki.io/v1/0476cd59-7e7b-4cff-a15d-05cd0cc90e25')
        .then(response => response.json())
        .then(data => {
            productsData = data; // Ensure only the first 25 products are displayed
            displayProducts(productsData);
        });

    const cart = getDataFromLocalStore();
    displayCart(cart);

    document.getElementById('products').addEventListener('click', event => {
        if (event.target.tagName === 'BUTTON') {
            const productId = event.target.dataset.id;
            const product = productsData.find(p => p.id == productId);
            const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
            addToCart(product, quantity);
            updateCartCount();
            highlightAddedItem(event.target);
            highlightProductContainer(productId);
        }
    });

   

    // Modal functionality
    const modal = document.getElementById('cart-modal');
    const btn = document.getElementById('cart-button');
    const span = document.getElementsByClassName('close')[0];

    modal.style.display = 'none';

    btn.onclick = () => {
        const cart = getDataFromLocalStore();
        displayCart(cart);
        modal.style.display = 'flex'; // Use flex to align center
    };

    span.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = event => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    document.getElementById('cart-items').addEventListener('click', event => {
        if (event.target.classList.contains('delete-icon')) {
            const productId = event.target.dataset.id;
            removeFromCart(productId);
            updateCartCount();
        }
    });

    

     // Initial cart count update
     updateCartCount();
});

function getDataFromLocalStore(){
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = products.map(product => `
        <div class="product" id="product-${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <label for="quantity-${product.id}">Quantity: </label>
        <select id="quantity-${product.id}">
            ${[...Array(30).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join('')}
        </select>
        <button data-id="${product.id}">Add to Cart</button>
        </div>
    `).join('');
    const cart = getDataFromLocalStore();
    cart.map(item => 
        highlightProductContainer(item.id)
        );
}

function displayCart(cart) {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');
    const subTotalContainer = document.getElementById('sub-total');
    const taxTotalContainer = document.getElementById('tax-total');

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity} <span class="delete-icon" data-id="${item.id}">&times;</span></p>
        </div>
    `).join('');

    const subtotalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxPrice = subtotalPrice * 0.13;
    const totalPrice = subtotalPrice + taxPrice;
    
    subTotalContainer.textContent = `Sub Total: $${subtotalPrice.toFixed(2)}`;
    taxTotalContainer.textContent = `Tax: $${taxPrice.toFixed(2)}`;
    totalPriceContainer.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

function addToCart(product, quantity) {
    const cart = getDataFromLocalStore();
    const existingItemIndex = cart.findIndex(item => item.id == product.id);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({...product, quantity});
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(productId) {
    let cart = getDataFromLocalStore();
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(cart);
    removeHighlightProductContainer(productId);
}

function highlightAddedItem(button) {
    button.classList.add('added-to-cart');
    button.textContent = 'Added!';
    setTimeout(() => {
        button.classList.remove('added-to-cart');
        button.textContent = 'Add to Cart';
    }, 2000); // Highlight for 2 seconds
}


function highlightProductContainer(productId) {
    const productContainer = document.getElementById(`product-${productId}`);
    if (productContainer) {
        productContainer.classList.add('product-added');
    }
    else{
        productContainer.classList.remove('product-added');
    }
}


function removeHighlightProductContainer(productId) {
    const productContainer = document.getElementById(`product-${productId}`);
    if (productContainer) {
        productContainer.classList.remove('product-added');
    }
}