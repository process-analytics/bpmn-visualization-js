import Graph from './../component/graph/Graph';

export const graph = new Graph(window.document.getElementById('graph'));

function handleFileSelect(evt: any) {
  const f = evt.target.files[0];
  console.info('Selected file ' + f.name);

  const reader = new FileReader();
  // Closure to capture the file information.
  reader.onload = (function(theFile: File) {
    return function(e: any) {
      console.info('read done for ' + theFile.name);
      const fileContent = reader.result;
      console.info(fileContent);
      graph.load(fileContent as string);
    };
  })(f);

  reader.readAsText(f);
}

document.getElementById('bpmn-file').addEventListener('change', handleFileSelect, false);
