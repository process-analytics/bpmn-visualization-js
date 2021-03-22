/**
 * Copyright 2021 Bonitasoft S.A.
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
import { OverlayConverter } from '../../../../../src/component/mxgraph/overlay/OverlayConverter';
import { MxGraphCustomOverlayOptions } from '../../../../../src/component/mxgraph/overlay/custom-overlay';
import { Overlay, OverlayPosition } from '../../../../../src/component/registry/types';

describe('overlay converter', () => {
  const overlayConverter = new OverlayConverter();

  it.each([
    [<OverlayPosition>'top-left', <MxGraphCustomOverlayOptions>{ horizontalAlign: 'left', verticalAlign: 'top' }],
    [<OverlayPosition>'top-right', <MxGraphCustomOverlayOptions>{ horizontalAlign: 'right', verticalAlign: 'top' }],
    [<OverlayPosition>'bottom-left', <MxGraphCustomOverlayOptions>{ horizontalAlign: 'left', verticalAlign: 'bottom' }],
    [<OverlayPosition>'bottom-right', <MxGraphCustomOverlayOptions>{ horizontalAlign: 'right', verticalAlign: 'bottom' }],
    [<OverlayPosition>'start', <MxGraphCustomOverlayOptions>{ horizontalAlign: 'left', verticalAlign: 'top' }],
    [<OverlayPosition>'middle', <MxGraphCustomOverlayOptions>{ horizontalAlign: 'center', verticalAlign: 'top' }],
    [<OverlayPosition>'end', <MxGraphCustomOverlayOptions>{ horizontalAlign: 'right', verticalAlign: 'top' }],
  ])('convert API overlay position %s to mxGraph overlay position %s', (apiPosition: OverlayPosition, mxGraphPosition: MxGraphCustomOverlayOptions) => {
    const overlay: Overlay = { position: apiPosition };

    const result = overlayConverter.convertPosition(overlay);

    expect(result).toEqual(mxGraphPosition);
  });
});
