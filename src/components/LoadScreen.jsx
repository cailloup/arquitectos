import styles from './LoadScreen.module.css';
export default function LoadScreen(){
    return(
        <main className={styles.main}>
            <div>
                <div className={styles.loader}></div>
                <h1 className={styles.loadText}>Cargando</h1>
            </div>
            
        </main>
    )
}

