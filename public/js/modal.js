import comments from "./comments.js";

const modal = {

    data() {
        return {
            imgData: [],
        };
    },

    components: {
        'comments': comments,
    },

    props: ["id"],


    methods: {
        changed: function () {
            // inform the parent component that the close btn clicked
            // for this we emit an event
            this.$emit("closeModal");
        },
    },


    template:
        `<div class="modal-container">
            <div class="close-modal" v-on:click="changed" >
                <span class="material-symbols-outlined"  >
                    close
                </span>
            </div>
            <div class="modal-img-container">
                <img v-bind:src="imgData.url" v-bind:id="imgData.id" alt="imgData.title"/>
            </div>
            <div class="img-desc-container">
                <h3>{{imgData.title}}</h3>
                <p>{{imgData.description}}</p>
                <p>Uploaded by {{imgData.username}} on {{imgData.created_at}}</p>
               <comments v-bind:image_id="id"></comments>
            </div> 
             
        </div>`,


    mounted() {
        // console.log(this);
        // console.log(this.title);

        history.pushState({}, "", `/imgs/${this.id}`);

        fetch(`/images/${this.id}`).then(res => res.json()).then(imgData => {
            console.log("this img is clicked", imgData);
            this.imgData = imgData;
            this.id = imgData.id;

        });
    },

    watch: {

        id: function () {
            fetch(`/images/${this.id}`).then(res => res.json()).then(imgData => {
                console.log("this img i clicked", imgData);
                this.imgData = imgData;

            });

        },
    },

};

export default modal;