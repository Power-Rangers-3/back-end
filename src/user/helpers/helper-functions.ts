import { BadRequestException } from '@nestjs/common';
import { IWaitListLine } from '../../models';

export const getRecordLine = (email: string, secret: string, answerDate: number, count: number) => {
  return  {
    email,
    secret,
    answerDate,
    count,
  };
}

export const checkPasswordIsEqual = (isPasswordIsEqual: boolean) => {
  if (!isPasswordIsEqual) throw new BadRequestException('Something went wrong', {cause: new Error(), description: "Password not equal copy"});
}

export const checkTimeWell = (isTimeWell: boolean) => {
  if (!isTimeWell) throw new BadRequestException('Something went wrong', {cause: new Error(), description: 'Your request is too late'});
}

export const checkCorrectSecret = (isCorrectSecret: boolean) => {
  if (!isCorrectSecret) throw new BadRequestException('Something went wrong', {cause: new Error(), description: 'Your secret is incorrect'});
}

export const checkWaitList = (waitList:IWaitListLine[]): IWaitListLine[] => {
  return waitList.filter((item) => {
    return ((new Date().getTime() - item.answerDate) / 60000) < Number(process.env.TIME_DELAY_TO_TO_SEND_POST2);
  })
}

export const checkDelayEmailSend = (lineInWaitList: IWaitListLine) => {
  const numberAttempts = Number(process.env.NUMBER_ATTEMPTS_NO_DELAY);
  const timeDelay1 = Number(process.env.TIME_DELAY_TO_TO_SEND_POST1);
  const requestIntervalMinutes = ((new Date().getTime()) - lineInWaitList.answerDate) / 60000;

  let isTimeWell: boolean;
    isTimeWell = ((lineInWaitList.count < (numberAttempts - 1))
      || (requestIntervalMinutes > timeDelay1 || lineInWaitList.count < (numberAttempts)));

  if (!isTimeWell) checkTimeWell(false);
}

