import React, { Fragment } from 'react';
import { Button, Modal } from 'react-bootstrap';

class ArticleModal extends React.Component{

  render () {
    return (
      <Fragment>
        <Modal size="lg" show={this.props.show} onHide={this.props.handleClose}>

        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Article
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>{JSON.stringify(this.props.data)}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.props.handleClose}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );}
  }
  
  export default ArticleModal;