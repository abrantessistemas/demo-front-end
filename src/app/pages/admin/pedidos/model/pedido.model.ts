import { ClienteModel } from "../../clientes/model/cliente.model";
import { ProdutoModel } from "../../produtos/model/produto.model";

export class PedidoModel {
  id!: number;
  dataCriacao!: Date;
  criadoPor!: string;
  ativo!: boolean;
  cliente!: ClienteModel;
  produtos!: ProdutoModel[];
  dataPedido!: Date;
  status!: string;
}