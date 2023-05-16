"use client";
import styles from "@/styles/components/nav.module.css";
import Link from "next/link";
import { useState,useEffect} from "react";
import Image from "next/image";

export default function NavBar({children,setRedirect}) {
  const [navbar, setNavbar] = useState(false);
  const [selected, setSelected] = useState(0);

  const options = [
    {name:"Mapa",
    route:""},
    {name:"Registrar edificio",
    route:"register"},
    {name:"Contacto",
    route:"contact"},
    {name:"Panel",
    route:"dashboard"}]
    
  function handleClick(id) {
    setNavbar(false)
    
    if(setRedirect && id!=selected){
      setRedirect(true)
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

                {options.map( (option,index) => 
                <li key={index} className=  {index==selected? [styles.menuOption,styles.selected].join(" "):styles.menuOption  } >
                <Link href={`/${option.route}`} onClick={() => handleClick(index)}>
                  {option.name}
                </Link>
              </li>
                )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
    {children}
    </>
  );
}
