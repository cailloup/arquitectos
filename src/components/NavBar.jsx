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

export default function NavBar({children}) {
  const [navbar, setNavbar] = useState(false);
  const [selected, setSelected] = useState(0);
  const [redirect,setRedirect] =useState(false);
  const {isLoaded} = useLoadScript(GoogleMapsConfig.scriptInit);
 

  const options = [
    {name:"Mapa", route:""},
    {name:"Registrar edificio", route:"register"},
    {name:"Contacto", route:"contact"},
    {name:"Panel", route:"dashboard"},
    {name:"Assests", route:"assests"},
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
  }, []);

  function getTheme() {
    const themeValue = window?.sessionStorage.getItem("theme")

    if (themeValue){
      return theme[themeValue]
    }else{
      return theme.default
    }

  }
  return (
    <ThemeProvider theme={getTheme}>
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
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div>
            <div className={styles.logoContainer}>
              <Link href="/">
                <h2 className={styles.logo}>MAP(IA)</h2>
              </Link>
              <div className={styles.hamburgerButton}>
                <button
                  className={styles.button}
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <Image src="/close.svg" width={30} height={30} alt="logo" />
                  ) : (
                    <Image
                      src="/hamburger-menu.svg"
                      width={30}
                      height={30}
                      alt="logo"
                      className={styles.hamburgerButton}
                    />
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
      </nav>
      {redirect||!isLoaded? <LoadScreen/>:<>{children}</>}
    </ThemeProvider>
  );
}
