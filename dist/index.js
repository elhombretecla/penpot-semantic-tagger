(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const s of l.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(a){if(a.ep)return;a.ep=!0;const l=n(a);fetch(a.href,l)}})();let r=[],c=new Map;const S=new URLSearchParams(window.location.search);document.body.dataset.theme=S.get("theme")??"light";const E=document.getElementById("selection-status"),C=document.getElementById("tagging-section"),w=document.getElementById("element-name"),i=document.getElementById("tag-select"),d=document.getElementById("custom-tag"),m=document.getElementById("properties-list"),$=document.getElementById("add-property"),B=document.getElementById("apply-tag"),M=document.getElementById("remove-tag"),k=document.getElementById("tagged-elements"),N=document.getElementById("export-tags"),P=document.getElementById("auto-tag-enabled"),q=document.getElementById("auto-tag-selection"),f=document.getElementById("auto-tag-feedback");function L(){j(),v(),R()}function j(){$.addEventListener("click",()=>x()),B.addEventListener("click",U),M.addEventListener("click",A),N.addEventListener("click",J),i.addEventListener("change",O),d.addEventListener("input",H),q.addEventListener("click",V),K()}function O(){i.value&&(d.value="",F(i.value))}function H(){d.value&&(i.value="")}function F(t){m.innerHTML="",z(t).forEach(n=>{x(n.key,n.value,n.placeholder)})}function z(t){return{button:[{key:"type",value:"button",placeholder:"button, submit, reset"},{key:"onClick",value:"",placeholder:"handleClick"}],input:[{key:"type",value:"text",placeholder:"text, password, email, number"},{key:"placeholder",value:"",placeholder:"Enter your text..."},{key:"required",value:"true",placeholder:"true, false"}],a:[{key:"href",value:"",placeholder:"https://example.com"},{key:"target",value:"_blank",placeholder:"_blank, _self"}],img:[{key:"src",value:"",placeholder:"path/image.jpg"},{key:"alt",value:"",placeholder:"Image description"}],MuiButton:[{key:"variant",value:"contained",placeholder:"contained, outlined, text"},{key:"color",value:"primary",placeholder:"primary, secondary, error"},{key:"onClick",value:"",placeholder:"handleClick"}],MuiTextField:[{key:"label",value:"",placeholder:"Field label"},{key:"variant",value:"outlined",placeholder:"outlined, filled, standard"},{key:"required",value:"false",placeholder:"true, false"}],ChakraButton:[{key:"colorScheme",value:"blue",placeholder:"blue, red, green, purple"},{key:"size",value:"md",placeholder:"xs, sm, md, lg"},{key:"onClick",value:"",placeholder:"handleClick"}]}[t]||[{key:"className",value:"",placeholder:"css-class-name"}]}function x(t="",e="",n=""){var a;const o=document.createElement("div");o.className="property-item",o.innerHTML=`
    <input type="text" class="input property-key" placeholder="Property" value="${t}">
    <input type="text" class="input property-value" placeholder="${n||"Value"}" value="${e}">
    <button type="button" data-appearance="secondary" title="Remove property" class="btn-remove">-</button>
  `,(a=o.querySelector(".btn-remove"))==null||a.addEventListener("click",()=>{o.remove()}),m.appendChild(o)}function U(){if(r.length===0){alert("No elements selected");return}const t=d.value.trim()||i.value;if(!t){alert("Select or enter a tag");return}const e={};m.querySelectorAll(".property-item").forEach(a=>{const l=a.querySelector(".property-key"),s=a.querySelector(".property-value");l&&s&&l.value.trim()&&s.value.trim()&&(e[l.value.trim()]=s.value.trim())});const o={type:"apply-tag",data:{tag:t,properties:e,elementIds:r.map(a=>a.id)}};parent.postMessage(o,"*")}function A(){if(r.length===0){alert("No elements selected");return}const t={type:"remove-tag",data:{elementIds:r.map(e=>e.id)}};parent.postMessage(t,"*")}function _(t){const e={type:"remove-tag",data:{elementIds:[t]}};parent.postMessage(e,"*")}function J(){const t={type:"export-tags"};parent.postMessage(t,"*")}function R(){parent.postMessage({type:"get-selection"},"*")}function V(){if(!P.checked){h("Auto-tagging is disabled. Enable the option to continue.","info");return}if(r.length===0){h("Please select at least one group or layer.","error");return}const t={type:"auto-tag-selection",data:{elementIds:r.map(e=>e.id)}};parent.postMessage(t,"*")}function h(t,e){f.textContent=t,f.className=`auto-tag-feedback ${e}`,f.style.display="block",setTimeout(()=>{f.style.display="none"},5e3)}function K(){document.querySelectorAll(".collapsible-header").forEach(e=>{e.addEventListener("click",()=>{const n=e.getAttribute("data-section"),o=document.querySelector(`[data-content="${n}"]`),a=e.querySelector(".collapse-arrow");o&&a&&(o.classList.contains("collapsed")?(o.classList.remove("collapsed"),a.classList.remove("collapsed")):(o.classList.add("collapsed"),a.classList.add("collapsed")))})})}function G(t){try{const e=JSON.stringify(t,null,2),n=document.createElement("div");n.style.cssText=`
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
    `,n.appendChild(o),document.body.appendChild(n);const a=o.querySelector("textarea"),l=o.querySelector("#copy-json"),s=o.querySelector("#close-modal");l.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),l.textContent="Copied!",setTimeout(()=>{l.textContent="Copy to Clipboard"},2e3)}catch{a.select(),document.execCommand("copy"),l.textContent="Copied!",setTimeout(()=>{l.textContent="Copy to Clipboard"},2e3)}}),s.addEventListener("click",()=>{document.body.removeChild(n)});const g=y=>{y.key==="Escape"&&(document.body.removeChild(n),document.removeEventListener("keydown",g))};document.addEventListener("keydown",g),a.select()}catch(e){console.error("Error showing JSON:",e),alert("Error exporting tags")}}function v(){if(r.length===0)E.textContent="Select an element on the canvas to get started",C.style.display="none";else{const t=r[0];E.textContent=`${r.length} element(s) selected`,w.textContent=t.name||"Unnamed",C.style.display="block",Q(t.id)}u()}function Q(t){const e=c.get(t);e?(W(e.tag)?(i.value=e.tag,d.value=""):(i.value="",d.value=e.tag),m.innerHTML="",Object.entries(e.properties).forEach(([n,o])=>{x(n,o)})):(i.value="",d.value="",m.innerHTML="")}function W(t){return Array.from(i.options).some(n=>n.value===t)}function X(t){const e=Object.entries(t);return e.length===0?"":e.map(([n,o])=>`${n}="${o}"`).join(" ")}function Y(t){if(!t)return"";const e=Object.entries(t).filter(([n,o])=>o&&o!=="").slice(0,3);return e.length===0?"":e.map(([n,o])=>`${n}: ${o}`).join("; ")}function Z(t){if(!t)return"";const e=Object.entries(t).filter(([n,o])=>o&&o!=="").slice(0,2);return e.length===0?"":e.map(([n,o])=>`${n}: ${o}`).join("; ")}function u(){if(c.size===0){k.innerHTML='<div class="empty-state">No tagged elements</div>';return}k.innerHTML="",c.forEach(t=>{const e=document.createElement("div");e.className="tagged-element-item";const n=X(t.properties),o=Y(t.styles),a=Z(t.layout),l=n.length>0,s=o.length>0,g=a.length>0,y=t.content&&t.content.trim().length>0,T=t.imageUrl&&t.imageUrl.length>0;let p="";if(y){const I=t.content.length>30?t.content.substring(0,30)+"...":t.content;p+=`<div class="tagged-element-content">📝 "${I}"</div>`}T&&(p+=`<div class="tagged-element-image">🖼️ ${t.imageUrl}</div>`),s&&(p+=`<div class="tagged-element-styles">🎨 ${o}</div>`),g&&(p+=`<div class="tagged-element-layout">📐 ${a}</div>`),e.innerHTML=`
      <div class="tagged-element-info">
        <div class="tagged-element-header">
          <span class="tagged-element-name">${t.elementName}</span>
          <span class="tagged-element-tag">&lt;${t.tag}&gt;</span>
          ${t.elementType?`<span class="tagged-element-type">(${t.elementType})</span>`:""}
        </div>
        ${l?`<div class="tagged-element-properties">️${n}</div>`:""}
        ${p}
      </div>
      <button type="button" class="remove-tag-btn" data-appearance="primary" data-variant="destructive" title="Remove tag" data-element-id="${t.elementId}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </button>
    `;const b=e.querySelector(".remove-tag-btn");b==null||b.addEventListener("click",()=>{_(t.elementId)}),k.appendChild(e)})}window.addEventListener("message",t=>{const e=t.data;if(e.source==="penpot"){if(e.type==="themechange")document.body.dataset.theme=e.theme;else if(e.type==="selection-update")r=e.data||[],v();else if(e.type==="tag-applied"){const{elementId:n,elementName:o,tag:a,properties:l}=e.data;c.set(n,{tag:a,properties:l,elementId:n,elementName:o}),u()}else if(e.type==="tag-removed"){const{elementId:n}=e.data;c.delete(n),u(),v()}else if(e.type==="tags-loaded")c.clear(),e.data.forEach(n=>{c.set(n.elementId,n)}),u(),v();else if(e.type==="export-data")G(e.data);else if(e.type==="auto-tag-complete"){const{taggedCount:n,processedElements:o}=e.data;n>0?h(`✅ ${n} elements were successfully tagged.`,"success"):h("ℹ️ No elements with valid names were found to tag.","info"),u()}}});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",L):L();
