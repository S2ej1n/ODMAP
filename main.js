import { authService } from "./fbase.js";

const $login_btn = document.querySelector("#login_btn");
const $logout_btn = document.querySelector("#logout_btn");

export let userId;
export let userName;

function onHandleLogoutBtn() {
  authService
    .signOut()
    .then(() => {
      location.reload(true);
    })
    .catch((error) => {
      console.log(error.message);
    });
}

authService.onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
    userId = user.uid;
    if (!user.displayName) {
      userName = user["uid"].slice(0, 8);
    } else {
      userName = user.displayName;
    }
    $logout_btn.style.display = "block";
    $login_btn.style.display = "none";
  } else {
    console.log(user);
    $logout_btn.style.display = "none";
    $login_btn.style.display = "block";
  }
});

$logout_btn.addEventListener("click", onHandleLogoutBtn);
