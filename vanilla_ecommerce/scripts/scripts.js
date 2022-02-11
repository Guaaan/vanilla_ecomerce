//bootstrap modal function
var myModal = document.getElementById("myModal");
var myInput = document.getElementById("myInput");

//myModal.addEventListener("shown.bs.modal", function () {
//  myInput.focus();
//});

const cards = document.getElementById("cards");
const items = document.getElementById("cart-item");
const cartTotal = document.getElementById("cart-total");
const templateCard = document.getElementById("template-card").content;
const templateCartItems = document.getElementById(
  "template-cart-items"
).content;
const templateCartTotal = document.getElementById(
  "template-cart-total"
).content;
const fragment = document.createDocumentFragment();
let cart = {};

//call the fetch api data
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  //load the item from the local storage
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    showCartItems();
  }
});
//add product to cart on click
cards.addEventListener("click", (e) => {
  addToCart(e);
});

items.addEventListener("click", (e) => {
  btnAction(e);
});
//async fetch the data from the api
const fetchData = async () => {
  try {
    

    //this is how i would have fetched the api data
    /*const response = await fetch(
      "https://backend-vanilla-ecommerce.herokuapp.com/"
    );
    //get the data from the api
    const data = await response.json();
    //map the data
    mapCards(data);*/


    const res = await fetch("../products.json");
    const data = await res.json();
    mapCards(data);
  } catch (error) {
    console.log(error);
  }
};

//function that maps the product cards
const mapCards = (data) => {
  console.log(data);
  data.forEach((product) => {
    templateCard.querySelector("h5").textContent = product.name;
    templateCard.querySelector("h2").textContent = product.price;
    templateCard.querySelector("img").setAttribute("src", product.url_image);
    templateCard.querySelector("button.btn-success").dataset.id = product.id;
    templateCard.querySelector("i.fa-shopping-cart").dataset.id = product.id;
    templateCard.querySelector("p.card-text").textContent = product.category;
    if (product.discount > 0) {
      templateCard.querySelector("h3.percent").textContent =  product.discount;
    } if (product.discount == 0) {
      templateCard.querySelector("h3.percent").textContent = 0;
      }
    
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
    setCart(e.target.parentElement.parentElement.parentElement);
  }
  e.stopPropagation();
};

const setCart = (object) => {
  console.log(object);
  const product = {
    id: object.querySelector("button.btn-success").dataset.id,
    name: object.querySelector("h5").textContent,
    url_image: object.querySelector("img").src,
    price: object.querySelector("h2").textContent,
    discount: object.querySelector("h3.percent").textContent,
    category: object.querySelector("p.card-text").textContent,
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
  //console.log(cart);
  items.innerHTML = "";
  Object.values(cart).forEach((product) => {
    templateCartItems.querySelectorAll("h6")[0].textContent = product.name;
    templateCartItems.querySelectorAll("h6")[1].textContent = product.price;
    templateCartItems.querySelectorAll("h6")[2].textContent = product.quantity * product.price * (product.discount / 100);
    templateCartItems.querySelectorAll("h6")[3].textContent = product.quantity * product.price;
    templateCartItems.querySelector("input").value = product.quantity;
    templateCartItems.querySelector(".fa-minus").dataset.id = product.id;
    templateCartItems.querySelector(".fa-plus").dataset.id = product.id;
    templateCartItems
      .querySelector("img")
      .setAttribute("src", product.url_image);

    const clone = templateCartItems.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  showCartTotal();
  //save the cart in the local storage
  localStorage.setItem("cart", JSON.stringify(cart));
};

const showCartTotal = () => {
  //set my total to an empty html so when i clone it below i can add the total and it wont repeat itself
  cartTotal.innerHTML = "";
  if (Object.keys(cart).length === 0) {
    cartTotal.innerHTML = "";
    return;
  }
  //here i use the reduce function to get the total items in the cart
  const nQuantity = Object.values(cart).reduce(
    (acc, { quantity }) => acc + quantity,
    0
  );
  //here i use the reduce function to get the total price in the cart
  const nPrice = Object.values(cart).reduce(
    (acc, { quantity, price }) => acc + quantity * price,
    0
  );
  const nTotalDiscount = Object.values(cart).reduce(
    (acc, { quantity, price, discount }) => 
    acc + quantity * price * (discount / 100),
    0
  );
  const nTotal = nPrice - nTotalDiscount;

  templateCartTotal.querySelectorAll("h5")[4].textContent = nQuantity;
  templateCartTotal.querySelectorAll("h5")[2].textContent = nPrice;
  templateCartTotal.querySelectorAll("h5")[3].textContent = nTotalDiscount;
  templateCartTotal.querySelectorAll("h5")[5].textContent = nTotal;
  const clone = templateCartTotal.cloneNode(true);
  fragment.appendChild(clone);
  cartTotal.appendChild(fragment);

  //function that set my cart to 0 and update the cart items
  const btnEmpty = document.getElementById("empty-cart");
  btnEmpty.addEventListener("click", () => {
    cart = {};
    showCartItems();
  });
};

const btnAction = (e) => {
  //sum an item
  if (e.target.classList.contains("fa-plus")) {
    //console.log(cart[e.target.dataset.id]);

    const product = cart[e.target.dataset.id];
    product.quantity++;
    //save the new quantity in a copy of product
    cart[e.target.dataset.id] = { ...product };
    showCartItems();
  }
  //substract an item
  if (e.target.classList.contains("fa-minus")) {
    //console.log(cart[e.target.dataset.id]);

    const product = cart[e.target.dataset.id];
    product.quantity--;
    //delete the item if quantity is 0
    if (product.quantity === 0) {
      delete cart[e.target.dataset.id];
    }
    //save the new quantity in a copy of product
    showCartItems();
  }
  e.stopPropagation();
};
