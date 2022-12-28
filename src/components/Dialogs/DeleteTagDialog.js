import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { deleteAllTags } from "../../services/omgServer";

export default function DeleteTagDialog(props) {
	const [open, setOpen] = useState(false);
	const [tagName] = useState(props.tagName);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		window.location.reload(false);
	};

	const deleteTag = () => {
		const deleteBtn = document.getElementById("buttonYesDeleteTagDialog");
		deleteBtn.setAttribute("disabled", "true");
		deleteBtn.innerText = "deleting...";
		deleteAllTags(props.tagName).then((res) => {
			if (res[0].ok) {
				deleteBtn.innerText = "Tag deleted";
				console.log(res[1]);
				handleClose();
			} else {
				deleteBtn.innerText = "Error";
				document.getElementById(
					"responseTextDeleteTagDialog"
				).innerText = "Something wrong happened. Try Later.";
			}
		});
	};

	return (
		<div>
			<button
				className={"btn btn-outline-danger"}
				onClick={handleClickOpen}
			>
				<span className={"icon mr-2"}>
					<i className={"fas fa-trash"} />
				</span>
				<span className={"text"}>{"Delete " + props.tagName}</span>
			</button>
			<Dialog
				open={open}
				onClose={handleClose}
				// aria-labelledby="deleteTag-dialog-title"
			>
				<DialogContent className={"ml-2 mr-2"}>
					<div className={"text-center"}>
						{" "}
						Are you sure you want to delete{" "}
						{tagName === "All" ? "all tags" : "this tag"} ? All
						associated tags will also be deleted. This action is
						irreversible.
					</div>
					<div
						id={"responseTextDeleteTagDialog"}
						className={"text-center text-danger small mt-2"}
					/>
				</DialogContent>
				<DialogActions>
					<button
						id={"buttonYesDeleteTagDialog"}
						onClick={deleteTag}
						className={"btn text-danger ml-0"}
					>
						Yes
					</button>
					<button
						id={"buttonNoDeleteTagDialog"}
						onClick={handleClose}
						className={"btn text-primary"}
					>
						No
					</button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
