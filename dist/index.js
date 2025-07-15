(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();let i=[],d=new Map;const E=new URLSearchParams(window.location.search);document.body.dataset.theme=E.get("theme")??"light";const h=document.getElementById("selection-status"),b=document.getElementById("tagging-section"),k=document.getElementById("element-name"),s=document.getElementById("tag-select"),c=document.getElementById("custom-tag"),p=document.getElementById("properties-list"),C=document.getElementById("add-property"),L=document.getElementById("apply-tag"),T=document.getElementById("remove-tag"),g=document.getElementById("tagged-elements"),I=document.getElementById("export-tags");function x(){S(),u(),$()}function S(){C.addEventListener("click",()=>y()),L.addEventListener("click",P),T.addEventListener("click",O),I.addEventListener("click",q),s.addEventListener("change",w),c.addEventListener("input",B)}function w(){s.value&&(c.value="",M(s.value))}function B(){c.value&&(s.value="")}function M(n){p.innerHTML="",N(n).forEach(t=>{y(t.key,t.value,t.placeholder)})}function N(n){return{button:[{key:"type",value:"button",placeholder:"button, submit, reset"},{key:"onClick",value:"",placeholder:"handleClick"}],input:[{key:"type",value:"text",placeholder:"text, password, email, number"},{key:"placeholder",value:"",placeholder:"Enter your text..."},{key:"required",value:"true",placeholder:"true, false"}],a:[{key:"href",value:"",placeholder:"https://example.com"},{key:"target",value:"_blank",placeholder:"_blank, _self"}],img:[{key:"src",value:"",placeholder:"path/image.jpg"},{key:"alt",value:"",placeholder:"Image description"}],MuiButton:[{key:"variant",value:"contained",placeholder:"contained, outlined, text"},{key:"color",value:"primary",placeholder:"primary, secondary, error"},{key:"onClick",value:"",placeholder:"handleClick"}],MuiTextField:[{key:"label",value:"",placeholder:"Field label"},{key:"variant",value:"outlined",placeholder:"outlined, filled, standard"},{key:"required",value:"false",placeholder:"true, false"}],ChakraButton:[{key:"colorScheme",value:"blue",placeholder:"blue, red, green, purple"},{key:"size",value:"md",placeholder:"xs, sm, md, lg"},{key:"onClick",value:"",placeholder:"handleClick"}]}[n]||[{key:"className",value:"",placeholder:"css-class-name"}]}function y(n="",e="",t=""){var a;const o=document.createElement("div");o.className="property-item",o.innerHTML=`
    <input type="text" class="input property-key" placeholder="Property" value="${n}">
    <input type="text" class="input property-value" placeholder="${t||"Value"}" value="${e}">
    <button type="button" data-appearance="primary" data-variant="destructive" title="Remove property" class="btn-remove">×</button>
  `,(a=o.querySelector(".btn-remove"))==null||a.addEventListener("click",()=>{o.remove()}),p.appendChild(o)}function P(){if(i.length===0){alert("No elements selected");return}const n=c.value.trim()||s.value;if(!n){alert("Select or enter a tag");return}const e={};p.querySelectorAll(".property-item").forEach(a=>{const r=a.querySelector(".property-key"),l=a.querySelector(".property-value");r&&l&&r.value.trim()&&l.value.trim()&&(e[r.value.trim()]=l.value.trim())});const o={type:"apply-tag",data:{tag:n,properties:e,elementIds:i.map(a=>a.id)}};parent.postMessage(o,"*")}function O(){if(i.length===0){alert("No elements selected");return}const n={type:"remove-tag",data:{elementIds:i.map(e=>e.id)}};parent.postMessage(n,"*")}function q(){const n={type:"export-tags"};parent.postMessage(n,"*")}function $(){parent.postMessage({type:"get-selection"},"*")}function j(n){try{const e=JSON.stringify(n,null,2),t=document.createElement("div");t.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    `;const o=document.createElement("div");o.style.cssText=`
      background: var(--db-primary);
      border-radius: 8px;
      padding: 20px;
      overflow: auto;
      height: -webkit-fill-available;
      width: -webkit-fill-available;
    `,o.innerHTML=`
      <h2 style="margin-top: 0;">Tag Export</h2>
      <p style="margin-bottom: 16px;">Copy the following JSON and save it to a .json file:</p>
      <textarea readonly style="
        width: 100%;
        height: 80%;
        font-family: monospace;
        font-size: 14px;
        background: var(--db-secondary);
        border-radius: 4px;
        padding: 10px;
        color: var(--app-blue);
        resize: vertical;
        box-sizing: border-box;
      ">${e}</textarea>
      <div style="margin-top: 15px; display: flex; gap: 10px;">
        <button id="copy-json" data-appearance="primary">Copy to Clipboard</button>
        <button id="close-modal" data-appearance="secondary">Close</button>
      </div>
    `,t.appendChild(o),document.body.appendChild(t);const a=o.querySelector("textarea"),r=o.querySelector("#copy-json"),l=o.querySelector("#close-modal");r.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),r.textContent="Copied!",setTimeout(()=>{r.textContent="Copy to Clipboard"},2e3)}catch{a.select(),document.execCommand("copy"),r.textContent="Copied!",setTimeout(()=>{r.textContent="Copy to Clipboard"},2e3)}}),l.addEventListener("click",()=>{document.body.removeChild(t)});const v=f=>{f.key==="Escape"&&(document.body.removeChild(t),document.removeEventListener("keydown",v))};document.addEventListener("keydown",v),a.select()}catch(e){console.error("Error showing JSON:",e),alert("Error exporting tags")}}function u(){if(i.length===0)h.textContent="Select an element on the canvas to get started",b.style.display="none";else{const n=i[0];h.textContent=`${i.length} element(s) selected`,k.textContent=n.name||"Unnamed",b.style.display="block",H(n.id)}m()}function H(n){const e=d.get(n);e?(z(e.tag)?(s.value=e.tag,c.value=""):(s.value="",c.value=e.tag),p.innerHTML="",Object.entries(e.properties).forEach(([t,o])=>{y(t,o)})):(s.value="",c.value="",p.innerHTML="")}function z(n){return Array.from(s.options).some(t=>t.value===n)}function F(n){const e=Object.entries(n);return e.length===0?"":e.map(([t,o])=>`${t}="${o}"`).join(" ")}function m(){if(d.size===0){g.innerHTML='<div class="empty-state">No tagged elements</div>';return}g.innerHTML="",d.forEach(n=>{const e=document.createElement("div");e.className="tagged-element-item";const t=F(n.properties),o=t.length>0;e.innerHTML=`
      <div class="tagged-element-info">
        <div class="tagged-element-header">
          <span class="tagged-element-name">${n.elementName}</span>
          <span class="tagged-element-tag">${n.tag}</span>
        </div>
        ${o?`<div class="tagged-element-properties">${t}</div>`:""}
      </div>
    `,g.appendChild(e)})}window.addEventListener("message",n=>{const e=n.data;if(e.source==="penpot")if(e.type==="themechange")document.body.dataset.theme=e.theme;else if(e.type==="selection-update")i=e.data||[],u();else if(e.type==="tag-applied"){const{elementId:t,elementName:o,tag:a,properties:r}=e.data;d.set(t,{tag:a,properties:r,elementId:t,elementName:o}),m()}else if(e.type==="tag-removed"){const{elementId:t}=e.data;d.delete(t),m(),u()}else e.type==="tags-loaded"?(d.clear(),e.data.forEach(t=>{d.set(t.elementId,t)}),m(),u()):e.type==="export-data"&&j(e.data)});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",x):x();
