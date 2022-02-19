import {
	packedUserLiteSchema,
	packedUserDetailedNotMeOnlySchema,
	packedMeDetailedOnlySchema,
	packedUserDetailedNotMeSchema,
	packedMeDetailedSchema,
	packedUserDetailedSchema,
	packedUserSchema,
} from '@/models/schema/user';
import { packedNoteSchema } from '@/models/schema/note';
import { packedUserListSchema } from '@/models/schema/user-list';
import { packedAppSchema } from '@/models/schema/app';
import { packedMessagingMessageSchema } from '@/models/schema/messaging-message';
import { packedNotificationSchema } from '@/models/schema/notification';
import { packedDriveFileSchema } from '@/models/schema/drive-file';
import { packedDriveFolderSchema } from '@/models/schema/drive-folder';
import { packedFollowingSchema } from '@/models/schema/following';
import { packedMutingSchema } from '@/models/schema/muting';
import { packedBlockingSchema } from '@/models/schema/blocking';
import { packedNoteReactionSchema } from '@/models/schema/note-reaction';
import { packedHashtagSchema } from '@/models/schema/hashtag';
import { packedPageSchema } from '@/models/schema/page';
import { packedUserGroupSchema } from '@/models/schema/user-group';
import { packedNoteFavoriteSchema } from '@/models/schema/note-favorite';
import { packedChannelSchema } from '@/models/schema/channel';
import { packedAntennaSchema } from '@/models/schema/antenna';
import { packedClipSchema } from '@/models/schema/clip';
import { packedFederationInstanceSchema } from '@/models/schema/federation-instance';
import { packedQueueCountSchema } from '@/models/schema/queue';
import { packedGalleryPostSchema } from '@/models/schema/gallery-post';
import { packedEmojiSchema } from '@/models/schema/emoji';

export const refs = {
	UserLite: packedUserLiteSchema,
	UserDetailedNotMeOnly: packedUserDetailedNotMeOnlySchema,
	MeDetailedOnly: packedMeDetailedOnlySchema,
	UserDetailedNotMe: packedUserDetailedNotMeSchema,
	MeDetailed: packedMeDetailedSchema,
	UserDetailed: packedUserDetailedSchema,
	User: packedUserSchema,

	UserList: packedUserListSchema,
	UserGroup: packedUserGroupSchema,
	App: packedAppSchema,
	MessagingMessage: packedMessagingMessageSchema,
	Note: packedNoteSchema,
	NoteReaction: packedNoteReactionSchema,
	NoteFavorite: packedNoteFavoriteSchema,
	Notification: packedNotificationSchema,
	DriveFile: packedDriveFileSchema,
	DriveFolder: packedDriveFolderSchema,
	Following: packedFollowingSchema,
	Muting: packedMutingSchema,
	Blocking: packedBlockingSchema,
	Hashtag: packedHashtagSchema,
	Page: packedPageSchema,
	Channel: packedChannelSchema,
	QueueCount: packedQueueCountSchema,
	Antenna: packedAntennaSchema,
	Clip: packedClipSchema,
	FederationInstance: packedFederationInstanceSchema,
	GalleryPost: packedGalleryPostSchema,
	Emoji: packedEmojiSchema,
};

// Packed = SchemaTypeDef<typeof refs[x]>; とすると展開されてマウスホバー時に型表示が使い物にならなくなる
// ObjType<r['properties']>を指定すると（なぜか）展開されずにPacked<'Hoge'>と表示される
type PackedDef<r extends { properties?: Obj; oneOf?: ReadonlyArray<Schema>; allOf?: ReadonlyArray<Schema> }> =
	r['allOf'] extends ReadonlyArray<Schema> ? UnionToIntersection<UnionSchemaType<r['allOf']>> :
	r['oneOf'] extends ReadonlyArray<Schema> ? UnionSchemaType<r['oneOf']> :
	r['properties'] extends Obj ? ObjType<r['properties'], any> :
	never;
export type Packed<x extends keyof typeof refs> = PackedDef<typeof refs[x]>;

type TypeStringef = 'null' | 'boolean' | 'integer' | 'number' | 'string' | 'array' | 'object' | 'any';
type StringDefToType<T extends TypeStringef> =
	T extends 'null' ? null :
	T extends 'boolean' ? boolean :
	T extends 'integer' ? number :
	T extends 'number' ? number :
	T extends 'string' ? string | Date :
	T extends 'array' ? ReadonlyArray<any> :
	T extends 'object' ? Record<string, any> :
	any;

// https://swagger.io/specification/?sbsearch=optional#schema-object
type OfSchema = {
	readonly anyOf?: ReadonlyArray<Schema>;
	readonly oneOf?: ReadonlyArray<Schema>;
	readonly allOf?: ReadonlyArray<Schema>;
}

