import { NextApiRequest, NextApiResponse } from "next";

const fLogout = async (req: NextApiRequest, res: NextApiResponse)=>{
    res.setHeader('Set-Cookie', 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')
    // Thu, 01 Jan 1970 00:00:00 GMT 과거시간을 임력함. 만료시킴. 
    res.status(200).json({message: '로그아웃 완료됨'})
}
export default fLogout;