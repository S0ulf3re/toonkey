import Vue from 'vue';
import { getScrollPosition, onScrollTop } from './scroll';

const SECOND_FETCH_LIMIT = 30;

export default (opts) => ({
	data() {
		return {
			items: [],
			queue: [],
			offset: 0,
			fetching: true,
			moreFetching: false,
			inited: false,
			more: false,
			backed: false,
			isBackTop: false,
			ilObserver: new IntersectionObserver(
				(entries) => entries.some((entry) => entry.isIntersecting)
					&& !this.moreFetching
					&& !this.fetching
					&& this.fetchMore()
				),
			loadMoreElement: null as Element,
			unsubscribeInfiniteScrollMutation: null as any,
		};
	},

	computed: {
		empty(): boolean {
			return this.items.length === 0 && !this.fetching && this.inited;
		},

		error(): boolean {
			return !this.fetching && !this.inited;
		},
	},

	watch: {
		pagination() {
			this.init();
		},

		queue() {
			this.$emit('queue', this.queue.length);
		}
	},

	created() {
		opts.displayLimit = opts.displayLimit || 30;
		this.init();

		this.$on('hook:activated', () => {
			this.isBackTop = false;
		});

		this.$on('hook:deactivated', () => {
			this.isBackTop = window.scrollY === 0;
		});
	},

	mounted() {
		this.$nextTick(() => {
			if (this.$refs.loadMore) {
				this.loadMoreElement = this.$refs.loadMore instanceof Element ? this.$refs.loadMore : this.$refs.loadMore.$el;
				if (this.$store.state.device.enableInfiniteScroll) this.ilObserver.observe(this.loadMoreElement);
				this.loadMoreElement.addEventListener('click', this.fetchMore);

				this.unsubscribeInfiniteScrollMutation = this.$store.subscribe(mutation => {
					if (mutation.type !== 'device/setInfiniteScrollEnabling') return;

					if (mutation.payload) return this.ilObserver.observe(this.loadMoreElement);
					return this.ilObserver.unobserve(this.loadMoreElement);
				});
			}
		});
	},

	beforeDestroy() {
		this.ilObserver.disconnect();
		if (this.$refs.loadMore) this.loadMoreElement.removeEventListener('click', this.fetchMore);
		if (this.unsubscribeInfiniteScrollMutation) this.unsubscribeInfiniteScrollMutation();
	},

	methods: {
		updateItem(i, item) {
			Vue.set((this as any).items, i, item);
		},

		reload() {
			this.items = [];
			this.init();
		},

		async init() {
			this.queue = [];
			this.fetching = true;
			if (opts.before) opts.before(this);
			let params = typeof this.pagination.params === 'function' ? this.pagination.params(true) : this.pagination.params;
			if (params && params.then) params = await params;
			const endpoint = typeof this.pagination.endpoint === 'function' ? this.pagination.endpoint() : this.pagination.endpoint;
			await this.$root.api(endpoint, {
				...params,
				limit: this.pagination.noPaging ? (this.pagination.limit || 10) : (this.pagination.limit || 10) + 1,
			}).then(items => {
				if (!this.pagination.noPaging && (items.length > (this.pagination.limit || 10))) {
					items.pop();
					this.items = this.pagination.reversed ? [...items].reverse() : items;
					this.more = true;
				} else {
					this.items = this.pagination.reversed ? [...items].reverse() : items;
					this.more = false;
				}
				this.offset = items.length;
				this.inited = true;
				this.fetching = false;
				if (opts.after) opts.after(this, null);
			}, e => {
				this.fetching = false;
				if (opts.after) opts.after(this, e);
			});
		},

		async fetchMore() {
			if (!this.more || this.moreFetching || this.items.length === 0) return;
			this.moreFetching = true;
			this.backed = true;
			let params = typeof this.pagination.params === 'function' ? this.pagination.params(false) : this.pagination.params;
			if (params && params.then) params = await params;
			const endpoint = typeof this.pagination.endpoint === 'function' ? this.pagination.endpoint() : this.pagination.endpoint;
			await this.$root.api(endpoint, {
				...params,
				limit: SECOND_FETCH_LIMIT + 1,
				...(this.pagination.offsetMode ? {
					offset: this.offset,
				} : this.pagination.reversed ? {
					sinceId: this.items[0].id,
				} : {
					untilId: this.items[this.items.length - 1].id,
				}),
			}).then(items => {
				if (items.length > SECOND_FETCH_LIMIT) {
					items.pop();
					this.items = this.pagination.reversed ? [...items].reverse().concat(this.items) : this.items.concat(items);
					this.more = true;
				} else {
					this.items = this.pagination.reversed ? [...items].reverse().concat(this.items) : this.items.concat(items);
					this.more = false;
				}
				this.offset += items.length;
				this.moreFetching = false;
			}, e => {
				this.moreFetching = false;
			});
		},

		prepend(item) {
			const isTop = this.isBackTop || (document.body.contains(this.$el) && (getScrollPosition(this.$el) === 0));

			if (isTop) {
				// Prepend the item
				this.items.unshift(item);

				// オーバーフローしたら古いアイテムは捨てる
				if (this.items.length >= opts.displayLimit) {
					this.items = this.items.slice(0, opts.displayLimit);
					this.more = true;
				}
			} else {
				this.queue.push(item);
				onScrollTop(this.$el, () => {
					for (const item of this.queue) {
						this.prepend(item);
					}
					this.queue = [];
				});
			}
		},

		append(item) {
			this.items.push(item);
		},

		remove(find) {
			this.items = this.items.filter(x => !find(x));
		},
	}
});
