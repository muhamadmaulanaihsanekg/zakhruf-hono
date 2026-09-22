<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    show?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    panelStyle?: string;
    onclose?: () => void;
    children?: Snippet;
  }

  let {
    show = false,
    maxWidth = 'sm',
    panelStyle = 'background: #13151c; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;',
    onclose,
    children,
  }: Props = $props();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && show && onclose) {
      onclose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if show}
  <div class="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-0 flex items-center justify-center">
    <!-- Backdrop -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      onclick={() => onclose?.()}
    ></div>

    <!-- Modal Panel -->
    <div
      class="relative z-10 w-full {maxWidthClasses[maxWidth]} mx-auto overflow-hidden rounded-2xl shadow-2xl transition-all"
      style={panelStyle}
    >
      {@render children?.()}
    </div>
  </div>
{/if}
