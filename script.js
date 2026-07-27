async function getCountries() {
  try {
    let response = await fetch("https://date.nager.at/api/v3/AvailableCountries");
    if(!response.ok){
        throw new Error(`Request failed : ${response.status}`)
    }
    return await response.json();
  } catch (error) {
    console.log("Error in fetching : ",error)
    return null
  }
}

function displayCountries(countries) {
  const select = document.getElementById("country");

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.countryCode;
    option.textContent = country.name;
    select.appendChild(option);
  });
}

function displayYears() {
  const yearSelect = document.getElementById("year");
  for (let year = 2021; year <= 2035; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

async function start() {
  let countries = await getCountries();
  if(!countries){
    console.log(`Could not populate countries`)
    return;
  }
  displayCountries(countries);
  displayYears();
}
start();
