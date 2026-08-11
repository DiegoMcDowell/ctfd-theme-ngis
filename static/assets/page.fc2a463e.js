import{C as s,m as e}from"./index.b6194f80.js";window.CTFd=s;window.Alpine=e;e.start();async function d(){return(await(await fetch("/api/v1/scoreboard")).json()).data}function c(o){const a=document.getElementById("scoreboard-widget"),r=o.map(t=>`
        <li>${t.pos}. ${t.name} \u2014 ${t.score} pts</li>
    `).join("");a.innerHTML=`<ul>${r}</ul>`}async function n(){const o=await d();c(o)}n();setInterval(n,1e4);
