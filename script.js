async function getCountries() {
  try {
    let response = await fetch(
      "https://date.nager.at/api/v3/AvailableCountries",
    );
    if (!response.ok) {
      throw new Error(`Request failed : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log("Error in fetching : ", error);
    return null;
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
  if (!countries) {
    console.log(`Could not populate countries`);
    return;
  }
  displayCountries(countries);
  displayYears();
}
start();

let recentSearch = [];

async function getHolidays(country, year) {
  const loading = document.getElementById("loading");
  const table = document.querySelector("table");
  table.classList.add("hidden");
  loading.classList.remove("hidden");
  try {
    let response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`,
    );
    if (!response.ok) {
      throw new Error(`Response failed : ${response.status}`);
    }
    let holidayList = await response.json();
    await new Promise((resolve) => setTimeout(resolve, 500));

    return holidayList;
  } catch (error) {
    console.log("Error in fetching :", error);
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 500));
    loading.classList.add("hidden");
    table.classList.remove("hidden");
  }
}

async function searchAndRender(countryCode, year) {
  let holidays = await getHolidays(countryCode, year);
  if (!holidays) {
    console.log(`Could not fetch the data`);
    // return;
  }
    console.log(holidays);
    // holidays = []

  if ( holidays == undefined || holidays.length == 0 ) {
    const noholiday = document.getElementById("noholiday");
    noholiday.innerText =
      "No holidays found for the selected country and year.";
    const table = document.querySelector("table");
    table.classList.add("hidden");
  } else {
    const table = document.querySelector("table");
    table.classList.remove("hidden");
    const noholiday = document.getElementById("noholiday");
    noholiday.innerText = "";
    const tablehead = document.getElementById("tablehead");
    tablehead.innerHTML = "";
    const headRow = document.createElement("tr");
    headRow.innerHTML = `
                <th>"Holiday Name"</th>
                <th>"Date"</th>
                <th>"Local Name"</th>
                <th>"Country code"</th>
                <th>"Holiday Type"</th>
                <th>"Day of the week"</th>
    `;
    tablehead.appendChild(headRow);

    headRow.querySelectorAll("th").forEach((th) => {
      th.style.border = "1px solid black";
      th.style.padding = "8px";
      th.style.backgroundColor = "#ff9999";
    });

    const tableBody = document.getElementById("tablebody");
    tableBody.innerHTML = "";
    holidays.forEach((holiday) => {
      const row = document.createElement("tr");

      const day = new Date(holiday.date).toLocaleDateString("en-US", {
        weekday: "short",
      });
      row.innerHTML = `
            <td>${holiday.name}</td>
            <td>${holiday.date}</td>
            <td>${holiday.localName}</td>
            <td>${holiday.countryCode}</td>
            <td>${holiday.types[0]}</td>
            <td>${day}</td>
        `;
      row.querySelectorAll("td").forEach((td) => {
        td.style.border = "1px solid black";
        td.style.padding = "8px";
        td.style.textAlign = "center";
      });
      tableBody.appendChild(row);
    });
  }
}

async function renderHistoryPills(){
      let historypills = document.getElementById("historypills");
  historypills.innerHTML = "";

  recentSearch.forEach((historypill) => {
    const button = document.createElement("button");
    button.textContent = `${historypill.countryName} - ${historypill.year}`;
    button.classList =
      "m-1 p-2 border-2 border-pink-200 rounded-2xl text-center";

      button.addEventListener("click",async()=>{
        document.getElementById("country").value = historypill.countryCode
        document.getElementById("year").value = historypill.year 
        await searchAndRender(historypill.countryCode,historypill.year)
      })

    historypills.appendChild(button);
  });
}



const searchbtn = document.getElementById("searchbtn");

searchbtn.addEventListener("click", async () => {
  let currentCountry = document.getElementById("country").value;
  let currentYear = document.getElementById("year").value;
  const countrySelect = document.getElementById("country");
  const countryName = countrySelect.options[countrySelect.selectedIndex].text;
  //   console.log(countryName)
  //   console.log(currentCountry , currentYear)

  if (currentCountry == "" || currentYear == "") {
    alert("Select both country and year");
    return;
  } else {
    let found = recentSearch.find(
      (item) => item.countryCode == currentCountry && item.year == currentYear,
    );
    if (!found) {
      recentSearch.unshift({
        countryCode: currentCountry,
        countryName: countryName,
        year: currentYear,
      });
    }
  }
//   console.log(recentSearch);
renderHistoryPills()
await searchAndRender(currentCountry,currentYear)

});

const clearbtn = document.getElementById("clearbtn")
clearbtn.addEventListener("click",()=>{
    recentSearch = []
    renderHistoryPills()
})
