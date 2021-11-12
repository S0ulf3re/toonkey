import FederationChart from './charts/classes/federation';
import NotesChart from './charts/classes/notes';
import UsersChart from './charts/classes/users';
import NetworkChart from './charts/classes/network';
import ActiveUsersChart from './charts/classes/active-users';
import InstanceChart from './charts/classes/instance';
import PerUserNotesChart from './charts/classes/per-user-notes';
import DriveChart from './charts/classes/drive';
import PerUserReactionsChart from './charts/classes/per-user-reactions';
import HashtagChart from './charts/classes/hashtag';
import PerUserFollowingChart from './charts/classes/per-user-following';
import PerUserDriveChart from './charts/classes/per-user-drive';
import { beforeShutdown } from '@/misc/before-shutdown';

export const federationChart = new FederationChart();
export const notesChart = new NotesChart();
export const usersChart = new UsersChart();
export const networkChart = new NetworkChart();
export const activeUsersChart = new ActiveUsersChart();
export const instanceChart = new InstanceChart();
export const perUserNotesChart = new PerUserNotesChart();
export const driveChart = new DriveChart();
export const perUserReactionsChart = new PerUserReactionsChart();
export const hashtagChart = new HashtagChart();
export const perUserFollowingChart = new PerUserFollowingChart();
export const perUserDriveChart = new PerUserDriveChart();

const charts = [
	federationChart,
	notesChart,
	usersChart,
	networkChart,
	activeUsersChart,
	instanceChart,
	perUserNotesChart,
	driveChart,
	perUserReactionsChart,
	hashtagChart,
	perUserFollowingChart,
	perUserDriveChart,
];

// 20分おきにメモリ情報をDBに書き込み
setInterval(() => {
	for (const chart of charts) {
		chart.save();
	}
}, 1000 * 60 * 20);

beforeShutdown(() => Promise.all(charts.map(chart => chart.save())));
