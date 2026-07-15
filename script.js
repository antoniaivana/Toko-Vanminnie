// DATA PRODUK
// Kalau mau ubah PRODUK disini
// Kalau mau ubah nama tinggal name nya aja ganti dan selebihnya kalau mau ubah apa apa di dalem kutipnya""

// CONTOH
//{ id: 1,name: " ISI NAMANYA ", category: " ISI KATEGORI ", price: ISI HARGA GAUSA PAKE KUTIP , image: " NAMA FILE IMG NYA " },

// AREA UBAH PRODUK
const products = [
    { id: 1,name: "Strawberry Milk Tweed Skirt", category: "dress", price: 245000, image: "img/A-Line skirt.jpg"},
    { id: 2, name: "Ribbon Candy Knit Top", category: "tops", price: 159000, image: "img/arme top.jpg"},
    { id: 3, name: "Blossom Glossy Pleated Skirt", category: "dress", price: 210000, image: "img/bubble skirt.jpg"},
    { id: 4, name: "Soft Pastel Puff Blouse", category: "tops", price: 175000, image: "img/leather mini.jpg"},
    { id: 5, name: "Hongdae Baby Pink Mini Skirt", category: "dress", price: 189000, image: "img/Ocia.jpg"},
    { id: 6, name: "Sakura Silk Button Top", category: "tops", price: 165000, image: "img/rok ruffle mini.jpg"},
    { id: 7, name: "Coquette Pink Ribbon Cardigan", category: "outerwear", price: 225000, image: "img/tie shoulder top .jpg"},
    { id: 8, name: "Neon Pink Sweetheart Corset Top", category: "tops", price: 195000, image: "img/unega top.jpg" }
];
// AREA UBAH PRODUK



// CART
let cart = JSON.parse(localStorage.getItem("kstyle_cart")) || [];

// FORMAT RUPIAH
function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}

// RENDER PRODUK
function renderProducts(list) {

    const productsGrid = document.getElementById("products-grid");

    productsGrid.innerHTML = "";


    if (list.length === 0) {
        productsGrid.innerHTML =
            `<p style="text-align:center">Produk tidak ditemukan</p>`;
        return;
    }


    list.forEach(product => {

        productsGrid.innerHTML += `

        <div class="product-card">

            <div class="img-container">

            <img 
            src="${product.image}" 
            class="product-img"
            onclick="openDetailModal(${product.id})">

            </div>


            <div class="product-info">

            <span class="product-cat">
            ${product.category}
            </span>


            <h3 class="product-title"
            onclick="openDetailModal(${product.id})">
            ${product.name}
            </h3>


            <p class="product-price">
            ${formatRupiah(product.price)}
            </p>


            <button class="btn-add-cart"
            onclick="addToCart(${product.id})">
            Tambah ke Keranjang
            </button>


            </div>

        </div>

        `;

    });

}




// FILTER SEARCH
function filterProducts() {

    let search =
        document.getElementById("search-input").value.toLowerCase();


    let category =
        document.getElementById("category-filter").value;


    let price =
        document.getElementById("price-filter").value;



    let result = products.filter(product => {


        let matchSearch =
            product.name.toLowerCase().includes(search);



        let matchCategory =
            category === "all" ||
            product.category === category;



        let matchPrice = true;


        if (price === "low") {
            matchPrice = product.price < 200000;
        }


        if (price === "high") {
            matchPrice = product.price >= 200000;
        }



        return matchSearch &&
            matchCategory &&
            matchPrice;

    });


    renderProducts(result);

}




// DETAIL MODAL
function openDetailModal(id) {

    let product =
        products.find(p => p.id === id);



    let modal =
        document.getElementById("detail-modal");


    let body =
        document.getElementById("modal-product-body");



    body.innerHTML = `

    <div class="modal-left">

    <img src="${product.image}">

    </div>


    <div class="modal-right">

    <h2>${product.name}</h2>


    <p>
    Kategori : ${product.category}
    </p>


    <h3>
    ${formatRupiah(product.price)}
    </h3>


    <p>
    Fashion Korea premium dengan desain modern dan nyaman digunakan.
    </p>


    <button class="btn-add-cart"
    onclick="addToCart(${product.id});closeDetailModal();">

    Tambah ke Keranjang

    </button>


    </div>

    `;


    modal.style.display = "block";

}



