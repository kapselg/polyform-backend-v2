export interface Results {
  formName: string;
  options?: {[key:string]: any};
  submissions: Submission[];
  questions: string[];
}

export interface Submission{
  submitDate: Date;
  answers: (string[] | string)[];
}
