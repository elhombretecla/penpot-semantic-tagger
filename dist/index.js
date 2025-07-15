(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}})();let i=[],d=new Map;const k=new URLSearchParams(window.location.search);document.body.dataset.theme=k.get("theme")??"light";const f=document.getElementById("selection-status"),b=document.getElementById("tagging-section"),E=document.getElementById("element-name"),s=document.getElementById("tag-select"),c=document.getElementById("custom-tag"),p=document.getElementById("properties-list"),C=document.getElementById("add-property"),L=document.getElementById("apply-tag"),T=document.getElementById("remove-tag"),g=document.getElementById("tagged-elements"),I=document.getElementById("export-tags");function x(){S(),u(),j()}function S(){C.addEventListener("click",()=>y()),L.addEventListener("click",P),T.addEventListener("click",q),I.addEventListener("click",$),s.addEventListener("change",w),c.addEventListener("input",M)}function w(){s.value&&(c.value="",B(s.value))}function M(){c.value&&(s.value="")}function B(t){p.innerHTML="",N(t).forEach(o=>{y(o.key,o.value,o.placeholder)})}function N(t){return{button:[{key:"type",value:"button",placeholder:"button, submit, reset"},{key:"onClick",value:"",placeholder:"handleClick"}],input:[{key:"type",value:"text",placeholder:"text, password, email, number"},{key:"placeholder",value:"",placeholder:"Enter your text..."},{key:"required",value:"true",placeholder:"true, false"}],a:[{key:"href",value:"",placeholder:"https://example.com"},{key:"target",value:"_blank",placeholder:"_blank, _self"}],img:[{key:"src",value:"",placeholder:"path/image.jpg"},{key:"alt",value:"",placeholder:"Image description"}],MuiButton:[{key:"variant",value:"contained",placeholder:"contained, outlined, text"},{key:"color",value:"primary",placeholder:"primary, secondary, error"},{key:"onClick",value:"",placeholder:"handleClick"}],MuiTextField:[{key:"label",value:"",placeholder:"Field label"},{key:"variant",value:"outlined",placeholder:"outlined, filled, standard"},{key:"required",value:"false",placeholder:"true, false"}],ChakraButton:[{key:"colorScheme",value:"blue",placeholder:"blue, red, green, purple"},{key:"size",value:"md",placeholder:"xs, sm, md, lg"},{key:"onClick",value:"",placeholder:"handleClick"}]}[t]||[{key:"className",value:"",placeholder:"css-class-name"}]}function y(t="",e="",o=""){var n;const a=document.createElement("div");a.className="property-item",a.innerHTML=`
    <input type="text" class="input property-key" placeholder="Property" value="${t}">
    <input type="text" class="input property-value" placeholder="${o||"Value"}" value="${e}">
    <button type="button" data-appearance="secondary" title="Remove property" class="btn-remove">-</button>
  `,(n=a.querySelector(".btn-remove"))==null||n.addEventListener("click",()=>{a.remove()}),p.appendChild(a)}function P(){if(i.length===0){alert("No elements selected");return}const t=c.value.trim()||s.value;if(!t){alert("Select or enter a tag");return}const e={};p.querySelectorAll(".property-item").forEach(n=>{const r=n.querySelector(".property-key"),l=n.querySelector(".property-value");r&&l&&r.value.trim()&&l.value.trim()&&(e[r.value.trim()]=l.value.trim())});const a={type:"apply-tag",data:{tag:t,properties:e,elementIds:i.map(n=>n.id)}};parent.postMessage(a,"*")}function q(){if(i.length===0){alert("No elements selected");return}const t={type:"remove-tag",data:{elementIds:i.map(e=>e.id)}};parent.postMessage(t,"*")}function O(t){const e={type:"remove-tag",data:{elementIds:[t]}};parent.postMessage(e,"*")}function $(){const t={type:"export-tags"};parent.postMessage(t,"*")}function j(){parent.postMessage({type:"get-selection"},"*")}function H(t){try{const e=JSON.stringify(t,null,2),o=document.createElement("div");o.style.cssText=`
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
    `;const a=document.createElement("div");a.style.cssText=`
      background: var(--db-primary);
      border-radius: 8px;
      padding: 20px;
      overflow: auto;
      height: -webkit-fill-available;
      width: -webkit-fill-available;
    `,a.innerHTML=`
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
    `,o.appendChild(a),document.body.appendChild(o);const n=a.querySelector("textarea"),r=a.querySelector("#copy-json"),l=a.querySelector("#close-modal");r.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),r.textContent="Copied!",setTimeout(()=>{r.textContent="Copy to Clipboard"},2e3)}catch{n.select(),document.execCommand("copy"),r.textContent="Copied!",setTimeout(()=>{r.textContent="Copy to Clipboard"},2e3)}}),l.addEventListener("click",()=>{document.body.removeChild(o)});const v=h=>{h.key==="Escape"&&(document.body.removeChild(o),document.removeEventListener("keydown",v))};document.addEventListener("keydown",v),n.select()}catch(e){console.error("Error showing JSON:",e),alert("Error exporting tags")}}function u(){if(i.length===0)f.textContent="Select an element on the canvas to get started",b.style.display="none";else{const t=i[0];f.textContent=`${i.length} element(s) selected`,E.textContent=t.name||"Unnamed",b.style.display="block",z(t.id)}m()}function z(t){const e=d.get(t);e?(F(e.tag)?(s.value=e.tag,c.value=""):(s.value="",c.value=e.tag),p.innerHTML="",Object.entries(e.properties).forEach(([o,a])=>{y(o,a)})):(s.value="",c.value="",p.innerHTML="")}function F(t){return Array.from(s.options).some(o=>o.value===t)}function J(t){const e=Object.entries(t);return e.length===0?"":e.map(([o,a])=>`${o}="${a}"`).join(" ")}function m(){if(d.size===0){g.innerHTML='<div class="empty-state">No tagged elements</div>';return}g.innerHTML="",d.forEach(t=>{const e=document.createElement("div");e.className="tagged-element-item";const o=J(t.properties),a=o.length>0;e.innerHTML=`
      <div class="tagged-element-info">
        <div class="tagged-element-header">
          <span class="tagged-element-name">${t.elementName}</span>
          <span class="tagged-element-tag">${t.tag}</span>
        </div>
        ${a?`<div class="tagged-element-properties">${o}</div>`:""}
      </div>
      <button type="button" class="remove-tag-btn" data-appearance="primary" data-variant="destructive" title="Remove tag" data-element-id="${t.elementId}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </button>
    `;const n=e.querySelector(".remove-tag-btn");n==null||n.addEventListener("click",()=>{O(t.elementId)}),g.appendChild(e)})}window.addEventListener("message",t=>{const e=t.data;if(e.source==="penpot")if(e.type==="themechange")document.body.dataset.theme=e.theme;else if(e.type==="selection-update")i=e.data||[],u();else if(e.type==="tag-applied"){const{elementId:o,elementName:a,tag:n,properties:r}=e.data;d.set(o,{tag:n,properties:r,elementId:o,elementName:a}),m()}else if(e.type==="tag-removed"){const{elementId:o}=e.data;d.delete(o),m(),u()}else e.type==="tags-loaded"?(d.clear(),e.data.forEach(o=>{d.set(o.elementId,o)}),m(),u()):e.type==="export-data"&&H(e.data)});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",x):x();
