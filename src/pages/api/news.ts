import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

// https://openapi.naver.com/v1/search/news.json?query=string
// [&display=Integer(기본10개)]
// [&start=Integer(검색시작위치)]
// [&sort=date(sim: 기본값-정확도 / date: 날짜순]
const news = async (req: NextApiRequest, res: NextApiResponse) => {
    const keywords = req.query.query || '뉴스' // query에 있는 query키를 가져와야함.
    // console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ'+keywords);
    const response = await fetch(`https://openapi.naver.com/v1/search/news.json?query=${ encodeURIComponent(keywords as string) }&sort=date`, {
        method: 'GET',
        headers: {
            'X-Naver-Client-Id': process.env.NAVAER_CLIENT_ID! as string,
            'X-Naver-Client-Secret': process.env.NAVAER_CLIENT_SECRET! as string
        }
    })

    const data = await response.json();
    res.status(200).json(data); // 실제 기사들은 items

}
export default news;