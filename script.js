function showForm(formId) {
    document.querySelectorAll(".form-box").forEach(form=> form.classList.remove("active"));
    document.getElementById(formId).classList.add("active");
}





 
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
cartIcon.addEventListener("click", ()=> cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));
