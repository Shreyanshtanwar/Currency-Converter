const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const FALLBACK_URL =
  "https://latest.currency-api.pages.dev/v1/currencies";

const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const msg = document.querySelector(".msg");
const amountEl = document.querySelector(".amount input");
const button = document.querySelector("form button");

// Populate dropdowns
for (let code in countryList) {
  let option1 = document.createElement("option");
  option1.value = code;
  option1.textContent = code;

  let option2 = document.createElement("option");
  option2.value = code;
  option2.textContent = code;

  fromCurrency.appendChild(option1);
  toCurrency.appendChild(option2);
}

// Default values
fromCurrency.value = "USD";
toCurrency.value = "INR";
updateFlag(fromCurrency);
updateFlag(toCurrency);

// Change flag when currency changes
fromCurrency.addEventListener("change", () => updateFlag(fromCurrency));
toCurrency.addEventListener("change", () => updateFlag(toCurrency));

function updateFlag(element) {
  let code = element.value;
  let countryCode = countryList[code];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
}

// Fetch exchange rate
async function updateExchangeRate() {
  let amtVal = amountEl.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amountEl.value = "1";
  }

  const base = fromCurrency.value.toLowerCase();
  const target = toCurrency.value.toLowerCase();

  const primaryURL = `${BASE_URL}/${base}.json`;
  const fallbackURL = `${FALLBACK_URL}/${base}.json`;

  let data, rate;

  try {
    const response = await fetch(primaryURL);
    data = await response.json();
  } catch (err) {
    console.warn("Primary CDN failed, trying fallback…", err);
    const fallbackResponse = await fetch(fallbackURL);
    data = await fallbackResponse.json();
  }

  rate = data[base][target];
  if (!rate) {
    msg.innerText = "Rate not found!";
    return;
  }

  const finalAmount = (amtVal * rate).toFixed(4);
  msg.innerText = `${amtVal} ${fromCurrency.value} = ${finalAmount} ${toCurrency.value}`;
}

// Handle button click
button.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Load initial rate
window.addEventListener("load", () => {
  updateExchangeRate();
});
