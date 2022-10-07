import QuestionModel from "./question.model";

export interface Results {
  formName: string;
  options?: {[key:string]: any};
  submissions: Submission[];
  questions: QuestionModel[];
}

export interface Submission{
  submitDate: Date;
  answers: (string[] | string)[];
}
