export interface IWaitListLine {
  email: string;
  secret: string;
  answerDate: number;
}

export const initWaitListLine: IWaitListLine = {
  email: ' ',
  secret: ' ',
  answerDate: new Date().getTime(),
};
