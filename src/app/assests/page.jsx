"use client"
import {Button} from '@/components/Assests';
import React, { useContext,useState } from 'react';

export default function test(){

    return(
        <main>
        <div style={{padding:"50px"}}>
            <h1>Assests Test</h1>
            <select onChange={(e) => {sessionStorage.setItem("theme", (e.currentTarget.value));location. reload()}} style={{ width: "300px"}}>
                <option value={"default"}> selecciona tema cabeza </option>
                <option value={"default"}> default </option>
                <option value={"dark"}> Dark </option>

            </select>
            <br/>
            <br/> <Button secondary onClick={() => alert("hola")} >secondary Button</Button>
            <br/>
            <br/><Button onClick={() => alert("hola")} >primary Button</Button>
            <br/>
            <br/><Button disabled onClick={() => alert("hola")} >primary Button</Button>
            <br/>
            <br/><Button disabled secondary onClick={() => alert("hola")} >secondary Button</Button>
            <br/><br/>
            
        </div>
        
        
        </main>
    )
}