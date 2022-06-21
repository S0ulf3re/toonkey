import { Directive } from 'vue';

export default {
	mounted(src, binding, vn) {
		//const query = binding.value;

		const header = src.children[0];
		const body = src.children[1];
		const currentStickyTop = getComputedStyle(src).getPropertyValue('--stickyTop') || '0px';
		src.style.setProperty('--stickyTop', `calc(${currentStickyTop} + ${header.offsetHeight}px)`);
		if (body) body.dataset.stickyContainerHeaderHeight = header.offsetHeight.toString();
		header.style.setProperty('--stickyTop', currentStickyTop);
		header.style.position = 'sticky';
		header.style.top = 'var(--stickyTop)';
		header.style.zIndex = '1';
	},
} as Directive;
