import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // 어디로 가라 라는 명령
import styles from "@/styles/Signup.module.scss";

const Signup = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [message, setMassage] = useState<string>('');

    const router = useRouter(); // 훅이라서 한번 튕겨줘야 함.

    const submitFunc = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email, password, name);
        try {
            const methodData = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email, password, name})
            }
            const res = await fetch('/api/signup', methodData);
            const data = await res.json();
            if (res.ok) {
                setMassage('회원가입 되셨습니다. 로그인해주세요.');
                setEmail('');
                setPassword('');
                setName('');
            } else {
                setMassage(data.error || '회원가입 실패');
            }
        } catch (error) {
            console.error(error);
            setMassage('전송 오류.');
        }

    }

    return (
        <div className={styles.outBox}>
            <div className={styles.bgBox}></div>
            <div className={styles.signUp}>
                <button className={styles.closeBtn} onClick={()=> router.push('/')}>X</button>
                <h2>회원가입</h2>
                <form action="" onSubmit={submitFunc}>
                    <input type="email" placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <input type="text" placeholder='name' value={name} onChange={(e)=>setName(e.target.value)}/>
                    <input type="text" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <button type="submit">가입하기</button>
                </form>
                {
                    message && <h3>{message}</h3>
                }
            </div>
        </div>
    )
}

// ctrl + shift + l => 한번에 찾아 바꾸기
export default Signup