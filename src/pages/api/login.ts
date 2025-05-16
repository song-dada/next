import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // 로그인 하고 쓸거
import { serialize } from "cookie"; // 로그인 하고 쓸거

const flog = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '허용한되는 메서드' });
    }
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ req: req.body, error: `${email}, ${password}` });
    }
    try {
        const data = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = (data as any)[0][0];
        // return res.status(401).json({w: await user.password, m: await user.email})
        // return res.status(401).json({p: password, w: await user.password, e:email, m: await user.email})
        if (!user) {
            return res.status(401).json({ error: '이메일이 존재하지 않습니다.' });
        }

        // 디버깅: 비밀번호 값들이 제대로 전달되는지 확인
        console.log("User users from DB:", user);
        console.log("User id from DB:", user.id);
        console.log("User password from DB:", user.password);
        console.log("Password entered by user:", password);

        const isCheck = await bcrypt.compare(password, user.password); // 해시 비교


        if (!isCheck) {
            return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
        }
        // 일치 했을때 토큰을 줘야함.
        const token = jwt.sign(// 시크릿 사용을 위한 선언이 필요함
            { id: user.id, email: user.email, name: user.name }, // 페이로드 = 사용자 정보
            process.env.JWT_SECRET!, // 무조건 있어야 해 => !는 단언
            { expiresIn: '1h' } // expiresIn 만료 시간을  넣어준다.
        );
        // jwt.sign( 사용자 정보, 시크릿키, 만료시간(30m, 1h, 3d)) => 토큰 선언.
        // 토큰이 완료 되면 쿠키에게 줘야함.
        // serialize ( '쿠기이름', 쿠키의 값, {옵션}) => 기본사용법
        const cookie = serialize('token', token, { // tokrn 이 아니고 다른걸 넣을 수도 있음.
            httpOnly: true,
            path: '/',
            maxAge: 3*24*60*60 // 일*시간*분*초 // 쿠키의 유효시간. 무조건 초단윈.
            // 쿠키의 유지시간, 초단위로 들어감, 관례(한시간: 60 * 60 / 3일: 3 * 24 * 60 * 60)
        });

        // setHeader( 헤더이름(예약된 이름), 헤더값 )
        // setHeader( 'Content-Type', 'appplication/json') -> 요런거. // 쿠키는 직렬화를 알아들음
        res.setHeader('Set-Cookie', cookie);
        res.status(200).json({message: '로그인 성공'});

    } catch (error) {
        res.status(500).json({error: `${error}`});

    }
}

export default flog;