export interface Schema extends OfSchema {
	readonly type?: TypeStringef;
	readonly nullable?: boolean;
	readonly optional?: boolean;
	readonly items?: Schema;
	readonly properties?: Obj;
	readonly required?: ReadonlyArray<keyof NonNullable<this['properties']>>;
	readonly description?: string;
	readonly example?: any;
	readonly format?: string;
	readonly ref?: keyof typeof refs;
	readonly enum?: ReadonlyArray<string>;
	readonly default?: (this['type'] extends TypeStringef ? StringDefToType<this['type']> : any) | null;
	readonly maxLength?: number;
	readonly minLength?: number;
}

type OptionalPropertyNames<T extends Obj> = {
	[K in keyof T]: T[K]['optional'] extends true ? K : never
}[keyof T];

type NonOptionalPropertyNames<T extends Obj> = {
	[K in keyof T]: T[K]['optional'] extends false ? K : never
}[keyof T];

type DefaultPropertyNames<T extends Obj> = {
	[K in keyof T]: T[K]['default'] extends null ? K :
		T[K]['default'] extends string ? K :
		T[K]['default'] extends number ? K :
		T[K]['default'] extends boolean ? K :
		T[K]['default'] extends Record<string, unknown> ? K :
		never
}[keyof T];

export interface Obj { [key: string]: Schema; }

export type ObjType<s extends Obj, RequiredProps extends ReadonlyArray<keyof s>> =
	{ -readonly [P in keyof s]?: SchemaType<s[P]> } &
	{ -readonly [P in RequiredProps[number]]: SchemaType<s[P]> } &
	{ -readonly [P in OptionalPropertyNames<s>]?: SchemaType<s[P]> } &
	{ -readonly [P in NonOptionalPropertyNames<s>]: SchemaType<s[P]> } &
	{ -readonly [P in DefaultPropertyNames<s>]: SchemaType<s[P]> };

type NullOrUndefined<p extends Schema, T> =
	p['nullable'] extends true
		?	p['optional'] extends true
			? (T | null | undefined)
			: (T | null)
		: p['optional'] extends true
			? (T | undefined)
			: T;

// 共用体型を交差型にする型 https://stackoverflow.com/questions/54938141/typescript-convert-union-to-intersection
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// https://github.com/misskey-dev/misskey/pull/8144#discussion_r785287552
// 単純にSchemaTypeDef<X>で判定するだけではダメ
type UnionSchemaType<a extends readonly any[], X extends Schema = a[number]> = X extends any ? SchemaType<X> : never;
type ArrayUnion<T> = T extends any ? Array<T> : never; 

export type SchemaTypeDef<p extends Schema> =
	p['type'] extends 'null' ? null :
	p['type'] extends 'integer' ? number :
	p['type'] extends 'number' ? number :
	p['type'] extends 'string' ? (
		p['enum'] extends readonly string[] ?
			p['enum'][number] :
			p['format'] extends 'date-time' ? string : // Dateにする？？
			string
	) :
	p['type'] extends 'boolean' ? boolean :
	p['type'] extends 'object' ? (
		p['ref'] extends keyof typeof refs ? Packed<p['ref']> :
		p['properties'] extends NonNullable<Obj> ? ObjType<p['properties'], NonNullable<p['required']>> :
		p['anyOf'] extends ReadonlyArray<Schema> ? UnionSchemaType<p['anyOf']> & Partial<UnionToIntersection<UnionSchemaType<p['anyOf']>>> :
		p['allOf'] extends ReadonlyArray<Schema> ? UnionToIntersection<UnionSchemaType<p['allOf']>> :
		any
	) :
	p['type'] extends 'array' ? (
		p['items'] extends OfSchema ? (
			p['items']['anyOf'] extends ReadonlyArray<Schema> ? UnionSchemaType<NonNullable<p['items']['anyOf']>>[] :
			p['items']['oneOf'] extends ReadonlyArray<Schema> ? ArrayUnion<UnionSchemaType<NonNullable<p['items']['oneOf']>>> :
			p['items']['allOf'] extends ReadonlyArray<Schema> ? UnionToIntersection<UnionSchemaType<NonNullable<p['items']['allOf']>>>[] :
			never
		) :
		p['items'] extends NonNullable<Schema> ? SchemaTypeDef<p['items']>[] :
		any[]
	) :
	p['oneOf'] extends ReadonlyArray<Schema> ? UnionSchemaType<p['oneOf']> :
	any;

export type SchemaType<p extends Schema> = NullOrUndefined<p, SchemaTypeDef<p>>;
