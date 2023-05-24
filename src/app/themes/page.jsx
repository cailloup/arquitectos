"use client"
import {Button,Input,Select} from '@/components/Assests';
import React, { useContext,useState } from 'react';

export default function test(){

    return(
        <>
            <div style={{padding:"50px"}}>
                <h1>Assests Test</h1>

               
                

                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr",gap:"30px"}}>
                    <div>
                    <Select onChange={(e) => {sessionStorage.setItem("theme", (e.currentTarget.value));location. reload()}} style={{ width: "300px"}}>
                        <option value={"default"}> selecciona tema cabeza </option>
                        <option value={"default"}> default </option>
                        <option value={"blueDark"}> blueDark </option>
                        <option value={"dark"}> Dark </option>
                    </Select>
                    </div>
                    <div>
                    <Select onChange={(e) => {sessionStorage.setItem("nav", (e.currentTarget.value))}} style={{ width: "300px"}}>
                        <option value={false}> Seleccionar color para barra </option>
                        <option value={false}> color secundario </option>
                        <option value={true}>  color primario </option>
                    </Select>
                    </div>
                </div>
                
            </div>
        
        
        </>
    )
}