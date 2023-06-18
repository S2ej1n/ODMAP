import {
  addDoc,
  collection,
  dbService,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "../../fbase.js";
import { userId, userName } from "../../main.js";
import { options_detail, options } from './data.js';

const mapContainer = document.getElementById("map"); // 지도를 표시할 div
const mapOption = {
  center: new kakao.maps.LatLng(37.5642135, 127.0016985), // 지도의 중심좌표
  level: 5, // 지도의 확대 레벨
  mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
};

const map = new kakao.maps.Map(mapContainer, mapOption);
const clusterer = new kakao.maps.MarkerClusterer({
  map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
  averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
  minLevel: 5, // 클러스터 할 최소 지도 레벨
});

const filterOptions = [];
const filterOptions_detail = [];

const $hospital_type_container = document.querySelector(
  "#hospital_type_container"
);
const $hospital_type_detail_container = document.querySelector("#hospital_type_detail_container");
const $toggle_option_btn = document.querySelector("#toggleOption");
const $options = document.querySelector("#options");
const $option_update_btn = document.querySelector("#optionUpdateBtn");

const $toggleContainer = document.querySelector("#toggleContainer");
const $toggleContainer_toggleBtn = document.querySelector(
  "#toggleContainer_toggleBtn"
);
const $toggleContainer_main = document.querySelector("#toggleContainer_main");
const $myLocation_btn = document.querySelector("#myLocation_btn");
const $search_result_list = document.querySelector("#search_result_list");
const $searchInput = document.querySelector("#searchInput");
const $searchButton = document.querySelector("#searchButton");

// const url ="https://api.odcloud.kr/api/3044320/v1/uddi:8c80987c-e5df-48ef-9201-aeb593696303?page=1&perPage=50&serviceKey=WdJ2KEvii666p0gJgsf5QjVSJ%2Bpx6rnEhkG5CM%2B3l3F%2BOfkB%2FqWCDwvOGls9CEtqdAw0ikGnEAyYN8pGu47LGA%3D%3D";

const hospital_notice_list = []; // 병원 정보 전체 배열
const find_list = []; // 검색 결과에 대한 배열
const markers = []; // 마커를 담을 배열

fetch("./myArray.json")
  .then((response) => response.json())
  .then((data) => {
    // 데이터를 성공적으로 받아온 경우 처리할 로직을 여기에 작성합니다.
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      const hospital_notice = data[i];
      hospital_notice_list.push(hospital_notice);

      const marker = createMarker(hospital_notice);
      // const customOverlay = createCustomOverlay(hospital_notice);
      markers.push(marker);
      // customOverlays.push(customOverlay);
    }
    clusterer.addMarkers(markers);
  })
  .catch((error) => {
    // 오류 처리
    console.error("파일 가져오기 오류:", error);
  });

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
  map.setLevel(3);
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

function createCustomOverlay(hospital_notice) {
  const content = `
    <div class="customoverlay">
      <div class="hospital_info">
        <h3>${hospital_notice.요양기관명}</h3>
        <span>${hospital_notice.종별코드명}</span>
      </div>
      <div class="hospital_info_detail">
        <p>${hospital_notice.주소}</p>
        <p>${hospital_notice.진료과목코드명}</p>
      </div>
    </div>
  `;

  // 커스텀 오버레이가 표시될 위치입니다
  const position = new kakao.maps.LatLng(
    hospital_notice["좌표(Y)"],
    hospital_notice["좌표(X)"]
  );

  // 커스텀 오버레이를 생성합니다
  const customOverlay = new kakao.maps.CustomOverlay({
    map: map,
    position: position,
    content: content,
    yAnchor: 2,
  });

  return customOverlay;
}

// 좌표를 기반으로 마커를 생성하는 함수
function createMarker(hospital_notice) {
  const marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(
      hospital_notice["좌표(Y)"],
      hospital_notice["좌표(X)"]
    ),
    title: hospital_notice.요양기관명,
    // map: map,
  });
  let customOverlay;
  kakao.maps.event.addListener(marker, "click", function () {
    console.log(hospital_notice.진료과목코드명);
    makeToggleContent(hospital_notice);
  });
  kakao.maps.event.addListener(marker, "mouseover", function () {
    customOverlay = createCustomOverlay(hospital_notice);
  });
  kakao.maps.event.addListener(marker, "mouseout", function () {
    customOverlay.setMap(null);
  });
  return marker;
}

