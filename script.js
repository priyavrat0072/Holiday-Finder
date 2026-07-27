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

async function getHolidays(country , year){
    try {
        let response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`)
        if(!response.ok){
            throw new Error(`Response failed : ${response.status}`)
        }
        let holidayList = await response.json()
        return holidayList
    } catch (error) {
        console.log('Error in fetching :',error)
    }
    
}

const searchbtn = document.getElementById('searchbtn')

searchbtn.addEventListener("click",async()=>{
    let currentCountry = document.getElementById("country").value
    let currentYear = document.getElementById("year").value
    // console.log(currentCountry , currentYear)
    if(currentCountry == ""  || currentYear == ""){
        alert("Select both country and year")
    }
    
    let holidays =await getHolidays(currentCountry , currentYear)
    if(!holidays){
        console.log(`Could not fetch the data`)
        return
    }
    console.log(holidays)

    const tableBody = document.getElementById("tablebody")
    tableBody.innerHTML = ""
    holidays.forEach((holiday)=>{
        const row = document.createElement("tr");
        
        const day = new Date(holiday.date).toLocaleDateString("en-US",{weekday:"short"})
        row.innerHTML = `
            <td>${holiday.name}</td>
            <td>${holiday.date}</td>
            <td>${holiday.localName}</td>
            <td>${holiday.countryCode}</td>
            <td>${holiday.types[0]}</td>
            <td>${day}</td>
        `;
        row.querySelectorAll("td").forEach(td => {
        td.style.border = "1px solid black";
        td.style.padding = "8px";
});
        tableBody.appendChild(row)
    })


})


