import "@stdlib/deploy";

message(0x5b3b21dd) AddPost {
    textOfPost: Post;
}

struct Post {
    text: String;
}

contract Dblog with Deployable {

    blogs: map<Address, Post>;
    maxNumberOfPosts: Int as uint8;
    currentNumberOfPosts: Int as uint8;

    init() {
        self.maxNumberOfPosts = 100;
        self.currentNumberOfPosts = 0;
    }

    receive() { cashback(sender()) }

    receive(msg: AddPost) {
        throwUnless(700, self.currentNumberOfPosts <= self.maxNumberOfPosts);
        self.blogs.set(sender(), msg.textOfPost);
        self.currentNumberOfPosts += 1;
    }


    get fun AllPosts(): map<Address, Post> {
        return self.blogs;
    }

    get fun CurrentNumberOfPosts(): Int {
        return self.currentNumberOfPosts;
    }
}
