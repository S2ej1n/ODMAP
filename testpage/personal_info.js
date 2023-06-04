function startTestpage() {
    var selectBox = document.getElementById("jobSelect");
    var selectedValue = selectBox.value;

    console.log(selectedValue)

    // JavaScript 파일 목록
    var jsFiles = {
      "1": "data1.js",
      "2": "data2.js",
      "3": "data3.js",
      "4": "data4.js",
      "5": "data5.js",
      "6": "data6.js",
      "7": "data7.js",
      "8": "data8.js",
      "9": "data9.js",
      "10": "data10.js"
    };

    // 선택한 값에 해당하는 JavaScript 파일을 가져옴
    var selectedJsFile = jsFiles[selectedValue];

    return selectedJsFile
    // if (selectedJsFile) {
    //   window.location.href = "test.html?jsfile=" + selectedJsFile;
    // }
  }