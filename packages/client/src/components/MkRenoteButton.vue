<template>
<button
	v-if="canRenote"
	ref="buttonRef"
	class="eddddedb _button canRenote"
	@click="renote(false, $event)"
>
	<i class="fas fa-retweet"></i>
	<p v-if="count > 0" class="count">{{ count }}</p>
</button>
<button v-else class="eddddedb _button">
	<i class="fas fa-ban"></i>
</button>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import * as misskey from 'misskey-js';
import Ripple from '@/components/MkRipple.vue';
import XDetails from '@/components/MkUsersTooltip.vue';
import { pleaseLogin } from '@/scripts/please-login';
import * as os from '@/os';
import { $i } from '@/account';
import { useTooltip } from '@/scripts/use-tooltip';
import { i18n } from '@/i18n';
import { defaultStore } from "@/store";

const props = defineProps<{
		note: misskey.entities.Note;
		count: number;
	}>();

const buttonRef = ref<HTMLElement>();

const canRenote = computed(() => ['public', 'home'].includes(props.note.visibility) || props.note.userId === $i.id);

useTooltip(buttonRef, async (showing) => {
	const renotes = await os.api('notes/renotes', {
		noteId: props.note.id,
		limit: 11,
	});

	const users = renotes.map(x => x.user);

	if (users.length < 1) return;

	os.popup(XDetails, {
		showing,
		users,
		count: props.count,
		targetElement: buttonRef.value,
	}, {}, 'closed');
});

const renote = (viaKeyboard = false, ev?: MouseEvent) => {
	pleaseLogin();
	if (defaultStore.state.seperateRenoteQuote) {
		os.api('notes/create', {
			renoteId: props.note.id,
			visibility: props.note.visibility,
		});
		const el = ev && (ev.currentTarget ?? ev.target) as HTMLElement | null | undefined;
		if (el) {
			const rect = el.getBoundingClientRect();
			const x = rect.left + (el.offsetWidth / 2);
			const y = rect.top + (el.offsetHeight / 2);
			os.popup(Ripple, { x, y }, {}, 'end');
		}
	} else {
		os.popupMenu([{
			text: i18n.ts.renote,
			icon: 'fas fa-retweet',
			action: () => {
				os.api('notes/create', {
					renoteId: props.note.id,
					visibility: props.note.visibility,
				});
			},
		}, {
			text: i18n.ts.quote,
			icon: 'fas fa-quote-right',
			action: () => {
				os.post({
					renote: props.note,
				});
			},
		}], buttonRef.value, {
			viaKeyboard,
		});
	}
};
</script>

	<style lang="scss" scoped>
	.eddddedb {
		display: inline-block;
		height: 32px;
		margin: 2px;
		padding: 0 6px;
		border-radius: 4px;

		&:not(.canRenote) {
			cursor: default;
		}

		&.renoted {
			background: var(--accent);
		}

		> .count {
			display: inline;
			margin-left: 8px;
			opacity: 0.7;
		}
	}
	</style>
