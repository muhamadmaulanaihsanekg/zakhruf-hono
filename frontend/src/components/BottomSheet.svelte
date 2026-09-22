<script lang="ts">
  import type { Snippet } from 'svelte';
  import { IconX } from '@tabler/icons-svelte';

  interface Props {
    show: boolean;
    title?: string;
    subtitle?: string;
    maxWidth?: string; // '420px', '480px', '520px'
    onclose: () => void;
    children?: Snippet;
    footer?: Snippet;
  }

  let {
    show,
    title = '',
    subtitle = '',
    maxWidth = '480px',
    onclose,
    children,
    footer,
  }: Props = $props();

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && show) {
      onclose();
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

{#if show}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-[80] bg-[#040508]/75 backdrop-blur-[6px] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-200"
    onclick={onclose}
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="w-full max-h-[88dvh] sm:max-h-[85vh] bg-[#0d0f15] border-t sm:border border-white/[0.08] rounded-t-[24px] sm:rounded-[24px] flex flex-col shadow-[0_-12px_48px_rgba(0,0,0,0.65)] sm:shadow-[0_24px_64px_rgba(0,0,0,0.7)] animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-250 ease-out z-10"
      style="max-width: {maxWidth};"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Pull Handle bar on mobile -->
      <div class="flex justify-center pt-3 pb-1 sm:hidden">
        <div class="w-10 h-1 rounded-full bg-white/20"></div>
      </div>

      <!-- Header -->
      {#if title || subtitle}
        <div class="flex justify-between items-start gap-3 px-5 pt-3 sm:pt-5 pb-3 border-b border-white/[0.06]">
          <div class="min-w-0">
            {#if title}
              <h3 class="text-base font-bold text-[#e4e4ec] m-0">{title}</h3>
            {/if}
            {#if subtitle}
              <p class="text-[11px] text-[#8b8d9a] m-0 mt-0.5 leading-relaxed">{subtitle}</p>
            {/if}
          </div>
          <button
            type="button"
            onclick={onclose}
            class="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] text-[#8b8d9a] hover:text-[#e4e4ec] hover:border-white/20 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            title="Tutup"
          >
            <IconX size={16} />
          </button>
        </div>
      {/if}

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-5 space-y-4 [scrollbar-width:thin]">
        {@render children?.()}
      </div>

      <!-- Optional Footer -->
      {#if footer}
        <div class="p-4 sm:p-5 pt-3 border-t border-white/[0.06] bg-[#0d0f15]/90 rounded-b-[24px]">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
