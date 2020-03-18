import BpmnXmlParser from '../../../../../src/component/parser/xml/BpmnXmlParser';
import { verifyDefinitions, verifyProperties } from './XMLTestUtils';

describe('parse bpmn as xml for process', () => {
  it('bpmn with empty process, ensure process is present', () => {
    const emptyProcess = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1xabmu2" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <bpmn:process id="Process_03fna6q" isExecutable="false" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_03fna6q" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    const json = new BpmnXmlParser().parse(emptyProcess);

    verifyDefinitions(json);

    // Model
    const process = json.definitions.process;
    verifyProperties(process, ['id', 'isExecutable'], []);

    // BPMNDiagram
    const diagram = json.definitions.BPMNDiagram;
    verifyProperties(diagram, ['id', 'BPMNPlane'], []);
    const plane = diagram.BPMNPlane;
    verifyProperties(plane, ['id', 'bpmnElement'], []);
  });
});
