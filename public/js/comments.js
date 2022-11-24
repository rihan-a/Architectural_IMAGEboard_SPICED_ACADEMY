
const comments = {
    data() {
        return {
            comment: "",
            commenter: "",
            comments: [],
            formerror: "",
        };
    },
    props: ["image_id"],

    methods: {
        saveComment: function (e) {
            e.preventDefault();

            if (this.comment.trim() == "" || this.commenter.trim() == "" || isNaN(this.comment) == false || isNaN(this.commenter) == false) {
                this.formerror = "Something went wrong! Please make sure you enter your comment and your username.";
                return;
            }

            fetch(`/comments`, {
                method: "POST",
                body: JSON.stringify({
                    image_id: this.image_id,
                    commenter: this.commenter,
                    comment: this.comment,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((comment) => {
                    console.log(comment);
                    this.comments.unshift(comment);
                    this.comment = "";
                    this.commenter = "";
                });
        },
    },

    template: `
    <div class="comments-container">
        
            <h4> Add a comment!</h4>
            <form  @submit="saveComment">
                <input type="text" v-model="comment" placeholder="Your Comment" />
                <input type="text" v-model="commenter" placeholder="username" />
                <input type="submit" class="btn-comment" value="Comment" />
            </form>
             <p class="form-error">{{formerror}}</p>
    
        <div class="comment-card" v-for="comment of comments">
            <h3>{{comment.comment}}</h3>
            <p>Comment by {{comment.commenter}} on {{comment.created_at}}</p>
        </div>
    </div>
    `,

    // watch for id change
    watch: {
        id: function () {
            fetch(`comments/${this.image_id}`)
                .then((res) => res.json())
                .then((comments) => {
                    this.comments = comments;
                    // console.log(this.comments);
                });
        },
    },


    mounted() {
        console.log("id", this.image_id);
        fetch(`comments/${this.image_id}`)
            .then((res) => res.json())
            .then((comments) => {
                this.comments = comments;
                // console.log(this.comments);
            });
    },
};

export default comments;