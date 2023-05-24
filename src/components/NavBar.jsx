"use client";
import styles from "@/styles/components/nav.module.css";
import Link from "next/link";
import { useState,useEffect} from "react";
import Image from "next/image";
import LoadScreen from "./LoadScreen";
import { useLoadScript } from "@react-google-maps/api";
import GoogleMapsConfig from "@/apis/googleMapsConfig";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import { Nav,BodyConainer } from "./Assests";
export default function NavBar({children}) {
  const [navbar, setNavbar] = useState(false);
  const [selected, setSelected] = useState(0);
  const [redirect,setRedirect] =useState(false);
  const {isLoaded} = useLoadScript(GoogleMapsConfig.scriptInit);
  const [themeValue,setTheme]= useState("default");
  const [primaryNav,setPrimary]= useState(false);

  const options = [
    {name:"Mapa", route:""},
    {name:"Registrar edificio", route:"register"},
    {name:"Panel", route:"dashboard"},
    {name:"Temas", route:"themes"},
  ]
    
  function handleClick(id) {
    setNavbar(false)
    
    if(setRedirect && id!=selected){
      //setRedirect(true)
    }
    setSelected(id);
  }
  useEffect(() => {
    const pathname = window.location.pathname;

    const segment = pathname.split('/')[1];
    const index = options.findIndex( (option) => segment==option.route )
    if (index ==-1){
      setSelected(0)
    }
    setSelected(index)

    const Value = window?.sessionStorage.getItem("theme")
    if (Value){
      setTheme(Value)
    }else{
     setTheme("default")
    }
    const primaryNavV = window?.sessionStorage.getItem("nav") == "true"
    if (primaryNavV){
      console.log(primaryNavV);
      setPrimary(true)
    }
  }, []);

  return (
    <ThemeProvider theme={theme[themeValue]}>
      <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

       <Nav primary={primaryNav} className={styles.nav}>
       <div className={styles.container}>
        <div>
          <div className={styles.logoContainer}>
            <Link href="/">
              <h2 className={styles.logo}>Mapa Virtual Arquitectura Patrimonial</h2>
            </Link>
            <div className={styles.hamburgerButton}>
              <button
                className={styles.button}
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg height="32px" id="Layer_1"  version="1.1" viewBox="0 0 512 512" width="32px" >
                    <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/>
                  </svg>
                
                ) : (
                  <svg height="32px" id="Layer_1" viewBox="0 0 32 32" width="32px"><path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className={navbar?styles.showMenu:styles.hideMenu}>
            <ul className={styles.optionsContainer}>
                {options.map((option) => (
                  <li
                    key={option.route}
                    className={`${styles.menuOption} ${option.route === selected ? styles.selected : ""}`}
                  >
                    <Link href={`/${option.route}`} onClick={() => handleClick(option.route)}>
                      {option.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
       </Nav>
      <BodyConainer>
        {redirect||!isLoaded? <LoadScreen/>:<>{children}</>}
      </BodyConainer>
    </ThemeProvider>
  );
}
