"use client";
import styles from "@/styles/components/nav.module.css";
import Link from "next/link";
import { useState,useEffect} from "react";
import Image from "next/image";
import LoadScreen from "./LoadScreen";
import { useLoadScript } from "@react-google-maps/api";
import GoogleMapsConfig from "@/apis/googleMapsConfig";
import { ToastContainer } from "react-toastify";

export default function NavBar({children}) {
  const [navbar, setNavbar] = useState(false);
  const [selected, setSelected] = useState(0);
  const [redirect,setRedirect] =useState(false);
  const {isLoaded} = useLoadScript(GoogleMapsConfig.scriptInit);
 

  const options = [
    {name:"Mapa", route:""},
    {name:"Registrar edificio", route:"register"},
    {name:"Contacto", route:"contact"},
    {name:"Panel", route:"dashboard"}]
    
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


  return (
    <>
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
      <nav className={`${styles.nav} secondary-background`}>
        <div className={styles.container}>
          <div>
            <div className={styles.logoContainer}>
              <Link href="/">
                <h2 className={`${styles.logo} constrast-secondary-color`}>MAP(IA)</h2>
              </Link>
              <div className={styles.hamburgerButton}>
                <button
                  className={styles.button}
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <Image src="/close.svg" width={30} height={30} alt="logo" />
                  ) : (
                    <svg height="30px" id="Layer_1" className={`${styles.hamburgerButton} constrast-secondary-color`} version="1.1" viewBox="0 0 32 32" width="30px" ><path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg>
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
                      <Link href={`/${option.route}`} onClick={() => handleClick(option.route)} className={`constrast-secondary-color ${styles.optionText}`}>
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
      </>
  );
}
