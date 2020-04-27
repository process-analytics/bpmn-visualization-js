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

import { MxGraphFactoryService } from '../../../service/MxGraphFactoryService';
import { mxgraph } from 'ts-mxgraph';
import { StyleConstant } from '../StyleConfigurator';
import MxScaleFactorCanvas from '../extension/MxScaleFactorCanvas';

const mxRectangleShape: typeof mxgraph.mxRectangleShape = MxGraphFactoryService.getMxGraphProperty('mxRectangleShape');

abstract class BaseTaskShape extends mxRectangleShape {
  // TODO we need to declare this field here because it is missing in the current mxShape type definition
  isRounded: boolean;

  protected constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
    // enforced by BPMN
    this.isRounded = true;
  }

  public paintForeground(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintForeground(c, x, y, w, h);
    this.paintTaskIcon(c, x, y, w, h);
  }

  protected abstract paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void;

  protected translateToStartingIconPosition(c: mxgraph.mxXmlCanvas2D, parentX: number, parentY: number, parentWidth: number, parentHeight: number): void {
    const xTranslation = parentX + parentWidth / 20;
    const yTranslation = parentY + parentHeight / 20;
    c.translate(xTranslation, yTranslation);
  }

  protected configureCanvasForIcon(c: mxgraph.mxXmlCanvas2D, parentWidth: number, parentHeight: number, iconOriginalSize: number): MxScaleFactorCanvas {
    // ensure we are not impacted by the configured shape stroke width
    c.setStrokeWidth(1);

    const parentSize = Math.min(parentWidth, parentHeight);
    const ratioFromParent = 0.25;
    const scaleFactor = (parentSize / iconOriginalSize) * ratioFromParent;

    return new MxScaleFactorCanvas(c, scaleFactor);
  }
}

export class TaskShape extends BaseTaskShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // No symbol for the BPMN Task
  }
}

export class ServiceTaskShape extends BaseTaskShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  // this implementation is adapted from the draw.io BPMN 'Service Task' stencil
  // https://github.com/jgraph/drawio/blob/9394fb0f1430d2c869865827b2bbef5639f63478/src/main/webapp/stencils/bpmn.xml#L898
  protected paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // icon coordinates fill a 100x100 rectangle (approximately: 90x90 + foreground translation)
    const canvas = this.configureCanvasForIcon(c, w, h, 100);
    this.translateToStartingIconPosition(c, x, y, w, h);

    // background
    this.drawIconBackground(canvas);

    // foreground
    const foregroundTranslation = 14 * canvas.scaleFactor;
    c.translate(foregroundTranslation, foregroundTranslation);
    this.drawIconForeground(canvas);
  }

  private drawIconBackground(canvas: MxScaleFactorCanvas): void {
    canvas.begin();
    canvas.moveTo(2.06, 24.62);
    canvas.lineTo(10.17, 30.95);
    canvas.lineTo(9.29, 37.73);
    canvas.lineTo(0, 41.42);
    canvas.lineTo(2.95, 54.24);
    canvas.lineTo(13.41, 52.92);
    canvas.lineTo(17.39, 58.52);
    canvas.lineTo(13.56, 67.66);
    canvas.lineTo(24.47, 74.44);
    canvas.lineTo(30.81, 66.33);
    canvas.lineTo(37.88, 67.21);
    canvas.lineTo(41.57, 76.5);
    canvas.lineTo(54.24, 73.55);
    canvas.lineTo(53.06, 62.94);
    canvas.lineTo(58.52, 58.52);
    canvas.lineTo(67.21, 63.09);
    canvas.lineTo(74.58, 51.88);
    canvas.lineTo(66.03, 45.25);
    canvas.lineTo(66.92, 38.62);
    canvas.lineTo(76.5, 34.93);
    canvas.lineTo(73.7, 22.26);
    canvas.lineTo(62.64, 23.44);
    canvas.lineTo(58.81, 18.42);
    canvas.lineTo(62.79, 8.7);
    canvas.lineTo(51.74, 2.21);
    canvas.lineTo(44.81, 10.47);
    canvas.lineTo(38.03, 9.43);
    canvas.lineTo(33.75, 0);
    canvas.lineTo(21.52, 3.24);
    canvas.lineTo(22.7, 13.56);
    canvas.lineTo(18.13, 17.54);
    canvas.lineTo(8.7, 13.56);
    canvas.close();

    const arcStartX = 24.8;
    const arcStartY = 39;
    this.drawInnerCircle(canvas, arcStartX, arcStartY);
  }

  private drawIconForeground(canvas: MxScaleFactorCanvas): void {
    canvas.begin();
    canvas.moveTo(16.46, 41.42);
    canvas.lineTo(24.57, 47.75);
    canvas.lineTo(23.69, 54.53);
    canvas.lineTo(14.4, 58.22);
    canvas.lineTo(17.35, 71.04);
    canvas.lineTo(27.81, 69.72);
    canvas.lineTo(31.79, 75.32);
    canvas.lineTo(27.96, 84.46);
    canvas.lineTo(38.87, 91.24);
    canvas.lineTo(45.21, 83.13);
    canvas.lineTo(52.28, 84.01);
    canvas.lineTo(55.97, 93.3);
    canvas.lineTo(68.64, 90.35);
    canvas.lineTo(67.46, 79.74);
    canvas.lineTo(72.92, 75.32);
    canvas.lineTo(81.61, 79.89);
    canvas.lineTo(88.98, 68.68);
    canvas.lineTo(80.43, 62.05);
    canvas.lineTo(81.32, 55.42);
    canvas.lineTo(90.9, 51.73);
    canvas.lineTo(88.1, 39.06);
    canvas.lineTo(77.04, 40.24);
    canvas.lineTo(73.21, 35.22);
    canvas.lineTo(77.19, 25.5);
    canvas.lineTo(66.14, 19.01);
    canvas.lineTo(59.21, 27.27);
    canvas.lineTo(52.43, 26.23);
    canvas.lineTo(48.15, 16.8);
    canvas.lineTo(35.92, 20.04);
    canvas.lineTo(37.1, 30.36);
    canvas.lineTo(32.53, 34.34);
    canvas.lineTo(23.1, 30.36);
    canvas.close();

    const arcStartX = 39.2;
    const arcStartY = 55.8;
    this.drawInnerCircle(canvas, arcStartX, arcStartY);

    // fill the inner circle to mask the background
    canvas.begin();
    this.drawInnerCircle(canvas, arcStartX, arcStartY);
  }

  private drawInnerCircle(canvas: MxScaleFactorCanvas, arcStartX: number, arcStartY: number): void {
    const arcRay = 13.5;
    canvas.moveTo(arcStartX, arcStartY);
    canvas.arcTo(arcRay, arcRay, 0, 1, 1, arcStartX + 2 * arcRay, arcStartY);
    canvas.arcTo(arcRay, arcRay, 0, 0, 1, arcStartX, arcStartY);
    canvas.close();
    canvas.fillAndStroke();
  }
}

