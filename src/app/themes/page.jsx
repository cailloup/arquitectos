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
                    <Select onChange={(e) => {sessionStorage.setItem("theme", (e.currentTarget.value));location. reload()}} style={{ width: "500px"}}>
                        <option value={"default"}> seleccione Tema</option>
                        <option value={"default"}> default </option>
                        <option value={"blueDark"}> blueDark </option>
                        <option value={"dark"}> Dark </option>
                    </Select><br /><br />
                    <Select onChange={(e) => {sessionStorage.setItem("nav", (e.currentTarget.value))}} style={{ width: "500px"}}>
                        <option value={false}> Seleccione color para la barra de navegacion</option>
                        <option value={true}>  color primario </option>
                        <option value={false}> color secundario </option> 
                    </Select>
                    </div>
                    <div>
                    
                    </div>
                </div>
                
            </div>
        
        
        </>
    )
}