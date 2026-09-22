<script lang="ts">
  import type { Snippet } from 'svelte';

  export interface RawOption {
    value?: string | number;
    label?: string;
    id?: string | number;
    name?: string;
    disabled?: boolean;
    [key: string]: any;
  }

  export type OptionInput = RawOption | string;

  interface NormalizedOption {
    value: string | number;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    id?: string;
    value?: string | number | null;
    options?: OptionInput[];
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    onchange?: (val: string | number) => void;
    children?: Snippet;
  }

  let {
    id,
    value = $bindable(null),
    options = [],
    placeholder = 'Pilih...',
    error = false,
    disabled = false,
    onchange,
  }: Props = $props();

  let normalizedOptions = $derived<NormalizedOption[]>(
    options.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      const val = opt.value ?? opt.id ?? '';
      const lbl = opt.label ?? opt.name ?? String(val);
      return {
        value: val,
        label: lbl,
        disabled: opt.disabled,
      };
    })
  );

  let open = $state(false);
  let triggerRef: HTMLButtonElement | null = $state(null);
  let popupRef: HTMLDivElement | null = $state(null);
  let popupStyle = $state<Record<string, string>>({});

  let displayLabel = $derived(
    normalizedOptions.find((o) => String(o.value) === String(value))?.label || placeholder
  );

  function updatePopupPosition() {
    if (!triggerRef) return;
    const rect = triggerRef.getBoundingClientRect();
    const gap = 6;
    const maxH = 240;
    const vh = window.innerHeight;
    const spaceBelow = vh - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const flip = spaceBelow < 160 && spaceAbove > spaceBelow;

    popupStyle = {
      position: 'fixed',
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: '9999',
      top: flip ? 'auto' : `${rect.bottom + gap}px`,
      bottom: flip ? `${vh - rect.top + gap}px` : 'auto',
      maxHeight: `${Math.min(maxH, flip ? spaceAbove - 8 : spaceBelow - 8)}px`,
    };
  }

  function toggleOpen() {
    if (disabled) return;
    open = !open;
    if (open) {
      setTimeout(updatePopupPosition, 10);
    }
  }

  function choose(opt: NormalizedOption) {
    if (opt.disabled) return;
    value = opt.value;
    onchange?.(opt.value);
    open = false;
  }

  function handleClickOutside(e: MouseEvent) {
    if (!open) return;
    const target = e.target as Node;
    if (triggerRef?.contains(target) || popupRef?.contains(target)) return;
    open = false;
  }
</script>

<svelte:window onclick={handleClickOutside} onresize={updatePopupPosition} />

<div class="relative w-full">
  <button
    {id}
    bind:this={triggerRef}
    type="button"
    {disabled}
    onclick={toggleOpen}
    class="w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 bg-white/[0.03] border rounded-[10px] text-[13px] text-[#e4e4ec] text-left transition-all duration-200 outline-none {error
      ? 'border-[#e05555] focus:ring-2 focus:ring-[#e05555]/20'
      : 'border-white/[0.08] focus:border-[#7a9a5e]/50 focus:ring-2 focus:ring-[#7a9a5e]/15'} {disabled
      ? 'opacity-40 cursor-not-allowed'
      : 'cursor-pointer'}"
  >
    <span class="flex-1 truncate {value ? 'text-[#e4e4ec]' : 'text-[#8b8d9a]'}">{displayLabel}</span>
    <svg
      class="w-3.5 h-3.5 text-[#8b8d9a] transition-transform duration-200 shrink-0 {open ? 'rotate-180 text-[#7a9a5e]' : ''}"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>

  {#if open}
    <div
      bind:this={popupRef}
      class="fixed p-1.5 bg-[#13151c] border border-white/[0.08] rounded-xl shadow-2xl overflow-y-auto outline-none"
      style={Object.entries(popupStyle).map(([k, v]) => `${k}:${v}`).join(';')}
    >
      {#each normalizedOptions as opt}
        <button
          type="button"
          disabled={opt.disabled}
          onclick={() => choose(opt)}
          class="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left text-[13px] transition-colors {String(opt.value) === String(value)
            ? 'text-[#8db36b] font-semibold bg-[#7a9a5e]/15'
            : 'text-[#e4e4ec] hover:bg-white/[0.06]'} {opt.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}"
        >
          <span class="flex-1 truncate">{opt.label}</span>
          {#if String(opt.value) === String(value)}
            <svg class="w-3.5 h-3.5 text-[#8db36b] shrink-0" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          {/if}
        </button>
      {:else}
        <div class="p-3 text-center text-xs text-[#5a5c6a]">— Tidak ada pilihan —</div>
      {/each}
    </div>
  {/if}
</div>
