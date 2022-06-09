/**
 * Copyright 2022 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { AssociationFlow, MessageFlow, SequenceFlow } from '../../../../../../src/model/bpmn/internal/edge/flows';
import { ShapeBpmnElementKind } from '../../../../../../src/model/bpmn/internal';
import ShapeBpmnElement from '../../../../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import Shape from '../../../../../../src/model/bpmn/internal/shape/Shape';
import { flat } from '../../../../../../src/model/bpmn/internal/BpmnModel';
import { Edge } from '../../../../../../src/model/bpmn/internal/edge/edge';

describe('BpmnModel', () => {
  it('flat empty array', () => {
    const result = flat([]);

    expect(result).toBeEmpty();
  });

  it('flat array with shapes and no children', () => {
    const bpmnModel = [
      new Shape('shape1', new ShapeBpmnElement('id1', 'name1', ShapeBpmnElementKind.EVENT_END)),
      new Shape('shape2', new ShapeBpmnElement('id2', 'name2', ShapeBpmnElementKind.CALL_ACTIVITY)),
    ];
    const result = flat(bpmnModel);

    expect(result).toHaveLength(2);
    expect(result).toStrictEqual(bpmnModel);
  });

  it('flat array with shapes and shape as children', () => {
    const bpmnModel = [
      new Shape('shape1', new ShapeBpmnElement('id1', 'name1', ShapeBpmnElementKind.EVENT_END)),
      new Shape('shape2', new ShapeBpmnElement('id2', 'name2', ShapeBpmnElementKind.CALL_ACTIVITY)),
    ];
    const child1 = new Shape('shape3', new ShapeBpmnElement('id3', 'name3', ShapeBpmnElementKind.CALL_ACTIVITY));
    const child2 = new Shape('shape4', new ShapeBpmnElement('id4', 'name4', ShapeBpmnElementKind.CALL_ACTIVITY));
    bpmnModel[0].addChild(child1);
    bpmnModel[0].addChild(child2);

    const result = flat(bpmnModel);

    expect(result).toHaveLength(4);
    expect(result).toStrictEqual([...bpmnModel, child1, child2]);
  });

  it('flat array with shapes and edge as children', () => {
    const bpmnModel = [
      new Shape('shape1', new ShapeBpmnElement('id1', 'name1', ShapeBpmnElementKind.EVENT_END)),
      new Shape('shape2', new ShapeBpmnElement('id2', 'name2', ShapeBpmnElementKind.CALL_ACTIVITY)),
    ];
    const child1 = new Edge('edge1', new SequenceFlow('id3', 'name3'));
    const child2 = new Edge('edge2', new AssociationFlow('id4', 'name4'));
    bpmnModel[0].addChild(child1);
    bpmnModel[0].addChild(child2);

    const result = flat(bpmnModel);

    expect(result).toHaveLength(4);
    expect(result).toStrictEqual([...bpmnModel, child1, child2]);
  });

  it('flat array with shapes and shape/edge as children', () => {
    const bpmnModel = [
      new Shape('shape1', new ShapeBpmnElement('id1', 'name1', ShapeBpmnElementKind.EVENT_END)),
      new Shape('shape2', new ShapeBpmnElement('id2', 'name2', ShapeBpmnElementKind.CALL_ACTIVITY)),
    ];
    const child1 = new Shape('shape3', new ShapeBpmnElement('id3', 'name3', ShapeBpmnElementKind.CALL_ACTIVITY));
    const child2 = new Shape('shape4', new ShapeBpmnElement('id4', 'name4', ShapeBpmnElementKind.CALL_ACTIVITY));
    const child3 = new Edge('edge1', new SequenceFlow('id5', 'name5'));
    const child4 = new Edge('edge2', new AssociationFlow('id6', 'name6'));
    bpmnModel[1].addChild(child1);
    bpmnModel[1].addChild(child2);
    bpmnModel[1].addChild(child3);
    bpmnModel[1].addChild(child4);

    const result = flat(bpmnModel);

    expect(result).toHaveLength(6);
    expect(result).toStrictEqual([...bpmnModel, child1, child2, child3, child4]);
  });

  it('flat array with edges and no children', () => {
    const bpmnModel = [new Edge('edge1', new SequenceFlow('id1', 'name1')), new Edge('edge2', new AssociationFlow('id2', 'name2'))];
    const result = flat(bpmnModel);

    expect(result).toHaveLength(2);
    expect(result).toStrictEqual(bpmnModel);
  });

  it('flat array with shapes and edges', () => {
    const bpmnModel = [
      new Shape('shape1', new ShapeBpmnElement('id1', 'name1', ShapeBpmnElementKind.EVENT_END)),
      new Shape('shape2', new ShapeBpmnElement('id2', 'name2', ShapeBpmnElementKind.CALL_ACTIVITY)),
      new Edge('edge1', new SequenceFlow('id3', 'name3')),
      new Edge('edge2', new AssociationFlow('id4', 'name4')),
    ];

    const result = flat(bpmnModel);

    expect(result).toHaveLength(4);
    expect(result).toStrictEqual(bpmnModel);
  });

  it('flat array with shapes and edges and shape/edge as children', () => {
    const child1 = new Shape('shape3', new ShapeBpmnElement('id5', 'name5', ShapeBpmnElementKind.CALL_ACTIVITY));
    const child2 = new Shape('shape4', new ShapeBpmnElement('id6', 'name6', ShapeBpmnElementKind.CALL_ACTIVITY));
    const child3 = new Edge('edge3', new SequenceFlow('id7', 'name7'));
    const child4 = new Edge('edge4', new AssociationFlow('id8', 'name8'));

    const shape1 = new Shape('shape1', new ShapeBpmnElement('id1', 'name1', ShapeBpmnElementKind.EVENT_END));
    shape1.addChild(child1);
    shape1.addChild(child3);

    const shape2 = new Shape('shape2', new ShapeBpmnElement('id2', 'name2', ShapeBpmnElementKind.CALL_ACTIVITY));
    shape2.addChild(child2);
    shape2.addChild(child4);

    const edge1 = new Edge('edge1', new SequenceFlow('id3', 'name3'));
    const edge2 = new Edge('edge2', new AssociationFlow('id4', 'name4'));

    const result = flat([shape1, shape2, edge1, edge2]);

    expect(result).toHaveLength(8);
    expect(result).toStrictEqual([shape1, shape2, edge1, edge2, child1, child3, child2, child4]);
  });

  it('flat array with shapes and edges and shape/edge as children and shape/edge as sub-children', () => {
    const subChild1 = new Shape('shape5', new ShapeBpmnElement('id9', 'name9', ShapeBpmnElementKind.SUB_PROCESS));
    const subChild2 = new Shape('shape6', new ShapeBpmnElement('id10', 'name10', ShapeBpmnElementKind.EVENT_END));
    const subChild3 = new Edge('edge5', new SequenceFlow('id11', 'name11'));
    const subChild4 = new Edge('edge6', new AssociationFlow('id12', 'name12'));

    const child1 = new Shape('shape3', new ShapeBpmnElement('id5', 'name5', ShapeBpmnElementKind.CALL_ACTIVITY));
    child1.addChild(subChild1);
    child1.addChild(subChild3);

    const child2 = new Shape('shape4', new ShapeBpmnElement('id6', 'name6', ShapeBpmnElementKind.CALL_ACTIVITY));
    child2.addChild(subChild2);
    child2.addChild(subChild4);

    const child3 = new Edge('edge3', new SequenceFlow('id7', 'name7'));
    const child4 = new Edge('edge4', new AssociationFlow('id8', 'name8'));

    const shape1 = new Shape('shape1', new ShapeBpmnElement('id1', 'name1', ShapeBpmnElementKind.EVENT_END));
    shape1.addChild(child1);
    shape1.addChild(child3);

    const shape2 = new Shape('shape2', new ShapeBpmnElement('id2', 'name2', ShapeBpmnElementKind.CALL_ACTIVITY));
    shape2.addChild(child2);
    shape2.addChild(child4);

    const edge1 = new Edge('edge1', new MessageFlow('id3', 'name3'));
    const edge2 = new Edge('edge2', new AssociationFlow('id4', 'name4'));

    const result = flat([shape1, shape2, edge1, edge2]);

    expect(result).toHaveLength(12);
    expect(result).toStrictEqual([shape1, shape2, edge1, edge2, child1, child3, child2, child4, subChild1, subChild3, subChild2, subChild4]);
  });
});
