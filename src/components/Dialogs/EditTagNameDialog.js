import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { putAllTags, putOneTag } from "../../services/omgServer";

export default function EditTagNameDialog(props) {
	const [open, setOpen] = React.useState(false);
	const [tagName] = useState(props.tagName);
	const [newTagName, setNewTagName] = React.useState(props.tagName);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		document.getElementById("editTagResultRequestTag").innerText = "";
		refreshPage();
	};

	const applyChanges = () => {
		if (!newTagName) {
			document.getElementById("editTagResultRequestTag").innerText =
				"You have to enter a tag name !";
		} else {
			const applyBtn = document.getElementById("editTagApplyButton");
			applyBtn.setAttribute("disabled", "true");
			applyBtn.innerText = "Updating...";
			putAllTags(props.tagName, newTagName).then((res) => {
				document.getElementById("editTagResultRequestTag").innerText =
					res;
			});
			applyBtn.innerText = "Name changed";
		}
	};

	const newTagNameChange = (event) => {
		setNewTagName(event.target.value);
		const applyBtn = document.getElementById("editTagApplyButton");
		if (applyBtn.hasAttribute("disabled")) {
			applyBtn.removeAttribute("disabled");
			applyBtn.innerText = "Apply";
			document.getElementById("editTagResultRequestTag").innerText = "";
		}
	};

	const refreshPage = () => {
		window.location.reload(false);
	};

	return (
		<div>
			<button
				type={"button"}
				className={"btn btn-outline-warning"}
				onClick={handleClickOpen}
			>
				<span className={"icon mr-2"}>
					<i className={"fas fa-edit"} />
				</span>
				<span className={"text"}>Change {props.tagName}</span>
			</button>
			{/*<button className={"btn btn-warning"} onClick={handleClickOpen}>*/}
			{/*    Edit*/}
			{/*</button>*/}
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="editTag-dialog-title"
			>
				<DialogTitle
					id="editTagDialogTitle"
					className={"text-warning pb-0"}
				>
					Change name
				</DialogTitle>
				<DialogContent className={"ml-2 mr-2"}>
					<div className="row form-group mt-2">
						<label
							className={"form-check-label"}
							htmlFor="editTagNameInput"
						>
							Name
						</label>
						<input
							type="text"
							className={"form-control"}
							id="editTagNameInput"
							value={newTagName}
							onChange={newTagNameChange}
						/>
						<div className={"invalid-feedback"}>
							You have to enter a tag name
						</div>
					</div>
					<div className="d-flex row form-group mt-2">
						<div
							id={"editTagResultRequestTag"}
							className={"text-center text-info"}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<button
						id={"editTagApplyButton"}
						onClick={applyChanges}
						className={"btn text-warning ml-0"}
					>
						Apply
					</button>
					<button
						onClick={handleClose}
						className={"btn text-primary"}
					>
						Close
					</button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
