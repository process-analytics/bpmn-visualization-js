import { JsonConverter } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import { Participant } from '../../../../model/bpmn/shape/ShapeBpmnElement';
import { Collaboration } from '../Definitions';

const convertedProcessRefParticipants: Participant[] = [];

export function findProcessRefParticipant(id: string): Participant {
  return convertedProcessRefParticipants.find(i => i.id === id);
}

export function findProcessRefParticipantByProcessRef(processRef: string): Participant {
  return convertedProcessRefParticipants.find(i => i.processRef === processRef);
}

@JsonConverter
export default class CollaborationConverter extends AbstractConverter<Collaboration> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(collaboration: any): Collaboration {
    try {
      // Deletes everything in the array, which does hit other references. For better performance.
      convertedProcessRefParticipants.length = 0;

      ensureIsArray(collaboration['participant']).forEach(participant => {
        if (participant.processRef) {
          convertedProcessRefParticipants.push(new Participant(participant.id, participant.name, participant.processRef));
        }
      });

      return {};
    } catch (e) {
      // TODO error management
      console.log(e as Error);
    }
  }
}
