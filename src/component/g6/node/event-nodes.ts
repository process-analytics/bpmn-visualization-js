/**
 * Copyright 2020 Bonitasoft S.A.
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
import { IGroup, IShape } from '@antv/g6/es';
import { BpmnG6NodeConfig } from '../G6Renderer';

const COLOR_MAP = {
  startEvent: '#90EE90',
  endEvent: '#FF4500',
  intermediateCatchEvent: '#1E90FF',
  intermediateThrowEvent: '#B0E0E6',
  boundaryEvent: '#FFE4B5',
};

export function drawEvent(): (cfg?: BpmnG6NodeConfig, group?: IGroup) => IShape {
  return (cfg, group): IShape => {
    const width = (cfg.size as number[])[0];
    const height = (cfg.size as number[])[1];

    // I don't know why but the Circle shape doesn't work
    /*    const shape = group.addShape('circle', {
      attrs: {
        x: 0,
        y: 0,
        radius: (width > height ? width : height) / 2,
        stroke: COLOR_MAP[cfg.type],
        strokeOpacity: 1,
        fill: COLOR_MAP[cfg.type],
        fillOpacity: 0.1,
        lineDash: [3, 2],
        lineWidth: 2,
      },
      name: 'main-box',
    });*/

    // a circle by path
    const r = (width > height ? width : height) / 2;
    const path = [
      ['M', 0, r],
      ['C', 0, (3 * r) / 2, r / 2, 2 * r, r, 2 * r],
      ['C', (3 * r) / 2, 2 * r, 2 * r, (3 * r) / 2, 2 * r, r],
      ['C', 2 * r, r / 2, (3 * r) / 2, 0, r, 0],
      ['C', r / 2, 0, 0, r / 2, 0, r],
      ['Z'],
    ];
    const shape = group.addShape('path', {
      attrs: { path, fill: 'white' },
      name: 'main-box',
      draggable: true,
    });
    group.addShape('path', {
      attrs: {
        /*     x: 0,
        y: 0,*/
        path,
        anchorPoints: cfg.anchorPoints,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        stroke: COLOR_MAP[cfg.type],
        strokeOpacity: 1,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fill: COLOR_MAP[cfg.type],
        fillOpacity: 0.1,
        lineDash: [3, 2],
        lineWidth: 2,
      },
      name: 'color-box',
    });

    // left icon
    group.addShape('image', {
      attrs: {
        x: width / 6,
        y: height / 6,
        width: (width * 2) / 3,
        height: (height * 2) / 3,
        cursor: 'pointer',
        img:
          'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAwIDEwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGQ9Ik0xMSw1NS44NDA4MjAzYzIuOTYwOTM3NSwwLDUuNzQ0NjI4OS0xLjE3OTY4NzUsNy44MDAyOTMtMy4yNzE0ODQ0ICBjMi4wNTU2NjQxLDIuMDkxNzk2OSw0LjgzOTM1NTUsMy4yNzE0ODQ0LDcuNzk5ODA0NywzLjI3MTQ4NDRjMi45NjA5Mzc1LDAsNS43NDQ2Mjg5LTEuMTc5Njg3NSw3LjgwMDI5My0zLjI3MTQ4NDQgIGMyLjA1NTY2NDEsMi4wOTE3OTY5LDQuODM5MzU1NSwzLjI3MTQ4NDQsNy43OTk4MDQ3LDMuMjcxNDg0NGMyLjk2MDkzNzUsMCw1Ljc0NDYyODktMS4xNzk2ODc1LDcuODAwMjkzLTMuMjcxNDg0NCAgYzIuMDU1NjY0MSwyLjA5MTc5NjksNC44MzkzNTU1LDMuMjcxNDg0NCw3LjgwMDI5MywzLjI3MTQ4NDRzNS43NDQxNDA2LTEuMTc5Njg3NSw3Ljc5ODgyODEtMy4yNzE0ODQ0ICBjMi4wNTU2NjQxLDIuMDkxNzk2OSw0LjgzOTM1NTUsMy4yNzE0ODQ0LDcuODAwMjkzLDMuMjcxNDg0NGMyLjk2MDQ0OTIsMCw1Ljc0NDE0MDYtMS4xNzk2ODc1LDcuNzk5ODA0Ny0zLjI3MTQ4NDQgIEM4My4yNTUzNzExLDU0LjY2MTEzMjgsODYuMDM5MDYyNSw1NS44NDA4MjAzLDg5LDU1Ljg0MDgyMDNjMC41NTIyNDYxLDAsMS0wLjQ0NzI2NTYsMS0xcy0wLjQ0Nzc1MzktMS0xLTEgIGMtMC43MDkxNjc1LDAtMS40MDQ4NDYyLTAuMDg2MjQyNy0yLjA3Nzk0MTktMC4yNDY1MjFsLTEwLjk4NTA0NjQtMjYuMTI4NDc5ICBjLTAuMTQwNjI1LTAuMzMzOTg0NC0wLjQ1MDY4MzYtMC41NjU0Mjk3LTAuODEwNTQ2OS0wLjYwNjQ0NTNjLTAuMzY4NjUyMy0wLjAzOTA2MjUtMC43MTQzNTU1LDAuMTE4MTY0MS0wLjkyNDgwNDcsMC40MTIxMDk0ICBMNjYuNDI1MjkzLDM4LjE0NDUzMTJsLTkuOTQ3MjY1Ni0yMy4wOTI3NzM0Yy0wLjExOTYyODktMC4yNzgzMjAzLTAuMzU5Mzc1LTAuNDg3MzA0Ny0wLjY1MDg3ODktMC41NjgzNTk0ICBjLTAuMjkzNDU3LTAuMDgxMDU0Ny0wLjYwNDk4MDUtMC4wMjUzOTA2LTAuODUxMDc0MiwwLjE1MTM2NzJsLTcuODM0NDcyNyw1LjYyNTk3NjZsLTcuMjI5NDkyMi05Ljg1MjUzOTEgIGMtMC4yMTgyNjE3LTAuMjk3ODUxNi0wLjU4MjUxOTUtMC40NTIxNDg0LTAuOTQ4MjQyMi0wLjM5ODQzNzVDMzguNTk4MTQ0NSwxMC4wNjI1LDM4LjI5MTUwMzksMTAuMzEyNSwzOC4xNjU1MjczLDEwLjY1OTE3OTcgIEwyNi41MTc1NzgxLDQyLjgyMTI4OTFsLTcuNTcwMzEyNS0yLjMxMzQ3NjZjLTAuNTA2ODM1OS0wLjE1OTE3OTctMS4wNDQ0MzM2LDAuMTExMzI4MS0xLjIyOTQ5MjIsMC42MDY0NDUzbC00LjY1MTk3NzUsMTIuNDgzNTgxNSAgQzEyLjM5NjU0NTQsNTMuNzU2MTY0NiwxMS43MDQ4MzQsNTMuODQwODIwMywxMSw1My44NDA4MjAzYy0wLjU1MjI0NjEsMC0xLDAuNDQ3MjY1Ni0xLDFTMTAuNDQ3NzUzOSw1NS44NDA4MjAzLDExLDU1Ljg0MDgyMDN6ICAgTTE5LjI2MzE4MzYsNDIuNjk1MzEyNWw3LjU3ODYxMzMsMi4zMTY0MDYyYzAuNTEzMTgzNiwwLjE1OTE3OTcsMS4wNTEyNjk1LTAuMTE2MjEwOSwxLjIzMjkxMDItMC42MTUyMzQ0bDExLjMzMzQ5NjEtMzEuMjkzOTQ1MyAgbDYuNzA2NTQzLDkuMTM5NjQ4NGMwLjMyMzczMDUsMC40NDA0Mjk3LDAuOTQzMzU5NCwwLjU0MTAxNTYsMS4zODk2NDg0LDAuMjIwNzAzMWw3LjYyODQxOC01LjQ3ODUxNTZMNjUuMjg5NTUwOCw0MC41NjI1ICBjMC4xNDI1NzgxLDAuMzMxMDU0NywwLjQ1MzEyNSwwLjU2MDU0NjksMC44MTE1MjM0LDAuNTk4NjMyOGMwLjM2MDgzOTgsMC4wMzgwODU5LDAuNzEwOTM3NS0wLjEyMDExNzIsMC45MjA0MTAyLTAuNDEyMTA5NCAgbDcuNzY1NjI1LTEwLjg1NzQyMTlsOS41MDQwMjgzLDIyLjYwNTc3MzljLTAuODY3NzM2OC0wLjUzOTY3MjktMS42NTA0NTE3LTEuMjI5NTUzMi0yLjMwODIyNzUtMi4wNTc5MjI0ICBjLTAuMzc5ODgyOC0wLjQ3NjU2MjUtMS4xODY1MjM0LTAuNDc2NTYyNS0xLjU2NjQwNjIsMGMtMS43MTY3OTY5LDIuMTYyMTA5NC00LjI3NDQxNDEsMy40MDEzNjcyLTcuMDE2NjAxNiwzLjQwMTM2NzIgIGMtMi43NDI2NzU4LDAtNS4zMDAyOTMtMS4yMzkyNTc4LTcuMDE2MTEzMy0zLjQwMTM2NzJjLTAuMTg5NDUzMS0wLjIzODI4MTItMC40NzgwMjczLTAuMzc3OTI5Ny0wLjc4MzIwMzEtMC4zNzc5Mjk3ICBzLTAuNTkzMjYxNywwLjEzOTY0ODQtMC43ODMyMDMxLDAuMzc3OTI5N2MtMS43MTY3OTY5LDIuMTYyMTA5NC00LjI3NDQxNDEsMy40MDEzNjcyLTcuMDE2NjAxNiwzLjQwMTM2NzIgIGMtMi43NDI2NzU4LDAtNS4zMDAyOTMtMS4yMzkyNTc4LTcuMDE3MDg5OC0zLjQwMTM2NzJjLTAuMzc5ODgyOC0wLjQ3NjU2MjUtMS4xODY1MjM0LTAuNDc2NTYyNS0xLjU2NjQwNjIsMCAgYy0xLjcxNjc5NjksMi4xNjIxMDk0LTQuMjc0NDE0MSwzLjQwMTM2NzItNy4wMTcwODk4LDMuNDAxMzY3MmMtMi43NDIxODc1LDAtNS4yOTk4MDQ3LTEuMjM5MjU3OC03LjAxNjYwMTYtMy40MDEzNjcyICBjLTAuMzc5ODgyOC0wLjQ3NjU2MjUtMS4xODY1MjM0LTAuNDc2NTYyNS0xLjU2NjQwNjIsMGMtMS43MTY3OTY5LDIuMTYyMTA5NC00LjI3NDQxNDEsMy40MDEzNjcyLTcuMDE3MDg5OCwzLjQwMTM2NzIgIGMtMi43NDIxODc1LDAtNS4yOTk4MDQ3LTEuMjM5MjU3OC03LjAxNjYwMTYtMy40MDEzNjcyYy0wLjM3OTg4MjgtMC40NzY1NjI1LTEuMTg2NTIzNC0wLjQ3NjU2MjUtMS41NjY0MDYyLDAgIGMtMC42ODgyOTM1LDAuODY2ODIxMy0xLjUxNjA1MjIsMS41NzcyMDk1LTIuNDMyMzczLDIuMTI2OTUzMUwxOS4yNjMxODM2LDQyLjY5NTMxMjV6Ij48L3BhdGg+PHBhdGggZD0iTTM4Ljk0MTg5NDUsMzcuNTYzNDc2NmMwLjQ3OTk4MDUsMC4yNzQ0MTQxLDEuMDg5ODQzOCwwLjEwNzQyMTksMS4zNjQyNTc4LTAuMzcxMDkzOGwzLjg4NjIzMDUtNi43OTAwMzkxICBsNS4wMzAyNzM0LDEwLjI1MTk1MzFjMC4xNDg0Mzc1LDAuMzAxNzU3OCwwLjQzNzk4ODMsMC41MDg3ODkxLDAuNzcxNDg0NCwwLjU1MTc1NzggIGMwLjA0MjQ4MDUsMC4wMDQ4ODI4LDAuMDg0NDcyNywwLjAwNzgxMjUsMC4xMjY0NjQ4LDAuMDA3ODEyNWMwLjI4OTU1MDgsMCwwLjU2NzM4MjgtMC4xMjU5NzY2LDAuNzU4Nzg5MS0wLjM0ODYzMjggIGw0LjEzMjMyNDItNC44MTQ0NTMxQzU1LjM3MTU4MiwzNS42MzE4MzU5LDU1LjMyMzI0MjIsMzUsNTQuOTA0Mjk2OSwzNC42NDA2MjVzLTEuMDUwNzgxMi0wLjMxMTUyMzQtMS40MTAxNTYyLDAuMTA3NDIxOSAgbC0zLjE0NDA0MywzLjY2MzA4NTlsLTUuMTkxODk0NS0xMC41ODEwNTQ3Yy0wLjE2MzA4NTktMC4zMzIwMzEyLTAuNDk2MDkzOC0wLjU0Njg3NS0wLjg2NjIxMDktMC41NTg1OTM4ICBjLTAuMzY2MjEwOS0wLjAyMDUwNzgtMC43MTU4MjAzLDAuMTgxNjQwNi0wLjg5OTQxNDEsMC41MDE5NTMxbC00LjgyMTc3NzMsOC40MjQ4MDQ3ICBDMzguMjk2Mzg2NywzNi42Nzc3MzQ0LDM4LjQ2MjQwMjMsMzcuMjg5MDYyNSwzOC45NDE4OTQ1LDM3LjU2MzQ3NjZ6Ij48L3BhdGg+PHBhdGggZD0iTTE1LjU2Njg5NDUsNTkuNzkxMDE1NmMtMC4xNzMzMzk4LTAuNTI0NDE0MS0wLjc0MDIzNDQtMC44MTI1LTEuMjYyMjA3LTAuNjM3Njk1MyAgYy0wLjUyNDkwMjMsMC4xNzI4NTE2LTAuODEwNTQ2OSwwLjczNzMwNDctMC42MzgxODM2LDEuMjYyNjk1M2wwLjYyNDUxMTcsMS45MDAzOTA2ICBjMC4xMzg2NzE5LDAuNDIwODk4NCwwLjUyOTc4NTIsMC42ODc1LDAuOTUwMTk1MywwLjY4NzVjMC4xMDM1MTU2LDAsMC4yMDg0OTYxLTAuMDE1NjI1LDAuMzEyMDExNy0wLjA0OTgwNDcgIGMwLjUyNDkwMjMtMC4xNzI4NTE2LDAuODEwNTQ2OS0wLjczNzMwNDcsMC42MzgxODM2LTEuMjYyNjk1M0wxNS41NjY4OTQ1LDU5Ljc5MTAxNTZ6Ij48L3BhdGg+PHBhdGggZD0iTTE3LjYwNDAwMzksNjUuOTkyMTg3NWMtMC4xNzIzNjMzLTAuNTI0NDE0MS0wLjczNDg2MzMtMC44MDk1NzAzLTEuMjYyMjA3LTAuNjM3Njk1MyAgYy0wLjUyNDkwMjMsMC4xNzI4NTE2LTAuODEwNTQ2OSwwLjczNzMwNDctMC42MzgxODM2LDEuMjYyNjk1M2wxLjQxMzA4NTksNC4zMDA3ODEyICBjMC4xMzg2NzE5LDAuNDIwODk4NCwwLjUyOTc4NTIsMC42ODc1LDAuOTUwMTk1MywwLjY4NzVjMC4xMDMwMjczLDAsMC4yMDg0OTYxLTAuMDE1NjI1LDAuMzEyMDExNy0wLjA0OTgwNDcgIGMwLjUyNDkwMjMtMC4xNzI4NTE2LDAuODEwNTQ2OS0wLjczNzMwNDcsMC42MzgxODM2LTEuMjYyNjk1M0wxNy42MDQwMDM5LDY1Ljk5MjE4NzV6Ij48L3BhdGg+PHBhdGggZD0iTTIxLjY1MTg1NTUsNzUuMTkyMzgyOGwtMC45MTc5Njg4LDAuMzI3MTQ4NEwyMC40Mjk2ODc1LDc0LjU5Mzc1ICBjLTAuMTcyODUxNi0wLjUyNTM5MDYtMC43MzY4MTY0LTAuODExNTIzNC0xLjI2MjY5NTMtMC42Mzc2OTUzYy0wLjUyNDQxNDEsMC4xNzI4NTE2LTAuODEwMDU4NiwwLjczODI4MTItMC42Mzc2OTUzLDEuMjYyNjk1MyAgbDAuNjI0NTExNywxLjg5OTQxNDFjMC4wODQ0NzI3LDAuMjU1ODU5NCwwLjI2ODU1NDcsMC40NjY3OTY5LDAuNTEwMjUzOSwwLjU4NTkzNzUgIGMwLjEzODY3MTksMC4wNjczODI4LDAuMjg5MDYyNSwwLjEwMTU2MjUsMC40Mzk5NDE0LDAuMTAxNTYyNWMwLjExMzI4MTIsMCwwLjIyNzA1MDgtMC4wMTk1MzEyLDAuMzM1OTM3NS0wLjA1ODU5MzggIGwxLjg4Mzc4OTEtMC42NzE4NzVjMC41MjAwMTk1LTAuMTg0NTcwMywwLjc5MTUwMzktMC43NTY4MzU5LDAuNjA1OTU3LTEuMjc3MzQzOCAgQzIyLjc0MzY1MjMsNzUuMjc3MzQzOCwyMi4xNzA0MTAyLDc1LjAwNDg4MjgsMjEuNjUxODU1NSw3NS4xOTIzODI4eiI+PC9wYXRoPjxwYXRoIGQ9Ik0yNy41MzQ2NjgsNzUuMjE2Nzk2OWwxLjM2NjY5OTItMC40ODczMDQ3bDEuMTQ1MDE5NSwwLjg5MTYwMTYgIGMwLjE4MjYxNzIsMC4xNDI1NzgxLDAuMzk4OTI1OCwwLjIxMDkzNzUsMC42MTM3Njk1LDAuMjEwOTM3NWMwLjI5Nzg1MTYsMCwwLjU5MjI4NTItMC4xMzI4MTI1LDAuNzg5NTUwOC0wLjM4NTc0MjIgIGMwLjMzOTM1NTUtMC40MzU1NDY5LDAuMjYxMjMwNS0xLjA2NDQ1MzEtMC4xNzQ4MDQ3LTEuNDAzMzIwM2wtMS41NzgxMjUtMS4yMjg1MTU2ICBjLTAuMjY5NTMxMi0wLjIwOTk2MDktMC42Mjg5MDYyLTAuMjY2NjAxNi0wLjk1MDE5NTMtMC4xNTIzNDM4bC0xLjg4Mzc4OTEsMC42NzE4NzUgIGMtMC41MjAwMTk1LDAuMTg0NTcwMy0wLjc5MTUwMzksMC43NTY4MzU5LTAuNjA1OTU3LDEuMjc3MzQzOEMyNi40NDIzODI4LDc1LjEzMDg1OTQsMjcuMDE0NjQ4NCw3NS40MDMzMjAzLDI3LjUzNDY2OCw3NS4yMTY3OTY5eiI+PC9wYXRoPjxwYXRoIGQ9Ik0zNy4zMTI1LDgxLjAwNzgxMjVjMC4yOTc4NTE2LDAsMC41OTI3NzM0LTAuMTMyODEyNSwwLjc4OTU1MDgtMC4zODU3NDIyICBjMC4zMzkzNTU1LTAuNDM2NTIzNCwwLjI2MDc0MjItMS4wNjQ0NTMxLTAuMTc0ODA0Ny0xLjQwMzMyMDNsLTMuMzI2MTcxOS0yLjU4Nzg5MDYgIGMtMC40MzY1MjM0LTAuMzQwODIwMy0xLjA2NTQyOTctMC4yNjA3NDIyLTEuNDAzMzIwMywwLjE3NDgwNDdjLTAuMzM5MzU1NSwwLjQzNjUyMzQtMC4yNjA3NDIyLDEuMDY0NDUzMSwwLjE3NDgwNDcsMS40MDMzMjAzICBsMy4zMjYxNzE5LDIuNTg3ODkwNkMzNi44ODEzNDc3LDgwLjkzOTQ1MzEsMzcuMDk3NjU2Miw4MS4wMDc4MTI1LDM3LjMxMjUsODEuMDA3ODEyNXoiPjwvcGF0aD48cGF0aCBkPSJNNDMuOTY0MzU1NSw4Ni4xODM1OTM4YzAuMjk3ODUxNiwwLDAuNTkyNzczNC0wLjEzMjgxMjUsMC43ODk1NTA4LTAuMzg1NzQyMiAgYzAuMzM5MzU1NS0wLjQzNjUyMzQsMC4yNjA3NDIyLTEuMDY0NDUzMS0wLjE3NDgwNDctMS40MDMzMjAzbC0zLjMyNjE3MTktMi41ODc4OTA2ICBjLTAuNDM2MDM1Mi0wLjM0MDgyMDMtMS4wNjQ5NDE0LTAuMjYxNzE4OC0xLjQwMzMyMDMsMC4xNzQ4MDQ3Yy0wLjMzOTM1NTUsMC40MzY1MjM0LTAuMjYwNzQyMiwxLjA2NDQ1MzEsMC4xNzQ4MDQ3LDEuNDAzMzIwMyAgbDMuMzI2MTcxOSwyLjU4Nzg5MDZDNDMuNTMzMjAzMSw4Ni4xMTUyMzQ0LDQzLjc0OTUxMTcsODYuMTgzNTkzOCw0My45NjQzNTU1LDg2LjE4MzU5Mzh6Ij48L3BhdGg+PHBhdGggZD0iTTQ4Ljg2ODY1MjMsOTBjMC4yMTI0MDIzLDAsMC40MjQ4MDQ3LTAuMDY3MzgyOCwwLjYwMzAyNzMtMC4yMDIxNDg0bDEuNTk1MjE0OC0xLjIwNjA1NDcgIGMwLjQ0MDQyOTctMC4zMzMwMDc4LDAuNTI3ODMyLTAuOTU5OTYwOSwwLjE5NDgyNDItMS40MDEzNjcyQzUwLjkyNzczNDQsODYuNzUsNTAuMzAwMjkzLDg2LjY2MTEzMjgsNDkuODYwODM5OCw4Ni45OTYwOTM4ICBsLTAuOTgzMzk4NCwwLjc0MzE2NDFsLTAuOTczMTQ0NS0wLjc1NjgzNTljLTAuNDM2NTIzNC0wLjM0MDgyMDMtMS4wNjQ5NDE0LTAuMjYxNzE4OC0xLjQwMzMyMDMsMC4xNzQ4MDQ3ICBjLTAuMzM5MzU1NSwwLjQzNTU0NjktMC4yNjA3NDIyLDEuMDY0NDUzMSwwLjE3NDgwNDcsMS40MDMzMjAzbDEuNTc4NjEzMywxLjIyODUxNTYgIEM0OC40MzUwNTg2LDg5LjkyOTY4NzUsNDguNjUxODU1NSw5MCw0OC44Njg2NTIzLDkweiI+PC9wYXRoPjxwYXRoIGQ9Ik01OC44MjkxMDE2LDgyLjcyMjY1NjJsMi41ODc0MDIzLTEuOTU2MDU0N2MwLjQ0MDQyOTctMC4zMzMwMDc4LDAuNTI3ODMyLTAuOTU5OTYwOSwwLjE5NDgyNDItMS40MDEzNjcyICBjLTAuMzMzOTg0NC0wLjQ0MDQyOTctMC45NjA0NDkyLTAuNTI5Mjk2OS0xLjQwMDg3ODktMC4xOTQzMzU5bC0yLjU4NzQwMjMsMS45NTYwNTQ3ICBjLTAuNDQwNDI5NywwLjMzMzAwNzgtMC41Mjc4MzIsMC45NTk5NjA5LTAuMTk0ODI0MiwxLjQwMTM2NzJjMC4xOTY3NzczLDAuMjU5NzY1NiwwLjQ5NjA5MzgsMC4zOTY0ODQ0LDAuNzk4ODI4MSwwLjM5NjQ4NDQgIEM1OC40MzcwMTE3LDgyLjkyNDgwNDcsNTguNjQ4NDM3NSw4Mi44NTkzNzUsNTguODI5MTAxNiw4Mi43MjI2NTYyeiI+PC9wYXRoPjxwYXRoIGQ9Ik01My42NTQyOTY5LDg2LjYzNTc0MjJsMi41ODc0MDIzLTEuOTU2MDU0N2MwLjQ0MDQyOTctMC4zMzMwMDc4LDAuNTI3ODMyLTAuOTU5OTYwOSwwLjE5NDgyNDItMS40MDEzNjcyICBjLTAuMzMzOTg0NC0wLjQ0MDQyOTctMC45NjA0NDkyLTAuNTI5Mjk2OS0xLjQwMDg3ODktMC4xOTQzMzU5bC0yLjU4NzQwMjMsMS45NTYwNTQ3ICBDNTIuMDA3ODEyNSw4NS4zNzMwNDY5LDUxLjkyMDQxMDIsODYsNTIuMjUzNDE4LDg2LjQ0MTQwNjJjMC4xOTY3NzczLDAuMjU5NzY1NiwwLjQ5NjA5MzgsMC4zOTY0ODQ0LDAuNzk4ODI4MSwwLjM5NjQ4NDQgIEM1My4yNjIyMDcsODYuODM3ODkwNiw1My40NzM2MzI4LDg2Ljc3MjQ2MDksNTMuNjU0Mjk2OSw4Ni42MzU3NDIyeiI+PC9wYXRoPjxwYXRoIGQ9Ik02NC4wMDQzOTQ1LDc4LjgwOTU3MDNsMS4wNzY2NjAyLTAuODEzNDc2NmwxLjE4MDY2NDEsMC42NTQyOTY5YzAuNDg0ODYzMywwLjI2NzU3ODEsMS4wOTIyODUyLDAuMDkzNzUsMS4zNTkzNzUtMC4zOTA2MjUgIGMwLjI2ODA2NjQtMC40ODI0MjE5LDAuMDkzMjYxNy0xLjA5MDgyMDMtMC4zODk2NDg0LTEuMzU5Mzc1bC0xLjc0OTUxMTctMC45Njk3MjY2ICBjLTAuMzQ1MjE0OC0wLjE5MDQyOTctMC43NzE5NzI3LTAuMTYwMTU2Mi0xLjA4Nzg5MDYsMC4wNzcxNDg0bC0xLjU5NTcwMzEsMS4yMDYwNTQ3ICBjLTAuNDQwNDI5NywwLjMzMzAwNzgtMC41Mjc4MzIsMC45NTk5NjA5LTAuMTk0ODI0MiwxLjQwMDM5MDZjMC4xOTY3NzczLDAuMjYwNzQyMiwwLjQ5NTYwNTUsMC4zOTc0NjA5LDAuNzk4ODI4MSwwLjM5NzQ2MDkgIEM2My42MTIzMDQ3LDc5LjAxMTcxODgsNjMuODIzNzMwNSw3OC45NDYyODkxLDY0LjAwNDM5NDUsNzguODA5NTcwM3oiPjwvcGF0aD48cGF0aCBkPSJNNzAuNTc5NTg5OCw4MS4wNDE5OTIyYzAuMTUzODA4NiwwLjA4NDk2MDksMC4zMTk4MjQyLDAuMTI1LDAuNDgzODg2NywwLjEyNSAgYzAuMzUyMDUwOCwwLDAuNjkzMzU5NC0wLjE4NTU0NjksMC44NzU0ODgzLTAuNTE1NjI1YzAuMjY4MDY2NC0wLjQ4MjQyMTksMC4wOTMyNjE3LTEuMDkxNzk2OS0wLjM4OTY0ODQtMS4zNTkzNzUgIGwtMi4xNTkxNzk3LTEuMTk2Mjg5MWMtMC40ODI0MjE5LTAuMjY2NjAxNi0xLjA5MTc5NjktMC4wOTI3NzM0LTEuMzU5Mzc1LDAuMzkwNjI1ICBjLTAuMjY4MDY2NCwwLjQ4MjQyMTktMC4wOTMyNjE3LDEuMDkxNzk2OSwwLjM4OTY0ODQsMS4zNTkzNzVMNzAuNTc5NTg5OCw4MS4wNDE5OTIyeiI+PC9wYXRoPjxwYXRoIGQ9Ik03NC44NTkzNzUsODAuMDk4NjMyOGwtMC4zNjE4MTY0LDAuODI2MTcxOWwtMC43ODkwNjI1LTAuNDM3NWMtMC40ODI5MTAyLTAuMjY2NjAxNi0xLjA5MTc5NjktMC4wOTI3NzM0LTEuMzU5Mzc1LDAuMzkwNjI1ICBjLTAuMjY4MDY2NCwwLjQ4MjQyMTktMC4wOTMyNjE3LDEuMDkwODIwMywwLjM4OTY0ODQsMS4zNTkzNzVsMS43NDk1MTE3LDAuOTY5NzI2NiAgYzAuMTQ5OTAyMywwLjA4MzAwNzgsMC4zMTY4OTQ1LDAuMTI1LDAuNDg0ODYzMywwLjEyNWMwLjEwNzkxMDIsMCwwLjIxNTgyMDMtMC4wMTc1NzgxLDAuMzIwMzEyNS0wLjA1MjczNDQgIGMwLjI2NjYwMTYtMC4wODk4NDM4LDAuNDgyOTEwMi0wLjI4ODA4NTksMC41OTU3MDMxLTAuNTQ1ODk4NGwwLjgwMjI0NjEtMS44MzIwMzEyICBjMC4yMjE2Nzk3LTAuNTA1ODU5NC0wLjAwODc4OTEtMS4wOTU3MDMxLTAuNTE0NjQ4NC0xLjMxNzM4MjhDNzUuNjY5OTIxOSw3OS4zNjAzNTE2LDc1LjA4MTA1NDcsNzkuNTkyNzczNCw3NC44NTkzNzUsODAuMDk4NjMyOHoiPjwvcGF0aD48cGF0aCBkPSJNNzguMjc0NDE0MSw3Mi4zMDE3NTc4bC0xLjcwNzUxOTUsMy44OTg0Mzc1Yy0wLjIyMTY3OTcsMC41MDU4NTk0LDAuMDA4Nzg5MSwxLjA5NTcwMzEsMC41MTQ2NDg0LDEuMzE3MzgyOCAgYzAuMTMwODU5NCwwLjA1NzYxNzIsMC4yNjcwODk4LDAuMDgzOTg0NCwwLjQwMDg3ODksMC4wODM5ODQ0YzAuMzg1MjUzOSwwLDAuNzUxOTUzMS0wLjIyMzYzMjgsMC45MTY1MDM5LTAuNTk4NjMyOCAgbDEuNzA3NTE5NS0zLjg5ODQzNzVjMC4yMjE2Nzk3LTAuNTA1ODU5NC0wLjAwODc4OTEtMS4wOTU3MDMxLTAuNTE0NjQ4NC0xLjMxNzM4MjggIEM3OS4wODM0OTYxLDcxLjU2MzQ3NjYsNzguNDk2MDkzOCw3MS43OTU4OTg0LDc4LjI3NDQxNDEsNzIuMzAxNzU3OHoiPjwvcGF0aD48cGF0aCBkPSJNODEuNjg5NDUzMSw2NC41MDU4NTk0bC0xLjcwNzUxOTUsMy44OTg0Mzc1Qzc5Ljc2MDI1MzksNjguOTEwMTU2Miw3OS45OTA3MjI3LDY5LjUsODAuNDk2NTgyLDY5LjcyMTY3OTcgIGMwLjEzMDg1OTQsMC4wNTc2MTcyLDAuMjY3MDg5OCwwLjA4Mzk4NDQsMC40MDA4Nzg5LDAuMDgzOTg0NGMwLjM4NTI1MzksMCwwLjc1MTk1MzEtMC4yMjM2MzI4LDAuOTE2NTAzOS0wLjU5ODYzMjggIGwxLjcwNzUxOTUtMy44OTg0Mzc1YzAuMjIxNjc5Ny0wLjUwNTg1OTQtMC4wMDg3ODkxLTEuMDk1NzAzMS0wLjUxNDY0ODQtMS4zMTczODI4ICBDODIuNDk5MDIzNCw2My43Njg1NTQ3LDgxLjkxMTEzMjgsNjQuMDAwOTc2Niw4MS42ODk0NTMxLDY0LjUwNTg1OTR6Ij48L3BhdGg+PHBhdGggZD0iTTg1LjIyOTAwMzksNjEuNDExMTMyOGwwLjgwMjczNDQtMS44MzIwMzEyYzAuMjIxNjc5Ny0wLjUwNTg1OTQtMC4wMDg3ODkxLTEuMDk1NzAzMS0wLjUxNDY0ODQtMS4zMTczODI4ICBjLTAuNTA1ODU5NC0wLjIyMDcwMzEtMS4wOTUyMTQ4LDAuMDA4Nzg5MS0xLjMxNzM4MjgsMC41MTQ2NDg0bC0wLjgwMjczNDQsMS44MzIwMzEyICBjLTAuMjIxNjc5NywwLjUwNTg1OTQsMC4wMDg3ODkxLDEuMDk1NzAzMSwwLjUxNDY0ODQsMS4zMTczODI4YzAuMTMwODU5NCwwLjA1NzYxNzIsMC4yNjY2MDE2LDAuMDgzOTg0NCwwLjQwMDg3ODksMC4wODM5ODQ0ICBDODQuNjk3MjY1Niw2Mi4wMDk3NjU2LDg1LjA2NDQ1MzEsNjEuNzg2MTMyOCw4NS4yMjkwMDM5LDYxLjQxMTEzMjh6Ij48L3BhdGg+PC9zdmc+',
      },
      name: 'node-icon',
    });

    group.addShape('text', {
      attrs: {
        /*        x: cfg.labelCfg.refX,
        y: cfg.labelCfg.refY,
        width: width - 20,
        height: height - 20,*/
        text: cfg.label,
        textAlign: 'center',
        textBaseline: 'bottom',
        fontFamily: 'Arial',
      },
      name: `index-title`,
    });
    return shape;
  };
}

