<script lang="ts" generics="T">
  import { Modal } from '$lib/components/modal'
  import { modal } from '$lib/components/modal'
  import Cardapio from '$components/Cardapio.svelte'
  import { onMount } from 'svelte'
  import { trpc } from '$trpc/client'
  import { page } from '$app/stores'

  import type { RouterOutputs } from '$trpc/router'
  import type { SelectAddress } from '$lib/server/db/schema'

  export let addresses: SelectAddress[] = []
  export let selectedAddress: (address: SelectAddress) => void
</script>

<Modal title="Enderecos">
  <div class="my-4 flex flex-col gap-4">

    {#each addresses as addres}
    <div class="flex flex-col bg-base-200 p-4 gap-3 rounded-box text-center">
      {addres?.cep}
      {addres?.city}, {addres?.neighborhood}, {addres
        ?.street}, {addres?.number}
      <button
      class="btn btn-primary"
        on:click={() => {
          selectedAddress(addres)
          modal.close()
        }}
      >
        selecione
      </button>
    </div>
    {/each}
  </div>
</Modal>
