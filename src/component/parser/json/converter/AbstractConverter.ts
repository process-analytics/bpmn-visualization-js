import { JsonConverter, JsonCustomConvert } from 'json2typescript';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ensureIsArray(elements: Array<any> | any): Array<any> {
  if (elements === undefined || elements === null || elements === '') {
    elements = [];
  } else if (!Array.isArray(elements)) {
    elements = [elements];
  }
  return elements;
}

@JsonConverter
export abstract class AbstractConverter<T> implements JsonCustomConvert<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
  serialize(data: T): any {
    // TODO throw exception
    console.log('Not implemented !!');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract deserialize(data: any): T;
}