function closeDetailModal() {

    document.getElementById("detail-modal")
        .style.display = "none";

}





// CART


function toggleCartModal() {

    document
        .getElementById("cart-sidebar")
        .classList.toggle("open");

}



function addToCart(id) {

    let product =
        products.find(p => p.id === id);


    let exist =
        cart.find(item => item.id === id);



    if (exist) {

        exist.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    updateCart();

}

function removeFromCart(id) {
    cart =
        cart.filter(item => item.id !== id);
    updateCart();
}
function updateQuantity(id, value) {
    let item =
        cart.find(item => item.id === id);
    item.quantity =
        parseInt(value);
    if (item.quantity < 1)
        item.quantity = 1;
    updateCart();
}
function changeQuantity(id, change){

    const item = cart.find(item => item.id === id);

    if(item){

        item.quantity += change;


        // jika jumlah 0 maka hapus produk
        if(item.quantity <= 0){

            cart = cart.filter(
                product => product.id !== id
            );

        }

    }


    updateCart();

}

function updateCart() {
    localStorage.setItem(
        "kstyle_cart",
        JSON.stringify(cart)
    );
    let count =
        cart.reduce(
            (a, b) => a + b.quantity,
            0
        );
    document.getElementById("cart-count")
        .innerText = count;
    let container =
        document.getElementById("cart-items");
    container.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        total +=
            item.price *
            item.quantity;
        container.innerHTML += `
        <div class="cart-item">
        <img src="${item.image}">
        <div>
        <h4>${item.name}</h4>
        <p>${formatRupiah(item.price)}</p>
<div class="cart-qty">

    <button onclick="changeQuantity(${item.id}, -1)">
        -
    </button>

    <span>${item.quantity}</span>

    <button onclick="changeQuantity(${item.id}, 1)">
        +
    </button>

</div>
        <button onclick="removeFromCart(${item.id})">
        Hapus
        </button>
        </div>
        </div>
        `;
    });
    document.getElementById("cart-total")
        .innerText = formatRupiah(total);
    renderCheckoutSummary(total);
}
// CHECKOUT SUMMARY
function renderCheckoutSummary(total) {
    let box =
        document.getElementById("checkout-summary-items");
    box.innerHTML = "";
    cart.forEach(item => {
        box.innerHTML += `
<p>
${item.name} x${item.quantity}
-
${formatRupiah(item.price * item.quantity)}
</p>
`;
    });
    document.getElementById("checkout-grand-total")
        .innerText = formatRupiah(total);
}
// CHECKOUT
function handleCheckout(event) {
    event.preventDefault();
    if (cart.length === 0) {
        alert("Keranjang masih kosong");
        return;
    }
    let total =
        cart.reduce(
            (a, b) => a + (b.price * b.quantity),
            0
        );
    document.getElementById("inv-name")
        .innerText =
        document.getElementById("name").value;
    document.getElementById("inv-address")
        .innerText =
        document.getElementById("address").value;
    document.getElementById("inv-method")
        .innerText =
        document.getElementById("payment").value;
    document.getElementById("inv-total")
        .innerText =
        formatRupiah(total);
    document.getElementById("inv-number")
        .innerText =
        "INV-" + Date.now();
    document.getElementById("invoice-section")
        .style.display = "block";
    cart = [];
    updateCart();
    document.getElementById("checkout-form")
        .reset();
    alert("Pembayaran berhasil!");
}
// START
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    updateCart();
    document
        .getElementById("search-input")
        .addEventListener("input", filterProducts);
    document
        .getElementById("category-filter")
        .addEventListener("change", filterProducts);
    document
        .getElementById("price-filter")
        .addEventListener("change", filterProducts);
});