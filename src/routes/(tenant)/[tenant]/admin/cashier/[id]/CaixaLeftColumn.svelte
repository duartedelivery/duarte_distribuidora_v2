<script lang="ts">
  import ModalEndereco from './ModalEndereco.svelte'
  import ModalCliente from './ModalCliente.svelte'
  import { modal } from '$lib/components/modal'
  import { getCartContext } from '$lib/stores/cart'
  import { icons } from '$lib/utils/icons'
  import type { RouterOutputs } from '$trpc/router'
  import ModalMotoboy from './ModalMotoboy.svelte'
  import { trpc } from '$trpc/client'
  import { page } from '$app/stores'
  import { toast } from 'svelte-sonner'
  import { onMount } from 'svelte'
  import CurrencyInput from '$lib/components/input/CurrencyInput.svelte'
  import Loading from '$lib/components/Loading.svelte'
  import UsedCredits from '$lib/components/UsedCredits.svelte'

  export let tipo_preco: 'retail_price' | 'wholesale_price' = 'retail_price'
  export let caixa
  export let clienteSelecionado:
    | RouterOutputs['customer']['getCustomers'][0]
    | null = null

  export let enderecoCliente:
    | RouterOutputs['customer']['getCustomers'][0]['adresses'][0]
    | null = null

  export let user

  export let motoboySelecionado:
    | RouterOutputs['auth']['getMotoboys'][0]
    | null = null

  export let isDelivery = false

  export let taxaEntrega = 0
  
  const cart = getCartContext()

  export let fee = 0

  function handleSelectClient() {
    modal.open(ModalCliente, {
      selectedClient: client => {
        clienteSelecionado = client
        modal.open(ModalEndereco, {
          addresses: client.adresses,
          customer_id: clienteSelecionado.id,
          selectedAddress: address => {
            enderecoCliente = address
            //TODO:ARRUMAR TIPO
            console.log(address)
            getDistance()
          },
        })
        if (clienteSelecionado.is_retail) {
          tipo_preco = 'retail_price'
        } else {
          tipo_preco = 'wholesale_price'
        }
      },
    })
  }

  function handleSelectMotoboy() {
    modal.open(ModalMotoboy, {
      selectedMotoboy: motoboy => {
        motoboySelecionado = motoboy
      },
    })
  }
  function toggleDelivery() {
    isDelivery = !isDelivery

    if (!isDelivery) {
      motoboySelecionado = null
    }
  }

  let distance = 0

  let isLoading = false
  
  async function getDistance() {
    isLoading= true
    try {
      if (enderecoCliente) {
        distance = await trpc($page).customer.calculateDistance.mutate({
          number: enderecoCliente.number,
          bairro: enderecoCliente?.neighborhood,
          street: enderecoCliente.street,
          city: enderecoCliente?.city,
          state: enderecoCliente.state,
          cep: enderecoCliente.cep,
          country: enderecoCliente.country,
        })
        taxaEntrega = (distance / 1000) * (fee / 100);
        taxaEntrega *= 100;
        taxaEntrega = Math.round(taxaEntrega / 100) * 100;
        console.log(taxaEntrega)
        console.log(distance)
        toast.success('Distancia: ' + (distance / 1000).toFixed(2) + 'km')
        isLoading=false
      }
    } catch (error: any) {
      toast.error(error.message)
      isLoading = false
    }
  }

  $: if(enderecoCliente) {
    isDelivery = true
  }
</script>

