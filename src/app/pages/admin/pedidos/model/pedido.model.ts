import { ClienteModel } from "../../clientes/model/cliente.model";
import { ProdutoModel } from "../../produtos/model/produto.model";

export class PedidoModel {
  id!: number;
  dataCriacao!: Date;
  criadoPor!: string;
  ativo!: boolean;
  cliente!: ClienteModel;
  produtos!: ProdutoAdicionado[];
  dataPedido!: Date;
  status!: string;
}

export class ProdutoAdicionado {
  id!: number;
  quantidade!: number;
  produto!: ProdutoModel;
}