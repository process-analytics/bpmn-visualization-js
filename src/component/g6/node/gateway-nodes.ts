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
import { ModelConfig, IGroup as GGroup, IShape } from '@antv/g6/es';

export function drawGateway(): (cfg?: ModelConfig, group?: GGroup) => IShape {
  return (cfg, group): IShape => {
    const width = (cfg.size as number[])[0];
    const height = (cfg.size as number[])[1];
    const mainShape = group.addShape('polygon', {
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        points: [
          [0, width / 2],
          [height / 2, width],
          [height, width / 2],
          [height / 2, 0],
        ],
        anchorPoints: cfg.anchorPoints,
        stroke: 'salmon',
        label: cfg.label,
        labelCfg: {
          style: {
            fill: '#9254de',
            fontSize: 18,
          },
          position: 'bottom',
        },
      },
      name: 'main-box',
      draggable: true,
    });

    group.addShape('image', {
      attrs: {
        x: width / 5,
        y: height / 5,
        width: (width * 3) / 5,
        height: (height * 3) / 5,
        img:
          'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgOTYgOTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDk2IDk2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggc3R5bGU9IiIgZD0iTTE2LjUsMjRjMC42MjIsMCwxLjIxNCwwLjEyNiwxLjc1MywwLjM1NCAgIGMwLjg5OS0wLjkwMSwxLjgzNy0xLjc2MywyLjgxNS0yLjU4MWMtMC4wMzMtMC4yNTMtMC4wNS0wLjUxMS0wLjA1LTAuNzc0YzAtNS45NTktMC44MjctNy41MDctMi42OTItMTMuMTAzICAgYy0wLjYyOS0xLjg4OS0wLjMzOS0zLjc5MSwwLjgyNS01LjQwNkMyMC4zMTQsMC44NzcsMjIuMDI3LDAsMjQuMDE3LDBjNC40NzgsMCwxMi41NSw1LjcwNCwxNy4xNjMsOS4xMjcgICBDNDIuODMxLDcuMjEyLDQ1LjI3NCw2LDQ4LDZjMi43MjYsMCw1LjE2OSwxLjIxMiw2LjgyLDMuMTI3QzU5LjQzMyw1LjcwNCw2Ny41MDUsMCw3MS45ODMsMGMxLjk5MSwwLDMuNzAzLDAuODc3LDQuODY3LDIuNDkyICAgYzEuMTY0LDEuNjE1LDEuNDU0LDMuNTE3LDAuODI1LDUuNDA2Qzc1LjgxLDEzLjQ5Myw3NC45ODMsMTUuMDQxLDc0Ljk4MywyMWMwLDAuMjYyLTAuMDE3LDAuNTIxLTAuMDUsMC43NzQgICBjMS45MTQsMS42MDEsMy42ODIsMy4zNyw1LjI4NCw1LjI4M0M4Mi4zNjEsMjcuNCw4NCwyOS4yNTksODQsMzEuNWMwLDAuMjU3LTAuMDIyLDAuNTA5LTAuMDYzLDAuNzU0Qzg3Ljc4NCwzOC41OTcsOTAsNDYuMDQsOTAsNTQgICBjMCwyMy4xOTYtMTguODA0LDQyLTQyLDQyYy01Ljc2MSwwLTExLjI1LTEuMTYxLTE2LjI0OS0zLjI2QzMxLjE5Nyw5Mi45MDksMzAuNjA5LDkzLDMwLDkzYy0yLjc1MiwwLTUuMDctMS44NTItNS43NzgtNC4zNzggICBDMTMuMjE3LDgxLjA1LDYsNjguMzY5LDYsNTRjMC04LjQ2MSwyLjUwMy0xNi4zMzYsNi44MDgtMjIuOTI4QzEyLjI5OSwzMC4zNDMsMTIsMjkuNDU2LDEyLDI4LjVDMTIsMjYuMDE1LDE0LjAxNSwyNCwxNi41LDI0ICAgTDE2LjUsMjR6IE04Mi41LDQyYy0wLjgyOCwwLTEuNSwwLjY3Mi0xLjUsMS41czAuNjcyLDEuNSwxLjUsMS41YzAuODI4LDAsMS41LTAuNjcyLDEuNS0xLjVTODMuMzI4LDQyLDgyLjUsNDJMODIuNSw0MnogTTcwLjUsMzAgICBjLTAuODI4LDAtMS41LDAuNjcyLTEuNSwxLjVjMCwwLjgyOCwwLjY3MiwxLjUsMS41LDEuNWMwLjgyOCwwLDEuNS0wLjY3MiwxLjUtMS41QzcyLDMwLjY3Miw3MS4zMjgsMzAsNzAuNSwzMEw3MC41LDMweiBNNDkuNSw4NyAgIGMtMC44MjgsMC0xLjUsMC42NzItMS41LDEuNWMwLDAuODI4LDAuNjcyLDEuNSwxLjUsMS41czEuNS0wLjY3MiwxLjUtMS41QzUxLDg3LjY3Miw1MC4zMjgsODcsNDkuNSw4N0w0OS41LDg3eiBNNDAuNSw4MSAgIGMtMC44MjgsMC0xLjUsMC42NzItMS41LDEuNWMwLDAuODI4LDAuNjcyLDEuNSwxLjUsMS41YzAuODI4LDAsMS41LTAuNjcyLDEuNS0xLjVDNDIsODEuNjcyLDQxLjMyOCw4MSw0MC41LDgxTDQwLjUsODF6IE0xNi41LDY5ICAgYy0wLjgyOCwwLTEuNSwwLjY3Mi0xLjUsMS41YzAsMC44MjgsMC42NzIsMS41LDEuNSwxLjVjMC44MjgsMCwxLjUtMC42NzIsMS41LTEuNUMxOCw2OS42NzIsMTcuMzI4LDY5LDE2LjUsNjlMMTYuNSw2OXogTTI1LjUsNzUgICBjLTAuODI4LDAtMS41LDAuNjcyLTEuNSwxLjVjMCwwLjgyOCwwLjY3MiwxLjUsMS41LDEuNWMwLjgyOCwwLDEuNS0wLjY3MiwxLjUtMS41QzI3LDc1LjY3MiwyNi4zMjgsNzUsMjUuNSw3NUwyNS41LDc1eiBNMTMuNSw1MSAgIGMtMC44MjgsMC0xLjUsMC42NzItMS41LDEuNWMwLDAuODI4LDAuNjcyLDEuNSwxLjUsMS41YzAuODI4LDAsMS41LTAuNjcyLDEuNS0xLjVDMTUsNTEuNjcyLDE0LjMyOCw1MSwxMy41LDUxTDEzLjUsNTF6IE0xOS41LDM2ICAgYy0wLjgyOCwwLTEuNSwwLjY3Mi0xLjUsMS41YzAsMC44MjgsMC42NzIsMS41LDEuNSwxLjVjMC44MjgsMCwxLjUtMC42NzIsMS41LTEuNUMyMSwzNi42NzIsMjAuMzI4LDM2LDE5LjUsMzZMMTkuNSwzNnogICAgTTE1LjE2OSwyNy44MDhsLTAuMDA1LDAuMDA5bDAsMGwtMC4wMDUsMC4wMWwtMC4wMDUsMC4wMWwtMC4wMDUsMC4wMWwtMC4wMDEsMC4wMDNsLTAuMDAzLDAuMDA3bC0wLjAwNSwwLjAxbC0wLjAwNSwwLjAxICAgbC0wLjAwMywwLjAwNmwtMC4wMDIsMC4wMDRsLTAuMDA1LDAuMDFsLTAuMDA0LDAuMDFsLTAuMDA0LDAuMDA5bDAsMC4wMDFsLTAuMDA0LDAuMDFsLTAuMDA0LDAuMDFsLTAuMDA0LDAuMDFsLTAuMDAxLDAuMDAyICAgbC0wLjAwMywwLjAwOGwtMC4wMDQsMC4wMTFsLTAuMDA0LDAuMDFsLTAuMDAyLDAuMDA2bC0wLjAwMiwwLjAwNWwtMC4wMDQsMC4wMWwtMC4wMDQsMC4wMWwtMC4wMDMsMC4wMDlsLTAuMDAxLDAuMDAxbC0wLjAwMywwLjAxICAgbC0wLjAwNCwwLjAxMWwtMC4wMDMsMC4wMTFsLTAuMDAxLDAuMDAybC0wLjAwMywwLjAwOWwtMC4wMDMsMC4wMTFsLTAuMDAzLDAuMDFsLTAuMDAxLDAuMDA1bC0wLjAwMSwwLjAwNWwtMC4wMDMsMC4wMTEgICBsLTAuMDAzLDAuMDExbC0wLjAwMiwwLjAwOWwwLDAuMDAybC0wLjAwMywwLjAxMWwtMC4wMDMsMC4wMTFsLTAuMDAzLDAuMDExbDAsMC4wMDFsLTAuMDAyLDAuMDA5bC0wLjAwMiwwLjAxMWwtMC4wMDIsMC4wMTEgICBsLTAuMDAxLDAuMDA1bC0wLjAwMSwwLjAwNmwtMC4wMDIsMC4wMTFsLTAuMDAyLDAuMDExbC0wLjAwMSwwLjAwOWwwLDAuMDAybC0wLjAwMiwwLjAxMWwtMC4wMDIsMC4wMTFsLTAuMDAyLDAuMDExdjAuMDAxICAgbC0wLjAwMSwwLjAxbC0wLjAwMiwwLjAxMWwtMC4wMDEsMC4wMTFsLTAuMDAxLDAuMDA1bC0wLjAwMSwwLjAwN2wtMC4wMDEsMC4wMTFsLTAuMDAxLDAuMDExbC0wLjAwMSwwLjAwOGwwLDAuMDAzbC0wLjAwMSwwLjAxMSAgIGwtMC4wMDEsMC4wMTFsLTAuMDAxLDAuMDEydjBsLTAuMDAxLDAuMDExbC0wLjAwMSwwLjAyM3YwLjAwNGwtMC4wMDIsMC4wMzhsMCwwLjAwNHYwLjAxMmwwLDAuMDEyVjI4LjVjMCwwLjgyOCwwLjY3MiwxLjUsMS41LDEuNSAgIGwwLjAzOS0wLjAwMWwwLjAzOC0wLjAwMWwwLjAzOC0wLjAwMmwwLjAzOC0wLjAwM2wwLjAzOC0wLjAwNGwwLjAzNy0wLjAwNmgwbDAuMDM3LTAuMDA2bDAuMDM3LTAuMDA3bDAuMDM2LTAuMDA4bDAuMDM2LTAuMDA5aDAgICBsMC4wMzYtMC4wMWwwLjAzNS0wLjAxbDAuMDM1LTAuMDExaDBsMC4wMzUtMC4wMTJsMC4wMzQtMC4wMTNoMGwwLjAzNC0wLjAxNGwwLjAzNC0wLjAxNWwwLjAzMy0wLjAxNWwwLjAzMi0wLjAxNmgwbDAuMDMyLTAuMDE3aDAgICBsMC4wMzEtMC4wMThsMC4wMzEtMC4wMThoMGwwLjAzMS0wLjAxOWwwLjAzLTAuMDJoMGwwLjAyOS0wLjAyMWgwbDAuMDI5LTAuMDIxaDBsMC4wMjktMC4wMjJsMC4wMjgtMC4wMjJoMGwwLjAyNy0wLjAyMyAgIGwwLjAyNy0wLjAyNGwwLjAyNi0wLjAyNWwwLjAyNi0wLjAyNWgwbDAuMDI1LTAuMDI2aDBsMC4wMjQtMC4wMjZsMC4wMjQtMC4wMjdsMC4wMjMtMC4wMjhsMC4wMjMtMC4wMjhoMGwwLjAyMi0wLjAyOWwwLjAyMS0wLjAyOSAgIGgwbDAuMDItMC4wM2wwLjAyLTAuMDNsMC4wMTktMC4wMzFsMC4wMTgtMC4wMzFoMGwwLjAxNy0wLjAzMmgwbDAuMDE3LTAuMDMybDAuMDE2LTAuMDMybDAuMDE1LTAuMDMzbDAuMDE1LTAuMDM0bDAuMDE0LTAuMDM0ICAgbDAuMDEzLTAuMDM0bDAuMDEyLTAuMDM1bDAuMDExLTAuMDM1bDAuMDExLTAuMDM1bDAuMDEtMC4wMzZsMC4wMDktMC4wMzZsMC4wMDgtMC4wMzZsMC4wMDctMC4wMzdsMC4wMDYtMC4wMzdsMC4wMDUtMC4wMzcgICBsMC4wMDQtMC4wMzhsMC4wMDMtMC4wMzhsMC4wMDItMC4wMzhsMC4wMDItMC4wMzhMMTgsMjguNWwtMC4wMDEtMC4wMzlsLTAuMDAyLTAuMDM4bC0wLjAwMi0wLjAzOGwtMC4wMDMtMC4wMzhsLTAuMDA0LTAuMDM4ICAgbC0wLjAwNS0wLjAzN3YwbC0wLjAwNi0wLjAzN2wtMC4wMDctMC4wMzdsLTAuMDA4LTAuMDM2bC0wLjAwOS0wLjAzNnYwbC0wLjAxLTAuMDM2bC0wLjAxMS0wLjAzNWwtMC4wMTEtMC4wMzV2MGwtMC4wMTItMC4wMzUgICBsLTAuMDEzLTAuMDM0djBsLTAuMDE0LTAuMDM0bC0wLjAxNS0wLjAzNGwtMC4wMTUtMC4wMzNsLTAuMDE2LTAuMDMydjBsLTAuMDM1LTAuMDY0aDBsLTAuMDE4LTAuMDMxdjBsLTAuMDE5LTAuMDMxbC0wLjAyLTAuMDN2MCAgIGwtMC4wNDItMC4wNTl2MGwtMC4wMjItMC4wMjhoMGwtMC4wMjMtMC4wMjh2MGwtMC4wMjMtMC4wMjdsLTAuMDI0LTAuMDI3bC0wLjAyNC0wLjAyNmgwbC0wLjA1MS0wLjA1MXYwbC0wLjAyNi0wLjAyNCAgIGwtMC4wMjctMC4wMjRsLTAuMDI3LTAuMDIzaDBsLTAuMDI4LTAuMDIzdjBsLTAuMDI5LTAuMDIyaDBsLTAuMDU4LTAuMDQyaDBsLTAuMDMtMC4wMmwtMC4wMzEtMC4wMTloMGwtMC4wMzEtMC4wMTh2MCAgIGwtMC4wNjQtMC4wMzVoMGwtMC4wMzItMC4wMTZsLTAuMDMzLTAuMDE1bC0wLjAzNC0wLjAxNWwtMC4wMzQtMC4wMTRoMGwtMC4wMzQtMC4wMTNsLTAuMDM1LTAuMDEyaDBsLTAuMDM1LTAuMDExbC0wLjAzNS0wLjAxICAgbC0wLjAzNi0wLjAxaDBsLTAuMDM2LTAuMDA5bC0wLjAzNi0wLjAwOGwtMC4wMzctMC4wMDdsLTAuMDM3LTAuMDA2aDBsLTAuMDM3LTAuMDA1bC0wLjAzOC0wLjAwNGwtMC4wMzgtMC4wMDNsLTAuMDM4LTAuMDAyICAgbC0wLjAzOC0wLjAwMUwxNi41LDI3aC0wLjAxN2wtMC4wMTcsMGwtMC4wMDUsMGwtMC4wMTIsMGwtMC4wMTcsMC4wMDFsLTAuMDEsMC4wMDFsLTAuMDA3LDBsLTAuMDE3LDAuMDAxbC0wLjAxNCwwLjAwMWgtMC4wMDIgICBsLTAuMDE3LDAuMDAxbC0wLjAxNywwLjAwMWwtMC4wMDIsMGwtMC4wMTQsMC4wMDFsLTAuMDE3LDAuMDAybC0wLjAwNywwLjAwMUwxNi4zLDI3LjAxM2wtMC4wMTcsMC4wMDJsLTAuMDEyLDAuMDAybC0wLjAwNSwwLjAwMSAgIGwtMC4wMTYsMC4wMDNsLTAuMDE2LDAuMDAzaDBsLTAuMDE2LDAuMDAzbC0wLjAxNiwwLjAwM2wtMC4wMDUsMC4wMDFsLTAuMDExLDAuMDAybC0wLjAxNiwwLjAwNGwtMC4wMDksMC4wMDJsLTAuMDA3LDAuMDAxICAgbC0wLjAxNiwwLjAwNGwtMC4wMTQsMC4wMDNsLTAuMDAyLDAuMDAxbC0wLjAxNiwwLjAwNGwtMC4wMTYsMC4wMDRsLTAuMDAzLDAuMDAxbC0wLjAxMywwLjAwNGwtMC4wMTUsMC4wMDVsLTAuMDA3LDAuMDAyICAgbC0wLjAwOCwwLjAwM2wtMC4wMTUsMC4wMDVsLTAuMDExLDAuMDA0bC0wLjAwNCwwLjAwMUwxNiwyNy4wODZsLTAuMDE1LDAuMDA1aDBsLTAuMDE1LDAuMDA2bC0wLjAxNSwwLjAwNmwtMC4wMDUsMC4wMDIgICBsLTAuMDEsMC4wMDRsLTAuMDE1LDAuMDA2bC0wLjAwOSwwLjAwNGwtMC4wMDYsMC4wMDNsLTAuMDE1LDAuMDA2bC0wLjAxMywwLjAwNmwtMC4wMDEsMC4wMDFsLTAuMDE0LDAuMDA3bC0wLjAxNCwwLjAwNyAgIGwtMC4wMDMsMC4wMDFsLTAuMDEyLDAuMDA2bC0wLjAxNCwwLjAwN2wtMC4wMDcsMC4wMDNsLTAuMDA4LDAuMDA0bC0wLjAxNCwwLjAwOGwtMC4wMSwwLjAwNmwtMC4wMDQsMC4wMDJsLTAuMDE0LDAuMDA4ICAgbC0wLjAxNCwwLjAwOGwtMC4wMDEsMGwtMC4wMTMsMC4wMDhsLTAuMDE0LDAuMDA4bC0wLjAwNCwwLjAwMmwtMC4wMDksMC4wMDZMMTUuNywyNy4yMzFsLTAuMDA4LDAuMDA1bC0wLjAwNSwwLjAwM2wtMC4wMTMsMC4wMDkgICBsLTAuMDEyLDAuMDA4bC0wLjAwMSwwLjAwMWwtMC4wMTMsMC4wMDlsLTAuMDEzLDAuMDA5bC0wLjAwMiwwLjAwMmwtMC4wMTEsMC4wMDhsLTAuMDEzLDAuMDA5bC0wLjAwNiwwLjAwNGwtMC4wMDcsMC4wMDUgICBsLTAuMDEzLDAuMDFsLTAuMDEsMC4wMDdsLTAuMDAzLDAuMDAybC0wLjAxMiwwLjAxbC0wLjAxMiwwLjAxQzE1LjM5MiwyNy40NywxNS4yNjMsMjcuNjI5LDE1LjE2OSwyNy44MDhMMTUuMTY5LDI3LjgwOHogICAgTTIyLjU5NSw2My4wMDNDMjIuNTY0LDYzLjAwMSwyMi41MzIsNjMsMjIuNSw2M2MtMC44MjgsMC0xLjUsMC42NzItMS41LDEuNWMwLDAuODI4LDAuNjcyLDEuNSwxLjUsMS41ICAgYzAuNDUyLDAsMC44NTgtMC4yLDEuMTMzLTAuNTE3bDAuMDAxLTAuMDAybDAuMDIzLTAuMDI4bDAuMDA3LTAuMDA4bDAuMDEtMC4wMTNsMC4wMDUtMC4wMDdsMC4wMDUtMC4wMDZsMC4wMS0wLjAxM2wwLjAwOC0wLjAxICAgbDAuMDAyLTAuMDAzbDAuMDM4LTAuMDUzbDAuMDAxLTAuMDAybDAuMDA4LTAuMDExbDAuMDA5LTAuMDE0bDAuMDAzLTAuMDA1bDAuMDE5LTAuMDMxbDAuMDA0LTAuMDA2bDAuMDMyLTAuMDU3bDAuMDAxLTAuMDAxICAgbDAuMDE1LTAuMDI5bDAuMDAxLTAuMDAybDAuMDA2LTAuMDEybDAuMDA4LTAuMDE1bDAuMDAyLTAuMDA1bDAuMDA0LTAuMDFsMC4wMDctMC4wMTVsMC4wMDQtMC4wMDhsMC4wMDMtMC4wMDdsMC4wMDctMC4wMTUgICBsMC4wMDUtMC4wMTJsMC4wMDEtMC4wMDRsMC4wMTItMC4wM2wwLDBsMC4wMDYtMC4wMTZsMC4wMDYtMC4wMTZsMC4wMDEtMC4wMDNsMC4wMDUtMC4wMTNsMC4wMDYtMC4wMTZsMC4wMDItMC4wMDZsMC4wMDktMC4wMjYgICBsMC4wMDMtMC4wMDlsMC4wMDItMC4wMDdsMC4wMDUtMC4wMTZsMC4wMDQtMC4wMTNsMC4wMDEtMC4wMDRsMC4wMDQtMC4wMTZsMC4wMDQtMC4wMTZ2MGwwLjAwNC0wLjAxNmwwLjAwNC0wLjAxN2wwLjAwMS0wLjAwMyAgIGwwLjAwMy0wLjAxM2wwLjAwNC0wLjAxN2wwLjAwMS0wLjAwNmwwLjAwMi0wLjAxbDAuMDAzLTAuMDE3bDAuMDAyLTAuMDFsMC4wMDEtMC4wMDdsMC4wMDMtMC4wMTdsMC4wMDItMC4wMTRsMC4wMDEtMC4wMDQgICBsMC4wMDItMC4wMTdsMC4wMDItMC4wMTd2MGwwLjAwMi0wLjAxN2wwLjAwMi0wLjAxN2wwLTAuMDAzbDAuMDAyLTAuMDE0bDAuMDAxLTAuMDE3bDAtMC4wMDdsMC4wMDEtMC4wMWwwLjAwMy0wLjA1MmwwLTAuMDE0ICAgbDAtMC4wMDRsMC0wLjAxN1Y2NC41bC0wLjAwMS0wLjAzN3YtMC4wMDJsLTAuMDAxLTAuMDM1bDAtMC4wMDNsLTAuMDAyLTAuMDM4bC0wLjAwMy0wLjAzMmwtMC4wMDEtMC4wMDZsLTAuMDAzLTAuMDNsLTAuMDAxLTAuMDA4ICAgbC0wLjAwNC0wLjAyOGwtMC4wMDEtMC4wMDlsLTAuMDA0LTAuMDI3bC0wLjAwMi0wLjAxbC0wLjAwNS0wLjAyNWwtMC4wMDItMC4wMTFsLTAuMDA1LTAuMDI0bC0wLjAwMy0wLjAxM2wtMC4wMDUtMC4wMjIgICBsLTAuMDAzLTAuMDE0bC0wLjAwNi0wLjAyMWwtMC4wMDQtMC4wMTVsLTAuMDA1LTAuMDE5bC0wLjAwNS0wLjAxN2wtMC4wMDUtMC4wMTdsLTAuMDA2LTAuMDE3bC0wLjAwNS0wLjAxNmwtMC4wMDctMC4wMTkgICBsLTAuMDA1LTAuMDE0bC0wLjAwOC0wLjAybC0wLjAwNS0wLjAxM2wtMC4wMDktMC4wMjFsLTAuMDA1LTAuMDExbC0wLjAxLTAuMDIybC0wLjAwNC0wLjAxbC0wLjAxMS0wLjAyM2wtMC4wMDQtMC4wMDggICBsLTAuMDEyLTAuMDI0bC0wLjAwNC0wLjAwN2wtMC4wMTMtMC4wMjVsLTAuMDAzLTAuMDA2bC0wLjAxNS0wLjAyNmwtMC4wMDMtMC4wMDVsLTAuMDE2LTAuMDI2bC0wLjAwMi0wLjAwM2wtMC4wMTctMC4wMjggICBsLTAuMDAxLTAuMDAybC0wLjAxOS0wLjAyOGwtMC4wMDEtMC4wMDFsLTAuMDItMC4wMjhsMCwwbC0wLjAyLTAuMDI4bC0wLjAwMS0wLjAwMWwtMC4wMi0wLjAyNmwtMC4wMDItMC4wMDNsLTAuMDItMC4wMjQgICBsLTAuMDAzLTAuMDA0bC0wLjAxOS0wLjAyM2wtMC4wMDQtMC4wMDVsLTAuMDE5LTAuMDIxbC0wLjAyMy0wLjAyNmwtMC4wMDYtMC4wMDdsLTAuMDE4LTAuMDE4bC0wLjAwNy0wLjAwN2wtMC4wMTctMC4wMTcgICBsLTAuMDA4LTAuMDA4bC0wLjAxNy0wLjAxNmwtMC4wMDktMC4wMDlsLTAuMDE3LTAuMDE0bC0wLjAyNi0wLjAyM2wtMC4wMTItMC4wMWwtMC4wMTUtMC4wMTJsLTAuMDEzLTAuMDExbC0wLjAxNC0wLjAxMSAgIGwtMC4wMjgtMC4wMjFsLTAuMDE2LTAuMDEybC0wLjAxMi0wLjAwOGwtMC4wMTgtMC4wMTJsLTAuMDExLTAuMDA3bC0wLjAxOS0wLjAxM2wtMC4wMS0wLjAwNmwtMC4wMjEtMC4wMTNsLTAuMDA5LTAuMDA1ICAgbC0wLjAyMi0wLjAxM2wtMC4wMDgtMC4wMDRsLTAuMDIzLTAuMDEzbC0wLjAwNy0wLjAwNGwtMC4wMjUtMC4wMTRsLTAuMDA2LTAuMDAzbC0wLjAyNy0wLjAxNGwtMC4wMDUtMC4wMDJsLTAuMDI4LTAuMDEzICAgbC0wLjAwNC0wLjAwMWwtMC4wMy0wLjAxM2wtMC4wMDItMC4wMDFjLTAuMDMyLTAuMDE0LTAuMDY1LTAuMDI2LTAuMDk5LTAuMDM3bC0wLjAwMi0wLjAwMWwtMC4wMzItMC4wMWwtMC4wMDMtMC4wMDFsLTAuMDMxLTAuMDA5ICAgbC0wLjAwNC0wLjAwMWMtMC4wNTYtMC4wMTYtMC4xMTMtMC4wMjgtMC4xNy0wLjAzOGwtMC4wMTItMC4wMDJsLTAuMDI0LTAuMDAzbC0wLjA3My0wLjAwOGwtMC4wMTctMC4wMDJMMjIuNTk1LDYzLjAwMyAgIEwyMi41OTUsNjMuMDAzeiBNMzAsODRjLTEuNjE0LDAtMi45MjksMS4yNzQtMi45OTcsMi44NzFsMCwwLjAwNHYwLjAwNGwwLDAuMDA0djAuMDA0bDAsMC4wMDR2MC4wMDRsMCwwLjAwNHYwLjAwNGwwLDAuMDA0djAuMDA0ICAgbC0wLjAwMSwwLjAxNnYwLjAwNHYwLjAwNGwwLDAuMDA0djAuMDA0djAuMDA0djAuMDA0bDAsMC4wMDR2MC4wMDR2MC4wMDR2MC4wMDR2MC4wMDRsMCwwLjAwNHYwLjAwNHYwLjAwNHYwLjAwNHYwLjAwNHYwLjAwNFY4NyAgIGMwLDEuNjU3LDEuMzQzLDMsMywzbDAuMDYtMC4wMDFsMC4wMTcsMGwwLjAxMywwbDAuMDMtMC4wMDFsMC4wMy0wLjAwMWwwLjAwNSwwbDAuMDI1LTAuMDAxbDAuMDMtMC4wMDJsMC4wMjEtMC4wMDFsMC4wMDgtMC4wMDEgICBsMC4wMjktMC4wMDNsMC4wMy0wLjAwM2wwLjAwOC0wLjAwMWwwLjAyMS0wLjAwMmwwLjAyOS0wLjAwM2wwLjAyNi0wLjAwM2wwLjAwNC0wLjAwMWwwLjAyOS0wLjAwNGwwLjAyOS0wLjAwNGwwLjAxMy0wLjAwMiAgIGwwLjAxNi0wLjAwM2wwLjAyOS0wLjAwNWwwLjAyOS0wLjAwNWgwbDAuMDI4LTAuMDA1bDAuMDI5LTAuMDA1bDAuMDE3LTAuMDAzbDAuMDEyLTAuMDAybDAuMDI4LTAuMDA2bDAuMDI4LTAuMDA2bDAuMDA1LTAuMDAxICAgbDAuMDI0LTAuMDA2bDAuMDI4LTAuMDA3bDAuMDItMC4wMDVsMC4wMDgtMC4wMDJsMC4wMjgtMC4wMDdsMC4wMjgtMC4wMDhsMC4wMjQtMC4wMDdsMC4wMDQtMC4wMDFsMC4wMjctMC4wMDhsMC4wMjQtMC4wMDggICBsMC4wMDMtMC4wMDFsMC4wMjctMC4wMDlsMC4wMjctMC4wMDlsMC4wMTItMC4wMDRsMC4wMTUtMC4wMDVsMC4wMjctMC4wMDlsMC4wMjctMC4wMWwwLjAwMSwwbDAuMDI2LTAuMDFsMC4wMjctMC4wMWwwLjAxNi0wLjAwNiAgIGwwLjAxLTAuMDA0bDAuMDI2LTAuMDExbDAuMDI2LTAuMDExbDAuMDA0LTAuMDAybDAuMDIyLTAuMDA5bDAuMDI2LTAuMDExbDAuMDE5LTAuMDA4bDAuMDA3LTAuMDAzbDAuMDI2LTAuMDEybDAuMDI2LTAuMDEyICAgbDAuMDA4LTAuMDA0bDAuMDE3LTAuMDA5bDAuMDI2LTAuMDEzbDAuMDIyLTAuMDExbDAuMDAzLTAuMDAxbDAuMDI1LTAuMDEzbDAuMDI1LTAuMDEzbDAuMDI1LTAuMDEzbDAuMDI1LTAuMDE0bDAuMDI1LTAuMDE0ICAgbDAuMDAxLDBsMC4wMjMtMC4wMTRsMC4wMjQtMC4wMTRsMC4wMTQtMC4wMDlsMC4wMS0wLjAwNmwwLjAyNC0wLjAxNWwwLjAyNC0wLjAxNWwwLjAwNC0wLjAwMmwwLjAxOS0wLjAxM2wwLjAyNC0wLjAxNSAgIGwwLjAxNy0wLjAxMmwwLjAwNi0wLjAwNGwwLjAyMy0wLjAxNmwwLjAyMy0wLjAxNkMzMi40OTgsODguOTA4LDMzLDg4LjAxMywzMyw4N0MzMyw4NS4zNDMsMzEuNjU3LDg0LDMwLDg0TDMwLDg0eiBNNzAuNSw3OCAgIGMtMC44MjgsMC0xLjUsMC42NzItMS41LDEuNWMwLDAuODI4LDAuNjcyLDEuNSwxLjUsMS41YzAuODI4LDAsMS41LTAuNjcyLDEuNS0xLjVDNzIsNzguNjcyLDcxLjMyOCw3OCw3MC41LDc4TDcwLjUsNzh6IE03Ni41LDY2ICAgYy0wLjgyOCwwLTEuNSwwLjY3Mi0xLjUsMS41YzAsMC44MjgsMC42NzIsMS41LDEuNSwxLjVjMC44MjgsMCwxLjUtMC42NzIsMS41LTEuNUM3OCw2Ni42NzIsNzcuMzI4LDY2LDc2LjUsNjZMNzYuNSw2NnogICAgTTU4LjIxNyw3OC44MTVjMC4xNTcsMC42NjEsMC43NTEsMS4xNTMsMS40NiwxLjE1M2MwLjgyOCwwLDEuNS0wLjY3MiwxLjUtMS41YzAtMC4zMzMtMC4xMS0wLjY0My0wLjI5NC0wLjg5MmwtMC4wMDQtMC4wMDUgICBsLTAuMDA5LTAuMDEybC0wLjAxMy0wLjAxN2wwLDBsLTAuMDEzLTAuMDE3bC0wLjAwOS0wLjAxMWwtMC4wMDUtMC4wMDZsLTAuMDE0LTAuMDE3bC0wLjAwNS0wLjAwNWwtMC4wMS0wLjAxMWwtMC4wMTQtMC4wMTZ2MCAgIGwtMC4wMTUtMC4wMTZsLTAuMDEtMC4wMTFsLTAuMDA1LTAuMDA1bC0wLjAxNS0wLjAxNWwtMC4wMDUtMC4wMDVsLTAuMDEtMC4wMWwtMC4wMTUtMC4wMTVsMC0wLjAwMWwtMC4wMTUtMC4wMTRsLTAuMDE2LTAuMDE0ICAgbC0wLjAxNi0wLjAxNGwtMC4wMDYtMC4wMDZsLTAuMDEtMC4wMDhsLTAuMDE3LTAuMDE0bC0wLjAwMS0wLjAwMWwtMC4wMTYtMC4wMTNsLTAuMDEyLTAuMDFsLTAuMDA0LTAuMDAzbC0wLjAxNy0wLjAxMyAgIGwtMC4wMDctMC4wMDZsLTAuMDEtMC4wMDdsLTAuMDE3LTAuMDEzbC0wLjAwMS0wLjAwMWwtMC4wMTYtMC4wMTFsLTAuMDE0LTAuMDFsLTAuMDA0LTAuMDAzbC0wLjAxOC0wLjAxMmwtMC4wMDgtMC4wMDUgICBsLTAuMDEtMC4wMDZsLTAuMDE4LTAuMDExbC0wLjAwMi0wLjAwMWwtMC4wMTYtMC4wMWwtMC4wMTUtMC4wMDlsLTAuMDA0LTAuMDAybC0wLjAxOS0wLjAxMWwtMC4wMDktMC4wMDVsLTAuMDEtMC4wMDVsLTAuMDE5LTAuMDEgICBsLTAuMDAzLTAuMDAxbC0wLjAxNy0wLjAwOGwtMC4wMTYtMC4wMDhsLTAuMDA0LTAuMDAybC0wLjAyLTAuMDA5bC0wLjAxLTAuMDA0bC0wLjAxLTAuMDA1bC0wLjAyLTAuMDA5bC0wLjAwNC0wLjAwMWwtMC4wMTctMC4wMDcgICBsLTAuMDE3LTAuMDA3bC0wLjAwMy0wLjAwMWwtMC4wMi0wLjAwOGwtMC4wMTEtMC4wMDRsLTAuMDEtMC4wMDNsLTAuMDIxLTAuMDA3bC0wLjAwNS0wLjAwMWwtMC4wMTYtMC4wMDVsLTAuMDE4LTAuMDA2ICAgbC0wLjAwMy0wLjAwMUw2MC4xLDc3LjAyOGwtMC4wMTItMC4wMDNsLTAuMDEtMC4wMDNsLTAuMDIxLTAuMDA2bC0wLjAwNS0wLjAwMWwtMC4wMTYtMC4wMDRsLTAuMDItMC4wMDVsLTAuMDAyLDBsLTAuMDIyLTAuMDA1ICAgbC0wLjAxMy0wLjAwM2wtMC4wMDktMC4wMDJsLTAuMDIyLTAuMDA0bC0wLjAwNi0wLjAwMWwtMC4wMTYtMC4wMDNsLTAuMDIxLTAuMDAzbC0wLjAwMSwwbC0wLjAyMi0wLjAwM2wtMC4wMTQtMC4wMDJsLTAuMDA5LTAuMDAxICAgbC0wLjAyMy0wLjAwM2wtMC4wMDctMC4wMDFsLTAuMDE2LTAuMDAxbC0wLjAyMi0wLjAwMmwtMC4wMDEsMGwtMC4wMzctMC4wMDJsLTAuMDA4LTAuMDAxbC0wLjAyMy0wLjAwMWgtMC4wMDhsLTAuMDE2LDBsLTAuMDIzLDAgICBjLTAuODI4LDAtMS41LDAuNjcyLTEuNSwxLjV2MC4wMDZ2MC4wMDZ2MC4wMDZsMCwwLjAwNnYwLjAwNnYwLjAwNmwwLDAuMDAzdjAuMDAzbDAsMC4wMTJsMCwwLjAwNmwwLDAuMDA2bDAsMC4wMDZsMCwwLjAwNiAgIGwwLDAuMDA2bDAsMC4wMDZsMCwwLjAwNmwwLDAuMDA2bDAuMDAxLDAuMDEybDAsMC4wMDN2MC4wMDNsMC4wMDEsMC4wMDZsMC4wMDEsMC4wMDZsMCwwLjAwNmwwLjAwMSwwLjAwNmwwLjAwMSwwLjAwNmwwLjAwMSwwLjAwNiAgIGwwLjAwMSwwLjAwNmwwLjAwMSwwLjAwNmwwLjAwMSwwLjAwNmwwLjAwMSwwLjAwNmwwLjAwMSwwLjAwNmwwLjAwMSwwLjAwNmwwLDAuMDAzbDAsMC4wMDNsMC4wMDEsMC4wMDZsMC4wMDEsMC4wMDZsMC4wMDEsMC4wMDYgICBsMC4wMDEsMC4wMDZsMC4wMDEsMC4wMDZsMC4wMDEsMC4wMDZoMGwwLjAwNCwwLjAyM2wwLjAwMSwwLjAwNmwwLjAwMSwwLjAwNmwwLjAwMSwwLjAwM2wwLjAwMSwwLjAwM2wwLjAwMSwwLjAwNmwwLjAwMiwwLjAxMSAgIGwwLjAwMSwwLjAwNmwwLjAwMiwwLjAxMWwwLDBsMC4wMDEsMC4wMDVsMC4wMDEsMC4wMDVsMC4wMDEsMC4wMDZsMC4wMDEsMC4wMDZsMC4wMDEsMC4wMDVsMC4wMDEsMC4wMDZsMC4wMDEsMC4wMDNsMC4wMDEsMC4wMDMgICBMNTguMjE3LDc4LjgxNUw1OC4yMTcsNzguODE1eiBNODAuNTg2LDMyLjUzNUw4MC41ODYsMzIuNTM1bDAuMDEyLTAuMDEzbDAuMDEyLTAuMDEzbDAsMGwwLjAxMi0wLjAxM2wwLjAxMi0wLjAxM2wwLjAwMS0wLjAwMSAgIGwwLjAxMS0wLjAxM2wwLjAxMS0wLjAxNGwwLjAwMS0wLjAwMWwwLjAxLTAuMDEybDAuMDExLTAuMDE0bDAuMDAxLTAuMDAyTDgwLjcsMzIuNGwwLjAwMi0wLjAwMmwwLjAxOS0wLjAyNmwwLjAwMi0wLjAwMyAgIGwwLjAwOC0wLjAxMmwwLjAxMi0wLjAxOGwwLjAwOC0wLjAxMWwwLjAxLTAuMDE1bDAuMDAyLTAuMDA0bDAuMDA3LTAuMDExbDAuMDA5LTAuMDE1bDAuMDAzLTAuMDA0bDAuMDE2LTAuMDI2bDAuMDAzLTAuMDA1ICAgbDAuMDE4LTAuMDMybDAuMDA2LTAuMDFsMC4wMTEtMC4wMjJsMC4wMDUtMC4wMWwwLjAwOC0wLjAxNmwwLjAwMy0wLjAwN2wwLjAwNS0wLjAxbDAuMDA4LTAuMDE2bDAuMDAzLTAuMDA3bDAuMDA0LTAuMDA5ICAgbDAuMDA3LTAuMDE3bDAuMDAzLTAuMDA4bDAuMDA0LTAuMDA4bDAuMDA3LTAuMDE3bDAuMDAzLTAuMDA5bDAuMDAzLTAuMDA4bDAuMDA2LTAuMDE3bDAuMDA0LTAuMDA5bDAuMDAzLTAuMDA4bDAuMDA2LTAuMDE3ICAgbDAuMDAzLTAuMDFsMC4wMDItMC4wMDdsMC4wMDYtMC4wMTdsMC4wMDMtMC4wMWwwLjAwMi0wLjAwN2wwLjAwNS0wLjAxOGwwLjAwMy0wLjAxMWwwLjAwMi0wLjAwNmwwLjAwNS0wLjAxN2wwLjAwMy0wLjAxMiAgIGwwLjAwMS0wLjAwNWwwLjAwNS0wLjAxOGwwLjAwMy0wLjAxM2wwLjAwMS0wLjAwNWwwLjAwNC0wLjAxOGwwLjAwMy0wLjAxM2wwLjAwMS0wLjAwNWwwLjAwMy0wLjAxOGwwLjAwMy0wLjAxNGwwLjAwMS0wLjAwNCAgIGwwLjAwMS0wLjAwNGwwLjAwNS0wLjAyOWwwLjAwMS0wLjAwM2wwLjAwMy0wLjAxOWwwLjAwMi0wLjAxNWwwLTAuMDAzbDAuMDAyLTAuMDE5bDAuMDAyLTAuMDE2bDAtMC4wMDJsMC4wMDItMC4wMTlsMC4wMDEtMC4wMTcgICBsMC0wLjAwMmwwLjAwMS0wLjAxOWwwLjAwMS0wLjAxOGwwLTAuMDAxbDAuMDAxLTAuMDE5bDAuMDAxLTAuMDE4di0wLjAwMUw4MSwzMS41MTlWMzEuNWwtMC4wMDEtMC4wMzlsLTAuMDAxLTAuMDM4bC0wLjAwMi0wLjAzOCAgIGwtMC4wMDMtMC4wMzhsLTAuMDA0LTAuMDM4bC0wLjAwNS0wLjAzN3YwbC0wLjAwNi0wLjAzN2wtMC4wMDctMC4wMzdsLTAuMDA4LTAuMDM2bC0wLjAwOS0wLjAzNnYwbC0wLjAxLTAuMDM2bC0wLjAxLTAuMDM1ICAgbC0wLjAxMS0wLjAzNXYwbC0wLjAxMi0wLjAzNWwtMC4wMTMtMC4wMzR2MGwtMC4wMTQtMC4wMzRsLTAuMDE1LTAuMDM0bC0wLjAxNS0wLjAzM2wtMC4wMTYtMC4wMzJ2MGwtMC4wMzUtMC4wNjRoMGwtMC4wMTgtMC4wMzEgICB2MGwtMC4wMTktMC4wMzFsLTAuMDItMC4wM3YwbC0wLjA0Mi0wLjA1OHYwbC0wLjAyMi0wLjAyOGgwbC0wLjAyMi0wLjAyOHYwbC0wLjAyMy0wLjAyN2wtMC4wMjQtMC4wMjdsLTAuMDI0LTAuMDI2aDAgICBsLTAuMDUxLTAuMDUxdjBsLTAuMDI2LTAuMDI0bC0wLjAyNy0wLjAyNGwtMC4wMjctMC4wMjNoMGwtMC4wMjgtMC4wMjN2MGwtMC4wMjgtMC4wMjJoMGwtMC4wNTktMC4wNDJoMGwtMC4wMy0wLjAybC0wLjAzMS0wLjAxOSAgIGgwbC0wLjAzMS0wLjAxOHYwbC0wLjA2NC0wLjAzNWgwbC0wLjAzMi0wLjAxNmwtMC4wMzMtMC4wMTVsLTAuMDM0LTAuMDE1bC0wLjAzNC0wLjAxNGgwbC0wLjAzNC0wLjAxM2wtMC4wMzUtMC4wMTJoMCAgIGwtMC4wMzUtMC4wMTFsLTAuMDM1LTAuMDExbC0wLjAzNi0wLjAxaDBsLTAuMDM2LTAuMDA5bC0wLjAzNi0wLjAwOGwtMC4wMzctMC4wMDdsLTAuMDM3LTAuMDA2aDBsLTAuMDM3LTAuMDA1bC0wLjAzOC0wLjAwNCAgIGwtMC4wMzgtMC4wMDNsLTAuMDM4LTAuMDAybC0wLjAzOC0wLjAwMUw3OS41LDMwaC0wLjAxMWwtMC4wMTEsMGgtMC4wMTFsLTAuMDA2LDBoLTAuMDA1bC0wLjAxMSwwbC0wLjAxMSwwLjAwMWwtMC4wMSwwbC0wLjAwMiwwICAgbC0wLjAwOSwwbC0wLjAyMSwwLjAwMWwtMC4wMDgsMC4wMDFoLTAuMDAzbC0wLjAxMSwwLjAwMWwtMC4wMSwwLjAwMWwtMC4wMTEsMC4wMDFsLTAuMDAzLDBsLTAuMDA3LDAuMDAxbC0wLjAxLDAuMDAxbC0wLjAxLDAuMDAxICAgbC0wLjAxLDAuMDAxbC0wLjAwMSwwbC0wLjAxLDAuMDAxbC0wLjAxLDAuMDAybC0wLjAxLDAuMDAxbC0wLjAwNSwwLjAwMWwtMC4wMDUsMC4wMDFsLTAuMDEsMC4wMDJsLTAuMDEsMC4wMDJsLTAuMDEsMC4wMDJoLTAuMDAxICAgbC0wLjAxLDAuMDAybC0wLjAxLDAuMDAybC0wLjAxLDAuMDAybC0wLjAwNywwLjAwMWwtMC4wMDMsMC4wMDFsLTAuMDEsMC4wMDJsLTAuMDEsMC4wMDJsLTAuMDEsMC4wMDJsLTAuMDAyLDAuMDAxbC0wLjAwOCwwLjAwMiAgIGwtMC4wMSwwLjAwMmwtMC4wMSwwLjAwM2wtMC4wMDgsMC4wMDJsLTAuMDAyLDAuMDAxbC0wLjAxLDAuMDAzbC0wLjAxLDAuMDAzbC0wLjAxLDAuMDAzbC0wLjAwNCwwLjAwMWwtMC4wMDYsMC4wMDJsLTAuMDEsMC4wMDMgICBsLTAuMDEsMC4wMDNsLTAuMDEsMC4wMDNoMGwtMC4wMSwwLjAwM2wtMC4wMSwwLjAwM2wtMC4wMSwwLjAwM2wtMC4wMDUsMC4wMDJsLTAuMDA1LDAuMDAybC0wLjAxLDAuMDAzbC0wLjAxLDAuMDAzbC0wLjAxLDAuMDA0ICAgbC0wLjAwMSwwbC0wLjAwOCwwLjAwM2wtMC4wMSwwLjAwNGwtMC4wMSwwLjAwNGwtMC4wMDcsMC4wMDNsLTAuMDAzLDAuMDAxbC0wLjAxLDAuMDA0bC0wLjAxLDAuMDA0bC0wLjAwOSwwLjAwNGwtMC4wMDMsMC4wMDEgICBsLTAuMDA3LDAuMDAzbC0wLjAxLDAuMDA0bC0wLjAxNywwLjAwOGwtMC4wMDEsMGwtMC4wMTgsMC4wMDlsLTAuMDA5LDAuMDA0Qzc4LjM0OSwzMC4zODcsNzgsMzAuOTAzLDc4LDMxLjUgICBjMCwwLjgyOCwwLjY3MiwxLjUsMS41LDEuNUM3OS45MjgsMzMsODAuMzEzLDMyLjgyMSw4MC41ODYsMzIuNTM1TDgwLjU4NiwzMi41MzV6IE03OCw1MWMtMS42NTcsMC0zLDEuMzQzLTMsMyAgIGMwLDEuNjU3LDEuMzQzLDMsMywzYzEuNjU3LDAsMy0xLjM0MywzLTNDODEsNTIuMzQzLDc5LjY1Nyw1MSw3OCw1MUw3OCw1MXogTTYyLjc0NCwzNC45MDVjLTAuNTU0LDAuMjUtMS4xOCwwLjMyMS0xLjgyMSwwLjE5MiAgIGwtMy4zNDEtMC42NzRsLTEuOTA3LDIuODI0Yy0wLjYzNSwwLjk0MS0xLjY2NCwxLjQyMi0yLjc5MywxLjMwNmMtMS4xMjktMC4xMTYtMi4wMzgtMC43OTYtMi40NjktMS44NDdMNDgsMzAuODIxbC0yLjQxMiw1Ljg4NSAgIGMtMC40MywxLjA1MS0xLjMzOSwxLjczLTIuNDY5LDEuODQ2Yy0xLjEyOSwwLjExNi0yLjE1OC0wLjM2NC0yLjc5My0xLjMwNmwtMS45MDctMi44MjVsLTMuMzQxLDAuNjc0ICAgYy0wLjY0MSwwLjEyOS0xLjI2NywwLjA1OC0xLjgyMS0wLjE5MkMyNy42MjMsMzkuMjk2LDI0LDQ2LjE0NSwyNCw1My44NDJjMCwyLjQwOSwwLjM1Niw0LjczNCwxLjAxNyw2LjkyOCAgIEMyNi4yMTMsNjEuNTc4LDI3LDYyLjk0OCwyNyw2NC41YzAsMC4yODQtMC4wMjYsMC41Ni0wLjA3NywwLjgzQzMwLjk5NSw3Mi43ODUsMzguOTA3LDc3Ljg0Miw0OCw3Ny44NDIgICBjMi42NDYsMCw1LjE5Mi0wLjQyOSw3LjU3Mi0xLjIyYzAuNzA1LTEuNTY0LDIuMjc4LTIuNjUzLDQuMTA1LTIuNjUzYzAuNDAyLDAsMC43OTIsMC4wNTMsMS4xNjMsMC4xNTIgICBDNjcuNTQ4LDY5Ljg2NCw3Miw2Mi4zNzMsNzIsNTMuODQyQzcyLDQ2LjE0NSw2OC4zNzcsMzkuMjk2LDYyLjc0NCwzNC45MDVMNjIuNzQ0LDM0LjkwNXogTTUxLjAwNywyMy40ODZsLTEuMzg2LDMuMzhsMy41NjcsOC43MDMgICBsMy4wMjYtNC40ODJsNS4zMDIsMS4wNjlsLTIuOTEyLTcuMTA2Yy0xLjg0NC0wLjc3NS0zLjUyMi0xLjgwNy00LjgzMS0zLjE0NUM1Mi45NiwyMi41ODUsNTIuMDI1LDIzLjEyNCw1MS4wMDcsMjMuNDg2ICAgTDUxLjAwNywyMy40ODZ6IE01Ni40NzcsMTguMDNjLTAuMTk3LDAuNTUyLTAuNDQ4LDEuMDc5LTAuNzQ0LDEuNTc2QzU4LjczMywyMi45NjQsNjQuOTI0LDI0LDY4Ljk4MywyNGMxLjY1MiwwLDMtMS4zNDgsMy0zICAgYzAtMi4zMDgsMC4wNi00LjY0LDAuNTc2LTYuODk5YzAuNTQyLTIuMzczLDEuNDk4LTQuODM3LDIuMjctNy4xNTNjMC4zMTUtMC45NDQsMC4xNy0xLjg5NS0wLjQxMi0yLjcwMyAgIEM3My44MzQsMy40MzgsNzIuOTc4LDMsNzEuOTgzLDNjLTIuNjU3LDAtNy4xMTMsMi45MjMtOS4zMjgsNC4zNjljLTIuMTE3LDEuMzgtNC4yMjUsMi44NDEtNi4yNzQsNC4zNDMgICBjMC4yMSwwLjUzNCwwLjM3LDEuMDkyLDAuNDc1LDEuNjdjMS44NjMtMC4zMTEsMy44NTUtMS4yMTMsNS4wODQtMi40NDJjMC41ODQtMC41ODQsMS41MzctMC41ODQsMi4xMjIsMCAgIGMwLjU4NCwwLjU4NCwwLjU4NCwxLjUzNywwLDIuMTIyYy0xLjMzMywxLjMzMy0zLjIyNSwyLjM2LTUuMTkyLDIuOTMyYzEuNzc2LDEuMDIyLDMuOTc2LDEuNjQ2LDUuOTI1LDIuMDM2ICAgYzAuODEsMC4xNjIsMS4zMzksMC45NTUsMS4xNzcsMS43NjVjLTAuMTYyLDAuODEtMC45NTUsMS4zMzktMS43NjUsMS4xNzdDNjEuNTkyLDIwLjQ0OCw1OC43MDUsMTkuNTY0LDU2LjQ3NywxOC4wM0w1Ni40NzcsMTguMDN6ICAgIE0zOS41MjMsMTguMDNjLTIuMjI4LDEuNTM0LTUuMTE1LDIuNDE4LTcuNzI5LDIuOTQxYy0wLjgxLDAuMTYyLTEuNjAzLTAuMzY3LTEuNzY1LTEuMTc3Yy0wLjE2Mi0wLjgxLDAuMzY3LTEuNjAzLDEuMTc3LTEuNzY1ICAgYzEuOTQ5LTAuMzksNC4xNDktMS4wMTQsNS45MjUtMi4wMzZjLTEuOTY3LTAuNTcyLTMuODU5LTEuNTk5LTUuMTkyLTIuOTMyYy0wLjU4NC0wLjU4NC0wLjU4NC0xLjUzNywwLTIuMTIyICAgYzAuNTg0LTAuNTg0LDEuNTM3LTAuNTg0LDIuMTIyLDBjMS4yMjksMS4yMjksMy4yMjEsMi4xMzEsNS4wODQsMi40NDJjMC4xMDUtMC41NzgsMC4yNjUtMS4xMzYsMC40NzUtMS42NyAgIGMtMi4wNDgtMS41MDItNC4xNTctMi45NjMtNi4yNzQtNC4zNDNDMzEuMTMsNS45MjMsMjYuNjc0LDMsMjQuMDE3LDNjLTAuOTk1LDAtMS44NTIsMC40MzgtMi40MzQsMS4yNDYgICBjLTAuNTgyLDAuODA3LTAuNzI3LDEuNzU4LTAuNDEzLDIuNzAzYzAuNzcyLDIuMzE2LDEuNzI4LDQuNzc5LDIuMjcsNy4xNTNjMC41MTYsMi4yNTksMC41NzYsNC41OTEsMC41NzYsNi44OTkgICBjMCwxLjY1MiwxLjM0OCwzLDMsM2M0LjA1OCwwLDEwLjI1LTEuMDM2LDEzLjI0OS00LjM5NEMzOS45NywxOS4xMDksMzkuNzIxLDE4LjU4MiwzOS41MjMsMTguMDNMMzkuNTIzLDE4LjAzeiBNNDgsOSAgIGMtMy4zMTQsMC02LDIuNjg2LTYsNmMwLDMuMzE0LDIuNjg2LDYsNiw2YzMuMzE0LDAsNi0yLjY4Niw2LTZDNTQsMTEuNjg2LDUxLjMxNCw5LDQ4LDlMNDgsOXogTTM3LjM5NywyNS4wNDlsLTIuOTEzLDcuMTA2ICAgbDUuMzAyLTEuMDY5bDMuMDI2LDQuNDgybDMuNTY3LTguNzAzbDEuMTc5LTIuODc3Yy0yLjAyNC0wLjA5OC0zLjg3My0wLjg2NS01LjMzLTIuMDg0QzQwLjkxOSwyMy4yNDMsMzkuMjQxLDI0LjI3NSwzNy4zOTcsMjUuMDQ5ICAgeiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjwvcGF0aD48L2c+PC9zdmc+',
      },
      // must be assigned in G6 3.3 and later versions. it can be any value you want
      name: 'image-shape',
    });
    return mainShape;
  };
}
/*
import StyleUtils, { StyleDefault } from '../StyleUtils';
import { PaintParameter, buildPaintParameter, IconPainterProvider } from './render';
import { mxgraph } from '../initializer';
import { mxAbstractCanvas2D, mxRectangle } from 'mxgraph'; // for types

abstract class GatewayShape extends mxgraph.mxRhombus {
  protected iconPainter = IconPainterProvider.get();

  protected constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected abstract paintInnerShape(paintParameter: PaintParameter): void;

  public paintVertexShape(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    const paintParameter = buildPaintParameter(c, x, y, w, h, this);
    this.paintOuterShape(paintParameter);
    this.paintInnerShape(paintParameter);
  }

  protected paintOuterShape({ c, shape: { x, y, w, h } }: PaintParameter): void {
    super.paintVertexShape(c, x, y, w, h);
  }
}

/!**
 * @internal
 *!/
export class ExclusiveGatewayShape extends GatewayShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintInnerShape(paintParameter: PaintParameter): void {
    this.iconPainter.paintXCrossIcon({
      ...paintParameter,
      icon: { ...paintParameter.icon, isFilled: true },
      ratioFromParent: 0.5,
    });
  }
}

/!**
 * @internal
 *!/
export class ParallelGatewayShape extends GatewayShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintInnerShape(paintParameter: PaintParameter): void {
    this.iconPainter.paintPlusCrossIcon({
      ...paintParameter,
      icon: { ...paintParameter.icon, isFilled: true },
      ratioFromParent: 0.5,
    });
  }
}

/!**
 * @internal
 *!/
export class InclusiveGatewayShape extends GatewayShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintInnerShape(paintParameter: PaintParameter): void {
    this.iconPainter.paintCircleIcon({
      ...paintParameter,
      ratioFromParent: 0.62,
      icon: { ...paintParameter.icon, isFilled: false, strokeWidth: StyleDefault.STROKE_WIDTH_THICK.valueOf() },
    });
  }
}

!/**
 * @internal
 *!/
export class EventBasedGatewayShape extends GatewayShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintInnerShape(paintParameter: PaintParameter): void {
    paintParameter = { ...paintParameter, icon: { ...paintParameter.icon, strokeWidth: 1 } };

    // circle (simple or double)
    this.iconPainter.paintCircleIcon({
      ...paintParameter,
      ratioFromParent: 0.55,
    });
    if (!StyleUtils.getBpmnIsInstantiating(this.style)) {
      this.iconPainter.paintCircleIcon({
        ...paintParameter,
        ratioFromParent: 0.45,
      });
    }

    // inner icon
    const innerIconPaintParameter = {
      ...paintParameter,
      ratioFromParent: 0.3,
    };
    if (StyleUtils.getBpmnIsParallelEventBasedGateway(this.style)) {
      this.iconPainter.paintPlusCrossIcon(innerIconPaintParameter);
    } else {
      this.iconPainter.paintPentagon(innerIconPaintParameter);
    }
  }
}
*/
