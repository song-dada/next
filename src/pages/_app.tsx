import "@/styles/globals.scss";
import type { AppProps } from "next/app"; // 넥스트에서 지원. 하나의 타입으로 가져옴
import Navbar from "@/com/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar/>
      <Component {...pageProps} /> 
      {/* // pageProps 컴포넌트가 나타났으면 좋겠다. */}
    </>

  )
}
