export class BadRequestContract {
  data!: string;
  error!: { error: string, mensagem: string };
  message!: string;
  name!: string;
  status!: number;
  statusText!: string;
  url!: string;
}
