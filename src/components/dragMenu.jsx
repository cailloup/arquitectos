"use client"
/**
 * @typedef {Object} DragMenu
 * @property {function} setOpen - seter.
 * @property {function} setHide - seter.
 */

import styles from "@/styles/components/dragMenu.module.css"
import React, { useState,forwardRef, useImperativeHandle } from 'react';
import { Container,LeftBar,LeftBarLine } from "./Assests";

export const DragMenu = forwardRef(({defaultWidth,free,...props},ref) => {
    const componentRef = React.useRef();
    const [close, setOpen] = useState(false);
    const [hide, setHide] = useState(true);
    
    function togleForm(){
            setOpen(!close);
    }

    useImperativeHandle(ref, () => ({
        setOpen,
        setHide,
    }));

    return (
        <Container  style={{width: `${defaultWidth}%`}} className={`${styles.menuContainer}  ${close?styles.close:''} ${hide?styles.hide:''} `} >
            <LeftBar  className={styles.leftBar}  onClick={togleForm}>
                <LeftBarLine className={styles.leftBarLine}/> 
            </LeftBar>
            {props.children}
        </Container>
    )
})