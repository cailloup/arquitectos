"use client";
import styles from "../styles/nav.module.css";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
export default function NavBar() {
  const [navbar, setNavbar] = useState(true);
  const [selected, setSelected] = useState(0);
  
  const options = [
    {name:"Mapa",
    route:""},
    {name:"Registrar edificio",
    route:"register"},
    {name:"Contacto",
    route:"contact"},
    {name:"Iniciar Sesion",
    route:"login"}]

  function buttonClass(id) {
    return `pb-6 text-xl ${
      selected == id ? "text-sky-700" : "text-black"
    } py-2 px-6 text-center  border-b-2 md:border-b-0 hover:border-b-4   hover:bg-sky-700  border-sky-900  md:hover:text-sky-700 md:hover:bg-transparent duration-200`;
  }

  function handleClick(id) {
    
    setSelected(id);
  }
  return (
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
  );
}
