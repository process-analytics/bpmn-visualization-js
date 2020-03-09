import Graph from './../component/graph/Graph';

export const graph = new Graph(window.document.getElementById('graph'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleFileSelect(evt: any): void {
  const f = evt.target.files[0];

  const reader = new FileReader();
  reader.onload = () => {
    graph.load(reader.result as string);
  };

  reader.readAsText(f);
}

document.getElementById('bpmn-file').addEventListener('change', handleFileSelect, false);
