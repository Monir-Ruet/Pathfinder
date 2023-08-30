class node {
    constructor(n) { this.x = n, this.next = null; }
};
class queue {
    constructor() {
        this.head = null, this.last = null, this.cnt = 0;
    }
    push(n) {
        if (this.cnt == 0) {
            this.last = new node(n);
            this.head = this.last
        } else {
            this.last.next = new node(n);
            this.last = this.last.next;
        }
        this.cnt++;
    }
    pop() {
        if (this.cnt) {
            let value = this.head.x;
            this.head = this.head.next;
            if (this.head == null) this.last = null;
            this.cnt--;
        } else return null;
    }
    size() {
        return this.cnt;
    }
    empty() {
        return this.cnt == 0;
    }
    front() {
        if (this.cnt) return this.head.x;
        else return null;
    }
};
module.exports = queue;