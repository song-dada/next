import React, { useEffect, useState } from 'react';
import styles from '@/styles/News.module.scss'

type Newsitem = {
    title: string; // 제목
    link: string; // 링크
    description: string; // 설명
    pubDate: string; // 생성된 날짜
}
const News = () => {
    // 뉴스 API
    const [topNews, setTopNews] = useState<Newsitem[]>([]);
    const [searchResult, setSearchResult] = useState<Newsitem[]>([]);
    const [query, setQuery] = useState<string>('');

    // 날씨
    const [weatherTemp, setWeatherTemp] = useState<number | null>(null);
    const [weatherIcon, setWeatherIcon] = useState<string | null>(null);
    const [weatherDesc, setWeatherDesc] = useState<string | null>(null);

    // 날짜
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        // 뉴스 가져오기
        const fnews = async () => {
            try {
                const res = await fetch('api/news?query=속보')
                const data = await res.json();
                console.log(data)
                setTopNews(data.items || []);

            } catch (error) {
                console.error('get news false', error);
            }
        }
        // 날씨 가져오기
        const fweather = async () => {
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Ansan&units=metric&appid=09f60ef0e89fd2b1d3da555ff03203ed&leng=ko`);
                const data = await res.json();
                setWeatherTemp(data.main.temp);
                setWeatherIcon(data.weather[0].icon);
                setWeatherDesc(data.weather[0].description);

            } catch (error) {
                console.error('get weather false', error);
            }
        }
        const updatas = () => {
            const now = new Date();
            setDate(now.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }));
            setTime(now.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
            })) // () 이렇게만 하면 초까지 나옴 
        }
        fnews();
        fweather();
        updatas();
        const intaval = setInterval(updatas, 1000);
        return () => clearInterval(intaval);

    }, [])

    const fsearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        try {
            const res = await fetch('api/news?query=' + encodeURIComponent(query))
            const data = await res.json();
            setSearchResult(data.items)
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <div className={styles.newsOutBox}>
            <div className={styles.leftBox}>
                <h2>실시간 뉴스</h2>
                <div className={styles.liveNewsBox}>
                    <ul className={styles.liveNewsList}>
                        {
                            topNews.map((item, idx) => (
                                <li key={`top-news-${idx}`}>
                                    <a href={item.link} target='_blank' rel='noreferrenr'>
                                        <span dangerouslySetInnerHTML={{ __html: item.title }} />
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <form onSubmit={fsearch} className={styles.searchForm}>
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder='뉴스 검색어 입력 [Ex > 날씨, 경제, 정치]' />
                    <button type="submit">검색</button>
                </form>
                {
                    // (searchResult.length > 0) ?
                    //     (
                            <div className={styles.resultBox}>
                                {
                                    searchResult?.map((item, idx) => (
                                        <div key={`news-${idx}`} className={styles.resultList}>
                                            <a href={item.link} target='_blank' rel='noreterre'>
                                                <h4 dangerouslySetInnerHTML={{ __html: item.title }} />
                                            </a>
                                            <p dangerouslySetInnerHTML={{ __html: item.description }} />
                                            <small>{item.pubDate}</small>

                                        </div>
                                    ))
                                }
                            </div>
                        // ) : null
                }
            </div>
            <div className={styles.rightBox}>
                {
                    weatherTemp !== null && weatherIcon !== null &&
                    <div className={styles.weatherBox}>
                        <h3>{date} / {time}</h3>
                        <h3>{weatherDesc}</h3>
                        <img src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`} alt="날씨 이미지" />
                        <p>{weatherTemp} &#176;C </p>
                    </div>
                }
            </div>
        </div>
    )
}

export default News