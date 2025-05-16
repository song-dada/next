import type { NextApiResponse, NextApiRequest } from "next";
import { db } from "@/lib/db";
import bcrypt from 'bcrypt';
import { error } from "console";

const bsf = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '허용한되는 메서드' });
    }

    console.log(req);
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: `값이 없습니다. ${email}, ${password}, ${name}`});
    }

    try {
        // const res = db.query();
        // const data = res[0];
        const [data] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if ((data as any[]).length > 0) {
            return res.status(405).json({ error: '이미 존재하는 아이디 입니다.' })
        }

        const hashPw = await bcrypt.hash(password, 10); // 암호화 방식

        await db.query(`
            INSERT INTO users (email, password, name)
            VALUES( ?, ?, ?);`, [email, hashPw, name]);

        res.status(200).json({message : '회원가입 성공'})

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버오류' });
    }
}

export default bsf;