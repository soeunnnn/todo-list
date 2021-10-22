/**
 * 
 */

//배경사진 가져오는 코드
//async 함수는 Promise를 반환함, then()을 붙일 필요 없이 그냥 await으로 함수를 불러오면 된다.
let getBackgroundImage = async () => {
	
	let prevBackground = JSON.parse(localStorage.getItem('bg-log')); //parse 메소드는 string객체를 json객체로 변환시켜준다.

	//이전 내역이 존재하고, 이전내역의 날짜가 현재시간 이후라면, 원래 있던 이미지 그대로 출력
	if(prevBackground && (prevBackground.expiresOn > Date.now())){
		return prevBackground.imgInfo;
	}
	
	let imgObject = await requestBackground();
	insertBackgroundLog(imgObject);
	return imgObject;
};

let requestBackground = async () => {
	
	let params = {
		orientation:'landscape',
		query:'landscape'
	}
	
	let queryString = createQueryString(params);
	let response = await fetch('https://api.unsplash.com/photos/random?'+ queryString,{
						method:'get',
						headers:{Authorization:'Client-ID 2Mt4HNgC1-el6CCADAqWNCXE3VMY-14ZSAYLYRMRiO8'}  //fetch 작성 방식은 가져올 API 확인?
					});
					
	let obj = await response.json();
	
	return {
		img: obj.urls.full,
		place: obj.location.title
	}
}

let insertBackgroundLog = (imgObject) => {
	
	let expirationDate = new Date();
	expirationDate = expirationDate.setDate(expirationDate.getDate() + 1);
	
	const backgroundLog = {
		expiresOn : expirationDate,
		imgInfo : imgObject
	}
	
	//데이터를 서버에 전송할 때는 문자열 형태로 전송해야 하기 때문에 stringify 사용
	localStorage.setItem('bg-log',JSON.stringify(backgroundLog)); //stringify 메소드는 json 객체를 String 객체로 변환시켜 준다.
}


//현재 위치 가져오는 함수
let getCoords = () => {
	
	if(!navigator.geolocation){
		return new Promise((resolve,reject)=>{
			reject();
		});
	}else{
		return new Promise((resolve, reject)=>{
			navigator.geolocation.getCurrentPosition((position)=>{
				resolve(position.coords);
			});
		})
	}
}

//날씨정보를 가져오는 함수
let getLocationTemp = async () => {
		const OPENWHEATHER_API_KEY = '8a60c2755f004c7d3edee68e1ccd80bb'; //OpenWeartherMap 사이트의 내 API 값
		let coords = await getCoords(); //현재 위치를 받아오기 위해 호출
		
		let params = {
				lat:coords.latitude,
				lon:coords.longitude,
				appid:OPENWHEATHER_API_KEY,
				units:'metric',
				lang:'kr'
		};
		
		let queryString = createQueryString(params); //createQueryString 함수는 webUtil.js 파일에 있음
		let url = `https://api.openweathermap.org/data/2.5/weather?${queryString}`;		
		
		let response = await fetch(url);  //fetch함수는 HTTP response 객체를 래핑한 Promise 객체를 반환한다. (url주소로 요청을 보냄)
		let obj = await response.json(); //요청을 보낸 뒤 오는 응답에 대해 json()처리 (대부분의 REST API들은 JSON 형태의 데이터를 응답하기 때문에)
		
		//console.dir(obj);  //뭐가 담기는지 확인용
		return {
			temp: obj.main.temp,
			place: obj.name
		}
}


//즉시 실행함수
(async () =>{
	
	/* 배경이미지와 이미지의 위치정보 랜더링 */
	let background = await getBackgroundImage();
	document.querySelector('body').style.backgroundImage = `url(${background.img})`;
	
	if(background.place){//이미지에 장소가 들어있을 경우에는 그 장소가 출력
		document.querySelector('.footer_text').innerHTML = background.place;
	}
	
	/* 지역과 기온 랜더링 */
	let locationTemp = await getLocationTemp();
	document.querySelector('.location_text').innerHTML = locationTemp.temp + 'º @ ' + locationTemp.place;

})();