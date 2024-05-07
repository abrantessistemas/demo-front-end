import { CategoriaModel } from "../../categorias/model/categoria.model";

export class ProdutoModel {
  id!: number;
  dataCriacao!: Date;
  criadoPor!: string;
  ativo!: boolean;
  nome!: string;
  descricao!: string;
  precoCompra!: number;
  precoRevenda!: number;
  precoTotalEstoque!: number;
  quatidadeEstoque!: number;
  pesoUnitario!: number;
  quantidadePorItem!: number;
  dataValidade!: Date;
  codigoBarras!: string;
  sku!: string;
  imageUrl!: string;
  estoque!: string;
  categoria!: CategoriaModel;
}

