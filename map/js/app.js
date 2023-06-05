import { addDoc, collection, dbService, onSnapshot, query, orderBy, deleteDoc, doc } from '../../fbase.js';

const mapContainer = document.getElementById("map"); // 지도를 표시할 div
const mapOption = {
  center: new kakao.maps.LatLng(37.5642135, 127.0016985), // 지도의 중심좌표
  level: 5, // 지도의 확대 레벨
  mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
};

const $toggleContainer = document.querySelector("#toggleContainer");
const $toggleContainer_toggleBtn = document.querySelector("#toggleContainer_toggleBtn");
const $toggleContainer_main = document.querySelector("#toggleContainer_main");

const $myLocation_btn = document.querySelector("#myLocation_btn");
const $search_result_list = document.querySelector("#search_result_list");
const $searchInput = document.querySelector("#searchInput");
const $searchButton = document.querySelector("#searchButton");

const url =
  "https://api.odcloud.kr/api/3044320/v1/uddi:8c80987c-e5df-48ef-9201-aeb593696303?page=1&perPage=50&serviceKey=WdJ2KEvii666p0gJgsf5QjVSJ%2Bpx6rnEhkG5CM%2B3l3F%2BOfkB%2FqWCDwvOGls9CEtqdAw0ikGnEAyYN8pGu47LGA%3D%3D";

let hospital_notice_list = [];
let find_list = []; // 검색 결과에 대한 리스트

// 사용자의 위치 정보에 접근하여 현재 위치를 가져오는 함수
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function setNewCenter(latitude, longitude) {
  const newCenter = new kakao.maps.LatLng(latitude, longitude);
  mapOption.center = newCenter;

  map.panTo(newCenter);
}

// 위치 정보를 성공적으로 가져왔을 때 실행되는 콜백 함수
function successCallback(position) {
  const latitude = position.coords.latitude; //위도
  const longitude = position.coords.longitude; //경도

  setNewCenter(latitude, longitude);
}
function errorCallback(error) {
  console.log("Error occurred while retrieving location.", error);
}

// getCurrentLocation();

fetch(url)
  .then((res) => res.json())
  .then((response) => {
    console.log(response);
    hospital_notice_list = response.data;
    convertAddressesToCoordinates(0);
    // Kakao Maps API 스크립트 로드 확인
  });

// 주소를 좌표로 변환하는 함수
function convertAddressesToCoordinates(startIndex) {
  const geocoder = new kakao.maps.services.Geocoder();
  const batchSize = 1000;
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
            hospital_notice_list[i].좌표 = coords;
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
    makeToggleContent(hospital_notice, coords);
  });
}

function makeHospitalInfo(hospital_notice) {
  const hospital_info_container = document.createElement("div");
  hospital_info_container.setAttribute("class", "hospital_info_container");
  const hospital_info = document.createElement("div");
  hospital_info.setAttribute("class", "hospital_info");
  const hospital_name = document.createElement("h3");
  const hospital_category = document.createElement("span");

  hospital_name.innerText = hospital_notice.의료기관명;
  hospital_name.addEventListener("click", () => setNewCenter(hospital_notice.좌표.Ma, hospital_notice.좌표.La))
  hospital_category.innerText = "종합병원";
  hospital_info.append(hospital_name);
  hospital_info.append(hospital_category);

  const hospital_info_detail = document.createElement("div");
  hospital_info_detail.setAttribute("class", "hospital_info_detail");
  const hospital_address = document.createElement("p");
  const hospital_postalcode = document.createElement("p");
  const hospital_contactnum = document.createElement("P");

  hospital_address.innerText = hospital_notice.소재지;
  hospital_postalcode.innerText = "우편번호 : " + hospital_notice.우편번호;
  hospital_contactnum.innerText = "연락처 : " + hospital_notice.연락처;
  hospital_info_detail.append(hospital_address);
  hospital_info_detail.append(hospital_postalcode);
  hospital_info_detail.append(hospital_contactnum);

  hospital_info_container.append(hospital_info);
  hospital_info_container.append(hospital_info_detail);
  $toggleContainer_main.append(hospital_info_container);
  // $toggleContainer_main.innerHTML = `
  // <div class="name_info">
  //   <h3>${hospital_notice.의료기관명}</h3>
  //   <span>종합병원</span>
  // </div>
  // <div class="content_info">
  //   <p>${hospital_notice.소재지}</p>
  //   <p>우편번호 : ${hospital_notice.우편번호}</p>
  //   <p>연락처 : ${hospital_notice.연락처}</P>
  // </div>
  // `
}

