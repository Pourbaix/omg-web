import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {deleteOneTag} from "../../services/omgServer";

export default function DeleteTagActivationDialog(props) {

    const [open, setOpen] = React.useState(false);
    const [tagId] = useState(props.tagId);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        window.location.reload(false);
    };

    const deleteTagActivation = () => {
        const deleteBtn = document.getElementById("buttonDeleteTagActivationDialog");
        deleteBtn.setAttribute("disabled", "true");
        deleteBtn.innerText = "deleting...";
        deleteOneTag(tagId).then(res => {
            if (res[0].ok) {
                deleteBtn.innerText = "Tag deleted";
                handleClose();
            } else {
                deleteBtn.innerText = "Error";
                document.getElementById("responseTextDeleteTagActivationDialog").innerText = "Something wrong happened. Try Later.";
            }
        });

    }

    return (
        <div>
            <button className={"btn btn-danger"} onClick={handleClickOpen}>
                <span className={"icon text-white mr-2"}>
                    <i className={"fas fa-trash"}/>
                </span>
                <span className={"text"}>
                    Delete
                </span>
            </button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="deleteTag-dialog-title">
                <DialogContent className={"ml-2 mr-2"}>
                    <div className={"text-center"}> Are you sure you want to delete this tag ?</div>
                    <div id={"responseTextDeleteTagActivationDialog"} className={"text-center text-danger small mt-2"}/>
                </DialogContent>
                <DialogActions>
                    <button id={"buttonDeleteTagActivationDialog"} onClick={deleteTagActivation} className={"btn text-danger ml-0"}>
                        Yes
                    </button>
                    <button onClick={handleClose} className={"btn text-primary"}>
                        No
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
