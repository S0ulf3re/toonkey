import Vue from 'vue';
import { Form } from '../scripts/form';

export default function <T extends Form>(data: {
	name: string;
	props?: () => T;
}) {
	return Vue.extend({
		props: {
			widget: {
				type: Object
			},
			isCustomizeMode: {
				type: Boolean,
				default: false
			}
		},

		data() {
			return {
				bakedOldProps: null
			};
		},

		computed: {
			id(): string {
				return this.widget.id;
			},

			props(): Record<string, any> {
				return this.widget.data;
			}
		},

		created() {
			this.mergeProps();

			this.$watch('props', () => {
				this.mergeProps();
			});
		},

		methods: {
			mergeProps() {
				if (data.props) {
					const defaultProps = data.props();
					for (const prop of Object.keys(defaultProps)) {
						if (this.props.hasOwnProperty(prop)) continue;
						Vue.set(this.props, prop, defaultProps[prop].default);
					}
				}
			},

			async setting() {
				const form = data.props();
				for (const item of Object.keys(form)) {
					form[item].default = this.props[item];
				}
				const { canceled, result } = await this.$root.form(data.name, form);
				if (canceled) return;

				for (const key of Object.keys(result)) {
					Vue.set(this.props, key, result[key]);
				}

				this.save();
			},

			save() {
				this.$store.commit('deviceUser/updateWidget', this.widget);
			}
		}
	});
}
