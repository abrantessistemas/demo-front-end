import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { ClienteModel } from '../../clientes/model/cliente.model';
import { ProdutoModel } from '../../produtos/model/produto.model';
import { PedidoModel, ProdutoAdicionado } from '../model/pedido.model';
import { PedidoService } from '../model/pedido.service';
import { DemoDataService } from 'src/app/services/demo-data.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'abs-pedidos-create-update',
  templateUrl: './pedidos-create-update.component.html',
  styleUrls: ['./pedidos-create-update.component.scss']
})
export class PedidosCreateUpdateComponent {
  pedidoForm!: FormGroup;
  formatPhone!: string;
  confirm!: FormControl;
  produtos!: ProdutoModel[];
  clientes!: ClienteModel[];
  cliente!: ClienteModel;
  pedidoAtivo!: boolean;
  formaPegamento = new FormControl(1);
  totalParcelas = new FormControl(1);
  produtosSelecionados: ProdutoAdicionado[] = [];
  total = 0;


  statusList = [
    { id: 1, nome: 'Em Processamento', descricao: 'O pedido está sendo processado.' },
    { id: 2, nome: 'Enviado', descricao: 'O pedido foi enviado para entrega.' },
    { id: 3, nome: 'Entregue', descricao: 'O pedido foi entregue ao cliente.' },
    { id: 4, nome: 'Cancelado', descricao: 'O pedido foi cancelado.' }
  ];

  formasPagamentos = [
    { id: 1, descricao: 'Dinheiro' },
    { id: 2, descricao: 'Cartão de crédito' },
    { id: 3, descricao: 'Cartão de débito' },
    { id: 4, descricao: 'Transferência bancária' },
    { id: 5, descricao: 'Boleto bancário' },
    { id: 6, descricao: 'PIX' }
  ]
  parcelas = [
    { id: 1, descricao: '1x' },
    { id: 2, descricao: '2x' },
    { id: 3, descricao: '3x' },
    { id: 4, descricao: '4x' },
    { id: 5, descricao: '5x' },
    { id: 6, descricao: '6x' },
    { id: 7, descricao: '7x' },
    { id: 8, descricao: '8x' },
    { id: 9, descricao: '9x' },
    { id: 10, descricao: '10x' }
  ]
  mode: 'delete' | 'create' | 'update' = 'create';

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: PedidoModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<PedidosCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private pedidoService: PedidoService, private data: DemoDataService
    , private util: UtilService) { }

  ngOnInit() {
    if (this.util.modoOperacional === 'demo') {
      this.produtos = this.data.produtos;
      this.clientes = this.data.clientes;

    }

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as PedidoModel;
      if (this.util.modoOperacional === 'demo') {
        setTimeout(() => {
          const total = this.data.pedidos.length + 1;
          this.pedidoForm.get('id')?.setValue(total);
        }, 1000);
      }
    }

    this.pedidoForm = this.fb.group({
      id: this.defaults.id || '',
      dataCriacao: this.defaults.dataCriacao || new Date(),
      criadoPor: this.defaults.criadoPor || '',
      ativo: this.defaults.ativo || true,
      cliente: this.defaults.cliente || '',
      produtos: this.defaults.produtos || '',
      dataPedido: new Date(this.defaults.dataPedido) || new Date(),
      status: this.defaults.status || 1
    });
  }
  save() {
    if (this.mode === 'create') {
      this.createPedido();
    } else if (this.mode === 'update') {
      this.updatePedido();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createPedido() {
    const pedido = this.pedidoForm.value;
    pedido.produtos = JSON.stringify(this.produtosSelecionados);
    this.subscription.add(
      this.pedidoService.create(pedido).subscribe(
        (result) => {
          this.snackbar.open(
            'Pedido ' +
            result.id +
            ' successfully created.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(pedido);
        },
        (exception: BadRequestContract) => {
          console.log(exception.data)
          this.snackbar.open(exception.message, 'ERROR', {
            duration: 5000,
          });
        }
      )
    );
  }

  updatePedido() {
    const pedido: PedidoModel = this.pedidoForm.value;

    this.subscription.add(
      this.pedidoService.update(pedido.id, pedido).subscribe(
        (result) => {
          this.snackbar.open(
            'Pedido ' +
            result.id +
            ' updated successfully.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(pedido);
        },
        (exception: BadRequestContract) => {
          console.log(exception.data)
          this.snackbar.open(exception.message, 'ERROR', {
            duration: 5000,
          });
        }
      )
    );
  }

  deletePedido() {
    const pedido: PedidoModel = this.pedidoForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete pedido ' + pedido.id + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pedidoService.delete(pedido.id).subscribe(() => {
          this.snackbar.open('Item deleted successfully.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(pedido);
    });
  }

  pictureChange = false;

  updateImage() {
    this.pictureChange = !this.pictureChange;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  togglePedido() {
    const ativo = this.pedidoForm.get('ativo')?.value;
    this.pedidoForm.get('ativo')?.setValue(!ativo);
    let mensagem = 'Pedido esta ativado para faturamento.';

    if (ativo) {
      mensagem = 'Pedido foi desativado.'
    }
    this.snackbar.open(mensagem, 'OK', {
      duration: 5000,
    });
  }

  adicionarItem(item: ProdutoModel) {
    const index = this.produtosSelecionados.findIndex(produtoAdicionado => produtoAdicionado.produto === item);
    let somar = false;

    if (index === -1) {
      // Se o item não estiver na lista, adiciona
      if (item.quatidadeEstoque > 0) {
        this.produtosSelecionados.push({ id: this.produtosSelecionados.length + 1, quantidade: 1, produto: item });
        somar = true;
      }

    } else {
      // Se o item já estiver na lista, incrementa a quantidade
      const itemEmEstoque = this.produtosSelecionados[index].produto.quatidadeEstoque;
      if (itemEmEstoque > 0 && this.produtosSelecionados[index].quantidade < item.quatidadeEstoque) {
        this.produtosSelecionados[index].quantidade++;
        somar = true;
      }
    }
    // Atualiza o total somando o preço do produto adicionado
    if (somar) {
      this.total += item.precoRevenda;
      somar = false;
    }
  }

  removerItem(item: ProdutoAdicionado) {
    const index = this.produtosSelecionados.indexOf(item);
    if (index !== -1) {
      // Se o item estiver na lista, decrementa a quantidade
      this.produtosSelecionados[index].quantidade--;
      // Se a quantidade chegar a zero, remove o item da lista
      if (this.produtosSelecionados[index].quantidade === 0) {
        this.produtosSelecionados.splice(index, 1);
      }
      // Subtrai o preço do produto do total
      this.total -= item.produto.precoRevenda;
    }
  }
}

