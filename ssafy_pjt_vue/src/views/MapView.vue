<template>
  <!-- <div class="container" @mousemove="handleMouseMove" :style="{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }"> -->
  <div class="container">
    <!-- <img src="../../public/logo2.png" alt="icon" id="move"> -->
    <p class="title">내주변 은행 검색하기</p>
    <form @submit.prevent="searchPlaces">
      <input type="text" v-model="keyword" placeholder="장소나 은행이름을 입력하세요.">
      <button type="submit">Search</button>
    </form>
    <div class="wrapper">
      <div id="menu_wrap">
        <ul id="placesList"></ul>
        <div id="pagination"></div>
      </div>
      <div id="map"></div>
      
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, toRaw } from 'vue';
import config from '../../config/config'
const keyword = ref('')
//
const parallaxX = ref(0);
const parallaxY = ref(0);

const handleMouseMove = (event) => {
  const mouseX = event.clientX / window.innerWidth - 0.5;
  const mouseY = event.clientY / window.innerHeight - 0.5;

  parallaxX.value = mouseX * 50; // Adjust the multiplier for the parallax effect
  parallaxY.value = mouseY * 50; // Adjust the multiplier for the parallax effect
};


//지도
var map

// 마커를 담을 배열
var markers = []
const Keyword = '은행'
var ps
var infowindow
let cur_lat
let cur_lng

// 키워드로 장소 검색
onMounted(() => {
  const script = document.createElement("script")
  script.src =
    `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${config.apiKey}&libraries=services,clusterer,drawing`
  document.head.appendChild(script)

  script.onload = () => {
    kakao.maps.load(() => {
      infowindow = new kakao.maps.InfoWindow({zIndex:1})
      // 장소 검색 객체 생성
      ps = new window.kakao.maps.services.Places()
      const container = document.getElementById('map');
      var options
      // 현재 위치 기준으로 지도 보여주기
      // if (navigator.geolocation) {
      //   console.log('current coords')
      //   navigator.geolocation.getCurrentPosition(function(position) {
      //     const lat = position.coords.latitude
      //     const lng = position.coords.longitude
      //     cur_lat = lat
      //     cur_lng = lng
      //     var locPosition = new kakao.maps.LatLng(lat, lng)
      //     presentPosition = locPosition
      //     map.setCenter(locPosition)
      //   })
      // }
      options = {
        center: new window.kakao.maps.LatLng(37.5320028, 126.9140722),
        level: 5,
      }
      map = new kakao.maps.Map(container, options);
      ps.keywordSearch(Keyword, placeSearchCB, {location: new kakao.maps.LatLng(37.5320028, 126.9140722)})



      // kakao.maps.event.addListener(map, 'idle', function() {
      //   // The map is fully loaded and becomes idle, call the searchPlaces function
      //   searchPlaces();
      // });
      // kakao.maps.event.addListener(map, 'tilesloaded', function() {
      //   // The map is fully loaded, call the searchPlaces function
      //   searchPlaces();
      // });


      // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성합니다
      var zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT);


    })
  }
})



// 키워드 검색 요청
function searchPlaces () {
  // 사용자가 어떤 값도 입력하지 않은 경우, 현재 위치를 기반으로 한 은행 검색 결과를 지도에 표시
  if (keyword.value === '') {
    console.log('no keyword')
    if (navigator.geolocation) {
        console.log('current coords')
        navigator.geolocation.getCurrentPosition(function(position) {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          ps.keywordSearch(Keyword, placeSearchCB, {location: new kakao.maps.LatLng(lat, lng)}, {radius: 50})
        })
      }
    // ps.categorySearch('BK9', placeSearchCB, {location: new kakao.maps.LatLng(cur_lat, cur_lng)}, {radius: 500})
  } else {
    if (!keyword.value.replace(/^\s+|\s+$/g, '')) {
    alert('키워드를 입력해주세요')
    return false
  }}
    // ps.keywordSearch(Keyword, placeSearchCB)
  // } else {
  //   if (!keyword.value.replace(/^\s+|\s+$/g, '')) {
  //   alert('키워드를 입력해주세요')
  //   return false
  // }
  
  console.log('검색하기')
  // 입력받은 장소를 좌표로 변환하기
  // 주소-좌표 변환 객체를 생성합니다
  var geocoder = new kakao.maps.services.Geocoder();
  // 주소로 좌표를 검색합니다
  geocoder.addressSearch(keyword.value, function(result, status) {

  // 정상적으로 검색이 완료됐으면 
  if (status === kakao.maps.services.Status.OK) {
      console.log('??')
      var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      console.log(coords)
      map.setCenter(coords);
      ps.categorySearch('BK9', placeSearchCB, {location: new kakao.maps.LatLng(result[0].y, result[0].x)}, {radius:400})
  } else { // 유효하지 않은 장소이름을 입력했다면 키워드 서치
      ps.keywordSearch(keyword.value, placeSearchCB)
  }
  // ps.keywordSearch(keyword.value, placeSearchCB)
  // ps.categorySearch('BK9', placeSearchCB, {useMapBounds:true})
})
}


// 장소 검색 완료 시 호출되는 콜백함수
function placeSearchCB (data, status, pagination) {
  if (window.kakao && window.kakao.maps && status === kakao.maps.services.Status.OK) {
    //정상적으로 검색이 완료된 경우
    if (status === kakao.maps.services.Status.OK) {

      // 정상적으로 검색이 완료됐으면
      // 검색 목록과 마커를 표출합니다
      displayPlaces(data);

      // 페이지 번호를 표출합니다
      displayPagination(pagination);

  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.');
      return;
  } else if (status === kakao.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다.');
      return;
  }
    
    // const bounds = new kakao.maps.LatLngBounds()
    // for (let i=0; i<data.length; i++) {
    //   displayMarker(data[i])
    //   bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
    // }
    // map.setBounds(bounds)
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert('검색 결과가 존재하지 않습니다.')
    return
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert('검색 결과 중 오류가 발생했습니다.')
    return
  }
}

