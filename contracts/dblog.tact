import "@stdlib/deploy";
import "@stdlib/ownable";

message(0x5b3b21dd) AddPost {
    textOfPost: Post;
}

message(0xb5de5f9e) WithDraw {
    amountToWithdraw: Int;
}

struct Post {
    text: String;
}

contract Dblog with Deployable, Ownable {

    owner: Address;
    blogs: map<Int, Post>;
    maxNumberOfPosts: Int as uint8;
    currentNumberOfPosts: Int as uint8;

    init() {
        self.maxNumberOfPosts = 100;
        self.currentNumberOfPosts = 0;
        self.owner = sender();
    }

    receive() { cashback(sender()) }

    receive(msg: AddPost) {
        throwUnless(700, self.currentNumberOfPosts <= self.maxNumberOfPosts);

        let ctx: Context = context();
        throwUnless(701, ctx.value >= 2000000000);

        self.blogs.set(self.currentNumberOfPosts, msg.textOfPost);
        self.currentNumberOfPosts += 1;
    }

    receive(msg: WithDraw) {
        self.requireOwner();
        send(SendParameters{
            to: sender(), 
            value: msg.amountToWithdraw, 
            mode: SendRemainingValue | SendIgnoreErrors,
            body: "TON withdraw".asComment(), 
        });
    }


    get fun AllPosts(): map<Int, Post> {
        return self.blogs;
    }

    get fun CurrentNumberOfPosts(): Int {
        return self.currentNumberOfPosts;
    }

    get fun Balance(): Int {
        return myBalance();
    }

}
