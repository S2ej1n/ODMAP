//value값에 따라 다른 데이터를 불러오는 js함수 구현
// URL 쿼리 파라미터에서 jsfile 값을 가져옴
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var jsFile = urlParams.get('jsfile');

// jsFile 값이 유효하면 동적으로 JavaScript 파일을 연결
if (jsFile) {
  var script = document.createElement('script');
  script.src = jsFile;
  document.head.appendChild(script);
}