<template>
<MkSpacer :content-max="700" :margin-min="16" :margin-max="32">
	<div class="_formRoot">
		<FormInput v-model="name" class="_formBlock">
			<template #label>{{ $ts.instanceName }}</template>
		</FormInput>

		<FormTextarea v-model="description" class="_formBlock">
			<template #label>{{ $ts.instanceDescription }}</template>
		</FormTextarea>

		<FormInput v-model="iconUrl" class="_formBlock">
			<template #prefix><i class="fas fa-link"></i></template>
			<template #label>{{ $ts.iconUrl }}</template>
		</FormInput>

		<FormInput v-model="bannerUrl" class="_formBlock">
			<template #prefix><i class="fas fa-link"></i></template>
			<template #label>{{ $ts.bannerUrl }}</template>
		</FormInput>

		<FormInput v-model="backgroundImageUrl" class="_formBlock">
			<template #prefix><i class="fas fa-link"></i></template>
			<template #label>{{ $ts.backgroundImageUrl }}</template>
		</FormInput>

		<FormInput v-model="themeColor" class="_formBlock">
			<template #prefix><i class="fas fa-palette"></i></template>
			<template #label>{{ $ts.themeColor }}</template>
			<template #caption>#RRGGBB</template>
		</FormInput>

		<FormInput v-model="tosUrl" class="_formBlock">
			<template #prefix><i class="fas fa-link"></i></template>
			<template #label>{{ $ts.tosUrl }}</template>
		</FormInput>

		<FormSplit :min-width="300">
			<FormInput v-model="maintainerName" class="_formBlock">
				<template #label>{{ $ts.maintainerName }}</template>
			</FormInput>

			<FormInput v-model="maintainerEmail" type="email" class="_formBlock">
				<template #prefix><i class="fas fa-envelope"></i></template>
				<template #label>{{ $ts.maintainerEmail }}</template>
			</FormInput>
		</FormSplit>

		<FormTextarea v-model="pinnedUsers" class="_formBlock">
			<template #label>{{ $ts.pinnedUsers }}</template>
			<template #caption>{{ $ts.pinnedUsersDescription }}</template>
		</FormTextarea>

		<FormInput v-model="maxNoteTextLength" type="number" class="_formBlock">
			<template #prefix><i class="fas fa-pencil-alt"></i></template>
			<template #label>{{ $ts.maxNoteTextLength }}</template>
		</FormInput>

		<FormSection>
			<FormSwitch v-model="enableRegistration" class="_formBlock">
				<template #label>{{ $ts.enableRegistration }}</template>
			</FormSwitch>

			<FormSwitch v-model="emailRequiredForSignup" class="_formBlock">
				<template #label>{{ $ts.emailRequiredForSignup }}</template>
			</FormSwitch>
		</FormSection>

		<FormSection>
			<FormSwitch v-model="enableLocalTimeline" class="_formBlock">{{ $ts.enableLocalTimeline }}</FormSwitch>
			<FormSwitch v-model="enableGlobalTimeline" class="_formBlock">{{ $ts.enableGlobalTimeline }}</FormSwitch>
			<FormInfo class="_formBlock">{{ $ts.disablingTimelinesInfo }}</FormInfo>
		</FormSection>

		<FormSection>
			<template #label>{{ $ts.files }}</template>

			<FormSwitch v-model="cacheRemoteFiles" class="_formBlock">
				<template #label>{{ $ts.cacheRemoteFiles }}</template>
				<template #caption>{{ $ts.cacheRemoteFilesDescription }}</template>
			</FormSwitch>

			<FormSwitch v-model="proxyRemoteFiles" class="_formBlock">
				<template #label>{{ $ts.proxyRemoteFiles }}</template>
				<template #caption>{{ $ts.proxyRemoteFilesDescription }}</template>
			</FormSwitch>

			<FormSplit :min-width="280">
				<FormInput v-model="localDriveCapacityMb" type="number" class="_formBlock">
					<template #label>{{ $ts.driveCapacityPerLocalAccount }}</template>
					<template #suffix>MB</template>
					<template #caption>{{ $ts.inMb }}</template>
				</FormInput>

				<FormInput v-model="remoteDriveCapacityMb" type="number" :disabled="!cacheRemoteFiles" class="_formBlock">
					<template #label>{{ $ts.driveCapacityPerRemoteAccount }}</template>
					<template #suffix>MB</template>
					<template #caption>{{ $ts.inMb }}</template>
				</FormInput>
			</FormSplit>
		</FormSection>

		<FormSection>
			<template #label>ServiceWorker</template>

			<FormSwitch v-model="enableServiceWorker" class="_formBlock">
				<template #label>{{ $ts.enableServiceworker }}</template>
				<template #caption>{{ $ts.serviceworkerInfo }}</template>
			</FormSwitch>

			<template v-if="enableServiceWorker">
				<FormInput v-model="swPublicKey" class="_formBlock">
					<template #prefix><i class="fas fa-key"></i></template>
					<template #label>Public key</template>
				</FormInput>

				<FormInput v-model="swPrivateKey" class="_formBlock">
					<template #prefix><i class="fas fa-key"></i></template>
					<template #label>Private key</template>
				</FormInput>
			</template>
		</FormSection>

		<FormSection>
			<template #label>DeepL Translation</template>

			<FormInput v-model="deeplAuthKey" class="_formBlock">
				<template #prefix><i class="fas fa-key"></i></template>
				<template #label>DeepL Auth Key</template>
			</FormInput>
			<FormSwitch v-model="deeplIsPro" class="_formBlock">
				<template #label>Pro account</template>
			</FormSwitch>
		</FormSection>
	</div>
