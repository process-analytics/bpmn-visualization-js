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
import * as util from '../../../../../../node_modules/cytoscape/src/util';

var fullFpsTime = 1000 / 60; // assume 60 frames per second

export default {
  setupDequeueing: function (opts) {
    return function setupDequeueingImpl() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      var self = this;
      var r = this.renderer;

      if (self.dequeueingSetup) {
        return;
      } else {
        self.dequeueingSetup = true;
      }

      var queueRedraw = util.debounce(function () {
        r.redrawHint('eles', true);
        r.redrawHint('drag', true);

        r.redraw();
      }, opts.deqRedrawThreshold);

      var dequeue = function (willDraw, frameStartTime) {
        var startTime = util.performanceNow();
        var avgRenderTime = r.averageRedrawTime;
        var renderTime = r.lastRedrawTime;
        var deqd = [];
        var extent = r.cy.extent();
        var pixelRatio = r.getPixelRatio();

        // if we aren't in a tick that causes a draw, then the rendered style
        // queue won't automatically be flushed before dequeueing starts
        if (!willDraw) {
          r.flushRenderedStyleQueue();
        }

        while (true) {
          // eslint-disable-line no-constant-condition
          var now = util.performanceNow();
          var duration = now - startTime;
          var frameDuration = now - frameStartTime;

          if (renderTime < fullFpsTime) {
            // if we're rendering faster than the ideal fps, then do dequeueing
            // during all of the remaining frame time

            var timeAvailable = fullFpsTime - (willDraw ? avgRenderTime : 0);

            if (frameDuration >= opts.deqFastCost * timeAvailable) {
              break;
            }
          } else {
            if (willDraw) {
              if (duration >= opts.deqCost * renderTime || duration >= opts.deqAvgCost * avgRenderTime) {
                break;
              }
            } else if (frameDuration >= opts.deqNoDrawCost * fullFpsTime) {
              break;
            }
          }

          var thisDeqd = opts.deq(self, pixelRatio, extent);

          if (thisDeqd.length > 0) {
            for (var i = 0; i < thisDeqd.length; i++) {
              deqd.push(thisDeqd[i]);
            }
          } else {
            break;
          }
        }

        // callbacks on dequeue
        if (deqd.length > 0) {
          opts.onDeqd(self, deqd);

          if (!willDraw && opts.shouldRedraw(self, deqd, pixelRatio, extent)) {
            queueRedraw();
          }
        }
      };

      var priority = opts.priority || util.noop;

      r.beforeRender(dequeue, priority(self));
    };
  },
};
