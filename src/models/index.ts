export interface IWaitListLine{
  email: string;
  secret: string;
  answerDate: number;
  count: number;
}

export const initWaitListLine: IWaitListLine = {
  email: ' ',
  secret: ' ',
  answerDate: new Date().getTime(),
  count: 0,
}