async function onAddReview(hospital_notice) {
  const $review_context_area = document.querySelector("#review_context_area");
  console.log($review_context_area.value);
  const docRef = await addDoc(collection(dbService, hospital_notice.의료기관명), {
    context: $review_context_area.value,
    createdAt: Date.now(),
  });
  console.log(docRef);

}

function closeReviewFormContainer() {
  const a = document.querySelector(".reviewForm");
  a.remove();
}

function onClickReviewAddBtn(hospital_notice) {
  const $review_context_area = document.querySelector("#review_context_area");
  if (!$review_context_area) {
    return;
  }
  else {
    onAddReview(hospital_notice);
    closeReviewFormContainer();
  }
}

function makeReviewForm(hospital_notice) {
  const reviewForm_container = document.createElement("div");
  reviewForm_container.setAttribute("class", "reviewForm");
  reviewForm_container.innerHTML = `
    <h3>리뷰 작성</h3>
    <textarea id="review_context_area" column="3"></textarea>
    <button id="review_add_btn">리뷰 등록</button>
  `
  $toggleContainer_main.insertBefore(reviewForm_container, $toggleContainer_main.children[2]);
  document.querySelector("#review_add_btn").addEventListener("click", () => onClickReviewAddBtn(hospital_notice));
}

function onHandleWriteReviewBtn(write_review, hospital_notice) {
  if (write_review.innerText === "리뷰 쓰기") {
    write_review.innerText = "작성취소";
    makeReviewForm(hospital_notice);
  }
  else {
    write_review.innerText = "리뷰 쓰기";
    closeReviewFormContainer();
  }

}

function makeReviewContainer(hospital_notice) {
  const review_container = document.createElement("div");
  review_container.setAttribute('class', 'review_container');
  const rate_info = document.createElement("div");
  rate_info.setAttribute("class", "rate_info");
  const total_rate_num = document.createElement("span");
  const total_rate_star = document.createElement("div");
  const write_review = document.createElement("span");
  total_rate_num.innerText = "4.0";
  total_rate_star.innerText = "★ ★ ★ ★ ★";
  write_review.innerText = "리뷰 쓰기";
  write_review.addEventListener("click", () =>
    onHandleWriteReviewBtn(write_review, hospital_notice));
  rate_info.append(total_rate_num);
  rate_info.append(total_rate_star);
  review_container.append(rate_info);
  review_container.append(write_review);
  $toggleContainer_main.append(review_container);

}

function getReviewFromFirestore(hospital_name) {
  return new Promise((resolve, reject) => {
    const q = query(collection(dbService, hospital_name), orderBy("createdAt"));
    onSnapshot(q, (snapshot) => {
      const reviewsArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      resolve(reviewsArr);
    }, (error) => {
      reject(error);
    });
  });
}

async function onClickReviewDeleteBtn(reviewArr, hospital_name) {
  console.log(reviewArr, hospital_name);
  const ok = confirm("정말 삭제 하시겠습니까 ? ");
  if (ok) {
    const reviewRef = doc(dbService, hospital_name, reviewArr.id);
    await deleteDoc(reviewRef);
  }
  else {
    return;
  }
}

