import React, { useEffect, useState } from 'react';
import styles from "@/styles/MainPage.module.scss";

type images = {
  src: string;
  text: string;
}
const Index = () => {
  const imgs: images[] = [
    { src: '/img/img1.jpg', text: 'hello1' },
    { src: '/img/img2.jpg', text: 'hello2' },
    { src: '/img/img3.jpg', text: 'hello3' }
  ];

  const [idx, setIdx] = useState<number>(0);
  const [showText, setShowText] = useState<boolean>(false);

  useEffect(()=>{
    
    setTimeout(()=>{
      setShowText(true);
    }, 500);

    const interval = setInterval(()=>{
      setTimeout(()=>{
        setShowText(false);
      }, 2800);
      setTimeout(()=>{
        setIdx(prev => (prev+1) % imgs.length);
        setShowText(true);
      }, 500);
    }, 4500);

    return ()=> clearInterval(interval);
    
  },[])

  return (
    <div className={styles.main}>
      <div className={styles.bgdiv}
      style={{backgroundImage: `url( ${imgs[idx].src} )`}}></div>
      <div className={`${styles.textbox} ${(showText)? styles.show: ''}`}>
        {imgs[idx].text}
      </div>
    </div>
  )
}

export default Index