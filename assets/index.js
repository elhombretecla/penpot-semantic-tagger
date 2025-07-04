const semanticRoles = {
  nav: "navigation", header: "banner", main: "main", section: "region",
  aside: "complementary", footer: "contentinfo", article: "article", div: "group",
  h1: "heading", h2: "heading", h3: "heading", h4: "heading", h5: "heading", h6: "heading",
  p: "paragraph", ul: "list", ol: "list", li: "listitem", figure: "figure",
  figcaption: "note", blockquote: "blockquote", a: "link", button: "button",
  details: "group", summary: "button", dialog: "dialog", form: "form",
  input: "textbox", label: "label", select: "listbox", textarea: "textbox",
  fieldset: "group", legend: "heading", table: "table", thead: "rowgroup",
  tbody: "rowgroup", tr: "row", td: "cell", th: "columnheader"
};

async function applySemantic() {
  const selectedTag = document.getElementById("semantic-type").value;
  if (!selectedTag) return alert("Selecciona una etiqueta semántica.");
  const role = semanticRoles[selectedTag] || "group";
  const selection = await penpot.ui.getSelection();
  if (!selection || selection.length === 0) return alert("Selecciona un grupo o componente.");
  const targetId = selection[0];
  const metadata = { semanticTag: selectedTag, ariaRole: role, assignedAt: new Date().toISOString() };
  await penpot.content.updateNodes([{ id: targetId, data: metadata }]);
  alert(`Etiqueta <${selectedTag}> con role="${role}" aplicada.`);
}

async function exportHTML() {
  const selection = await penpot.ui.getSelection();
  if (!selection || selection.length === 0) return alert("Selecciona al menos un componente.");
  let html = "<!DOCTYPE html>\\n<html lang='es'>\\n<body>\\n";
  for (const id of selection) {
    const node = await penpot.content.getNode(id);
    const tag = node.data?.semanticTag || "div";
    const role = node.data?.ariaRole ? ` role="${node.data.ariaRole}"` : "";
    html += `<${tag}${role} id="${id}">Contenido</${tag}>\\n`;
  }
  html += "</body>\\n</html>";
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "export.html";
  a.click();
}

async function exportJSX() {
  const selection = await penpot.ui.getSelection();
  if (!selection || selection.length === 0) return alert("Selecciona al menos un componente.");
  let jsx = "export default function Component() {\\n  return (\\n    <>\\n";
  for (const id of selection) {
    const node = await penpot.content.getNode(id);
    const tag = node.data?.semanticTag || "div";
    const role = node.data?.ariaRole ? ` role=\\"${node.data.ariaRole}\\"` : "";
    jsx += `      <${tag}${role} id=\\"${id}\\">Contenido</${tag}>\\n`;
  }
  jsx += "    </>\\n  );\\n}";
  const blob = new Blob([jsx], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "export.jsx";
  a.click();
}
