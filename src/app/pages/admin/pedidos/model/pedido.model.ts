import { ClienteModel } from "../../clientes/model/cliente.model";
import { ProdutoModel } from "../../produtos/model/produto.model";

export class PedidoModel {
  id!: number;
  dataCriacao!: Date;
  criadoPor!: string;
  ativo!: boolean;
  cliente!: ClienteModel;
  itens!: ItemPedido[];
  dataPedido!: Date;
  status!: string;

  constructor(id: number, dataCriacao: Date, criadoPor: string, ativo: boolean,
    cliente: ClienteModel, itens: ItemPedido[], dataPedido: Date, status: string) {
    this.id = id;
    this.dataCriacao = dataCriacao;
    this.criadoPor = criadoPor;
    this.ativo = ativo;
    this.cliente = cliente;
    this.itens = itens;
    this.dataPedido = dataPedido;
    this.status = status;
  }

}

export class ItemPedido {
  produto: ProdutoModel;
  quantidade: number;

  constructor(produto: ProdutoModel, quantidade: number) {
    this.produto = produto;
    this.quantidade = quantidade;
  }
}
