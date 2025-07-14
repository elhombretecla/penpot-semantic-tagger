// Espera a que la API de Penpot esté lista
penpot.on('ready', () => {
  console.log('Plugin de Etiquetado Semántico listo.');

  // --- REFERENCIAS A LA UI ---
  const selectionInfo = document.getElementById('selection-info')!;
  const taggingSection = document.getElementById('tagging-section')!;
  const semanticTagInput = document.getElementById('semantic-tag') as HTMLInputElement;
  const propertiesList = document.getElementById('properties-list')!;
  const addPropertyBtn = document.getElementById('add-property-btn')!;
  const saveBtn = document.getElementById('save-btn')!;

  // --- ESTADO DEL PLUGIN ---
  // Guardaremos el ID del objeto seleccionado actualmente
  let selectedShapeId: string | null = null;
  // Namespace único para evitar colisiones con otros plugins
  const PLUGIN_DATA_NAMESPACE = 'semantic-tagger-data';

  // --- LÓGICA DE LA UI ---

  // Función para renderizar la lista de propiedades
  const renderProperties = (properties: { [key: string]: string } = {}) => {
    propertiesList.innerHTML = '';
    Object.entries(properties).forEach(([key, value]) => {
      const propItem = document.createElement('div');
      propItem.className = 'property-item';
      propItem.innerHTML = `
        <input type="text" class="prop-key" value="${key}" placeholder="Clave">
        <input type="text" class="prop-value" value="${value}" placeholder="Valor">
        <button class="remove-prop-btn">X</button>
      `;
      propertiesList.appendChild(propItem);
    });
  };

  // Evento para añadir una nueva propiedad vacía
  addPropertyBtn.addEventListener('click', () => {
    renderProperties({ ...getPropertiesFromUI(), '': '' });
  });

  // Evento para eliminar una propiedad
  propertiesList.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('remove-prop-btn')) {
      target.parentElement?.remove();
    }
  });

  // Función para obtener las propiedades desde la UI
  const getPropertiesFromUI = (): { [key: string]: string } => {
    const properties: { [key: string]: string } = {};
    propertiesList.querySelectorAll('.property-item').forEach(item => {
      const keyInput = item.querySelector('.prop-key') as HTMLInputElement;
      const valueInput = item.querySelector('.prop-value') as HTMLInputElement;
      if (keyInput.value) {
        properties[keyInput.value] = valueInput.value;
      }
    });
    return properties;
  };
  
  // --- LÓGICA DE PENPOT ---

  /**
   * Carga los datos guardados de un elemento y actualiza la UI del plugin.
   * @param shape - El objeto de la forma seleccionada.
   */
  const loadDataForShape = (shape: penpot.Shape) => {
    // Los datos personalizados se guardan en el objeto `meta`
    const savedData = shape.meta?.[PLUGIN_DATA_NAMESPACE];

    if (savedData && typeof savedData === 'object') {
      semanticTagInput.value = savedData.tag || '';
      renderProperties(savedData.properties || {});
    } else {
      // Si no hay datos, resetea la UI
      semanticTagInput.value = '';
      renderProperties();
    }
  };

  /**
   * Guarda los datos de la UI en el elemento seleccionado en Penpot.
   */
  const saveDataToShape = async () => {
    if (!selectedShapeId) {
      penpot.ui.notify('Error: No hay ningún elemento seleccionado.');
      return;
    }

    const dataToSave = {
      tag: semanticTagInput.value,
      properties: getPropertiesFromUI(),
    };
    
    // Aquí está la magia: usamos `updateShape` para añadir nuestros datos
    // al campo `meta` del objeto. Esto persiste los datos en el archivo .penpot
    await penpot.shapes.updateShape(selectedShapeId, {
      meta: {
        [PLUGIN_DATA_NAMESPACE]: dataToSave,
      },
    });

    penpot.ui.notify('✅ Datos guardados en el elemento!');
  };

  saveBtn.addEventListener('click', saveDataToShape);

  // --- LISTENER DE EVENTOS DE PENPOT ---

  /**
   * Se ejecuta cada vez que cambia la selección en el lienzo de Penpot.
   */
  penpot.events.on('selectionChanged', (selection) => {
    // Solo trabajaremos si se selecciona UN solo elemento
    if (selection.length === 1) {
      const shape = selection[0];
      selectedShapeId = shape.id;

      // Actualizamos la UI
      selectionInfo.textContent = `Seleccionado: ${shape.name} (ID: ${shape.id.substring(0, 8)}...)`;
      taggingSection.style.display = 'block';

      // Cargamos los datos existentes para ese elemento
      loadDataForShape(shape);
    } else {
      selectedShapeId = null;
      selectionInfo.textContent = selection.length > 1
        ? 'Selecciona un solo elemento para ver/editar sus datos.'
        : 'Selecciona un elemento en el lienzo.';
      taggingSection.style.display = 'none';
    }
  });
});