let cryptos = [
  { name: "Bitcore",   price: 490,  pct: "-18.5" },
  { name: "Xoluna",    price: 66.50,   pct: "+33.0" },
  { name: "Litezone",  price: 120.3,  pct: "-60" },
  { name: "Ethora",    price: 328,    pct: "+118" },
  { name: "Orium",     price: 1001,   pct: "+0.1" },
];

const ADMIN_USER = "admin";
const ADMIN_PASS = "doallup";

let isAdmin = false;

document.addEventListener("DOMContentLoaded", () => {
  const burgerIcon       = document.getElementById("burger-icon");
  const burgerMenu       = document.getElementById("burger-menu");
  const loginForm        = document.getElementById("login-form");
  const loginMessage     = document.getElementById("login-message");

  const cryptoTableBody  = document.getElementById("crypto-table-body");
  const logoutBtn        = document.getElementById("logout-btn");
  const adminCol         = document.getElementById("admin-col");

  const themeToggleBtn   = document.getElementById("theme-toggle");

  burgerIcon.addEventListener("click", () => {
    burgerMenu.classList.toggle("open");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      isAdmin = true;
      burgerMenu.classList.remove("open");
      loginMessage.textContent = "";

      adminCol.classList.remove("hidden");
      logoutBtn.classList.remove("hidden");

      renderTable();
    } else {
      loginMessage.textContent = "Identifiants incorrects.";
    }
  });

  logoutBtn.addEventListener("click", () => {
    isAdmin = false;
    adminCol.classList.add("hidden");
    logoutBtn.classList.add("hidden");

    renderTable();
  });

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
      themeToggleBtn.textContent = "🌕";
    } else {
      themeToggleBtn.textContent = "🌑";
    }
  });

  function renderTable() {
    cryptoTableBody.innerHTML = "";

    cryptos.forEach((crypto) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = crypto.name;
      row.appendChild(nameCell);

      const priceCell = document.createElement("td");
      if (isAdmin) {
        const container = document.createElement("span");
        container.style.whiteSpace = "nowrap";

        const priceInput = document.createElement("input");
        priceInput.type = "number";
        priceInput.value = crypto.price;
        priceInput.classList.add("edit-input");
        
        priceInput.addEventListener("change", (e) => {
          crypto.price = parseFloat(e.target.value);
        });

        container.appendChild(priceInput);

        const currencySymbol = document.createTextNode(" $");
        container.appendChild(currencySymbol);

        priceCell.appendChild(container);
      } else {
        priceCell.textContent = `${crypto.price} $`;
      }
      row.appendChild(priceCell);

      const pctCell = document.createElement("td");
      if (isAdmin) {
        const pctInput = document.createElement("input");
        pctInput.type = "text";
        pctInput.value = crypto.pct;
        pctInput.classList.add("edit-input");

        pctInput.addEventListener("change", (e) => {
          const newPctStr = e.target.value.trim();
          const newPctValue = parseFloat(newPctStr);

          if (!isNaN(newPctValue)) {
            crypto.pct = newPctStr;

            let oldPrice = crypto.price;
            let newPrice = oldPrice * (1 + newPctValue / 100);
            newPrice = parseFloat(newPrice.toFixed(2));
            crypto.price = newPrice;

            if (priceCell.firstChild && priceCell.firstChild.tagName === "SPAN") {
              const spanContainer = priceCell.firstChild;
              if (spanContainer.firstChild.tagName === "INPUT") {
                spanContainer.firstChild.value = newPrice;
              }
            }
          } else {
            e.target.value = crypto.pct;
          }
        });

        pctCell.appendChild(pctInput);
      } else {
        pctCell.textContent = crypto.pct;
      }
      row.appendChild(pctCell);

      const actionCell = document.createElement("td");
      if (isAdmin) {
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "✅";
        saveBtn.classList.add("edit-button");
        saveBtn.addEventListener("click", () => {
          alert(`Modifications sauvegardées pour ${crypto.name} !`);
        });
        actionCell.appendChild(saveBtn);
      }
      row.appendChild(actionCell);

      cryptoTableBody.appendChild(row);
    });
  }

  renderTable();
});