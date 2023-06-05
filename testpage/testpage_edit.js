//qna 골라줌
const qna = document.querySelector("#qna");
const result = document.querySelector("#result");

//질문이 8개이므로 끝나는 지점을 8로 맞춤.
const endPoint = 8;
const select = [];

function calResult(){
  //결과 계산할 배열 만들기
  var pointArray = [
    { name:'위험', value: 0, key: 0},
    { name:'경고', value: 0, key: 1},
    { name:'주의', value: 0, key: 2},
    { name:'관심', value: 0, key: 3}
  ]

  for (let i = 0; i < endPoint; i++){
    var target = qnaList[i].a[select[i]];
    for(let j = 0; j < target.type.length; j++){
      for(let k = 0; k < pointArray.length; k++){
        if (target.type[j] === pointArray[k].name){
          pointArray[k].value += 1;
        }
      }
    }
  }

  var resultArray = pointArray.sort(function (a,b){
    if (a.value > b.value){
      return -1;
    }
    if (a.value < b.value){
      return 1;
    }
    return 0;
  })

  let resultword = resultArray[0].key;
  
  return resultword;
}

function setResult(){
  let point = calResult(); //결과값 저장
  const resultName = document.querySelector('.resultname');
  resultName.innerHTML = infoList[point].name;

  //이미지태그만들기
  var resultImg = document.createElement('img');
  //이미지태그선택
  const imgDiv = document.querySelector('#resultImg');
  var imgURL = 'img/image-' + point + '.png';
  resultImg.src = imgURL;
  resultImg.alt = point; //공유하기 만들때 사용

  resultImg.classList.add('img-fluid');
  imgDiv.appendChild(resultImg);

  const resultDesc = document.querySelector('.resultDesc');
  resultDesc.innerHTML = infoList[point].desc;
}

function goResult(){

  qna.style.WebkitAnimation = "fadeOut 1s";
  qna.style.animation = "fadeOut 1s";
  setTimeout(() => {
    result.style.WebkitAnimation = "fadeIn 1s";
    result.style.animation = "fadeIn 1s";
    setTimeout(() => {
      qna.style.display = "none";
      result.style.display = "block"
    }, 450)})
    setResult();
}


//goNext안에 들어있는 함수
function addAnswer(answerText, qIdx, idx){
  //class 이름이 answerBox인 요소를 a에 할당.
  var a = document.querySelector('.answerBox');

  //answer를 버튼으로 만들어서 반환한다.
  var answer = document.createElement('button');

  //answer에 클래스 리스트에서 add로 answerList라는 이름의 클래스 값을 넣어줌.
  //answer 요소의 클래스 리스트에 answerList라는 클래스 값을 추가
  /*classList는 DOM 요소의 클래스를 조작하는 데 사용되는 속성. 
    add() 메서드를 사용하여 클래스 값을 추가할 수 있습니다. */
  /*childeren이라는 변수에 버튼 세개를 다 담으려고 함.
    그런데, 이 버튼마다 id값이 없으므로 쿼리 셀렉터에 담으려고 하는데, 
    이를 위해서 answerList라는 클래스를 만든거에요 */
  /*answer 요소의 클래스 리스트에 answerList라는 클래스 값을 추가. 
  해당 버튼에 answerList 클래스를 할당하는 역할. 
  이를 통해 스타일링이나 JavaScript 이벤트 핸들러 등에서 해당 클래스를 활용할 수 있음. */
  answer.classList.add('answerList');

  //클래스 리스트의 마진값 (버튼들의)
  answer.classList.add('my-3');
  //패딩값
  answer.classList.add('py-3');

  //가운데정렬
  answer.classList.add('mx-auto');

  //버튼이 추가되었을때
  answer.classList.add('fadeIn');

  //answer라는 버튼이 a에 소속될 수 있도록 관계 만들어줌
  //<div> <button/> </div> 이렇게됨.
  a.appendChild(answer);

  //answer버튼의 내부 HTML을 answer Text로 설정한다. (버튼에 답변 내용이 표시된다.)
  answer.innerHTML = answerText;

  //다음 질문으로 넘어가기 ()
  answer.addEventListener("click", function(){

    //childeren이라는 변수에 버튼 세개를 다 담으려고 함.
    //id값이 없으므로 쿼리 셀렉터에 담으려고 하는데, 이를 위해서 answerList를 만듬 (위에서)
    var children = document.querySelectorAll('.answerList'); 
    //클래스 이름으로 answerList를 선택하면 버튼 세개 모두 선택
    for(let i = 0; i < children.length; i++){
      children[i].disabled = true; //버튼 비활성화 되도록 만듬

      //animation.css에 지정되어있음.
      children[i].style.WebkitAnimation = "fadeOut 0.5s";
      children[i].style.animation = "fadeOut 0.5s";
    }

    //애니메이션 넣었을 경우 버튼이 바로 사라지면 안되니까 setTimeOut
    setTimeout(() => {
      select[qIdx] = idx;

      for(let i = 0; i < children.length; i++){
        children[i].style.display = 'none'; //한 버튼만 클릭해도 모든 버튼 숨겨짐
      }

      goNext(++qIdx); //그 다음 goNext의 값을 하나 증가해서 호출한다.
    },450)
  }, false);
}



//시작 인덱스를 0으로
let qIdx = 0;
//함수 호출하여 테스트를 시작함
goNext(qIdx);

//다음으로 넘어가는 함수
function goNext(qIdx){

  //마지막 질문이 끝난다면
  if(qIdx === endPoint){
    goResult(); //결과 출력
    return;
  }

  //큐박스
  var q = document.querySelector('.qBox');
  q.innerHTML = qnaList[qIdx].q;

  //i라는 인덱스 값의 a를 돌도록 함.
  for(let i in qnaList[qIdx].a){
    //이 안에(버튼) a의 answer의 값을 넣어줌.
    addAnswer(qnaList[qIdx].a[i].answer, qIdx, i);
  }
  var status = document.querySelector('.statusBar');
  status.style.width = (100/endPoint) * (qIdx+1) + '%';
}