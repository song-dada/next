import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie"
// 로그인 상태를 저장하는 파일


const fme = (req: NextApiRequest, res: NextApiResponse)=>{
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;

    if(!token) return res.status(401).end();

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET!) // verify 토큰 안의 정보를 읽을수 있는걸로 바꿔줌
        res.status(200).json({user : decode})
    }
    catch(error){
        console.error('me.ts',error);
        return res.status(401).end();
    }
}
export default fme;
