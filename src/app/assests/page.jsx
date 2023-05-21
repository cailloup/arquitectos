"use client"
import {Button,Input,Select} from '@/components/Assests';
import React, { useContext,useState } from 'react';

export default function test(){

    return(
        <>
            <div style={{padding:"50px"}}>
                <h1>Assests Test</h1>
                <Select onChange={(e) => {sessionStorage.setItem("theme", (e.currentTarget.value));location. reload()}} style={{ width: "300px"}}>
                    <option value={"default"}> selecciona tema cabeza </option>
                    <option value={"default"}> default </option>
                    <option value={"blueDark"}> blueDark </option>
                    <option value={"dark"}> Dark </option>
                </Select>
                <Select onChange={(e) => {sessionStorage.setItem("nav", (e.currentTarget.value))}} style={{ width: "300px"}}>
                <option value={false}> default </option>
                    <option value={false}> secondaryNaav </option>
                    <option value={true}> primaryNav </option>
                </Select>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr",gap:"30px"}}>
                    <div>
                        <h1>Button</h1>
                        <br/> <Button secondary onClick={() => alert("Brindo contigo, Hölderlin")} >secondary Button</Button>
                        <br/>
                        <br/><Button onClick={() => alert("Brindo contigo, Hölderlin")} >primary Button</Button>
                        <br/>
                        <br/><Button disabled onClick={() => alert("Brindo contigo, Hölderlin")} >primary Button</Button>
                        <br/>
                        <br/><Button disabled secondary onClick={() => alert("Brindo contigo, Hölderlin")} >secondary Button</Button>
                        <br/><br/>
                    </div>
                    <div>
                        <h1>Input</h1>
                        <br/> <Input placeHolder="Input example" />
                        <br/>
                        <br/><Select  > Button
                            <option value={"default"}> default </option>
                            <option value={"blueDark"}> blueDark </option>
                            <option value={"dark"}> Dark </option>
                        </Select>
                        <br/>
                        <br/><Button disabled onClick={() => alert("Brindo contigo, Hölderlin")} >primary Button</Button>
                        <br/>
                        <br/><Button disabled secondary onClick={() => alert("Brindo contigo, Hölderlin")} >secondary Button</Button>
                        <br/><br/>
                    </div>
                </div>
                
            </div>
        
        
        </>
    )
}