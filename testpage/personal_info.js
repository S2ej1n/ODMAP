function startTestpage() {
    var selectBox = document.getElementById("jobSelect");
    var selectedValue = selectBox.value;

    /*페이지 연결하는 코드 */
    // if (selectedValue === "1") {
    //   window.location.href = "1.html";
    // } else if (selectedValue === "2") {
    //   window.location.href = "2.html";
    // } else if (selectedValue === "3") {
    //   window.location.href = "3.html";
    // } else if (selectedValue === "4") {
    //   window.location.href = "4.html";
    // } else if (selectedValue === "5") {
    //   window.location.href = "5.html";
    // } else if (selectedValue === "6") {
    //   window.location.href = "6.html";
    // } else if (selectedValue === "7") {
    //   window.location.href = "7.html";
    // }

    if (selectedJob) {
      var script = document.createElement("script");
      script.src = "./data" + selectedJob + ".js";
      script.charset = "utf-8";
      document.head.appendChild(script);
    }
  
    // testpage.html로 이동
    location.href = "testpage.html";
  }