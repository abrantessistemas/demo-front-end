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
  total!: number;
  formaPagamento!: number;
  qtdeParcelas!: number;
  valorParcela!: number;
}

export class ProdutoAdicionado {
  id!: number;
  quantidade!: number;
  produto!: ProdutoModel;
  totalPorItem!: number;
}