function onClickReviewUpdateBtn() {
  return;
}
function makeReview(review_list_container, reviewsArr, hospital_name) {
  if (reviewsArr.length !== 0) {
    for (let i = 0; i < reviewsArr.length; i++) {
      const review_container = document.createElement("div");
      review_container.setAttribute("class", "review");
      const review_context = document.createElement("p");
      review_context.innerText = reviewsArr[i].context;
      review_container.append(review_context);

      const review_tool_btns = document.createElement("div");
      review_tool_btns.setAttribute("class", "review_tool_btns");
      const review_update_btn = document.createElement("button");
      const review_delete_btn = document.createElement("button");
      review_update_btn.innerText = "수정";
      review_delete_btn.innerText = "삭제";
      review_update_btn.addEventListener("click", onClickReviewUpdateBtn);
      review_delete_btn.addEventListener("click", () => onClickReviewDeleteBtn(reviewsArr[i], hospital_name));
      review_tool_btns.append(review_update_btn);
      review_tool_btns.append(review_delete_btn);
      review_container.append(review_tool_btns);
      review_list_container.append(review_container);
    }
  }
  else {
    const noReview = document.createElement("div");
    noReview.setAttribute("class", "noReview");
    noReview.innerText = "해당 병원의 리뷰가 없습니다.";
    review_list_container.append(noReview);
  }

}
function makeReviewList(hospital_name) {
  const review_list_container = document.createElement("div");
  review_list_container.setAttribute("class", "review_list_container");

  getReviewFromFirestore(hospital_name).then((reviewsArr) => {
    makeReview(review_list_container, reviewsArr, hospital_name);
  }).catch((error) => {
    console.log(error);
  })
  $toggleContainer_main.append(review_list_container);
}

function makeToggleContent(hospital_notice, coords) {
  const latitude = coords.Ma; //위도
  const longitude = coords.La; //경도
  setNewCenter(latitude, longitude);

  $toggleContainer_main.innerHTML = "";
  // 토글 창 내용 설정
  makeHospitalInfo(hospital_notice);
  makeReviewContainer(hospital_notice);
  makeReviewList(hospital_notice.의료기관명);
  openToggleContainer();
  // 토글 창 열기
}

// 지도를 생성한다
var map = new kakao.maps.Map(mapContainer, mapOption);
// 주소-좌표 변환 객체 생성

function makeSearchResult() {
  for (let i = 0; i < find_list.length; i++) {
    const find_div = document.createElement("li");
    find_div.className = "search_result"
    find_div.innerText = find_list[i].의료기관명;
    find_div.addEventListener("click", () => {
      $searchInput.value = find_list[i].의료기관명;
      $search_result_list.innerHTML = "";
      const tmp = [];
      tmp.push(find_list[i]);
      find_list = [];
      find_list.push(tmp[0]);
    })
    $search_result_list.append(find_div);
  }

}

function findHospital(btnClicked, searchValue) {
  if (btnClicked && find_list) {
    $toggleContainer_main.innerHTML = '';
    for (let i = 0; i < find_list.length; i++) {
      makeHospitalInfo(find_list[i]);
    }
    openToggleContainer();
    find_list = [];
    return;
  }
  if (!searchValue) {
    $search_result_list.innerHTML = "";
    return;
  }
  $search_result_list.innerHTML = "";
  find_list = [];
  let find = false;
  for (let i = 0; i < hospital_notice_list.length; i++) {
    if (hospital_notice_list[i].의료기관명.includes(searchValue)) {
      find_list.push(hospital_notice_list[i]);
      find = true;
    }
  }
  if (find) {
    makeSearchResult();
    find = true;
  }
  else {
    const find_div = document.createElement("li");
    find_div.className = "search_result"
    find_div.innerText = "검색 결과가 없습니다.";
    $search_result_list.append(find_div);
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

function openToggleContainer() {
  $toggleContainer_main.style.display = "block"
  $toggleContainer_toggleBtn.style.left = `${$toggleContainer.clientWidth - 1}px`;
  $toggleContainer_toggleBtn.innerHTML = `
  <i class="fa-solid fa-angle-left"></i>`;
}

function handleToggleContainer() {
  if ($toggleContainer_main.style.display === "none") {
    openToggleContainer();
  }
  else {
    $toggleContainer_main.style.display = "none"
    $toggleContainer_toggleBtn.style.left = "0";
    $toggleContainer_toggleBtn.innerHTML = `
    <i class="fa-solid fa-angle-right"></i>
    `;
  }
}

$searchInput.addEventListener('input', () => onHandleSearchInput($searchInput.value));
$searchButton.addEventListener("click", () => onClickSearchBtn($searchInput.value));
$myLocation_btn.addEventListener("click", getCurrentLocation);
$toggleContainer_toggleBtn.addEventListener('click', handleToggleContainer);