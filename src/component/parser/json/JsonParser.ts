import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export default class JsonParser {
  private static instance: JsonParser;
  private readonly _jsonConvert: JsonConvert;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    this._jsonConvert = new JsonConvert();
    this._jsonConvert.operationMode = OperationMode.ENABLE;
    this._jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
    this._jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): JsonParser {
    if (!JsonParser.instance) {
      JsonParser.instance = new JsonParser();
    }

    return JsonParser.instance;
  }

  public get jsonConvert(): JsonConvert {
    return this._jsonConvert;
  }
}
