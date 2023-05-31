import { authService, dbService } from '../fbase.js';

const $login_btn = document.querySelector('#login_btn');
const $navbar_menu = document.querySelector(".navbar__menu");

let isLoggedIn = false;

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

function handleLogout() {
  //쿠키 삭제
  document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  location.reload();
}

function createProfileBtn() {
  const profile = document.createElement('li');
  profile.setAttribute('id', 'profile_btn');
  const a = document.createElement("a");
  a.innerText = "PROFILE";
  a.addEventListener('click', () => { console.log("go to profilePage") });
  profile.append(a);
  $navbar_menu.append(profile);
}

function createLogoutBtn() {
  const profile = document.createElement('li');
  profile.setAttribute('id', 'logout_btn');
  const a = document.createElement("a");
  a.innerText = "LOGOUT";
  a.addEventListener('click', handleLogout);
  profile.append(a);
  $navbar_menu.append(profile);
}


const userId = getCookie('user');

if (userId) {
  isLoggedIn = true;
}

if (isLoggedIn) {
  $login_btn.style.display = 'none';
  createProfileBtn();
  createLogoutBtn();
}
else {
  $login_btn.style.display = 'block';
}