const form = document.querySelector('.top-banner form');
const input = document.querySelector('div.container input');
const msg = document.querySelector('span.msg');
const cityList = document.querySelector('.ajax-section .cities');

localStorage.setItem('apiKey', EncryptStringAES('18900ba341544f10d83f1c8555905924'));

form.addEventListener('submit', e =>{
    e.preventDefault();
    getWeatherDataFromApi();

});


// ?q=London&appid=18900ba341544f10d83f1c8555905924&units=metric&lang=de

const getWeatherDataFromApi = async () => {
    let apiKey = DecryptStringAES(localStorage.getItem('apiKey'));
    let inputVal = input.value;
    let units = 'metric';
    let lang = 'en';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=${units}&lang=${lang}`;

    try {
        const response = await axios(url);
        const {main, name, sys, weather} = response.data;
        const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

        let cityCardList = cityList.querySelectorAll('.city');
        let cityCardListArray = Array.from(cityCardList);
        if(cityCardListArray.length > 0){
            const filteredArray = cityCardListArray.filter(card => card.querySelector('.city-name span').innerHTML == name);
            if(filteredArray.length > 0){
                msg.innerHTML = `You already know the weather for ${name}, Please search for another city 😉`;
                setTimeout(()=>{
                    msg.innerText = '';
                }, 5000);
                form.reset();
                input.focus();
                return;
            }
        }

        let createdCityCard = document.createElement('li');
        createdCityCard.classList.add('city');
        createdCityCard.innerHTML = `
        <h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
        </figure>`;

        setTimeout(()=>{
            msg.innerText = '';
        }, 5000);

        cityList.prepend(createdCityCard);

        form.reset();
        input.focus();
        
    } catch (error) {
        msg.innerText = error;
        setTimeout(()=>{
            msg.innerText = '';
        }, 5000);
    }
}