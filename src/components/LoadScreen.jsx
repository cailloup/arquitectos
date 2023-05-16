"use client";
import styles from "@/styles/components/LoadScreen.module.css";
import NavBar from "./NavBar";
export default function LoadScreen(){
    return(
        <NavBar>
            <main className={styles.main}>
                <div>
                    <div className={styles.loader}></div>
                    <h1 className={styles.loadText}>Cargando</h1>
                </div>
                
            </main>
        </NavBar>
    )
}

