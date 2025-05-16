import React, { useState, useEffect } from 'react'
import Link from "next/link";
import { useRouter } from 'next/router';
import styles from '@/styles/Navbar.module.scss';


const Navbar = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const router = useRouter();
    const checkLogin = async () => {
        try {
            const res = await fetch('api/me', {
                credentials: 'include',
            })
            setIsLogin(res.ok);
        } catch (error) {
            setIsLogin(false);
        }
    }

    useEffect(() => {
        checkLogin();
        router.events.on('routeChangeComplete', checkLogin) // addEventListener 랑 비슷한거
        // 라우터의 값이 변경-완료 되었을때 마다 이벤트를 함.
        return () => {
            router.events.off('routeChangeComplete', checkLogin) // removeEventListener 랑 비슷한거

        }
    }, [router.events]) // 라우터의 이벤트(path가 변할때)가 일어났을때 마나 로그인 결과를 확인함

    const logoutFunc = async () => {
        await fetch('api/logout');
        setIsLogin(false);
        router.push('/');
    }
    return (
        <div className={styles.navbar}>
            <div className={styles.logo}><Link href="/">Next Project</Link></div>
            <ul className={styles.menu}>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/about">About</Link>
                </li>
                <li>
                    <Link href="/news">News</Link>
                </li>
                <li>
                    <Link href="/map">Map</Link>
                </li>
                {
                    isLogin ?
                        <li>
                            <button onClick={logoutFunc} className={styles.logout}>Logout</button>
                        </li> :
                        (
                            <>
                                <li>
                                    <Link href="/signup">Sign Up</Link>
                                </li>
                                <li>
                                    <Link href="/login">Login</Link>
                                </li>
                            </>
                        )
                }
            </ul>
        </div>
    )
}

export default Navbar