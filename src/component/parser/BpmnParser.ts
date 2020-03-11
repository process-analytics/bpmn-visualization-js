import BpmnModel from '../../model/bpmn/BpmnModel';
import BpmnXmlParser from './xml/BpmnXmlParser';
import BpmnJsonParser from './json/BpmnJsonParser';

export default class BpmnParser {
  // TODO inner parsers should be injected
  parse(bpmnAsXml: string): BpmnModel {
    const json = new BpmnXmlParser().parse(bpmnAsXml);
    const { shapes, edges } = BpmnJsonParser.parse(json);

    return new BpmnModel(shapes, edges);
  }
}
