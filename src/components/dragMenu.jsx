"use client"
import styles from "@/styles/components/dragMenu.module.css"
import React, { useState } from 'react';

export default function DragMenu({children}){
    const [left, setLeft] = useState(window.innerWidth - 20);
    const [isdraggin, setdraggin] = useState(false);
    const [transition,setTransition] = useState('all 350ms')
    function togleForm(){
        if(isdraggin)
            return
        if(left<window.innerWidth/2){
            setLeft(window.innerWidth - 20)
        }else{
            setLeft(0)
        }
    }

    const handleMouseMove = (event) => {
        const clientX = event.type == 'mousemove'?event.clientX:event.touches[0].clientX
        setLeft( clientX);
        setdraggin(true)
        setTransition("all 0ms")
    };
  
    const handleMouseUp = () => {
        setdraggin(false)
        setTransition("all 350ms")
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
    };
  
    const handleMouseDown = () => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        window.addEventListener('touchmove', handleMouseMove);
        window.addEventListener('touchend', handleMouseUp);
    };
  
    return (
        <div className={styles.menuContainer} style={ {transition:transition, left: `max(0px,min(${left}px,calc(100vw - 20px)))` } }>
            <div  className={styles.leftBar}  onMouseDown={handleMouseDown}  onTouchStart={handleMouseDown} onMouseUp={togleForm}>
                <div className={styles.leftBarLine}/> 
            </div>
            {children}
        </div>
    )
}