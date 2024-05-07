import { EnderecoModel } from "../../enderecos/model/endereco.model";

export class EmpresaModel {
  id!: number;
  dataCriacao!: Date;
  criadoPor!: string;
  ativo!: boolean;
  nomeFantasia!: string;
  razaoSocial!: string;
  inscricaoEstadual!: string;
  inscricaoMunicipal!: string;
  cnpj!: string;
  cpf!: string;
  telefone!: string;
  email!: string;
  responsavel!: string;
  endereco!: EnderecoModel;
}