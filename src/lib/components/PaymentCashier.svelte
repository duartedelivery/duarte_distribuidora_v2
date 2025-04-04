<script lang="ts">
  import CurrencyInput from '$lib/components/input/CurrencyInput.svelte'
  import type { RouterOutputs } from '$trpc/router'
  import type { InsertOrderPayment, SelectAddress } from '$lib/server/db/schema'
  import { formatCurrency, icons } from '$lib/utils'
  import { toast } from 'svelte-sonner'
  import CardPayments from './cards/CardPayments.svelte'
  import { trpc } from '$trpc/client'
  import { page } from '$app/state'
  import { modal } from './modal'
  import Loading from './Loading.svelte'
  import { getCartContext } from '../../routes/(tenant)/[tenant]/admin/cashier/[id]/cartContext.svelte'
  import { onMount } from 'svelte'

  const cart = getCartContext()

  let {
    payments,
    nulla,
    save,
    total_pedido,
    cashier_id,
    observacao
  }: {
    payments: Omit<InsertOrderPayment, 'order_id'>[]
    nulla: () => void
    save: (payments: Omit<InsertOrderPayment, 'order_id'>[]) => void
    total_pedido: number
    cashier_id: number
    observacao: string
  } = $props()

  let total_paid = $derived.by(() => {
    return payments.reduce((acc, payment) => acc + payment.amount_paid, 0)
  })

  let valor_a_pagar = $state(0)

  onMount(() => {
    valor_a_pagar = total_pedido - total_paid
  })

  let valor_recebido_dinheiro = $state(0)

  let troco = $derived.by(() => {
    return valor_recebido_dinheiro - valor_a_pagar
  })

  // $effect(()=>{
  //   valor_a_pagar = total_pedido - total_paid
  //   troco = valor_recebido_dinheiro - valor_a_pagar
  // })

  let metodo_pagamento: InsertOrderPayment['payment_method'] | null =
    $state(null)

  let isDiferent = $state(false)
  let isPago = $state(false)
  let isDinheiro = $state(false)
  let isFiado = $state(false)
  let isLoading = $state(false)
  // export let isChecked = false

  function divideValor(n: number) {
    valor_a_pagar = total_pedido - total_paid
    valor_a_pagar = valor_a_pagar / n
    console.log(valor_a_pagar)
  }

  function addPayment() {
    if (metodo_pagamento === null) {
      toast.error('Nenhum metodo de pagamento selecionado!')
      return
    }

    if (valor_a_pagar <= 0) {
      toast.error('O valor a pagar não pode ser zero ou negativo!')
      return
    }

    if (metodo_pagamento === 'dinheiro' && troco < 0) {
      toast.error('Valor não pode ser menor que o valor a pagar')
      return
    }

    if (metodo_pagamento === 'dinheiro' && valor_recebido_dinheiro <= 0) {
      toast.error('O valor recebido em dinheiro não pode ser zero ou negativo!')
      return
    }

    if (metodo_pagamento != 'dinheiro' && total_paid > total_pedido) {
      toast.error('O valor pago não pode exceder o valor do pedido!')
      return
    }

    payments.push({
      amount_paid: isDinheiro ? valor_recebido_dinheiro : valor_a_pagar,
      status: 'CONFIRMED',
      payment_method: metodo_pagamento,
      troco: isDinheiro ? troco : null,
    })
    isDinheiro = false
    isPago = false
    isDiferent = true
    isFiado = false
    metodo_pagamento = null
    payments = [...payments]
    valor_a_pagar = total_pedido - total_paid
  }

  async function addOrderFiado() {
    try {
      isLoading = true
      if (cart.meta.isDelivery && !cart.meta.motoboySelecionado) {
        toast.error('Selecione um motoboy para pedidos delivery')
        return
      }
      if (!cart.meta.isDelivery) {
        cart.meta.taxaEntrega = 0
      }
      if (cart.meta.clienteSelecionado) {
        await trpc(page).customer.order.insertFiado.mutate({
          order_items: Object.values(cart.cart).map(item => ({
            product_id: item.item.product_id,
            quantity: item.quantity,
            price:
              item.item[
                item.meta.is_retail ? 'retail_price' : 'wholesale_price'
              ],
          })),
          order_info: {
            customer_id: cart.meta.clienteSelecionado.id,
            address_id: cart.meta.enderecoSelecionado
              ? cart.meta.enderecoSelecionado.id
              : undefined,
            total: cart.meta.isDelivery
              ? total_pedido - cart.meta.taxaEntrega
              : total_pedido,
            observation: observacao,
            motoboy_id: cart.meta.motoboySelecionado?.id,
            type: 'ATACADO',
            taxa_entrega: cart.meta.isDelivery ? cart.meta.taxaEntrega : 0,
            cachier_id: cashier_id,
            //TODO: Type
          },
        })
        nulla()
        toast.success('Pedido fiado realizado com sucesso!')
        modal.close()
      }
      isLoading = false
    } catch (error: any) {
      isLoading = false
      toast.error(error.message)
      console.error(error.message)
    }
  }
</script>

<h1 class="mb-2 text-center">
  Valor total do pedido: <span class="font-bold text-success">
    {formatCurrency(total_pedido)}
  </span>
</h1>
<div
  class="flex {total_pedido === total_paid || total_pedido < total_paid
    ? 'flex-col-reverse'
    : 'flex-col'}"
