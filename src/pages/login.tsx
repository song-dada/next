import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "@/styles/Login.module.scss";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const flogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email, password})
            })
            const data = await res.json();

            if (res.ok) {
                setMessage('login 성공');
                setTimeout(() => {
                    router.push('/');
                }, 1000)
            } else {
                console.log(data);
                setMessage('login 실패');

            }
        } catch (error) {
            console.error(error);
            setMessage('서버 오류');
        }
    }
    return (
        <div className={styles.outBox}>
            <div className={styles.bgBox}></div>
            <main className={styles.logBox}>
                <button className={styles.closeBtn} onClick={() => { router.push('/') }}>
                    X
                </button>
                <h2>Login</h2>
                <form onSubmit={flogin}>
                    <input type="email" name="email" id="email" placeholder='이메일 입력'
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" name="password" id="password" placeholder='비밀번호 입력'
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit">로그인</button>
                </form>
                {
                    message && <h3>{message}</h3>
                }
            </main>
        </div>
    )
}

export default Login