// 검색 결과 리스트를 보여주는 함수
function displayPlaces(places) {
  var listEl = document.getElementById('placesList'), 
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(), 
    bounds = new kakao.maps.LatLngBounds(), 
    listStr = '';
    console.log(places)
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();
    
    for ( var i=0; i<places.length; i++ ) {

      // 마커를 생성하고 지도에 표시합니다
      var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
          marker = addMarker(placePosition, i), 
          itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      bounds.extend(placePosition);

      // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시합니다
      // mouseout 했을 때는 인포윈도우를 닫습니다
      (function(marker, title) {
          kakao.maps.event.addListener(marker, 'mouseover', function() {
              displayInfowindow(marker, title);
          });

          kakao.maps.event.addListener(marker, 'mouseout', function() {
              infowindow.close();
          });

          itemEl.onmouseover =  function () {
              displayInfowindow(marker, title);
          };

          itemEl.onmouseout =  function () {
              infowindow.close();
          };
      })(marker, places[i].place_name);

      fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}

function getListItem(index, places) {

var el = document.createElement('li'),
itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
            '<div class="info" style="margin:1rem; border-bottom:0.5px solid black">' +
            '   <h4 style="margin-bottom:0.7rem">' + places.place_name + '</h4>';

if (places.road_address_name) {
    itemStr += '    <span>' + places.road_address_name + '</span>' +
                '   <span  class="jibun gray" style="display:block;">' +  places.address_name  + '</span>';
} else {
    itemStr += '    <span style="margin:0.3rem">' +  places.address_name  + '</span>'; 
}
             
  itemStr += '  <span class="tel" style="color: #1B4DFF;padding:0.5rem 0; font-weight: 700; display:block">' + places.phone  + '</span>' +
            '</div>';           

el.innerHTML = itemStr;
el.className = 'item';

return el;
}

function addMarker(position, idx, title) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions =  {
            spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage 
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
  var content = '<div style="padding:10px;z-index:1;">' + title + '</div>';

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}

//검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
  var paginationEl = document.getElementById('pagination'),
      fragment = document.createDocumentFragment(),
      i; 

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
      paginationEl.removeChild (paginationEl.lastChild);
  }

  for (i=1; i<=pagination.last; i++) {
      var el = document.createElement('a');
      el.href = "#";
      el.innerHTML = i;
      el.style.marginRight = "10px";
      // el.style.color = "#F596EA"
      el.style.color = '000000'
      el.style.fontSize = "1rem"
      el.style.fontWeight = "700"
      el.style.textDecoration = "none"
      el.style.width = "1rem"
      el.style.height = "1rem"

      if (i===pagination.current) {
          el.className = 'on';
      } else {
          el.onclick = (function(i) {
              return function() {
                  pagination.gotoPage(i);
              }
          })(i);
      }

      fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}


function displayMarker(place) {
  if (window.kakao && window.kakao.maps) {
    var marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(place.y, place.x)
  })
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  background-image: url('/public/Grad_17.png'); /* Replace with the path to your PNG file */
  background-size: cover; /* Adjust the background size */
  background-repeat: no-repeat;
  height: 100vh; /* Ensure the container takes the full viewport height */
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
form {
  margin-bottom: 1rem;
}

input{
  position: relative;
  cursor: text;
  font-size: 14px;
  line-height: 20px;
  padding: 0 16px;
  height: 40px;
  width: 240px;
  background-color: #fff;
  border: 1px solid #d6d6e7;
  border-radius: 3px;
  color: rgb(35, 38, 59);
  box-shadow: inset 0 1px 4px 0 rgb(119 122 175 / 30%);
  overflow: hidden;
  transition: all 100ms ease-in-out;
  
}
input:focus {
  border-color: #3c4fe0;
  box-shadow: 0 1px 0 0 rgb(35 38 59 / 5%);
}
button {
  appearance: none;
  margin: 0.5rem;
  height: 40px;
  background-color: #FAFBFC;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: #24292E;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  padding: 6px 16px;
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  word-wrap: break-word;
}

button:hover {
  background-color: #F3F4F6;
  text-decoration: none;
  transition-duration: 0.1s;
}

button:disabled {
  background-color: #FAFBFC;
  border-color: rgba(27, 31, 35, 0.15);
  color: #959DA5;
  cursor: default;
}

button:active {
  background-color: #EDEFF2;
  box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
  transition: none 0s;
}

button:focus {
  outline: 1px transparent;
}

button:before {
  display: none;
}

button:-webkit-details-marker {
  display: none;
}

#map {
  width: 100%;
  height: 50vh;
  flex: 1;
  border-radius: 5px;
}
#placesList {
  height: 100%;
  overflow: scroll;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 1rem;
  border-radius: 5px;
}
#menu_wrap {
  display: flex;
  flex-direction: column;
  width: 50%;
  /* height: 100%; */
  height: 54.7vh;
  float: left;
  border-radius: 5px;
}
.wrapper {
  width: 80%;
  display: flex;
  height: 400px;
  margin: 100px auto;
}
ul {
  list-style: none;
  margin: 0rem;
}
li {
  margin: 1rem;
}
.title {
  font-size: 2rem;
  margin: 1rem;
}
#pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  color: #fff;
  height: 10%;
}

#pagination .on {
  font-weight: bold;
  cursor: default;
  color:#777;
}

#move {
  z-index: 2000;
  width: 3rem;
  height: 3rem;
}
</style>
