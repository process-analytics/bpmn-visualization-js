import { mxgraphFactory } from './../../node_modules/ts-mxgraph/index';

const { mxClient, mxUtils } = mxgraphFactory({
  mxLoadResources: false,
  mxLoadStylesheets: false,
});

export const mxGraphInit = (): void => {
  try {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error('Browser is not supported!', 200, false);
    } else {
      mxUtils.alert('Browser is supported!');
    }
  } catch (e) {
    mxUtils.alert('Cannot start application: ' + e.message);
    throw e;
  }
};
