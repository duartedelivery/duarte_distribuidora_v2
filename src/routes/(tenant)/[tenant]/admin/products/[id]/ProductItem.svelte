<script lang="ts">
  import ImageInput from '$lib/components/input/ImageInput.svelte'
  import CurrencyInput from '$lib/components/input/CurrencyInput.svelte'

  import type { SelectProductItem } from '$db/schema'

  import { page } from '$app/stores'
  import { trpc } from '$trpc/client'
  import { toast } from 'svelte-sonner'
  import { icons } from '$lib/utils'
  import { modal } from '$lib/components/modal'
  import ModalSku from '$lib/components/modal/ModalSKU.svelte'
  import { onMount } from 'svelte'
  import type { RouterOutputs } from '$trpc/router'
  export let item: SelectProductItem

  let isChanged = false

  async function updateProductItemImage(image_id: number) {
    item.image = image_id

    try {
      const resp = await trpc($page).product.updateProductItem.mutate({
        id: item.id,
        prod: {
          image: image_id,
        },
      })
      console.log(resp)

      if (resp) {
        toast.success(`Product Item  Image#${item.id} updated`)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  async function updateProductItemInfo() {
    try {
      const resp = await trpc($page).product.updateProductItem.mutate({
        id: item.id,
        prod: {
          name: item.name,
          quantity: item.quantity,
          wholesale_price: item.wholesale_price,
          retail_price: item.retail_price,
          sku: item.sku ?? undefined,
        },
      })
      console.log(resp)

      if (resp) {
        toast.success(`Product Item Info #${item.id} updated`)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
    isChanged = false
  }

  function openSKUModal() {
    modal.open(ModalSku, {
      selectedSKU: async sku => {
        item.sku = sku.sku
        await updateProductItemInfo()
      },
      newSKU: { name: item.name, sku: item.sku ?? '' },
    })
  }

  async function handleDeleteProductItem() {
    try {
      await trpc($page).product.deleteProductItem.mutate(item.id)

      toast.success('Deletado com sucesso!')
      //TODO: Fix delete update sem recarregar
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  type CostPrice = RouterOutputs['stock']['getLastCostPrice']
  let costPrice: CostPrice | undefined

  onMount(async () => {
    if (item.sku) {
      try {
        costPrice = await trpc($page).stock.getLastCostPrice.query({
          sku: item.sku,
        })
        console.log(costPrice)
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  })
</script>

<div
  class="flex flex-col items-center justify-center gap-2 space-y-1 rounded-lg bg-base-200 p-4"
>
  <!-- <h2 class="text-center text-xl font-bold">{item.name}</h2> -->

  <div class="flex items-center gap-2">
    <span>
      #{item.id}
    </span>
    <input
      type="text"
      class="input w-full"
      bind:value={item.name}
      on:change={() => (isChanged = true)}
    />

    <button
      class="btn {item.sku ? 'btn-success' : 'btn-error'}"
      on:click={openSKUModal}
    >
      {@html icons.box()}
    </button>
    <button class="btn btn-error" on:click={handleDeleteProductItem}>
      {@html icons.trash()}
    </button>
  </div>
  <div class=" flex w-full items-center justify-between font-light">
    <span>Quantidade Incluida:</span>

    <input
      type="number"
      class="input w-20"
      bind:value={item.quantity}
      on:change={() => (isChanged = true)}
    />
  </div>
  {#if costPrice?.cost_price}
    <div class=" flex w-full items-center justify-between font-light">
      <span>Preco Custo:</span>
      <span class="font-semibold">
        R${(costPrice.cost_price / 100).toFixed(2)}
      </span>
    </div>
  {/if}

  <!-- <div class="my-3">
    <ImageInput
      image_id={item.image}
      name={item.name}
      save={updateProductItemImage}
    />
  </div> -->
  <div
    class="flex flex-col items-center justify-between gap-3 text-center md:flex-row"
  >
    <ImageInput
      image_id={item.image}
      name={item.name}
      save={updateProductItemImage}
    />
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between gap-3">
      Atacado:

        <CurrencyInput
          bind:value={item.wholesale_price}
          onchange={() => (isChanged = true)}
        />
      </div>
      <div class="flex items-center justify-between gap-3">
        Varejo
        <CurrencyInput
          bind:value={item.retail_price}
          onchange={() => (isChanged = true)}
        />
      </div>
    </div>
  </div>

  {#if isChanged}
    <button class="btn btn-outline mt-2" on:click={updateProductItemInfo}>
      Salvar alterações
    </button>
  {/if}
</div>
