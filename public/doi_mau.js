const socket = io()

const sttNhietDo = document.getElementById("nhietdo")
const sttDoAm = document.getElementById("doAm")
const sttAnhSang = document.getElementById("anhSang")
const sttden = document.getElementById("den")
const stttivi = document.getElementById("tivi")

// NHIỆT ĐỘ
  socket.on("temp",function(data_received){
      let nhietdo = data_received
      document.getElementById("temp_value").innerHTML = nhietdo + "°C"

      if(nhietdo <= 30){
        sttNhietDo.style.backgroundImage = "linear-gradient(rgb(224, 238, 147),rgb(242, 182, 174))";
      }else if(nhietdo <= 36){

        sttNhietDo.style.backgroundImage = "linear-gradient(rgb(234, 251, 0),rgb(249, 74, 5))";
      }else{
        sttNhietDo.style.backgroundImage = "linear-gradient(rgb(242, 86, 86),red)";        

      }

      //thêm giá trị vào biểu đồ
      updatee.data.datasets[0].data.push(nhietdo)
      updatee.data.labels.push(new Date().getSeconds());
  })

  //ĐỘ ẨM
  socket.on("humi",function(data_received){
    let doam = data_received
    document.getElementById("humi_value").innerHTML = doam + "%"
    
    if(doam <= 10){
      sttDoAm.style.backgroundImage = "linear-gradient(rgb(194, 176, 239),rgb(135, 92, 243))";
    }else if(doam <= 88){
      //socket.emit("control_led","0")
      sttDoAm.style.backgroundImage = "linear-gradient(rgb(132, 90, 238),rgb(102, 45, 247))";
    }else{
      // var a = alert(" Turn on LED ? ")
      // if(a){
      socket.emit("control_led","1")
      // }
      sttDoAm.style.backgroundImage = "linear-gradient(rgb(78, 84, 239),blue)";
    }

    updatee.data.datasets[1].data.push(doam)
  })

// ÁNH SÁNG
  socket.on("light",function(data_received){
    let anhsang = data_received
    document.getElementById("light_value").innerHTML = anhsang +" lux"

    if(anhsang <= 100){
      sttAnhSang.style.backgroundImage = "linear-gradient(yellow,lightyellow)";
    }else if(anhsang <=200){
      // var result = confirm(" Turn on LED ? ")
      // if(result && sttAnhSang.style.backgroundImage != "linear-gradient(yellow,lightyellow)"){
      // socket.emit("control_led","1")
      // }
      sttAnhSang.style.backgroundImage = "linear-gradient(rgb(255, 245, 124),rgb(240, 240, 72))";
    }else{
      sttAnhSang.style.backgroundImage = "linear-gradient(rgb(245, 245, 124),rgb(249, 249, 222))";
    }

      updatee.data.datasets[2].data.push(anhsang)
      updatee.update()
    
        updatee.data.labels.push(new Date().getSeconds());
        updatee.data.labels.shift()
      
  })


const updatee = new Chart("myChart", {
  
  type: "line",
  data: {
    labels: [],
    datasets: [{
        label: "Nhiệt độ",
        lineTension: 0.5,
        backgroundColor: "pink",      
        borderColor: "pink",         
        data: []
      },{
        label: "Độ ẩm",
        lineTension: 0.5,
        backgroundColor: "red",      
        borderColor: "blue",         
        data: []
      },{
        label: "Ánh sáng",              
        lineTension: 0.5,
        backgroundColor: "yellow",      
        borderColor: "yellow",         
        data: []
      }
    ]
  },
  options: {
   
    scales: {
      x: {
        title:{
          display: false,
          text: "TIME (s)"
        }
      }
    }
  }
})

socket.on("led",function(data_received){
  if(data_received == 1){
    document.getElementById("checkboxThreeInput_den").checked =true
    document.getElementById("light_img").src='/public/images/on_light.png'
    sttden.style.backgroundColor = "greenyellow";
  } else{
    document.getElementById("checkboxThreeInput_den").checked = false
    document.getElementById("light_img").src='/public/images/off_light.png'
    sttden.style.backgroundColor = "DarkGray";
  }
})

socket.on("tv",function(data_received){
  if(data_received == 1){
    document.getElementById("Input_tv").checked = true
    document.getElementById("tv_img").src='/public/images/on_tv.png'
    stttivi.style.backgroundColor = "lightblue";
  } else{
    document.getElementById("output_tv").checked = false
    document.getElementById("tv_img").src='/public/images/off_tv.png'
    stttivi.style.backgroundColor = "DarkGray";
  }
})
function on_off_led(){
  let trangthai = document.getElementById("checkboxThreeInput_den")
  if(trangthai.checked == true){      
    var result = confirm(" Bạn muốn bật đèn? ")
      if(result){
        socket.emit("control_led","1")
      } else {
        trangthai.checked = false
      }
  }else{
    var result1= confirm("Bạn muốn tắt đèn? ")
    if(result1){
      socket.emit("control_led","0")
    }
  }
}
// function on_off_2led(){
//   let trangthai = document.getElementById("checkboxThreeInput_2den")
//   if(trangthai.checked == true){      
//     var result = confirm(" Bạn muốn bật đèn và TV? ")
//       if(result){
//         socket.emit("control_led","1")
//         socket.emit("control_tv","1")
        
//       } else {
//         trangthai.checked = false
//       }
//   }else{
//     var result1= confirm("Bạn muốn tắt đèn và TV? ")
//     if(result1){
//       socket.emit("control_led","0")
//       socket.emit("control_tv","0")
//     }
//   }
// }

function kiemtra_on_tv(){
  if(confirm("Bạn muốn bật TV") == true){
    socket.emit("control_tv","1")
  }
}
function kiemtra_off_tv(){
  if(confirm("Bạn muốn tắt TV") == true){
    socket.emit("control_tv","0")
  }
}

function highChart(){
  document.getElementById("myChart").style.opacity = "1"
}
highChart();