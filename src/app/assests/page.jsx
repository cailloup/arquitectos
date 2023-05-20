"use client"
import { ThemeProvider } from 'styled-components';

import {Button} from '@/components/Assests';
export default function test(){
    return(
        <main>
        <div style={{padding:"50px"}}>
            
        {/* Contenido de tu aplicación */}
               <br/> <Button secondary onClick={() => alert("hola")} >secondary Button</Button>
               <br/>
               <br/><Button onClick={() => alert("hola")} >primary Button</Button>
               <br/>
               <br/><Button disabled onClick={() => alert("hola")} >primary Button</Button>
               <br/>
               <br/><Button disabled secondary onClick={() => alert("hola")} >secondary Button</Button>
        </div>
        
        
        </main>
    )
}