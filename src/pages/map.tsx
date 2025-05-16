import React, { useEffect, useState, useRef } from 'react';
import styles from "@/styles/Map.module.scss";

declare global { // 전역변수 선언
    interface Window { // 소문잔 윈도우는 js가 작업하는거고, 대문자 윈도우가 리액트가 알아듣는 용도
        kakao: any; // 카카오를 추가함.
    }
}
const Map = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [myMap, setMyMap] = useState<any>(null);
    const [query, setQuery] = useState<string>('');
    const [myMark, setMyMark] = useState<any>(null);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [myOverlay, setMyOverlay] = useState<any>(null);
    const keywordBtns = ['고잔역', '서울역', '안산역', '사리역', '고색역'];

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false&libraries=services`;
        script.async = true;

        // 스크립트 로드된 이후 맵 실행
        script.onload = () => {
            window.kakao.mapsy.load(() => { // 윈도우 안에 카카오를 선언해둔거라 이렇게 가져와야함. // 로드 안하면 안뜸..?
                const center = new window.kakao.maps.LatLng(37.3218778, 126.8308848); // 중심점 맞춰줌
                const options = {
                    center, //  center : center 와 같음. 키와 이르밍 같아서 생략 가능함.
                    level: 3
                }

                // 지도를 표시할 div와  지도 옵션으로  지도를 생성
                const maps = new window.kakao.maps.Map(mapRef.current, options);
                setMyMap(maps);

                // 교통상황
                maps.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);

                // 마커생성
                // const markerPosition = new window.kakao.maps.LatLng(37.3218778, 126.8308848);

                // 마커를 생성합니다
                const marker = new window.kakao.maps.Marker({
                    position: center // markerPosition
                });

                // 마커가 지도 위에 표시되도록 설정합니다
                marker.setMap(maps);
                setMyMark(marker);

                // 초기 셋, 오버레이
                const content = document.createElement('div');
                content.id = 'customOverray';
                content.style.cssText = `
                    backround: #fff;
                    border: 1px solid #ccc;
                    border-radius: 10px;
                    padding: 10px;
                    font-size: 13px;
                    position : relative;
                `;
                const closeBtn = document.createElement('div');
                closeBtn.innerHTML = '닫기 X';
                closeBtn.style.cssText = `
                    position : absolute;
                    top : 5px;
                    right: 9px;
                    cursor: pointer;
                    font-size: 11px;
                    color: #f00;
                `;
                const info = document.createElement('div');
                info.innerHTML = `<strong>안산 중앙역(수인선/4호선)</strong> <br/>`;
                content.appendChild(closeBtn);
                content.appendChild(info);

                const overlay = new window.kakao.maps.CustomOverlay({
                    content: content,
                    position: center,
                    map: maps,
                    xAnchor: 0.3,
                    yAnchor: 0.91
                });
                overlay.setMap(maps);

                closeBtn.onclick=()=>{
                    overlay.setMap(null)
                }

                setIsLoad(true);
            });
        }
        document.head.appendChild(script);
    }, []);

    const searchFunc =(keyword: string)=>{
        if( !isLoad || !keyword){
            alert('지도가 로드되지 않았거나 키워드가 없습니다.');
            return ;
        }
        // 검색
        const ps = new window.kakao.maps.service.Places();
        ps.keywordSearch(keyword, placesSearchCB);
        // const placesSearchCB = ( ) => 이렇게 가져오면 순서에서 밀려서 function을 사용함
        function placesSearchCB(data: any[], status: string) {
            if(status === window.kakao.maps.Status.OK){
                if(myMark){
                    myMark.setMap(null);
                }
                if(myOverlay){
                    myOverlay.setMap(null);
                }
                const bounds = new window.kakao.maps.LatLngBounds();
                const position = new window.kakao.maps.LatLng(data[0].y, data[0].x); // 새로운 포지션.
                bounds.extend(new window.kakao.maps.LatLng(data[0].y, data[0].x));

                myMap.setBounds(bounds);

                // 새로운 마커
                const newMarker = new window.kakao.maps.Marker({
                    position: position
                });

                newMarker.setMap(myMap);
                setMyMark(newMarker);

                // 새로운 오버레이 생성
                const content = document.createElement('div');
                content.id = 'customOverray';
                content.style.cssText = `
                    background: #fff;
                    border: 1px solid #ccc;
                    border-radius: 10px;
                    padding: 10px;
                    font-size: 13px;
                    position : relative;
                `;
                const closeBtn = document.createElement('div');
                closeBtn.innerHTML = '닫기 X';
                closeBtn.style.cssText = `
                    position : absolute;
                    top : 5px;
                    right: 9px;
                    cursor: pointer;
                    font-size: 11px;
                    color: #f00;
                `;
                const info = document.createElement('div');
                info.innerHTML = `<strong>${data[0].place_name}</strong> <br/>${data[0].address_name}`;
                content.appendChild(closeBtn);
                content.appendChild(info);

                const overlay = new window.kakao.maps.CustomOverlay({
                    content: content,
                    position: position,
                    map: myMap,
                    xAnchor: 0.3,
                    yAnchor: 0.91
                });
                overlay.setMap(myMap);

                closeBtn.onclick=()=>{
                    overlay.setMap(null)
                }
            }
        }

    }
    return (
        <div className={styles.mapBox}>
            <h2>키워드 지도 검색</h2>
            <div className={styles.searchBox}>
                <input type="text" placeholder='검색할 지역 키워드를 입력하세요.'
                value={query} onChange={(e)=>setQuery(e.target.value)}/>
                <button onClick={()=>searchFunc(query)}> 검색 </button>
            </div>
            <div className={styles.searchBtns}>
                {
                    keywordBtns.map((item, index)=>(
                        <button key={`searchBtn-${index}`} onClick={()=>searchFunc(item)}> {item} </button>
                    ))
                }
            </div>
            <div className={styles.map} ref={mapRef}>지도</div>
        </div>
    )
}

export default Map