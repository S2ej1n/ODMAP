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

const mapContainer = document.getElementById("map"); // 지도를 표시할 div
const mapOption = {
  center: new kakao.maps.LatLng(37.5642135, 127.0016985), // 지도의 중심좌표
  level: 5, // 지도의 확대 레벨
  mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
};

const filterOptions = [];
const options = [
  { id: "option1", value: "상급종합" },
  { id: "option2", value: "종합병원" },
  { id: "option3", value: "병원" },
  { id: "option4", value: "요양병원" },
  { id: "option5", value: "의원" },
  { id: "option6", value: "치과병원" },
  { id: "option7", value: "치과의원" },
  { id: "option8", value: "보건의료원" },
  { id: "option9", value: "정신병원" },
  { id: "option10", value: "한방병원" },
  { id: "option11", value: "한의원" },
];
const $hospital_type_container = document.querySelector(
  "#hospital_type_container"
);
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
      markers.push(marker);
    }
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

// 좌표를 기반으로 마커를 생성하는 함수
function createMarker(hospital_notice) {
  const marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(
      hospital_notice["좌표(Y)"],
      hospital_notice["좌표(X)"]
    ),
    title: hospital_notice.요양기관명,
    map: map,
  });

  kakao.maps.event.addListener(marker, "click", function () {
    makeToggleContent(hospital_notice);
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
  hospital_name.addEventListener("click", () =>
    setNewCenter(hospital_notice["좌표(Y)"], hospital_notice["좌표(X)"])
  );
  hospital_category.innerText = hospital_notice.종별코드명;
  hospital_info.append(hospital_name);
  hospital_info.append(hospital_category);

  const hospital_info_detail = document.createElement("div");
  hospital_info_detail.setAttribute("class", "hospital_info_detail");
  const hospital_address = document.createElement("p");
  const hospital_postalcode = document.createElement("p");
  const hospital_contactnum = document.createElement("P");

  hospital_address.innerText = hospital_notice.주소;
  hospital_postalcode.innerText = "우편번호 : " + hospital_notice.우편번호;
  hospital_contactnum.innerText = "연락처 : " + hospital_notice.전화번호;
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
  const docRef = await addDoc(
    collection(dbService, hospital_notice.요양기관명),
    {
      context: $review_context_area.value,
      createdAt: Date.now(),
    }
  );
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
  } else {
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
  const write_review = document.createElement("span");
  total_rate_num.innerText = "4.0";
  total_rate_star.innerText = "★ ★ ★ ★ ★";
  write_review.innerText = "리뷰 쓰기";
  write_review.addEventListener("click", () =>
    onHandleWriteReviewBtn(write_review, hospital_notice)
  );
  rate_info.append(total_rate_num);
  rate_info.append(total_rate_star);
  review_container.append(rate_info);
  review_container.append(write_review);
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

async function onClickReviewDeleteBtn(reviewArr, hospital_name) {
  console.log(reviewArr, hospital_name);
  const ok = confirm("정말 삭제 하시겠습니까 ? ");
  if (ok) {
    const reviewRef = doc(dbService, hospital_name, reviewArr.id);
    await deleteDoc(reviewRef);
  } else {
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
      review_delete_btn.addEventListener("click", () =>
        onClickReviewDeleteBtn(reviewsArr[i], hospital_name)
      );
      review_tool_btns.append(review_update_btn);
      review_tool_btns.append(review_delete_btn);
      review_container.append(review_tool_btns);
      review_list_container.append(review_container);
    }
  } else {
    const noReview = document.createElement("div");
    noReview.setAttribute("class", "noReview");
    noReview.innerText = "해당 병원의 리뷰가 없습니다.";
    review_list_container.append(noReview);
  }
}
function makeReviewList(hospital_name) {
  const review_list_container = document.createElement("div");
  review_list_container.setAttribute("class", "review_list_container");

  getReviewFromFirestore(hospital_name)
    .then((reviewsArr) => {
      makeReview(review_list_container, reviewsArr, hospital_name);
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
  makeReviewContainer(hospital_notice);
  makeReviewList(hospital_notice.요양기관명);
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
  $toggleContainer_toggleBtn.style.left = `${
    $toggleContainer.clientWidth - 1
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

function onHandleOptionUpdateBtn() {
  markers.forEach((marker) => marker.setMap(null));
  markers.length = 0;

  hospital_notice_list.forEach((hospitalInfo) => {
    if (filterOptions.includes(hospitalInfo.종별코드명)) {
      const marker = createMarker(hospitalInfo);
      markers.push(marker);
    }
  });
  closeOptionToggleContainer();
}

// 지도를 생성한다
var map = new kakao.maps.Map(mapContainer, mapOption);

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
