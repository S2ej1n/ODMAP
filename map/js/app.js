import { dbService } from "./fbase.js";

const toggleContainer = document.getElementById("toggleContainer");
const toggleContainer_cancelBtn = document.querySelector(
  "#toggleContainer_cancelBtn"
);
const toggleContainer_main = document.querySelector("#toggleContainer_main");

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
    openToggleContainer(coords, hospital_notice);
  });
}

function openToggleContainer(coords, hospital_notice) {
  // 토글 창 내용 설정 (여기서는 좌표 정보를 표시)
  toggleContainer_main.innerHTML = `주소:${hospital_notice.소재지}<br/>
                                    병원명:${hospital_notice.의료기관명}<br/>
                                    우편번호:${hospital_notice.우편번호}<br/>
                                    연락처:${hospital_notice.연락처}`;

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
