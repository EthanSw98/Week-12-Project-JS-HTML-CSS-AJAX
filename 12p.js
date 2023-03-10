class Comment {                     //this class sets up the 2 constructors that the server will take:name and comment
    constructor(name,comment) {
        this.name = name;
        this.comment = comment;
    }
}


class CommentService {
    static url = 'https://6407659c77c1a905a0f7cd3e.mockapi.io/Comments'; //refrences the server MOCKAPI I am using

    static getAllComments() {
        return $.get(this.url);
    }

    static getComment(id) {
        return $.get(this.url + `/${id}`);
    }

    static createComment(comment){
        return $.post(this.url, comment);
    }

    static updateComment(id){
        let comment = document.getElementById('updateText').value;

        return $.ajax({
            url: this.url + `/` + id,
            dataType: 'json',
            data:JSON.stringify({comment:comment}),
            contentType: 'application/json',
            type:'PUT'
        });
    }

    static deleteComment(id){
        return $.ajax({
            url:this.url + `/${id}`,
            type:'DELETE'
        })
    }
}

class DOMManager {
    static comments;

    static getAllComments(){
        CommentService.getAllComments().then(comments => this.render(comments));
    }

    static createComment(name, comment) {
        CommentService.createComment(new Comment(name, comment))
        .then(() => {
            return CommentService.getAllComments();
        })
        .then((comments) => this.render(comments));
    }

    static updateComment(id) {
        CommentService.updateComment(id)
        .then(() => {
            return CommentService.getAllComments();
        })
        .then((comments) => this.render(comments));
    };
    
    
    static deleteComment(id) {
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
            $('#app').prepend(
                `<div id="${comment.id}" class="card">
                    <div class="framed secondary">
                        <h4>${comment.name}</h4>
                        <p>${comment.comment}</p>
                        <input type="text" id="updateText" placeholder="Update your sighting">
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


function buttonClick(){
    let name = document.getElementById('comName').value;
    let comment = document.getElementById('comment').value;
        DOMManager.createComment(name, comment);
        document.getElementById('comName').value = "";
        document.getElementById('comment').value = "";
}


DOMManager.getAllComments();