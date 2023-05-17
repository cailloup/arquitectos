"use client"
import styles from "@/styles/components/dragMenu.module.css"
import React, { useState, useEffect } from 'react';

export default function DragMenu({children}){
    const [left, setLeft] = useState(window.innerWidth - 20);
    
    function togleForm(){
       
    }

    const handleMouseMove = (event) => {
        setLeft(event.clientX);
    };
  
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  
    const handleMouseDown = () => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };
  
    useEffect(() => {
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, []);
    return (
        <div className={styles.menuContainer} style={ {left: `min(${left}px,calc(100vw - 20px))` } }>
            <div  className={styles.leftBar}  onMouseDown={handleMouseDown}  onClick={togleForm}>
                <div className={styles.leftBarLine}/> 
            </div>
            {children}
        </div>
    )
}