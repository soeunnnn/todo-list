/**
 * 
 */
let createPopup = (popInfo) => {
	let positionX = screen.width/2 - (popInfo.width/2); 
	let positionY = screen.height/2 - (popInfo.height/2);
	let popup = open(popInfo.url, popInfo.name, `width=${popInfo.width}, height=${popInfo.height}, left=${positionX}, top=${positionY}`);
		
	return popup;
}
	


//쿼리문으로 만들어주는 함수
let createQueryString = (params) => {
	let arr = [];
	for(key in params){ //key라는 변수에 params의 값들을 넣어줌  
		arr.push(key + '=' + params[key]);
	}
		
	return arr.join('&');
		
}