export class UserTaskShape extends BaseTaskShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // this.paintBasic(c, x, y, w, h);
    this.paintWoman(c, x, y, w, h);
  }

  // adapted from https://github.com/primer/octicons/blob/638c6683c96ec4b357576c7897be8f19c933c052/icons/person.svg
  // use mxgraph svg2xml to generate the xml stencil and port it to code
  private paintBasic(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // icon coordinates fill a 12x13 rectangle
    const canvas = this.configureCanvasForIcon(c, w, h, 13);
    this.translateToStartingIconPosition(c, x, y, w, h);

    c.setFillColor(this.stroke);
    canvas.begin();
    canvas.moveTo(12, 13);
    canvas.arcTo(1, 1, 0, 0, 1, 11, 14);
    canvas.lineTo(1, 14);
    canvas.arcTo(1, 1, 0, 0, 1, 0, 13);
    canvas.lineTo(0, 12);
    canvas.curveTo(0, 9.37, 4, 8, 4, 8);
    canvas.curveTo(4, 8, 4.23, 8, 4, 8);
    canvas.curveTo(3.16, 6.38, 3.06, 5.41, 3, 3);
    canvas.curveTo(3.17, 0.59, 4.87, 0, 6, 0);
    canvas.curveTo(7.13, 0, 8.83, 0.59, 9, 3);
    canvas.curveTo(8.94, 5.41, 8.84, 6.38, 8, 8);
    canvas.curveTo(8, 8, 12, 9.37, 12, 12);
    canvas.lineTo(12, 13);
    canvas.close();
    canvas.fill();
  }

  private paintWoman(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // icon coordinates fill a 284x328 rectangle
    const canvas = this.configureCanvasForIcon(c, w, h, 328);
    this.translateToStartingIconPosition(c, x, y, w, h);

    canvas.begin();
    // cheveux gauche vers haut epaule gauche (du haut vers le bas)
    canvas.moveTo(141.9, 0);
    canvas.curveTo(85.52, 0, 39.66, 45.87, 39.66, 102.25);
    canvas.lineTo(39.66, 131.4);
    // TODO a partir d'ici on dépasse l'oreille gauche qui a un glitch
    canvas.curveTo(39.66, 193.96, 26, 222.54, 25.87, 222.79);
    canvas.curveTo(24.88, 224.78, 24.82, 227.11, 25.71, 229.15);
    canvas.curveTo(26.6, 231.19, 28.35, 232.73, 30.48, 233.35);
    canvas.curveTo(30.85, 233.46, 62.4, 242.66, 86.67, 250.61);
    canvas.lineTo(32.34, 275.52); // debut epaule gauche

    // epaule gauche
    // canvas.curveTo(13.51, 284.16, 1.07, 302.84, 0, 323.26);
    canvas.curveTo(13.51, 284.16, 1.07, 302.84, 0, 327.14);
    // canvas.curveTo(0.84, 323.27, 1.67, 323.28, 2.51, 323.27);
    // canvas.curveTo(3.67, 323.13, 4.92, 323.47, 6.08, 323.27);

    // zigwi gwi
    // canvas.curveTo(6.24, 323.24, 5.76, 323.19, 5.61, 323.16);
    // canvas.curveTo(6.47, 323.07, 7.34, 322.98, 8.21, 322.88);
    // canvas.curveTo(8.79, 322.97, 9.38, 323.04, 9.96, 323.13);
    // canvas.curveTo(11.59, 323.41, 11.85, 323.34, 13.59, 323.27);

    // canvas.curveTo(14.07, 323.25, 14.54, 323.24, 15.02, 323.24);
    // canvas.curveTo(15.57, 315.7, 18.23, 308.51, 22.54, 302.47);
    // bretelle gauche
    // canvas.moveTo(22.54, 302.47); // remplacement pour eviter doublement
    // canvas.moveTo(18.54, 298.47); // remplacement pour eviter doublement
    // canvas.lineTo(39.25, 322.51); // TODO ne descend pas assez bas y devrait etre dans les 326-328 (x a ajuster en fonction)

    // zigwi gwi
    // canvas.curveTo(39.25, 322.51, 39.26, 322.51, 39.26, 322.51);
    // canvas.curveTo(41.11, 322.57, 42.96, 322.49, 44.81, 322.49);
    // canvas.curveTo(47.19, 322.5, 49.58, 322.5, 51.96, 322.5);
    // canvas.curveTo(53.75, 322.64, 55.6, 322.29, 57.38, 322.5);

    // doublement bretelle gauche
    // canvas.curveTo(57.69, 322.54, 58.04, 322.59, 58.41, 322.66);
    // canvas.curveTo(57.21, 320.85, 55.92, 319.08, 54.51, 317.4);
    canvas.moveTo(54.51, 327.14);
    canvas.lineTo(29.38, 288.04);
    // canvas.lineTo(33.38, 292.04);

    // doublement epaule gauche
    // canvas.curveTo(35.03, 290.96, 36.77, 289.99, 38.59, 289.16);
    // canvas.lineTo(74.53, 272.68);
    // canvas.moveTo(74.53, 272.68); // remplacement pour eviter doublement
    canvas.moveTo(70.53, 268.68); // remplacement pour eviter doublement

    // cou
    canvas.curveTo(84.77, 300.61, 111.54, 319.62, 141.78, 319.62);
    // canvas.curveTo(172.11, 319.62, 198.79, 300.64, 209.02, 272.68);
    canvas.curveTo(172.11, 319.62, 198.79, 300.64, 213.02, 268.68);
    //    canvas.lineTo(244.96, 289.16); // début epaule droite
    canvas.moveTo(244.96, 289.16); // remplacement pour eviter doublement

    // suite epaule droite + bretelle (on garde la partie exterieure)
    // canvas.curveTo(246.78, 289.99, 248.52, 290.96, 250.17, 292.04);
    canvas.moveTo(254.17, 288.04);
    // canvas.lineTo(229.04, 317.4);
    canvas.lineTo(229.04, 327.14);

    // // zigwi gwi cut pas droit
    // canvas.curveTo(226.72, 320.19, 224.68, 323.17, 222.92, 326.3);
    // canvas.curveTo(224.27, 326.27, 225.63, 326.25, 226.97, 326.34);
    // canvas.curveTo(228.16, 326.41, 229.34, 326.61, 230.52, 326.75);
    // // debut doublement
    // canvas.curveTo(232.69, 327.05, 235.72, 327.7, 237.93, 327.21);
    // canvas.curveTo(238.06, 327.18, 238.09, 326.99, 238.21, 326.95);
    // // doublement
    // canvas.curveTo(238.68, 326.75, 239.18, 326.63, 239.66, 326.47);
    // canvas.curveTo(240.2, 326.3, 240.73, 326.22, 241.26, 326.17);
    // bretelle (de bas en haut - on remonte car c'est le doublement qui suit la 1ere descente)
    // canvas.moveTo(241.26, 326.17); // tmp remplacement
    // // canvas.lineTo(261.01, 302.47);
    // canvas.lineTo(265.01, 298.47);

    // debut fin epaule droite
    //     canvas.curveTo(265.81, 309.2, 268.56, 317.35, 268.62, 325.82);
    //     canvas.curveTo(270.26, 326.03, 272.18, 326.29, 272.79, 326.37);
    //     canvas.curveTo(276.29, 326.65, 279.72, 327.57, 283.25, 327.17);
    //
    //     canvas.curveTo(283.37, 327.15, 283.5, 327.15, 283.62, 327.14);

    canvas.moveTo(283.62, 327.14); // tmp remplacement
    canvas.curveTo(284.03, 305.24, 271.23, 284.7, 251.21, 275.52);
    canvas.lineTo(197.03, 250.68); // remontee milieu du cou

    // remontee cheveux droit
    canvas.curveTo(221.48, 242.7, 252.97, 233.45, 253.34, 233.35);
    canvas.curveTo(255.46, 232.72, 257.19, 231.18, 258.09, 229.16);
    canvas.curveTo(258.98, 227.14, 258.92, 224.81, 257.95, 222.82);
    canvas.curveTo(257.81, 222.54, 244.15, 193.96, 244.15, 131.4);
    canvas.lineTo(244.15, 102.25);
    canvas.curveTo(244.15, 45.87, 198.28, 0, 141.9, 0); // remonte en haut et rejoins la partie gauche
    // canvas.close(); // TODO voir si on restaure

    // // haut cheveux droite jusqu'au cou (partie interieure --> doublement, on ne garde pas)
    // // canvas.moveTo(141.91, 15);
    // // canvas.curveTo(190.01, 15, 229.15, 54.14, 229.15, 102.25);
    // // canvas.lineTo(229.15, 131.4);
    // // canvas.curveTo(229.15, 179.13, 236.72, 208.19, 241.25, 221.29);
    // // canvas.curveTo(228.85, 224.99, 204.34, 232.39, 186.13, 238.49);
    // bas visage a droite jusq'a frange haut gauche
    // canvas.moveTo(186.13, 238.49); // added bas visage a droite
    // canvas.moveTo(197.03, 250.68); // added bas visage a droite + ajustement pour lier avec le bas V1
    // canvas.moveTo(221.48, 242.7); // added bas visage a droite + ajustement pour lier avec le bas v2
    canvas.moveTo(186.13, 250.68); // added bas visage a droite + ajustement pour lier avec le bas V3
    canvas.lineTo(186.13, 220.35); // remontee cou droit v1
    // canvas.moveTo(186.13, 220.35); // temp si pas remontee cou droit car gere par doublement
    canvas.curveTo(198.74, 212.02, 209.02, 200.15, 215.38, 185.74);
    canvas.curveTo(219.16, 177.17, 221.29, 167.65, 221.53, 158.2);
    canvas.curveTo(222.34, 126.93, 195.71, 119.07, 167.51, 110.74);
    canvas.curveTo(144.19, 103.86, 117.75, 96.05, 96.12, 75.01);
    canvas.curveTo(93.15, 72.12, 88.4, 72.19, 85.51, 75.15);

    // limite cheveux haut du visage (doublement, partie inferieure, de gauche a droite)
    // // canvas.curveTo(82.63, 78.12, 82.69, 82.87, 85.66, 85.76); // debut retour doublement
    // canvas.moveTo(85.66, 85.76); // tmp, remplacement 'debut retour doublement', necessaire si on garde la partie inferieure
    // canvas.curveTo(109.95, 109.38, 139.51, 118.11, 163.27, 125.13);
    // canvas.curveTo(192.83, 133.86, 207.02, 138.89, 206.54, 157.82);
    // canvas.curveTo(206.35, 165.32, 204.66, 172.88, 201.66, 179.68);
    // canvas.curveTo(191.21, 203.35, 167.75, 218.65, 141.91, 218.65);
    // canvas.curveTo(110.39, 218.65, 83.38, 196.16, 77.68, 165.16);
    // canvas.curveTo(76.34, 157.83, 69.55, 152.49, 62.21, 153.04);

    // debut oreille
    // canvas.moveTo(62.21, 153.04); // added as a starting point
    // canvas.curveTo(61.52, 153.09, 60.81, 153.03, 60.09, 152.86);
    // canvas.curveTo(56.99, 152.12, 54.66, 148.76, 54.66, 145.02);
    // // canvas.moveTo(54.66, 145.02); // added (remove line on the left)
    // canvas.lineTo(54.66, 139.43);

    //suite oreille et frange gauche
    // canvas.curveTo(54.66, 135.68, 57.18, 132.3, 60.4, 131.73);
    // canvas.moveTo(60.4, 131.73);
    // canvas.curveTo(63.1, 131.25, 65.7, 132.25, 67.34, 134.4);
    // canvas.moveTo(67.34, 134.4);
    // canvas.curveTo(68.74, 136.21, 70.59, 137.51, 72.71, 138.15);
    // canvas.moveTo(72.71, 138.15);
    // canvas.curveTo(75.82, 139.09, 79.24, 138.54, 81.88, 136.68);
    canvas.moveTo(71.88, 146.68);
    // canvas.moveTo(81.88, 136.68);
    canvas.curveTo(87.91, 132.42, 93.03, 127.01, 97.08, 120.62);
    canvas.curveTo(99.3, 117.12, 98.26, 112.48, 104.77, 90.26);
    // canvas.curveTo(99.3, 117.12, 98.26, 112.48, 94.77, 110.26);

    // canvas.curveTo(91.27, 108.05, 86.63, 109.09, 84.41, 112.58); // debut doublement
    // canvas.moveTo(84.41, 112.58);
    // canvas.curveTo(82.12, 116.2, 79.39, 119.38, 76.25, 122.07);
    // canvas.curveTo(71.27, 117.71, 64.53, 115.78, 57.8, 116.96);
    // canvas.curveTo(56.72, 117.15, 55.68, 117.44, 54.66, 117.78);
    // canvas.lineTo(54.66, 102.25);

    // doublement cheveux gauche
    // canvas.curveTo(54.66, 54.14, 93.8, 15, 141.91, 15);
    // canvas.close();

    // jou gauche
    canvas.moveTo(53.18, 166.3);
    canvas.curveTo(54.29, 166.78, 55.44, 167.17, 56.64, 167.46);
    canvas.curveTo(58.73, 167.95, 60.86, 168.14, 62.96, 168.02);
    canvas.curveTo(67.04, 190.01, 79.86, 208.5, 97.43, 220.2);
    // canvas.lineTo(97.43, 238.38);
    // canvas.lineTo(86.67, 250.61); // cou vertical - ajustement pour lier a la ligne de dedoublement v1
    canvas.lineTo(97.43, 250.61); // cou vertical - ajustement pour lier a la ligne de dedoublement
    // debut doublement cheveux gauche via interieur du bas droite vers la gauche puis remontee
    // canvas.curveTo(79.38, 232.3, 54.95, 224.95, 42.57, 221.28);
    // canvas.curveTo(45.86, 211.74, 50.76, 193.76, 53.18, 166.3);
    // canvas.close();

    // cou
    // canvas.moveTo(112.43, 228.04);
    canvas.moveTo(97.43, 220.2); // fermeture cou gauche
    canvas.curveTo(121.6, 231.66, 131.55, 233.65, 141.91, 233.65);
    // canvas.curveTo(152.09, 233.65, 161.97, 231.71, 171.12, 228.13);
    canvas.curveTo(152.09, 233.65, 161.97, 231.71, 186.13, 220.35); // fermeture cou droite
    // canvas.lineTo(171.12, 240.2); // doublement vertical cou droit

    // doublement cou
    // canvas.moveTo(171.12, 240.2); // added
    // canvas.curveTo(171.12, 249.38, 176.51, 257.77, 184.85, 261.59);
    // canvas.lineTo(195.34, 266.41);
    // canvas.curveTo(187.56, 289.12, 166.16, 304.62, 141.78, 304.62);
    // canvas.curveTo(117.47, 304.62, 96, 289.09, 88.22, 266.4);
    // canvas.lineTo(98.7, 261.59);
    // canvas.curveTo(107.04, 257.77, 112.43, 249.38, 112.43, 240.2);

    // canvas.close();

    // canvas.fillAndStroke();
    c.stroke();
  }
}
