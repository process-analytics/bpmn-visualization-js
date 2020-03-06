import Graph from './../component/graph/Graph';

export const graph = new Graph(window.document.getElementById('graph'));

function handleFileSelect(evt: any) {
  const f = evt.target.files[0];

  const reader = new FileReader();
  reader.onload = (function(theFile: File) {
    return function(e: any) {
      const fileContent = reader.result;
      graph.load(fileContent as string);
    };
  })(f);

  reader.readAsText(f);
}

document.getElementById('bpmn-file').addEventListener('change', handleFileSelect, false);
