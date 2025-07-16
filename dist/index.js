(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=n(a);fetch(a.href,r)}})();let i=[],c=new Map;const T=new URLSearchParams(window.location.search);document.body.dataset.theme=T.get("theme")??"light";const x=document.getElementById("selection-status"),k=document.getElementById("tagging-section"),I=document.getElementById("element-name"),s=document.getElementById("tag-select"),d=document.getElementById("custom-tag"),u=document.getElementById("properties-list"),S=document.getElementById("add-property"),w=document.getElementById("apply-tag"),$=document.getElementById("remove-tag"),h=document.getElementById("tagged-elements"),M=document.getElementById("export-tags");function E(){B(),y(),F()}function B(){S.addEventListener("click",()=>b()),w.addEventListener("click",q),$.addEventListener("click",H),M.addEventListener("click",U),s.addEventListener("change",N),d.addEventListener("input",P)}function N(){s.value&&(d.value="",j(s.value))}function P(){d.value&&(s.value="")}function j(t){u.innerHTML="",O(t).forEach(n=>{b(n.key,n.value,n.placeholder)})}function O(t){return{button:[{key:"type",value:"button",placeholder:"button, submit, reset"},{key:"onClick",value:"",placeholder:"handleClick"}],input:[{key:"type",value:"text",placeholder:"text, password, email, number"},{key:"placeholder",value:"",placeholder:"Enter your text..."},{key:"required",value:"true",placeholder:"true, false"}],a:[{key:"href",value:"",placeholder:"https://example.com"},{key:"target",value:"_blank",placeholder:"_blank, _self"}],img:[{key:"src",value:"",placeholder:"path/image.jpg"},{key:"alt",value:"",placeholder:"Image description"}],MuiButton:[{key:"variant",value:"contained",placeholder:"contained, outlined, text"},{key:"color",value:"primary",placeholder:"primary, secondary, error"},{key:"onClick",value:"",placeholder:"handleClick"}],MuiTextField:[{key:"label",value:"",placeholder:"Field label"},{key:"variant",value:"outlined",placeholder:"outlined, filled, standard"},{key:"required",value:"false",placeholder:"true, false"}],ChakraButton:[{key:"colorScheme",value:"blue",placeholder:"blue, red, green, purple"},{key:"size",value:"md",placeholder:"xs, sm, md, lg"},{key:"onClick",value:"",placeholder:"handleClick"}]}[t]||[{key:"className",value:"",placeholder:"css-class-name"}]}function b(t="",e="",n=""){var a;const o=document.createElement("div");o.className="property-item",o.innerHTML=`
    <input type="text" class="input property-key" placeholder="Property" value="${t}">
    <input type="text" class="input property-value" placeholder="${n||"Value"}" value="${e}">
    <button type="button" data-appearance="secondary" title="Remove property" class="btn-remove">-</button>
  `,(a=o.querySelector(".btn-remove"))==null||a.addEventListener("click",()=>{o.remove()}),u.appendChild(o)}function q(){if(i.length===0){alert("No elements selected");return}const t=d.value.trim()||s.value;if(!t){alert("Select or enter a tag");return}const e={};u.querySelectorAll(".property-item").forEach(a=>{const r=a.querySelector(".property-key"),l=a.querySelector(".property-value");r&&l&&r.value.trim()&&l.value.trim()&&(e[r.value.trim()]=l.value.trim())});const o={type:"apply-tag",data:{tag:t,properties:e,elementIds:i.map(a=>a.id)}};parent.postMessage(o,"*")}function H(){if(i.length===0){alert("No elements selected");return}const t={type:"remove-tag",data:{elementIds:i.map(e=>e.id)}};parent.postMessage(t,"*")}function z(t){const e={type:"remove-tag",data:{elementIds:[t]}};parent.postMessage(e,"*")}function U(){const t={type:"export-tags"};parent.postMessage(t,"*")}function F(){parent.postMessage({type:"get-selection"},"*")}function _(t){try{const e=JSON.stringify(t,null,2),n=document.createElement("div");n.style.cssText=`
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
    `,n.appendChild(o),document.body.appendChild(n);const a=o.querySelector("textarea"),r=o.querySelector("#copy-json"),l=o.querySelector("#close-modal");r.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),r.textContent="Copied!",setTimeout(()=>{r.textContent="Copy to Clipboard"},2e3)}catch{a.select(),document.execCommand("copy"),r.textContent="Copied!",setTimeout(()=>{r.textContent="Copy to Clipboard"},2e3)}}),l.addEventListener("click",()=>{document.body.removeChild(n)});const m=g=>{g.key==="Escape"&&(document.body.removeChild(n),document.removeEventListener("keydown",m))};document.addEventListener("keydown",m),a.select()}catch(e){console.error("Error showing JSON:",e),alert("Error exporting tags")}}function y(){if(i.length===0)x.textContent="Select an element on the canvas to get started",k.style.display="none";else{const t=i[0];x.textContent=`${i.length} element(s) selected`,I.textContent=t.name||"Unnamed",k.style.display="block",J(t.id)}v()}function J(t){const e=c.get(t);e?(A(e.tag)?(s.value=e.tag,d.value=""):(s.value="",d.value=e.tag),u.innerHTML="",Object.entries(e.properties).forEach(([n,o])=>{b(n,o)})):(s.value="",d.value="",u.innerHTML="")}function A(t){return Array.from(s.options).some(n=>n.value===t)}function R(t){const e=Object.entries(t);return e.length===0?"":e.map(([n,o])=>`${n}="${o}"`).join(" ")}function V(t){if(!t)return"";const e=Object.entries(t).filter(([n,o])=>o&&o!=="").slice(0,3);return e.length===0?"":e.map(([n,o])=>`${n}: ${o}`).join("; ")}function K(t){if(!t)return"";const e=Object.entries(t).filter(([n,o])=>o&&o!=="").slice(0,2);return e.length===0?"":e.map(([n,o])=>`${n}: ${o}`).join("; ")}function v(){if(c.size===0){h.innerHTML='<div class="empty-state">No tagged elements</div>';return}h.innerHTML="",c.forEach(t=>{const e=document.createElement("div");e.className="tagged-element-item";const n=R(t.properties),o=V(t.styles),a=K(t.layout),r=n.length>0,l=o.length>0,m=a.length>0,g=t.content&&t.content.trim().length>0,C=t.imageUrl&&t.imageUrl.length>0;let p="";if(g){const L=t.content.length>30?t.content.substring(0,30)+"...":t.content;p+=`<div class="tagged-element-content">📝 "${L}"</div>`}C&&(p+=`<div class="tagged-element-image">🖼️ ${t.imageUrl}</div>`),l&&(p+=`<div class="tagged-element-styles">🎨 ${o}</div>`),m&&(p+=`<div class="tagged-element-layout">📐 ${a}</div>`),e.innerHTML=`
      <div class="tagged-element-info">
        <div class="tagged-element-header">
          <span class="tagged-element-name">${t.elementName}</span>
          <span class="tagged-element-tag">${t.tag}</span>
          ${t.elementType?`<span class="tagged-element-type">(${t.elementType})</span>`:""}
        </div>
        ${r?`<div class="tagged-element-properties">⚙️ ${n}</div>`:""}
        ${p}
      </div>
      <button type="button" class="remove-tag-btn" data-appearance="primary" data-variant="destructive" title="Remove tag" data-element-id="${t.elementId}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </button>
    `;const f=e.querySelector(".remove-tag-btn");f==null||f.addEventListener("click",()=>{z(t.elementId)}),h.appendChild(e)})}window.addEventListener("message",t=>{const e=t.data;if(e.source==="penpot")if(e.type==="themechange")document.body.dataset.theme=e.theme;else if(e.type==="selection-update")i=e.data||[],y();else if(e.type==="tag-applied"){const{elementId:n,elementName:o,tag:a,properties:r}=e.data;c.set(n,{tag:a,properties:r,elementId:n,elementName:o}),v()}else if(e.type==="tag-removed"){const{elementId:n}=e.data;c.delete(n),v(),y()}else e.type==="tags-loaded"?(c.clear(),e.data.forEach(n=>{c.set(n.elementId,n)}),v(),y()):e.type==="export-data"&&_(e.data)});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",E):E();
