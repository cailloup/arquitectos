"use client"
/**
 * @typedef {Object} DragMenu
 * @property {function} setLeft - seter.
 */


import styles from "@/styles/components/dragMenu.module.css"
import React, { useState,forwardRef, useImperativeHandle } from 'react';
export const DragMenu = forwardRef((props,ref) => {
    const componentRef = React.useRef();
    const [left, setLeft] = useState(window.innerWidth - 20);
    const [isdraggin, setdraggin] = useState(false);
    const [transition,setTransition] = useState('all 800ms cubic-bezier(.2,.85,.49,.91)')
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
        setTransition("all 800ms cubic-bezier(.2,.85,.49,.91)")
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

    useImperativeHandle(ref, () => ({
        setLeft,
    }));
    return (
        <div className={styles.menuContainer} style={ {transition:transition, left: `max(0px,min(${left}px,calc(100vw - 20px)))` } }>
            <div  className={styles.leftBar}  onMouseDown={handleMouseDown}  onTouchStart={handleMouseDown} onMouseUp={togleForm}>
                <div className={styles.leftBarLine}/> 
            </div>
            {props.children}
        </div>
    )
})