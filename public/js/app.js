import * as Vue from './vue.js';
// import component
import modal from "./modal.js";

// create Vue app
Vue.createApp({

    data() {
        return {
            isActive: false,
            angle: 0,
            opacity: 0,
            imageTitle: "",
            imageDesc: "",
            userName: "",
            formerror: "",
            photo: "",
            images: [],
            modalID: null,
            overlayBackground: false,
            more: true,
            lastId: null,
        };
    },

    components: {
        'modal': modal,
    },

    methods: {



        showUploadArea: function () {
            console.log("upload clicked");
            if (!this.isActive) {
                this.isActive = true;
                this.angle = 45;
                this.opacity = 100;
            } else {
                this.isActive = false;
                this.angle = 0;
                this.opacity = 0;
            }
        },

        uploadImage: function () {
            console.log("upload btn clicked");

            // Check if there is no file uploaded, show error and return
            if (document.querySelector("input[type=file]").files.length < 1) {
                this.formerror = "Something went wrong! Please make sure you upload an image as jpeg or png.";
                return;
            }
            let file = document.querySelector("input[type=file]").files[0];

            // Check if there is the input are empty or numbers, show error and return
            if (this.userName.trim() == "" || this.imageTitle.trim() == "" || this.imageDesc.trim() == ""
                || isNaN(this.userName) == false || isNaN(this.imageTitle) == false || isNaN(this.imageDesc) == false) {
                this.formerror = "Something went wrong! Please make sure you enter a project title, description and your username";
                return;
            }

            let formData = new FormData();
            // add form data 
            formData.append("userName", this.userName);
            formData.append("imageTitle", this.imageTitle);
            formData.append("imageDesc", this.imageDesc);
            formData.append("file", file);

            console.log(formData);
            // send form data to the server
            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((response) => {
                    //add the last uploaded img to the images array
                    this.images.unshift(response);
                    //console.log("response", response);

                    //empty the input field
                    this.imageTitle = "";
                    this.imageDesc = "";
                    this.userName = "";

                })
                .catch((err) => {
                    console.log("err", err);
                });
        },

        openModal: function (e) {
            //console.log(e.target.id);
            let imgId = e.target.id;
            this.modalID = imgId;
            this.overlayBackground = true;

            //   history.pushState({}, "", `/imgs/${imgId}`);
        },

        closeModal: function () {
            console.log("close modal clicked");
            this.modalID = null;
            this.overlayBackground = false;

            history.replaceState({}, '', `/`);
        },

        loadMore: function () {
            console.log("load more images ...");
            this.lastId = this.images[this.images.length - 1].id;
            // console.log(this.images);
            // console.log(this.lastId);

            // send last img id to server
            fetch(`/loadmore/${this.lastId} `).then(res => res.json()).then(imgsData => {
                // console.log(imgsData);
                this.images.push(...imgsData);

                this.lastId = this.images[this.images.length - 1].id;

                if (imgsData[0].lowestId == this.lastId) {
                    this.more = false;
                } else {
                    this.more = true;
                }

            });
        },
    },

    mounted() {
        fetch("/images").then(res => res.json()).then(imgsData => {
            //console.log(imgsData);
            this.images = imgsData;
        });

        //console.log(location.pathname);

        let userUrl = location.pathname.split("/");

        if (userUrl[1] == "imgs" && userUrl.length == 3 &&
            isNaN(userUrl[2]) == false) {
            fetch(`/images/${userUrl[2]}`).then(res => res.json()).then(imgData => {
                console.log("this img is clicked", imgData);
                if (imgData) {
                    this.modalID = userUrl[2];
                } else {
                    this.modalID = null;
                }
            });
        }


        window.addEventListener("popstate", () => {
            let userUrl = location.pathname.split("/");

            if (userUrl[1] == "imgs" && userUrl.length == 3 &&
                isNaN(userUrl[2]) == false) {
                fetch(`/images/${userUrl[2]}`).then(res => res.json()).then(imgData => {
                    console.log("this img is clicked", imgData);
                    if (imgData) {
                        this.modalID = userUrl[2];
                    } else {
                        this.modalID = null;
                    }
                });
            }

        });

    }
}).mount('#app');


