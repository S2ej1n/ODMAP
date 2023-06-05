var selectedJsFile

function startTest() {
    var selectBox = document.getElementById("jobSelect");
    var selectedValue = selectBox.value;

    if (selectedValue == ""){
      window.alert("직업군을 선택해주세요");
    } else if (selectedValue === "1") {
      window.location.href = "testpage1.html";
    } else if (selectedValue === "2") {
      window.location.href = "testpage2.html";
    } else if (selectedValue === "3") {
      window.location.href = "testpage3.html";
    } else if (selectedValue === "4") {
      window.location.href = "testpage4.html";
    } else if (selectedValue === "5") {
      window.location.href = "testpage5.html";
    } else if (selectedValue === "6") {
      window.location.href = "testpage6.html";
    } else if (selectedValue === "7") {
      window.location.href = "testpage7.html";
    } else if (selectedValue === "8") {
      window.location.href = "testpage8.html";
    } else if (selectedValue === "9") {
      window.location.href = "testpage9.html";
    } else if (selectedValue === "10") {
      window.location.href = "testpage10.html";
    }
  }