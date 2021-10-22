let renderCurrentTime = () => {
	
	let now = new Date();
	let hour = now.getHours();
	let minutes = now.getMinutes();
	let seconds = now.getSeconds();
	
	//어느 경우에도 숫자가 두자리로 나오게 하기 위해서 삼항연산자 작성
	hour = hour < 10 ? "0"+hour:hour;
	minutes = minutes < 10 ? "0"+minutes:minutes;
	seconds = seconds < 10 ? "0"+seconds:seconds;	
	document.querySelector('.clock_text').innerHTML = `${hour} : ${minutes} : ${seconds}`;
}

let renderUser = e => {
	e.preventDefault(); //메서드에 있는 기본이벤트를 중지시켜주는 메서드
	let inpName = document.querySelector('.inp_name');
	let username = inpName.value;
	localStorage.setItem('username',username); //username이라는 key 값으로 사용자가 입력한 값 넣어서 저장해줌
	
	convertMainDiv(username); //convertMainDiv 함수에 username 넘겨주기
}

//로그인을 했을 경우 css를 변경시켜주기 위한 작업들
let convertMainDiv = username => {
	let inpName = document.querySelector('.inp_name');
	
	document.querySelector('.frm_name').className = 'frm_todo'; //frm_name form의 class이름을 변경시켜줌(css설정 변경을 위해)
	document.querySelector('.username').innerHTML = username; //username div의 내용을 입력한 값으로 변경시킴
	inpName.value = ''; //한번 값 입력 후 값을 비워주기 위해서
	inpName.placeholder = 'Enter your schedule'; //input의 placeholder 내용 변경시켜주기
	inpName.className = 'inp_todo'; //inp_name input의 class 이름을 변경시켜줌(css변경위해)
	
	document.querySelector('.todo-list').style.display ='flex'; //display:none으로 숨겨놓은 것을 flex로 바꿔서 나타나게 해줌
	document.querySelector('.main').style.justifyContent = 'space-between';
	document.querySelector('.wrap_user').className ='wrap_todo';
	
	document.querySelector('.frm_todo').removeEventListener('submit',renderUser);
	document.querySelector('.frm_todo').addEventListener('submit',registSchedule); //위에서 classname이 frm_todo로 변경되었으니까 '.frm_todo'를 넣음
	document.querySelector('#leftArrow').addEventListener('click', movePage); //왼쪽방향 화살표 클릭시 발생할 이벤트
	document.querySelector('#rightArrow').addEventListener('click', movePage); //오른쪽 화살표 클릭시 발생할 이벤트
}

let movePage = (event) => {
	let curPage = document.querySelector('.current-page').textContent; //현재 페이지 값 구해오기
	renderPage(Number(event.target.dataset.dir) + Number(curPage)); //html파일 화살표 아이콘들에 data-dir값을 넣어놈(event.target는 이벤트가 발생한 element(요소))
}

//사용자가 할 일을 추가했을 때 동작할 함수
let registSchedule = (e) => {
	e.preventDefault(); //디폴트 이벤트 중지(submit 발생하면 새로고침되도록 기본설정이 되어있어서 새로고침 막아주기 위한 것임)
	let todoList = localStorage.getItem('todo');  //-> setItem에서 todo라는 이름으로 넣어준 값을 가져옴
	//console.dir(todoList);
	let input = document.querySelector('.inp_todo').value; //input에서 입력한 값을 받아오기
	document.querySelector('.inp_todo').value = ''; //입력하고 엔터 칠 때마다 초기화시켜주기
	
	if(todoList){
		todoList = JSON.parse(todoList);
		let lastIdx = localStorage.getItem('lastIdx');
		
		lastIdx = Number(lastIdx) + 1; //데이터가 들어갈 때 마다 값이 1씩 증가하도록
		localStorage.setItem('lastIdx', lastIdx); //증가한 값으로 업데이트 되도록 setItem으로 다시 넣어줌
		todoList.unshift({work:input, idx:lastIdx}); //입력하는 값을 계속 배열 앞쪽에 넣어줌
	}else{ //todoList가 존재하지 않으면, 배열을 생성해서 넣어줌
		localStorage.setItem('lastIdx',0); //lastIdx라는 이름으로 0을 넣어줌(리스트 지울때 사용하기 위해서)
		todoList = [{work:input, idx:0}];
	}
	
	localStorage.setItem('todo',JSON.stringify(todoList)); //사용자가 다시 들어왔을 때도 추가해놨던 할 일을 봐야하니까 localStorage에 저장해놓기(todo라는 이름으로 저장)
	renderSchedule(todoList.slice(0,8));
}

