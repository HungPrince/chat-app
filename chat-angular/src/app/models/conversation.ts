export class Conversation {
    constructor(
		public message: String,
		public fromUserId: String,
		public toUserId: String,
		public timestamp:Number,
		public username:String
	) {}
}