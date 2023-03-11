class Comment {                     //this class sets up the 2 constructors that the server will take:name and comment
    constructor(name,comment) {
        this.name = name;
        this.comment = comment;
    }
}


class CommentService {
    static url = 'https://6407659c77c1a905a0f7cd3e.mockapi.io/Comments'; //refrences the server MOCKAPI I am using

    static getAllComments() {  //returns all comments stored in the api. will be used to render all comments to the page
        return $.get(this.url);
    }

    static getComment(id) {  
        return $.get(this.url + `/${id}`);
    }

    static createComment(comment){  //uses 'post' to add a comment to the api
        return $.post(this.url, comment);
    }

    static updateComment(id){   
        let comment = document.getElementById(`updateText${id}`).value;  //each comment box will have an input field with the ID of the comment it is in

        return $.ajax({
            url: this.url + `/` + id,
            dataType: 'json',
            data:JSON.stringify({comment:comment}),
            contentType: 'application/json',
            type:'PUT'
        });
    }

    static deleteComment(id){  // each comment box will have a button linked to that comments id
        return $.ajax({
            url:this.url + `/${id}`,
            type:'DELETE'
        })
    }
}

class DOMManager {
    static comments;

    static getAllComments(){
        CommentService.getAllComments().then(comments => this.render(comments));  // this takes all the comments in the api and runs the render function on them
    }

    static createComment(name, comment) {  //runs when submit button is clicked, when user enters a name and comment
        CommentService.createComment(new Comment(name, comment))
        .then(() => {
            return CommentService.getAllComments();
        })
        .then((comments) => this.render(comments));  //after creating the new comment we want to render all of them again
    }

    static updateComment(id) {  // each comment will have an update button with the ID of the comment it is in
        CommentService.updateComment(id)
        .then(() => {
            return CommentService.getAllComments();
        })
        .then((comments) => this.render(comments));
    };
    
    
    static deleteComment(id) {  //same with each delete button within each comment
        CommentService.deleteComment(id)
        .then(() => {
            return CommentService.getAllComments();
        })
        .then((comments) => this.render(comments));
    }


    static render(comments){
        this.comments= comments;
        $('#app').empty();
        for(let comment of comments){
            $('#app').prepend(                              //this html sets up a card for each comment. each comment gets buttons and input with ID's matching the comment it is in
                `<div id="${comment.id}" class="card">
                    <div class="framed secondary">
                        <h4>${comment.name}</h4>
                        <p>${comment.comment}</p>
                        <input type="text" id="updateText${comment.id}" placeholder="Update your sighting">  
                        <button  onClick="DOMManager.updateComment('${comment.id}')"> Update </button>
                        <button  onClick="DOMManager.deleteComment('${comment.id}')"> Delete </button>
                    </div>
                </div>
                `
            )
        }
    }

    
}


document.getElementById('btnSubmit').addEventListener('click', () => {buttonClick()});


function buttonClick(){  //this function takes the name and comment and creates a new comment, submitting it to the API then rendering all comments again
    let name = document.getElementById('comName').value;
    let comment = document.getElementById('comment').value;
        DOMManager.createComment(name, comment);
        document.getElementById('comName').value = "";
        document.getElementById('comment').value = "";
}


DOMManager.getAllComments();