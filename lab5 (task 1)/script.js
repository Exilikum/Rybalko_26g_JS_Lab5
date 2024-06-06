document.addEventListener('DOMContentLoaded', () => {
    const cartItems = {};
    const cartContainer = document.querySelector('.cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const promocodeElement = document.getElementById('promocode');
    const applyPromocodeButton = document.getElementById('apply-promocode');
    let discountRate = 0.20;

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.closest('.product');
            const id = product.dataset.id;
            if (cartItems[id]) {
                alert('This item is already in the cart.');
                return;
            }
            const name = product.dataset.name;
            const price = parseFloat(product.dataset.price);
            const stock = parseInt(product.dataset.stock);
            const color = product.dataset.color;
            const ram = product.dataset.ram || '';
            const storage = product.dataset.storage || '';
            const connectivity = product.dataset.connectivity || '';
            const imageSrc = product.querySelector('img').src;

            const details = [color, ram, storage, connectivity].filter(Boolean).join(' | ');

            cartItems[id] = { name, price, quantity: 1, details, imageSrc };

            const item = document.createElement('div');
            item.classList.add('cart-item');
            item.dataset.id = id;
            item.innerHTML = `
                <img src="${imageSrc}" alt="${name}">
                <div>
                    <p class="product-name">${name}</p>
                    <p class="product-details">${details}</p>
                </div>
                <div class="quantity-wrapper">
                    <button class="decrease-qty" data-id="${id}">-</button>
                    <span class="quantity">1</span>
                    <button class="increase-qty" data-id="${id}">+</button>
                </div>
                <p class="price">$${price.toFixed(2)}</p>
                <button class="remove-from-cart" data-id="${id}">
                    <img src="https://cdn-icons-png.flaticon.com/512/3096/3096673.png" alt="Remove">
                </button>
            `;
            cartContainer.appendChild(item);

            updateCart();

            document.querySelector(`.increase-qty[data-id="${id}"]`).addEventListener('click', () => {
                if (cartItems[id].quantity < stock) {
                    cartItems[id].quantity++;
                } else {
                    alert('Stock limit reached');
                }
                updateCart();
            });

            document.querySelector(`.decrease-qty[data-id="${id}"]`).addEventListener('click', () => {
                if (cartItems[id].quantity > 1) {
                    cartItems[id].quantity--;
                } else {
                    delete cartItems[id];
                    document.querySelector(`.cart-item[data-id="${id}"]`).remove();
                }
                updateCart();
            });

            document.querySelector(`.remove-from-cart[data-id="${id}"]`).addEventListener('click', () => {
                delete cartItems[id];
                document.querySelector(`.cart-item[data-id="${id}"]`).remove();
                updateCart();
            });
        });
    });

    const updateCart = () => {
        let subtotal = 0;
        Object.keys(cartItems).forEach(id => {
            const item = cartItems[id];
            subtotal += item.price * item.quantity;
            document.querySelector(`.cart-item[data-id="${id}"] .quantity`).textContent = item.quantity;
            document.querySelector(`.cart-item[data-id="${id}"] .price`).textContent = `$${(item.price * item.quantity).toFixed(2)}`;
        });

        const discount = subtotal * discountRate;
        const tax = (subtotal - discount) * 0.05;
        const total = subtotal - discount + tax;

        subtotalElement.textContent = subtotal.toFixed(2);
        discountElement.textContent = discount.toFixed(2);
        taxElement.textContent = tax.toFixed(2);
        totalElement.textContent = total.toFixed(2);
    };

    applyPromocodeButton.addEventListener('click', () => {
        const promocode = promocodeElement.value;
        if (promocode === 'DISCOUNT20') {
            discountRate = 0.20;
        } else {
            discountRate = 0.0;
            alert('Invalid promocode');
        }
        updateCart();
    });

    document.getElementById('info').addEventListener('mouseover', () => {
        document.getElementById('info-tooltip').style.display = 'block';
    });

    document.getElementById('info').addEventListener('mouseout', () => {
        document.getElementById('info-tooltip').style.display = 'none';
    });

    updateCart();
});