let renderSchedule = (todoList) => {
	document.querySelectorAll('.todo-list>div').forEach(e => {e.remove()});
	
	//사용자가 입력한 TO Do List 값을 새로운 div에 넣어주기
	todoList.forEach(e =>{
		let workDiv = document.createElement('div');
		workDiv.innerHTML = e.work + '   <i class="far fa-trash-alt" data-idx="'+e.idx+'"></i>';
		document.querySelector('.todo-list').appendChild(workDiv); //todo-list div 밑에 workDiv 달아줌
	})
	
	//todo-list의 자식 div의 자식 i 태그에 이벤트 걸어줌(위에서 넣은 휴지통 아이콘)
	document.querySelectorAll('.todo-list>div>i').forEach(e => {
		e.addEventListener('click',removeSchedule)
	})
	
	document.querySelector('.current-page').textContent = 1;
	
	
	//To do List에 넣을 div 갯수 지정
	/*for(let i =0; i < 8; i++){
		let e = todoList[i];
		let workDiv = document.createElement('div');
		workDiv.innerHTML = e.work;
		document.querySelector('.todo-list').appendChild(workDiv);
	}*/
}

//개별 리스트 삭제하는 함수
let removeSchedule = event => {
	let todoList = JSON.parse(localStorage.getItem('todo'));
	
	//삭제한 이후에 새롭게 리스트 정렬하기 위해 사용하는 코드
	let curPage = document.querySelector('.current-page').textContent;
	let res = todoList.filter(e => event.target.dataset.idx != e.idx); //todoList에 들어있는 idx속성과 같지 않은 리스트들만 res에 담아줌
	
	localStorage.setItem('todo', JSON.stringify(res));
	renderPage(curPage);
}

/*//이전 페이지 가져오는 함수
let renderPrevPage = () => {
	let curPage = document.querySelector('.current-page').textContent; //현재 페이지 값 (console 찍어보면 textContent를 가지고 있는 것을 알수있음)
	let todoList = JSON.parse(localStorage.getItem('todo')); //renderSchedule에 넘겨줄 데이터 가져오기
	
	if(curPage < 2){
		alert("첫 페이지 입니다.")
		return;
	}
	//curPage 값이 2 이상 이면 밑의 코드들이 실행
	let renderPage = curPage - 1;
	let end= renderPage * 8; //to do list를 8개씩 나오게 하기 위한 코드?
	let begin = end - 8;
	
	renderSchedule(todoList.slice(begin,end));
	document.querySelector('.current-page').textContent = renderPage;
}

//다음페이지 가져오는 함수
let renderNextPage = () => {
	let curPage = document.querySelector('.current-page').textContent; //현재 페이지 값
	let todoList = JSON.parse(localStorage.getItem('todo'));
	let lastPage = Math.ceil(todoList.length/8); //마지막페이지 값, 반올림 처리
	
	if(curPage >= lastPage){
		alert("마지막 페이지 입니다.")
		return;
	}
	
	let renderPage = Number(curPage) + 1;
	let end= renderPage * 8;
	let begin = end - 8;
	
	renderSchedule(todoList.slice(begin,end));
	document.querySelector('.current-page').textContent = renderPage;
}*/

//위의 renderPrevPage()함수와 renderNextPage()함수를 간단하게 합친 코드임
let renderPage = (renderPage, cnt) => {
	if(!cnt) cnt = 8; //cnt값이 안넘어오면 cnt는 8로 지정
	
	let todoList = localStorage.getItem('todo');
	
	if(!todoList){//todoList가 없으면 돌려보내고, 있으면 밑에 코드 실행
		return;
	}
	
	todoList = JSON.parse(todoList);
	
	let lastPage = Math.ceil(todoList.length/8); //마지막페이지 값, 반올림 처리
	if(renderPage > lastPage) renderPage = lastPage;
	if(renderPage < 1) renderPage = 1;
	
	//let renderPage = Number(curPage) + 1;
	let end= renderPage * cnt;
	let begin = end - cnt;
	
	renderSchedule(todoList.slice(begin,end));
	document.querySelector('.current-page').textContent = renderPage; //현재 페이지 값을 renderPage로 변경해줌
}

//즉시 실행함수로 실행시켜줌
(()=> {
	let username = localStorage.getItem('username'); //localStorage에 저장했었던 username값을 받아오기
	let todoList = localStorage.getItem('todo');
	
	if(username){ //로그인이 되어있다면 실행(username이 존재한다면)
		convertMainDiv(username); 
	}else{ //로그인을 안했을 경우 실행(username이 존재하지 않을 경우)
		document.querySelector('.frm_name').addEventListener('submit',renderUser);
	}
	
	if(todoList){ //todoList가 존재한다면
		renderSchedule(JSON.parse(todoList).slice(0,8));
	}
	
	setInterval(renderCurrentTime,1000); //1초마다 브라우저에서 시간 바뀌도록
})();
