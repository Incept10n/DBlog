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
    blogs: map<Address, Post>;
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
        self.blogs.set(sender(), msg.textOfPost);
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


    get fun AllPosts(): map<Address, Post> {
        return self.blogs;
    }

    get fun CurrentNumberOfPosts(): Int {
        return self.currentNumberOfPosts;
    }

    get fun Balance(): Int {
        return myBalance();
    }

}
