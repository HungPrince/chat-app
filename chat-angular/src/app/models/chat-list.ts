export class ChatList {
    constructor(
		public _id: string,
		public online: string,
		public socketId: string,
		public timestamp :number,
		public username :string
	) {}
}