<div class="flex h-auto flex-col-reverse justify-between md:flex-col">
  <h2 class="mb-2 hidden text-3xl font-bold md:block">
    Informações do pedido:
  </h2>
  <!-- <p>
      Número do pedido: <span class="font-bold text-primary">
        #{caixa.id}
      </span>
    </p> -->
  <p>
    Criado por: <span class="font-bold text-success">{user?.email}</span>
  </p>
  <div>
    <!-- <h1 class="text-center mt-2">Selecione o tipo de preco</h1> -->
    <div class="mt-2 flex w-full flex-col lg:flex-row">
      <div class="grid flex-grow place-items-center">
        <button
          class="btn btn-primary w-full"
          on:click={() => {
            tipo_preco = 'retail_price'
          }}
          disabled={tipo_preco === 'retail_price' ||
            Object.values($cart).length >= 1}
        >
          Varejo
        </button>
      </div>
      <div class="divider lg:divider-horizontal">OU</div>
      <div class="grid flex-grow place-items-center">
        <button
          class="btn btn-primary w-full"
          on:click={() => {
            tipo_preco = 'wholesale_price'
          }}
          disabled={tipo_preco === 'wholesale_price' ||
            Object.values($cart).length >= 1}
        >
          Atacado
        </button>
      </div>
    </div>
  </div>
  <!-- <div
    class="mt-3 hidden w-full rounded-lg px-3 py-1 text-center font-bold md:block {caixa.status ===
    'Aberto'
      ? 'bg-success'
      : 'bg-error'}"
  >
    {caixa.status === 'Aberto' ? 'Em aberto' : 'Fechado'}
  </div> -->
  <div class="mt-2 flex flex-col-reverse gap-2 md:flex-col">
    <div class=" rounded-box bg-base-200 p-4">
      {#if clienteSelecionado}
        <div class="flex items-center justify-between gap-2">
          <span>
            <p class="font-bold">
              {clienteSelecionado.name} - {clienteSelecionado.email}
            </p>
            Créditos usados: <UsedCredits id={clienteSelecionado.id}/> - R${(clienteSelecionado.max_credit/100).toFixed(2)}
          </span>
          <button
            class="btn btn-primary"
            on:click={() => {
              clienteSelecionado = null
              enderecoCliente = null
              distance = 0
              taxaEntrega = 0
            }}
          >
            Desvincular
          </button>
        </div>
      {:else}
        <button
          class="btn btn-outline w-full disabled:bg-opacity-50"
          on:click={handleSelectClient}
        >
          <span class="mr-1">Vincular compra a um cliente</span>
        </button>
      {/if}
      {#if enderecoCliente}
        <div class="mt-2 max-w-[50vh] flex-wrap items-center justify-between">
          <strong>Endereço:</strong>
          {enderecoCliente?.cep} -
          {enderecoCliente?.city}, {enderecoCliente?.neighborhood}, {enderecoCliente?.street},
          {enderecoCliente?.number}, {enderecoCliente.state}
        </div>
        {#if distance}
          <h1>Distancia até endereço: {(distance / 1000).toFixed(2)}km</h1>
        {/if}
        {#if isLoading === true}
          Taxa de entrega carregando...
        {:else if taxaEntrega !== null}
        <div class="flex flex-col">
          <span>Taxa de entrega: R${(taxaEntrega / 100).toFixed(2)}</span>
          <span class="mt-2">Definir manualmente valor da entrega: <CurrencyInput bind:value={taxaEntrega}/></span>
        </div>
        {/if}
      {/if}
    </div>
    <div class="my-1 flex flex-col items-center justify-center gap-1">
      {#if clienteSelecionado && enderecoCliente}
        <div class="flex items-center justify-center gap-3">
          <h1>É um pedido delivery?</h1>
          <input
            type="checkbox"
            class="toggle toggle-success"
            checked={isDelivery}
            on:click={toggleDelivery}
          />
        </div>
      {/if}
      {#if isDelivery && clienteSelecionado}
        {#if motoboySelecionado}
          <div class="m-2 flex w-full items-center justify-center gap-3">
            <p class="flex flex-col">
              <span>
                Motoboy: <strong>{motoboySelecionado.username}</strong>
              </span>
            </p>
            <button
              class="btn btn-accent"
              on:click={() => {
                motoboySelecionado = null
                isDelivery = false
              }}
            >
              Desvincular
            </button>
          </div>
        {:else}
          <button class="btn btn-outline w-full" on:click={handleSelectMotoboy}>
            Selecione o motoboy
          </button>
        {/if}
      {/if}
    </div>
    <a
      href="/admin/cashier"
      class="btn btn-primary w-full disabled:bg-opacity-50"
      on:click={() => cart.set({})}
    >
      <span class="mr-1">CANCELAR</span>
      {@html icons.x()}
    </a>
  </div>
</div>
