const toggleContainer = document.getElementById("toggleContainer");
const toggleContainer_cancelBtn = document.querySelector(
  "#toggleContainer_cancelBtn"
);
const $toggleContainer_main = document.querySelector("#toggleContainer_main");
const $search_result_list = document.querySelector("#search_result_list");
const $searchInput = document.querySelector("#searchInput");
const $searchButton = document.querySelector("#searchButton");

const url =
  "https://api.odcloud.kr/api/3044320/v1/uddi:8c80987c-e5df-48ef-9201-aeb593696303?page=1&perPage=10&serviceKey=WdJ2KEvii666p0gJgsf5QjVSJ%2Bpx6rnEhkG5CM%2B3l3F%2BOfkB%2FqWCDwvOGls9CEtqdAw0ikGnEAyYN8pGu47LGA%3D%3D";

let hospital_notice_list = [];
let addresses;

fetch(url)
  .then((res) => res.json())
  .then((response) => {
    console.log(response);
    hospital_notice_list = response.data;
    addresses = hospital_notice_list.map((item) => item.소재지);
    convertAddressesToCoordinates(0);
    // Kakao Maps API 스크립트 로드 확인
  });

// 주소를 좌표로 변환하는 함수
function convertAddressesToCoordinates(startIndex) {
  const geocoder = new kakao.maps.services.Geocoder();
  const batchSize = 100;
  const endIndex = Math.min(
    startIndex + batchSize,
    hospital_notice_list.length
  );

  for (let i = startIndex; i < endIndex; i++) {
    setTimeout(() => {
      geocoder.addressSearch(
        hospital_notice_list[i].소재지,
        function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            createMarker(coords, hospital_notice_list[i]);
          }
        }
      );
    }, i * 100); // 100ms 간격으로 호출
  }

  if (endIndex < hospital_notice_list.length) {
    // 변환할 주소가 남아있으면 다음 일부분 변환 호출 예약
    setTimeout(() => {
      convertAddressesToCoordinates(endIndex);
    }, endIndex * 100);
  }
}
// 좌표를 기반으로 마커를 생성하는 함수
function createMarker(coords, hospital_notice) {
  const marker = new kakao.maps.Marker({
    position: coords,
    map: map,
  });

  kakao.maps.event.addListener(marker, "click", function () {
    openToggleContainer(hospital_notice);
  });
}

function makeHospitalInfo(hospital_notice) {
  console.log(hospital_notice)
  $toggleContainer_main.innerHTML = `
  <div class="name_info">
    <h3>${hospital_notice.의료기관명}</h3>
    <span>종합병원</span>
  </div>
  <div class="content_info">
    <p>${hospital_notice.소재지}</p>
    <p>우편번호 : ${hospital_notice.우편번호}</p>
    <p>연락처 : ${hospital_notice.연락처}</P>
  </div>
  `
}

function openToggleContainer(hospital_notice) {
  // 토글 창 내용 설정 (여기서는 좌표 정보를 표시)
  makeHospitalInfo(hospital_notice);
  // 토글 창 열기
  toggleContainer.style.display = "block";
}


var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.5642135, 127.0016985), // 지도의 중심좌표
    level: 5, // 지도의 확대 레벨
    mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
  };

// 지도를 생성한다
var map = new kakao.maps.Map(mapContainer, mapOption);
// 주소-좌표 변환 객체 생성

toggleContainer_cancelBtn.addEventListener("click", () => {
  toggleContainer.style.display = "none";
});

function makeSearchResult(find_list) {
  const find_div = document.createElement("li");
  find_div.className = "search_result"
  find_div.innerText = find_list.의료기관명;
  find_div.addEventListener("click", () => {
    $searchInput.value = find_list.의료기관명;
    $search_result_list.innerHTML = "";
  })
  $search_result_list.append(find_div);
}

function findHospital(btnClicked, searchValue) {
  console.log(btnClicked);
  if (!searchValue) {
    $search_result_list.innerHTML = "";
    return;
  }
  $search_result_list.innerHTML = "";
  let find_list = []
  let find = false
  for (let i = 0; i < hospital_notice_list.length; i++) {
    if (hospital_notice_list[i].의료기관명.includes(searchValue)) {
      find_list.push(hospital_notice_list[i]);
      find = true;
    }
  }
  if (find) {
    for (let i = 0; i < find_list.length; i++) {
      makeSearchResult(find_list[i]);
      find = true;
    }
  }
  else {
    const find_div = document.createElement("li");
    find_div.className = "search_result"
    find_div.innerText = "검색 결과가 없습니다.";
    $search_result_list.append(find_div);
  }
  if (btnClicked && find) {
    openToggleContainer(find_list[0]);
  }
}

function onClickSearchBtn(searchValue) {
  let btnClicked = true;
  findHospital(btnClicked, searchValue);
  $searchInput.value = "";
  $search_result_list.innerHTML = "";
}

function onHandleSearchInput(searchValue) {
  let btnClicked = false;
  findHospital(btnClicked, searchValue);
}

$searchInput.addEventListener('input', () => onHandleSearchInput($searchInput.value));
$searchButton.addEventListener("click", () => onClickSearchBtn($searchInput.value));