function makeHospitalInfo(hospital_notice) {
  const hospital_info_container = document.createElement("div");
  hospital_info_container.setAttribute("class", "hospital_info_container");
  const hospital_info = document.createElement("div");
  hospital_info.setAttribute("class", "hospital_info");
  const hospital_name = document.createElement("h3");
  const hospital_category = document.createElement("span");

  hospital_name.innerText = hospital_notice.요양기관명;
  hospital_name.addEventListener(
    "click",
    () => makeToggleContent(hospital_notice)
    // setNewCenter(hospital_notice["좌표(Y)"], hospital_notice["좌표(X)"])
  );
  hospital_category.innerText = hospital_notice.종별코드명;
  hospital_info.append(hospital_name);
  hospital_info.append(hospital_category);

  const hospital_info_detail = document.createElement("div");
  hospital_info_detail.setAttribute("class", "hospital_info_detail");
  const hospital_address = document.createElement("p");
  const hospital_postalcode = document.createElement("p");
  const hospital_contactnum = document.createElement("P");
  const hospital_homepage = document.createElement("a");

  hospital_address.innerText = hospital_notice.주소;
  hospital_postalcode.innerText = "우편번호 : " + hospital_notice.우편번호;
  hospital_contactnum.innerText = "연락처 : " + hospital_notice.전화번호;
  hospital_homepage.innerText = hospital_notice.병원홈페이지;
  hospital_homepage.target = "_blank";
  hospital_homepage.href = hospital_notice.병원홈페이지;
  hospital_info_detail.append(hospital_address);
  hospital_info_detail.append(hospital_postalcode);
  hospital_info_detail.append(hospital_contactnum);
  hospital_info_detail.append(hospital_homepage);

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
  const docRef = await addDoc(
    collection(dbService, hospital_notice.요양기관명),
    {
      context: $review_context_area.value,
      creatorId: userId,
      creatorName: userName,
      createdAt: Date.now(),
    }
  );
}

function closeReviewFormContainer() {
  const a = document.querySelector(".reviewForm");
  a.remove();
}

function onClickReviewAddBtn(hospital_notice) {
  const $review_context_area = document.querySelector("#review_context_area");
  if (!$review_context_area) {
    return;
  } else {
    onAddReview(hospital_notice);
    makeToggleContent(hospital_notice);
  }
}

function makeReviewForm(hospital_notice) {
  const reviewForm_container = document.createElement("div");
  reviewForm_container.setAttribute("class", "reviewForm");
  reviewForm_container.innerHTML = `
    <h3>리뷰 작성</h3>
    <textarea id="review_context_area" column="3"></textarea>
    <button id="review_add_btn">리뷰 등록</button>
  `;
  $toggleContainer_main.insertBefore(
    reviewForm_container,
    $toggleContainer_main.children[2]
  );
  document
    .querySelector("#review_add_btn")
    .addEventListener("click", () => onClickReviewAddBtn(hospital_notice));
}

function onHandleWriteReviewBtn(write_review, hospital_notice) {
  if (write_review.innerText === "리뷰 쓰기") {
    write_review.innerText = "작성취소";
    makeReviewForm(hospital_notice);
  } else {
    write_review.innerText = "리뷰 쓰기";
    closeReviewFormContainer();
  }
}

function makeReviewContainer(hospital_notice) {
  const review_container = document.createElement("div");
  review_container.setAttribute("class", "review_container");
  const rate_info = document.createElement("div");
  rate_info.setAttribute("class", "rate_info");
  const total_rate_num = document.createElement("span");
  const total_rate_star = document.createElement("div");

  // write_review.setAttribute("id", "toggleWriteReviewBtn");
  // total_rate_num.innerText = "4.0";
  // total_rate_star.innerText = "★ ★ ★ ★ ★";
  rate_info.append(total_rate_num);
  rate_info.append(total_rate_star);
  review_container.append(rate_info);

  if (userId) {
    const write_review = document.createElement("span");
    write_review.innerText = "리뷰 쓰기";
    write_review.addEventListener("click", () =>
      onHandleWriteReviewBtn(write_review, hospital_notice)
    );
    review_container.append(write_review);
  }
  $toggleContainer_main.append(review_container);
}

