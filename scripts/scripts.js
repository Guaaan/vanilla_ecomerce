//bootstrap modal function
var myModal = document.getElementById("myModal");
var myInput = document.getElementById("myInput");

// myModal.addEventListener("shown.bs.modal", function () {
//   myInput.focus();
// });

const cards = document.getElementById("cards");
const items = document.getElementById("cart-item");
const templateCard = document.getElementById("template-card").content;
const templateCartItems = document.getElementById("template-cart-items").content;
const fragment = document.createDocumentFragment();
let cart = {};

//call the fetch api data
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});
cards.addEventListener("click", (e) => {
  addToCart(e);
});
//async fetch the data from the api
const fetchData = async () => {
  try {
    //aqui debe ir la url de la api
    const res = await fetch("products.json");
    const data = await res.json();
    mapCards(data);
  } catch (error) {
    console.log(error);
  }
};

let dollarSign = "$";
//function that maps the product cards
const mapCards = (data) => {
  console.log(data);
  data.forEach((product) => {
    templateCard.querySelector("h5").textContent = product.name;
    templateCard.querySelector("h2").textContent = dollarSign + product.price;
    templateCard.querySelector("img").setAttribute("src", product.url_image);
    templateCard.querySelector("button.btn-success").dataset.id = product.id;
    templateCard.querySelector("i.fa-shopping-cart").dataset.id = product.id;

    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addToCart = (e) => {
  // console.log(e.target);
  // console.log(e.target.classList.contains("btn-success"));
  // send the id of the product to the cart if the button or the cart icon is clicked
  if (
    e.target.classList.contains("btn-success") ||
    e.target.classList.contains("fa-shopping-cart")
  ) {
    setCart(e.target.parentElement.parentElement);
  }
  e.stopPropagation();
};

const setCart = (object) => {
  //console.log(object);
  const product = {
    id: object.querySelector("button.btn-success").dataset.id,
    name: object.querySelector("h5").textContent,
    price: object.querySelector("h2").textContent,
    quantity: 1,
  };

  if (cart.hasOwnProperty(product.id)) {
    product.quantity = cart[product.id].quantity + 1;
  }
  //set the product on my cart
  cart[product.id] = { ...product };
  showCartItems();
  //console.log(cart);
};
//show the cart items in the cart modal
const showCartItems = () => {
  console.log(cart);
  items.innerHTML = "";
  Object.values(cart).forEach((product) => {
    templateCartItems.querySelectorAll("h6")[0].textContent = product.name;
    templateCartItems.querySelectorAll("span").textContent = product.quantity * product.price;
    templateCartItems.querySelector('.fa-minus').dataset.id = product.id;
    templateCartItems.querySelector('.fa-plus').dataset.id = product.id; 
    templateCartItems.querySelector('input').value = product.quantity;
    templateCard.querySelector("img").setAttribute("src", product.url_image)
    const clone = templateCartItems.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
};
