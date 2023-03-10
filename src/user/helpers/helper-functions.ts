import { IWaitListLine } from '../../models';

export const getRecordLine = (email: string, secret: string, answerDate: number, count: number) => {
  return  {
    email,
    secret,
    answerDate,
    count,
  };
}