/*
abstract class EventShape extends mxgraph.mxEllipse {
  protected iconPainter = IconPainterProvider.get();

  // TODO: when all/more event types will be supported, we could move to a Record/MappedType
  private iconPainters: Map<ShapeBpmnEventKind, (paintParameter: PaintParameter) => void> = new Map([
    [ShapeBpmnEventKind.MESSAGE, (paintParameter: PaintParameter) => this.iconPainter.paintEnvelopeIcon({ ...paintParameter, ratioFromParent: 0.5 })],
    [ShapeBpmnEventKind.TERMINATE, (paintParameter: PaintParameter) => this.iconPainter.paintCircleIcon({ ...paintParameter, ratioFromParent: 0.6 })],
    [
      ShapeBpmnEventKind.TIMER,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintClockIcon({ ...paintParameter, setIconOrigin: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(5) }),
    ],
    [
      ShapeBpmnEventKind.SIGNAL,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintTriangleIcon({
          ...paintParameter,
          ratioFromParent: 0.55,
          icon: { ...paintParameter.icon, strokeWidth: StyleDefault.STROKE_WIDTH_THIN.valueOf() },
          setIconOrigin: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(4),
        }),
    ],
    [
      ShapeBpmnEventKind.LINK,
      (paintParameter: PaintParameter) => this.iconPainter.paintRightArrowIcon({ ...paintParameter, ratioFromParent: 0.55, icon: { ...paintParameter.icon, strokeWidth: 1.5 } }),
    ],
    [
      ShapeBpmnEventKind.ERROR,
      (paintParameter: PaintParameter) => this.iconPainter.paintErrorIcon({ ...paintParameter, ratioFromParent: 0.55, icon: { ...paintParameter.icon, strokeWidth: 1.5 } }),
    ],
    [
      ShapeBpmnEventKind.COMPENSATION,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintDoubleLeftArrowheadsIcon({ ...paintParameter, ratioFromParent: 0.7, icon: { ...paintParameter.icon, strokeWidth: 1.5 } }),
    ],
    [ShapeBpmnEventKind.CANCEL, (paintParameter: PaintParameter) => this.iconPainter.paintXCrossIcon({ ...paintParameter, ratioFromParent: 0.78 })],
    [
      ShapeBpmnEventKind.ESCALATION,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintUpArrowheadIcon({
          ...paintParameter,
          ratioFromParent: 0.55,
          icon: { ...paintParameter.icon, strokeWidth: StyleDefault.STROKE_WIDTH_THIN.valueOf() },
        }),
    ],
    [
      ShapeBpmnEventKind.CONDITIONAL,
      (paintParameter: PaintParameter) => this.iconPainter.paintListIcon({ ...paintParameter, ratioFromParent: 0.6, icon: { ...paintParameter.icon, strokeWidth: 1.5 } }),
    ],
  ]);

  protected withFilledIcon = false;

  protected constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintVertexShape(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    this.markNonFullyRenderedEvents(c);
    const paintParameter = buildPaintParameter(c, x, y, w, h, this, 0.25, this.withFilledIcon);

    EventShape.setDashedOuterShapePattern(paintParameter, StyleUtils.getBpmnIsInterrupting(this.style));
    this.paintOuterShape(paintParameter);
    EventShape.restoreOriginalOuterShapePattern(paintParameter);

    this.paintInnerShape(paintParameter);
  }

  // This will be removed after implementation of all supported events
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private markNonFullyRenderedEvents(c: mxAbstractCanvas2D): void {
    // const eventKind = StyleUtils.getBpmnEventKind(this.style);
    // if (eventKind == ShapeBpmnEventKind.CONDITIONAL) {
    //   c.setFillColor('deeppink');
    //   c.setFillAlpha(0.3);
    // }
  }

  protected paintOuterShape({ c, shape: { x, y, w, h } }: PaintParameter): void {
    super.paintVertexShape(c, x, y, w, h);
  }

  private paintInnerShape(paintParameter: PaintParameter): void {
    const paintIcon = this.iconPainters.get(StyleUtils.getBpmnEventKind(this.style)) || (() => this.iconPainter.paintEmptyIcon());
    paintIcon(paintParameter);
  }

  private static setDashedOuterShapePattern(paintParameter: PaintParameter, isInterrupting: string): void {
    paintParameter.c.save(); // ensure we can later restore the configuration
    if (isInterrupting === 'false') {
      paintParameter.c.setDashed(true, false);
      paintParameter.c.setDashPattern('3 2');
    }
  }

  private static restoreOriginalOuterShapePattern(paintParameter: PaintParameter): void {
    paintParameter.c.restore();
  }
}

/!**
 * @internal
 *!/
export class StartEventShape extends EventShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }
}

/!**
 * @internal
 *!/
export class EndEventShape extends EventShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THICK) {
    super(bounds, fill, stroke, strokewidth);
    this.withFilledIcon = true;
  }
}

abstract class IntermediateEventShape extends EventShape {
  protected constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  // this implementation is adapted from the draw.io BPMN 'throwing' outlines
  // https://github.com/jgraph/drawio/blob/0e19be6b42755790a749af30450c78c0d83be765/src/main/webapp/shapes/bpmn/mxBpmnShape2.js#L431
  protected paintOuterShape({ c, shape: { x, y, w, h, strokeWidth } }: PaintParameter): void {
    c.ellipse(x, y, w, h);
    c.fillAndStroke();

    const inset = strokeWidth * 1.5;
    c.ellipse(w * 0.02 + inset + x, h * 0.02 + inset + y, w * 0.96 - 2 * inset, h * 0.96 - 2 * inset);
    c.stroke();
  }
}

/!**
 * @internal
 *!/
export class CatchIntermediateEventShape extends IntermediateEventShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number) {
    super(bounds, fill, stroke, strokewidth);
  }
}

/!**
 * @internal
 *!/
export class ThrowIntermediateEventShape extends IntermediateEventShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number) {
    super(bounds, fill, stroke, strokewidth);
    this.withFilledIcon = true;
  }
}

/!**
 * @internal
 *!/
export class BoundaryEventShape extends IntermediateEventShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number) {
    super(bounds, fill, stroke, strokewidth);
  }
}
*/
