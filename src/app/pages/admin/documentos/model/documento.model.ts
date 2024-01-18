import { BeneficiarioModel } from "../../beneficiarios/model/beneficiario.model";

export class DocumentoModel {
  id!: number;
  tipoDocumento!: string;
  descricao!: string;
  dataInclusao!: Date;
  dataAtualizacao!: Date;
  beneficiario!: BeneficiarioModel;
}
