const wrapper = document.querySelector(".wrapper"),
  shopEl = wrapper.querySelector(".shop"),
  countEle = wrapper.querySelector(".counter"),
  listProduct = wrapper.querySelector(".listproduct"),
  shopingCard = document.querySelector(".card_left"),
  listChoice = document.querySelector(".list_choice"),
  btnMinus = shopingCard.querySelector(".btns_added .minus"),
  btnPlus = shopingCard.querySelector(".btns_added .plus"),
  closeShopingCard = document.querySelector(".close"),
  listPages = wrapper.querySelector(".list_pages");

// console.log(allProduct);

let productArray = [];
let cardArr = [];
let page = 1,
  totalPages = 4;

shopEl.addEventListener("click", () => {
  document.body.classList.toggle("show_card");
});

closeShopingCard.addEventListener("click", () => shopEl.click());

function addToShopingCard() {
  listChoice.innerHTML = "";

  if (cardArr.length) {
    cardArr.forEach((item) => {
      // console.log(item.productId);
      let position = productArray.findIndex(
        (value) => value.id == item.productId
      );
      let info = productArray[position];
      let liTag = document.createElement("li");
      liTag.classList.add("item");
      liTag.dataset.id = item.productId;
      liTag.innerHTML = `<img src="${info.image}" alt="">
                        <div class="title">${info.name}</div>
                        <div class="price">$${info.price * item.quantity}</div>
                        <div class="btns_added">
                            <i class="fa-solid fa-minus minus"></i>
                            <span class="number_of_count">${
                              item.quantity
                            }</span>
                            <i class="fa-solid fa-plus plus"></i>
                        </div>`;

      listChoice.appendChild(liTag);
    });
  }

  countEle.innerText = cardArr.length;
}

listChoice.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("minus") ||
    e.target.classList.contains("plus")
  ) {
    let product_id = e.target.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (e.target.classList.contains("plus")) {
      type = "plus";
    }

    changeQuantity(product_id, type);
  }
});

function changeQuantity(product_id, type) {
  let positionEl = cardArr.findIndex((value) => value.productId == product_id);
  switch (type) {
    case "plus":
      cardArr[positionEl].quantity += 1;
      break;
    default:
      let infoQuantity = cardArr[positionEl].quantity;
      if (infoQuantity > 0) {
        cardArr[positionEl].quantity -= 1;
      } else {
        cardArr.splice(positionEl, 1);
      }
  }

  addToShopingCard();
  addToLocalStorage();

  console.log(cardArr.length);
  if(!cardArr.length){
     shopEl.click();
  }
}

function addToCard(id) {
  let positionProductInCard = cardArr.findIndex(
    (value) => value.productId == id
  );

  if (cardArr.length <= 0) {
    cardArr = [{ productId: id, quantity: 1 }];
  } else if (positionProductInCard < 0) {
    cardArr.push({ productId: id, quantity: 1 });
  } else {
    cardArr[positionProductInCard].quantity += 1;
  }

  addToShopingCard();
  addToLocalStorage();
}

function addToLocalStorage() {
  localStorage.setItem("cards", JSON.stringify(cardArr));
}

listProduct.addEventListener("click", (e) => {
  if (e.target.classList.contains("add")) {
    let itemId = e.target.parentElement.dataset.id;
    addToCard(itemId);
  }
});

function showData() {
  listProduct.innerHTML = "";

  let divTag = "";
  if (productArray) {
    productArray.forEach((item) => {
      const { id, image, name, price } = item;
      divTag += ` <li class="item" data-id=${id}>
                  <img src="${image}" alt="image">
                  <div class="title">${name}</div>
                  <div class="price">$${price}</div>
                  <button class="add">Add To Card</button>
              </li>`;

      listProduct.innerHTML = divTag;
    });
  }

  allProduct = listProduct.querySelectorAll(".listproduct .item");
  loadPage(page, totalPages);
}

function loadPage() {
  let starPage = totalPages * (page - 1);
  let endPage = totalPages * page - 1;

  allProduct.forEach((item, index) => {
    if (index >= starPage && index <= endPage) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }

    showPage();
  });
}

function showPage() {
  let countProducts = Math.ceil(allProduct.length / totalPages);
  listPages.innerHTML = "";
  let activeEl;

  if (page > 1) {
    let liEl = document.createElement("li");
    liEl.classList.add("prev");
    liEl.innerHTML = `<li class="prev" onclick="changePage(${
      page - 1
    })">Prev</li>`;
    listPages.appendChild(liEl);
  }

  for (let i = 1; i <= countProducts; i++) {
    let liEl = document.createElement("li");
    i == page ? (activeEl = "active") : (activeEl = "");
    liEl.innerHTML = `<li class="${activeEl}">${i}</li>`;
    liEl.setAttribute("onclick", "changePage(" + i + ")");
    listPages.appendChild(liEl);
  }

  if (page < countProducts) {
    let liEl = document.createElement("li");
    liEl.classList.add("next");
    liEl.innerHTML = `<li class="next" onclick="changePage(${
      page + 1
    })">Prev</li>`;
    listPages.appendChild(liEl);
  }
}

function changePage(index) {
  page = index;
  loadPage();
}

function initData() {
  fetch("products.json")
    .then((res) => res.json())
    .then((data) => {
      productArray = data;
      showData();

      if (localStorage.getItem("cards")) {
        cardArr = JSON.parse(localStorage.getItem("cards"));
        addToShopingCard();
      }
    });
}

initData();
