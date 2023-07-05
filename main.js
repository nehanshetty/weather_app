const apiKey ='b2a5a1d85aabfa63f464a70c2b81fe77';
const btn = document.getElementById("search");
const btn2 = document.getElementById("myLocation");
const time1 = document.getElementById("time");
const date1 = document.getElementById("date");
let sec1 = document.getElementById("section");
let currentloc = document.getElementById("currentLocation");
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const nores = document.getElementById("noResult");

btn.addEventListener("click", () => {
    let loc = document.getElementById("city").value;
    getweather(loc);
    document.getElementById('city').value='';
})

//get weather details
function getweather(loc){
        let temp = document.getElementById('temp');
        let icons=document.getElementById('img');
        let description=document.getElementById('desc');
        let body= document.getElementById('main');
        fetch('https://api.openweathermap.org/data/2.5/weather?q='+loc+'&appid='+ apiKey).
        then(response=>response.json()).
        then(data=>{
            console.log(data.list);
        let timezone = 3600;
        document.getElementById('noResult').classList.add('hidden');
        currentTime(loc);
        document.getElementById('noResult').classList.add('hidden');
        temp.innerHTML=(data.main.temp-273.15).toFixed(2)+'°C';
        let {icon}=data.weather[0];
        document.getElementById('currentLocation').classList.remove('hidden');
        currentloc.innerHTML=data.name;
        description.innerHTML=data.weather[0].description;
        body.classList.add("bg-[url('https://source.unsplash.com/random/?"+loc+"')]");
        document.querySelector("#wind").innerHTML=data.wind.speed;
        document.querySelector("#humidity").innerHTML=data.main.humidity;
        getForecast(loc);
        icons.src='http://openweathermap.org/img/wn/'+icon+'.png';
        document.querySelector('#sunrise').innerHTML=new Date((timezone+data.sys.sunrise)*1000).toUTCString();
        document.querySelector('#sunset').innerHTML=new Date((timezone+data.sys.sunset)*1000).toUTCString();
        document.getElementById('hero').classList.remove('hidden');
    }).catch((e)=>{
        nores.innerHTML="No match found for the search";
        document.getElementById('noResult').classList.remove('hidden');
        document.getElementById('hero').classList.add('hidden');
        sec1.innerHTML='';
        document.getElementById('currentLocation').classList.add('hidden');

     })
}


async function currentTime(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        const timestamp = data.dt;
        console.log(timestamp);
        const date = new Date(timestamp * 1000);
        console.log(date);
        // Extract the time from the Date object
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        console.log(time);
        time1.innerHTML = date.toUTCString().slice(17);
        date1.innerHTML = date.toUTCString().slice(0,16);
      } else {
        throw new Error(data.message);
      }
    }
     catch (error) {
       return null;
    }
  }

//to get 5 day weather forecast
function getForecast(loc){
    fetch('https://api.openweathermap.org/data/2.5/forecast?q='+loc+'&appid='+ apiKey).
    then(response=>response.json()).then(d=>
     {
        
       let date=new Date(d.list[0].dt_txt)
       let hours= (24-date.getHours())/3;
       console.log(d.list[hours]);
       sec1.innerHTML='';
       for(let i=0;i<5;i++, hours+=8)
       {
          let {icon}=d.list[hours].weather[0];
          source='http://openweathermap.org/img/wn/'+icon+'.png';
         sec1.innerHTML +=
         `<div class="lg:w-1/7 w-80 flex place-items-center mb-2 flex-col p-[2%] lg:mr-10 text-center rounded-lg hover:bg-slate-300 ease-in duration-300 hover:scale-110 font-bold  bg-gray-700">
         <p class="font-mono font-family: ui-monospace font-semibold text-center text-yellow-500 text-2xl">${d.list[hours].dt_txt.slice(0,10)}</p>
         <h2 class="text-gray-300 text-lg">${(d.list[hours].main.temp-273.15).toFixed(2)+'°C'}</h2>
         <h1 class="text-yellow-500 text-lg">${d.list[hours].weather[0].main}</h1>
         <img src ='${source}'>`
       }
     })
}

// to get the weather details of current location

btn2.addEventListener("click", () => {
    let long;
    let lat;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
        fetch(url)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            getweather(data.name);
          })
      });
    }
  });