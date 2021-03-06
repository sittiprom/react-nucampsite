import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb,
    BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label, Col, Row
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);


class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);

        this.state = {
            isModalOpen: false,
            touched: {
                author: false
            }
        };


        this.handleSubmit = this.handleSubmit.bind(this);

    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    

    }

    render() {
        return (
            <React.Fragment>

                <Button onClick={this.toggleModal} outline type="submit"> <i class="fa fa-pencil"></i> Submit Comment
                </Button>

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>

                        <LocalForm onSubmit={values => this.handleSubmit(values)}>

                            <div className="form-group">

                                <Label htmlFor="rating">rating</Label>
                                <Control.select validators={{
                                    required
                                }} model=".rating" id="rating">

                                    <option value="" defaultValue> SelectRating</option>
                                    <option value="1"> 1</option>
                                    <option value="2"> 2</option>
                                    <option value="3"> 3</option>
                                    <option value="3"> 4</option>
                                    <option value="3"> 5</option>

                                </Control.select>
                                <Errors
                                    className="text-danger"
                                    model=".rating"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        required: 'Required'

                                    }}
                                />
                            </div>


                            <div className="form-group">

                                <Label htmlFor="author">Your Name</Label>

                                <Control.text model=".author" id="author"
                                    validators={{
                                        required,
                                        minLength: minLength(2),
                                        maxLength: maxLength(15)
                                    }}
                                />

                                <Errors
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be at least 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                />
                            </div>


                            <div className="form-group">

                                <Label htmlFor="text" >Comment</Label>

                                <Control.textarea model=".text" id="text" name="text" />
                            </div>


                            <Button type="submit" color="primary">
                                Submit
                                  </Button>


                        </LocalForm>

                    </ModalBody>

                </Modal>
            </React.Fragment>

        );
    }

}

function RenderComments({ comments, postComment, campsiteId }) {

    if (comments) {
        return (

            <div className="col-md-5 m-1">
                <h4>Comments</h4>

                {comments.map(comment =>
                    <div key={comment.id} >
                        <p>{comment.text}</p>
                        <p>-- {comment.author} {new Intl.DateTimeFormat('en-US',
                            { year: 'numeric', month: 'short', day: '2-digit' })
                            .format(new Date(Date.parse(comment.date)))}</p>
                    </div>
                )

                }

                <CommentForm campsiteId={campsiteId} postComment={postComment} />

            </div>
        )

    }

    return <div></div>;

}


function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <Card>
                <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );

}


function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }

    if (props.campsite) {

        return (
            <div className="container">
                <div className="col">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <h2>{props.campsite.name}</h2>
                    <hr />
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments
                        comments={props.comments}
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}


                    />
                </div>
            </div>

        );

    } else {
        return (
            <div />
        );
    }

}





export default CampsiteInfo;