>
  {#if total_pedido === total_paid || total_pedido < total_paid}
    <div class="mt-3 flex w-full flex-col items-center justify-center gap-2">
      <div class="badge badge-success gap-2">
        Valor total to pedido foi pago!
      </div>
      <button
        class="btn btn-secondary"
        disabled={isLoading}
        onclick={() => {
          isLoading = true
          save(payments)
        }}
      >
        {isLoading
          ? 'Criando pedido...'
          : 'CLIQUE AQUI PARA CONFIRMAR O PAGAMENTO'}
      </button>
    </div>
  {:else}
    <div class="flex flex-col gap-3">
      {#if isDiferent || isPago || isDinheiro}
        <button
          class="btn btn-secondary"
          disabled={payments.length > 0}
          onclick={() => {
            isDiferent = false
            isPago = false
            isDinheiro = false
            isFiado = false
            metodo_pagamento = null
            valor_recebido_dinheiro = 0
            valor_a_pagar = total_pedido
          }}
        >
          {@html icons.back()}
          Voltar
        </button>
      {:else}
        <h1 class="text-center text-xl">Qual metodo de pagamento?</h1>
      {/if}
      {#if isDiferent}
        <label class="form-control w-full items-center">
          <div class="label">
            <span class="label-text">
              Digite aqui o valor para este pagamento
            </span>
          </div>

          <div>
            <CurrencyInput bind:value={valor_a_pagar} />
            <button class="btn mt-2" onclick={() => divideValor(4)}>25%</button>
            <button class="btn" onclick={() => divideValor(2)}>50%</button>
            <button class="btn" onclick={() => divideValor(1.25)}>75%</button>
            <button class="btn" onclick={() => divideValor(1)}>100%</button>
          </div>
          <p>
            Valor restante do pedido: 
            {formatCurrency(total_pedido - total_paid)}
          </p>
        </label>
      {/if}
      {#if isPago}
        <div class="label">
          <span class="label-text">
            Selecione o metodo utilizado para pagar:
          </span>
        </div>
        <select
          class="select select-bordered w-full"
          bind:value={metodo_pagamento}
        >
          <option value="" disabled selected>Qual foi o metodo?</option>
          <option value="credit_card">Cartão de crédito</option>
          <option value="debit_card">Cartão de debito</option>
          <option value="pix">Pix</option>
        </select>
        <hr class="w-full bg-base-300" />
        <!-- <div class="flex justify-center gap-2">
          Deseja finalizar este pedido?
          <input
            type="checkbox"
            class="checkbox-primary checkbox"
            on:change={() => (isChecked = !isChecked)}
          />
        </div> -->
      {:else if isDinheiro}
        <div class="flex w-full items-center justify-center gap-4">
          <label class="form-control w-full gap-2">
            <div class="label">
              <span class="label-text">Valor recebido:</span>
              <span class="label-text-alt">(Valor pago pelo cliente)</span>
            </div>
            <CurrencyInput bind:value={valor_recebido_dinheiro} />
          </label>
        </div>
        {#if valor_recebido_dinheiro && (valor_recebido_dinheiro >= total_pedido || valor_recebido_dinheiro >= valor_a_pagar) && troco > 0}
          <h1 class="font-lg">
            Troco do cliente: <span class="font-bold">
              {formatCurrency(troco)}
            </span>
          </h1>
        {/if}
      {:else}
        {#if !isDiferent}
          <button
            class="btn btn-primary"
            onclick={() => {
              isDiferent = !isDiferent
              isFiado = false
              isDinheiro = false
              isPago = false
              metodo_pagamento = null
            }}
          >
            PAGAMENTO PARCIAL
            {@html icons.divide()}
          </button>
        {/if}
        {#if cart.meta.clienteSelecionado && !isDiferent}
          <button
            class="btn btn-primary w-full"
            onclick={() => {
              isFiado = true
              addOrderFiado()
              // nulla()
            }}
            disabled={isFiado}
          >
            FIADO
            {@html icons.fiado()}
          </button>
        {/if}
        <button
          class="btn btn-primary w-full"
          onclick={() => {
            isPago = true
            isDinheiro = false
            isFiado = false
          }}
        >
          PAGO
          {@html icons.paid()}
        </button>
        <button
          class="btn btn-primary w-full"
          onclick={() => {
            isDinheiro = true
            isPago = false
            isFiado = false
            metodo_pagamento = 'dinheiro'
          }}
        >
          DINHEIRO
          {@html icons.cashColor()}
        </button>
      {/if}
      {#if isDiferent || isPago || isDinheiro || isFiado}
        <hr />
        <button
          class="btn btn-secondary w-full"
          onclick={addPayment}
          disabled={!(metodo_pagamento === 'dinheiro'
            ? valor_recebido_dinheiro >= valor_a_pagar
            : metodo_pagamento) || metodo_pagamento === null}
        >
          ADICIONAR PAGAMENTO
        </button>
      {/if}
    </div>
  {/if}
  {#if payments.length > 0}
    <div class="mt-5">
      {#if total_paid < total_pedido && total_paid != 0}
        <p>
          Foi pago: {formatCurrency(total_paid)} mas ainda faltam
          
          <span class="text-error">
            {formatCurrency(total_pedido - total_paid)}
          </span>
          para pagar o pedido!
        </p>
        <!-- <p class="mb-4">
          {#if cart.meta.clienteSelecionado}
            Deseja fazer com que R${((total_pedido - total_paid) / 100).toFixed(
              2,
            )} seja um pagamento fiado?
            <button
              class="text-info underline"
              onclick={() => {
                metodo_pagamento = 'fiado'
                addPayment()
              }}
            >
              clique aqui
            </button>
          {/if}
        </p> -->
      {/if}

      <h3 class="mb-2 text-lg font-medium">Pagamentos feitos:</h3>
      {#each payments as payment, i}
        <div class="my-1 flex flex-col">
          <CardPayments {payment} {i} />
        </div>
      {/each}
    </div>
  {/if}
</div>
