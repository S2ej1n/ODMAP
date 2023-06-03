var slideIndex = 0; //슬라이드 인덱스를 0으로 초기화

// HTML 로드가 끝난 후 동작하도록 window 어쩌구를 만들어줌.
window.onload=function(){
  showSlides(slideIndex); 
  //시작시 실행되는 함수이다.
  //슬라이드 인덱스가 0인 이미지 표시.

  //자동으로 넘어가는 함수. 3초마다 다음 슬라이드 표시
  var sec = 3000;
  setInterval(function(){
    slideIndex++;
    showSlides(slideIndex);
}, sec);
}

//슬라이드쇼 함수
function showSlides(n) {

    // 각 사진이 들어있는 div.mySlide를 불러온다.
  var slides = document.getElementsByClassName("mySlides");
  var size = slides.length;

  //만약 인덱스가 슬라이드 범위를 벗어난다면, 처음 또는 마지막 슬라이드 보여줌
  if ((n+1) > size) {
    slideIndex = 0; n = 0;
  }else if (n < 0) {
    slideIndex = (size-1);
    n = (size-1);
  }

  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }

  slides[n].style.display = "block";
  //css를 block으로 만듬. 혼자 한 줄 차지.
}