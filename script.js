const $ = (id) => document.getElementById(id);
const colorSelect = $("color"), product = $("product"), productName = $("productName");
const engraving = $("engraving"), characterCount = $("characterCount"), productImage = $("productImage");
const cartArea = $("cartArea"), cartMessage = $("cartMessage"), productForm = $("productForm");
const description = $("description"), popupMessage = $("popupMessage"), scrollProgress = $("scrollProgress");

const FINISHES = {
    black:  { tone: "linear-gradient(145deg, #2b2f38, #0f1116)", text: "#ffffff" },
    silver: { tone: "linear-gradient(145deg, #eef0f4, #b9c0cc)", text: "#12151c" },
    blue:   { tone: "linear-gradient(145deg, #4a75ff, #1a2f9e)", text: "#ffffff" }
};
const CART_EMPTY = "Drop Product Here";
let popupTimer;

function showPopup(message) {
    popupMessage.textContent = message;
    popupMessage.classList.add("show");
    clearTimeout(popupTimer);
    popupTimer = setTimeout(() => popupMessage.classList.remove("show"), 2500);
}

function applyColor(name) {
    const f = FINISHES[name] || FINISHES.black;
    product.style.setProperty("--tone", f.tone);
    product.style.setProperty("--engrave", f.text);
}

function setCartHighlight(on) {
    cartArea.style.background = on ? "#e6f6ee" : "";
    cartArea.style.borderColor = on ? "var(--ok)" : "";
}

function removeFromCart() {
    cartArea.textContent = CART_EMPTY;
    cartMessage.textContent = "✓ Product removed from cart";
    setCartHighlight(false);
    showPopup("✓ Product removed from cart.");
}

function addToCart() {
    cartArea.innerHTML = "";
    const img = productImage.cloneNode(true);
    img.removeAttribute("id");
    img.title = "Click to remove product";
    img.addEventListener("click", removeFromCart);
    cartArea.appendChild(img);
    cartMessage.textContent = "✓ Product added to cart";
    setCartHighlight(true);
    product.style.opacity = "1";
    showPopup("✓ Product added to cart.");
}

colorSelect.addEventListener("change", () => {
    applyColor(colorSelect.value);
    showPopup("Finish changed to " + colorSelect.value + ".");
});

productName.addEventListener("input", () => {
    engraving.textContent = productName.value || "Your Name";
    characterCount.textContent = productName.value.length + " / 15";
    characterCount.style.color = productName.value.length ? "var(--ok)" : "";
});

/* Tilt */
product.addEventListener("mousemove", (e) => {
    const r = product.getBoundingClientRect();
    const rx = (r.height / 2 - (e.clientY - r.top)) / 12;
    const ry = ((e.clientX - r.left) - r.width / 2) / 12;
    product.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
});
product.addEventListener("mouseleave", () => { product.style.transform = ""; });

/* Drag and drop */
product.addEventListener("dragstart", () => {
    product.style.opacity = "0.5";
    showPopup("Drop the watch in the cart to add it.");
});
product.addEventListener("dragend", () => { product.style.opacity = "1"; });
cartArea.addEventListener("dragover", (e) => { e.preventDefault(); setCartHighlight(true); });
cartArea.addEventListener("dragleave", () => setCartHighlight(false));
cartArea.addEventListener("drop", (e) => { e.preventDefault(); addToCart(); });
$("addBtn").addEventListener("click", addToCart);

/* Form */
productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (productName.value.trim() === "") {
        cartMessage.textContent = "Please enter a name to engrave.";
        showPopup("⚠ Please enter a name to engrave.");
        productName.focus();
        return;
    }
    cartMessage.textContent = "✓ Configuration saved!";
    showPopup("✓ Configuration saved.");
});

productForm.addEventListener("reset", () => {
    setTimeout(() => {
        colorSelect.value = "black";
        applyColor("black");
        engraving.textContent = "Your Name";
        characterCount.textContent = "0 / 15";
        characterCount.style.color = "";
        cartArea.textContent = CART_EMPTY;
        setCartHighlight(false);
        cartMessage.textContent = "";
        product.style.opacity = "1";
        product.style.transform = "";
        showPopup("✓ Configuration reset.");
    }, 0);
});

/* Copy / cut protection */
description.addEventListener("copy", (e) => { e.preventDefault(); showPopup("🔒 Copying the description is not allowed."); });
description.addEventListener("cut", (e) => { e.preventDefault(); showPopup("🔒 Cutting the description is not allowed."); });

/* Scroll progress */
window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
});