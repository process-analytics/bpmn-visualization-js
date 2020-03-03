import { greet } from './greet';
import Graph from './mx-graph/Graph';

greet(window.document, 'container');

new Graph(window.document.getElementById('graph'));