</MkSpacer>
</template>

<script lang="ts" setup>
import { } from 'vue';
import FormSwitch from '@/components/form/switch.vue';
import FormInput from '@/components/form/input.vue';
import FormTextarea from '@/components/form/textarea.vue';
import FormInfo from '@/components/ui/info.vue';
import FormSection from '@/components/form/section.vue';
import FormSplit from '@/components/form/split.vue';
import * as os from '@/os';
import * as symbols from '@/symbols';
import { fetchInstance } from '@/instance';
import { i18n } from '@/i18n';

defineExpose({
	[symbols.PAGE_INFO]: {
		title: i18n.ts.general,
		icon: 'fas fa-cog',
		bg: 'var(--bg)',
		actions: [{
			asFullButton: true,
			icon: 'fas fa-check',
			text: i18n.ts.save,
			handler: save,
		}],
	},
});

const meta = await os.api('meta', { detail: true });

let name = $ref(meta.name);
let description = $ref(meta.description);
let tosUrl = $ref(meta.tosUrl);
let iconUrl = $ref(meta.iconUrl);
let bannerUrl = $ref(meta.bannerUrl);
let backgroundImageUrl = $ref(meta.backgroundImageUrl);
let themeColor = $ref(meta.themeColor);
let maintainerName = $ref(meta.maintainerName);
let maintainerEmail = $ref(meta.maintainerEmail);
let maxNoteTextLength = $ref(meta.maxNoteTextLength);
let enableLocalTimeline = $ref(!meta.disableLocalTimeline);
let enableGlobalTimeline = $ref(!meta.disableGlobalTimeline);
let pinnedUsers = $ref(meta.pinnedUsers.join('\n'));
let cacheRemoteFiles = $ref(meta.cacheRemoteFiles);
let proxyRemoteFiles = $ref(meta.proxyRemoteFiles);
let localDriveCapacityMb = $ref(meta.driveCapacityPerLocalUserMb);
let remoteDriveCapacityMb = $ref(meta.driveCapacityPerRemoteUserMb);
let enableRegistration = $ref(!meta.disableRegistration);
let emailRequiredForSignup = $ref(meta.emailRequiredForSignup);
let enableServiceWorker = $ref(meta.enableServiceWorker);
let swPublicKey = $ref(meta.swPublickey);
let swPrivateKey = $ref(meta.swPrivateKey);
let deeplAuthKey = $ref(meta.deeplAuthKey);
let deeplIsPro = $ref(meta.deeplIsPro);

async function save() {
	await os.apiWithDialog('admin/update-meta', {
		name: name,
		description: description,
		tosUrl: tosUrl,
		iconUrl: iconUrl,
		bannerUrl: bannerUrl,
		backgroundImageUrl: backgroundImageUrl,
		themeColor: themeColor === '' ? null : themeColor,
		maintainerName: maintainerName,
		maintainerEmail: maintainerEmail,
		maxNoteTextLength: maxNoteTextLength,
		disableLocalTimeline: !enableLocalTimeline,
		disableGlobalTimeline: !enableGlobalTimeline,
		pinnedUsers: pinnedUsers.split('\n'),
		cacheRemoteFiles: cacheRemoteFiles,
		proxyRemoteFiles: proxyRemoteFiles,
		localDriveCapacityMb: parseInt(localDriveCapacityMb, 10),
		remoteDriveCapacityMb: parseInt(remoteDriveCapacityMb, 10),
		disableRegistration: !enableRegistration,
		emailRequiredForSignup: emailRequiredForSignup,
		enableServiceWorker: enableServiceWorker,
		swPublicKey: swPublicKey,
		swPrivateKey: swPrivateKey,
		deeplAuthKey: deeplAuthKey,
		deeplIsPro: deeplIsPro,
	});

	fetchInstance();
}
</script>
