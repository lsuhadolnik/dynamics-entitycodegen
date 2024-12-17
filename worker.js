// alert("Hey! Hello from WORKER");

window.addEventListener('message', (event) => {
  if (event.data && event.data.EntityGeneratorRequest) {
    try {
      const entityName = Xrm.Page.data.entity.getEntityName(); // Access Xrm.Page
      window.postMessage({ EntityGeneratorResponse: true, entityName }, '*');
    } catch (error) {
      window.postMessage({ EntityGeneratorResponse: true, entityName: 'Error accessing Xrm.Page' }, '*');
    }
  }
});
