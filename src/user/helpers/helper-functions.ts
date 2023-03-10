import { BadRequestException } from '@nestjs/common';

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

export const checkWaitList = () => {

}

// const requestIntervalMinutes = ((new Date().getTime()) - lineInWaitList.answerDate) / 60000;
// const isLinkNotOverTime = requestIntervalMinutes  < 60;
// isTimeWell = isLinkNotOverTime && lineInWaitList.count < 2
//   || isLinkNotOverTime && requestIntervalMinutes < 1 && lineInWaitList.count === 2
//   || isLinkNotOverTime && requestIntervalMinutes < 120 && lineInWaitList.count > 2;