function getReviewFromFirestore(hospital_name) {
  return new Promise((resolve, reject) => {
    const q = query(collection(dbService, hospital_name), orderBy("createdAt"));
    onSnapshot(
      q,
      (snapshot) => {
        const reviewsArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        resolve(reviewsArr);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

async function onClickReviewDeleteBtn(reviewArr, hospital_notice) {
  const ok = confirm("정말 삭제 하시겠습니까 ? ");
  if (ok) {
    const reviewRef = doc(dbService, hospital_notice.요양기관명, reviewArr.id);
    await deleteDoc(reviewRef);
    makeToggleContent(hospital_notice);
  } else {
    return;
  }
}

function onClickReviewUpdateBtn() {
  return;
}
function makeReview(review_list_container, reviewsArr, hospital_notice) {
  if (reviewsArr.length !== 0) {
    for (let i = 0; i < reviewsArr.length; i++) {
      const review_container = document.createElement("div");
      review_container.setAttribute("class", "review");
      const review_context = document.createElement("p");
      review_context.innerText = reviewsArr[i].context;
      review_container.append(review_context);
      const user_info = document.createElement("span");
      user_info.setAttribute("class", "review_user_info");
      user_info.innerText = `${reviewsArr[i].creatorName}`;
      review_container.append(user_info);

      if (reviewsArr[i].creatorId === userId) {
        const review_tool_btns = document.createElement("div");
        review_tool_btns.setAttribute("class", "review_tool_btns");
        const review_update_btn = document.createElement("button");
        const review_delete_btn = document.createElement("button");
        review_update_btn.innerText = "수정";
        review_delete_btn.innerText = "삭제";
        review_update_btn.addEventListener("click", onClickReviewUpdateBtn);
        review_delete_btn.addEventListener("click", () =>
          onClickReviewDeleteBtn(reviewsArr[i], hospital_notice)
        );
        review_tool_btns.append(review_update_btn);
        review_tool_btns.append(review_delete_btn);
        review_container.append(review_tool_btns);
      }
      review_list_container.append(review_container);
    }
  } else {
    const noReview = document.createElement("div");
    noReview.setAttribute("class", "noReview");
    noReview.innerText = "해당 병원의 리뷰가 없습니다.";
    review_list_container.append(noReview);
  }
}
function makeReviewList(hospital_notice) {
  const review_list_container = document.createElement("div");
  review_list_container.setAttribute("class", "review_list_container");

  getReviewFromFirestore(hospital_notice.요양기관명)
    .then((reviewsArr) => {
      makeReview(review_list_container, reviewsArr, hospital_notice);
    })
    .catch((error) => {
      console.log(error);
    });
  $toggleContainer_main.append(review_list_container);
}

function makeToggleContent(hospital_notice) {
  const latitude = hospital_notice["좌표(Y)"]; //위도
  const longitude = hospital_notice["좌표(X)"]; //경도
  setNewCenter(latitude, longitude);

  $toggleContainer_main.innerHTML = "";
  // 토글 창 내용 설정
  makeHospitalInfo(hospital_notice);
  const hospital_info_container = (document.querySelector(
    ".hospital_info_container"
  ).style.backgroundColor = "#eff7ff");
  makeReviewContainer(hospital_notice);
  makeReviewList(hospital_notice);
  openToggleContainer();
  // 토글 창 열기
}

function makeSearchResult() {
  for (let i = 0; i < find_list.length; i++) {
    const find_div = document.createElement("li");
    find_div.className = "search_result";
    find_div.innerText = find_list[i].요양기관명;
    find_div.addEventListener("click", () => {
      $searchInput.value = find_list[i].요양기관명;
      $search_result_list.innerHTML = "";
      const tmp = [];
      tmp.push(find_list[i]);
      find_list.length = 0;
      find_list.push(tmp[0]);
    });
    $search_result_list.append(find_div);
  }
}

function findHospital(btnClicked, searchValue) {
  // 찾는 병원이 있고 검색 버튼을 클릭 했을 때
  if (btnClicked && find_list) {
    $toggleContainer_main.innerHTML = "";
    for (let i = 0; i < find_list.length; i++) {
      makeHospitalInfo(find_list[i]);
    }
    openToggleContainer();
    find_list.length = 0;
    return;
  }
  if (!searchValue) {
    $search_result_list.innerHTML = "";
    return;
  }
  $search_result_list.innerHTML = "";
  find_list.length = 0;
  let find = false;
  for (let i = 0; i < hospital_notice_list.length; i++) {
    if (hospital_notice_list[i].요양기관명.includes(searchValue)) {
      find_list.push(hospital_notice_list[i]);
      find = true;
    }
  }
  if (find) {
    makeSearchResult();
    find = true;
  } else {
    const find_div = document.createElement("li");
    find_div.className = "search_result";
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
  $toggleContainer_main.style.display = "block";
  $toggleContainer_toggleBtn.style.left = `${$toggleContainer.clientWidth - 1
    }px`;
  $toggleContainer_toggleBtn.innerHTML = `
  <i class="fa-solid fa-angle-left"></i>`;
}
function closeToggleContainer() {
  $toggleContainer_main.style.display = "none";
  $toggleContainer_toggleBtn.style.left = "0";
  $toggleContainer_toggleBtn.innerHTML = `
  <i class="fa-solid fa-angle-right"></i>
  `;
}

function onHandleToggleContainer() {
  if ($toggleContainer_main.style.display === "none") {
    openToggleContainer();
  } else {
    closeToggleContainer();
  }
}
function openOptionToggleContainer() {
  $options.style.display = "block";
  $toggle_option_btn.innerHTML = `
  <i class="fa-solid fa-caret-up"></i>검색옵션
  `;
}
function closeOptionToggleContainer() {
  $options.style.display = "none";
  $toggle_option_btn.innerHTML = `
  <i class="fa-solid fa-caret-down"></i>검색옵션
  `;
}

function onHandleToggleOptionBtn() {
  if ($options.style.display === "none") {
    openOptionToggleContainer();
  } else {
    closeOptionToggleContainer();
  }
}

for (let i = 0; i < options.length; i++) {
  createTypeOptions(options[i]);
}

for (let i = 0; i < options_detail.length; i++) {
  createTypeDetailOptions(options_detail[i]);
}

function createTypeOptions(option) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = option.id;
  checkbox.value = option.value;

  const label = document.createElement("label");
  label.htmlFor = option.id;
  label.textContent = option.value;

  const br = document.createElement("br");

  $hospital_type_container.appendChild(checkbox);
  $hospital_type_container.appendChild(label);
  $hospital_type_container.appendChild(br);
}

function createTypeDetailOptions(option) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = option.id;
  checkbox.value = option.value;

  const label = document.createElement("label");
  label.htmlFor = option.id;
  label.textContent = option.value;

  const br = document.createElement("br");

  $hospital_type_detail_container.appendChild(checkbox);
  $hospital_type_detail_container.appendChild(label);
  $hospital_type_detail_container.appendChild(br);
}

function onHandleOptionUpdateBtn() {
  clusterer.clear();
  markers.length = 0;

  hospital_notice_list.forEach((hospitalInfo) => {
    if (filterOptions.includes(hospitalInfo.종별코드명)) {
      if (filterOptions_detail.length !== 0) {
        const departments = hospitalInfo.진료과목코드명.split(", ");
        filterOptions_detail.map((option) => {
          if (departments.includes(option)) {
            const marker = createMarker(hospitalInfo);
            markers.push(marker);
            return
          }
        })
      }
      else {
        const marker = createMarker(hospitalInfo);
        markers.push(marker);
      }
    }
  });
  clusterer.addMarkers(markers);
  closeOptionToggleContainer();
}

// 지도를 생성한다

getCurrentLocation();

$hospital_type_container.addEventListener("change", function (event) {
  const checkbox = event.target;
  const value = checkbox.value;
  if (checkbox.checked) {
    filterOptions.push(value);
  } else {
    const index = filterOptions.indexOf(value);
    if (index > -1) {
      filterOptions.splice(index, 1);
    }
  }
});

$hospital_type_detail_container.addEventListener("change", function (event) {
  const checkbox = event.target;
  const value = checkbox.value;

  if (checkbox.checked) {
    filterOptions_detail.push(value);
  } else {
    const index = filterOptions_detail.indexOf(value);
    if (index > -1) {
      filterOptions_detail.splice(index, 1);
    }
  }
});

$toggle_option_btn.addEventListener("click", onHandleToggleOptionBtn);
$option_update_btn.addEventListener("click", onHandleOptionUpdateBtn);
$searchInput.addEventListener("input", () =>
  onHandleSearchInput($searchInput.value)
);
$searchButton.addEventListener("click", () =>
  onClickSearchBtn($searchInput.value)
);
$myLocation_btn.addEventListener("click", getCurrentLocation);
$toggleContainer_toggleBtn.addEventListener("click", onHandleToggleContainer);
