import React, {Component} from 'react';
import {postUpload, getRangesWithFormattedTimes, getBolusWithFormattedDateAndTime, postPendingTag} from "../../services/omgServer";
import {useRoundMinutesAndAddSummerTime} from "../../hooks/useRoundMinutesAndAddSummerTime";

/**
 * component that implements the method of importing the data of a user via a CSV file
 */
class ImportFileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            upload: "",  // state of the upload (0 -> not started, 1 -> request sent, 2 -> success, 3 -> detecting event -1 -> error)
            file: '',   // CSV data file
            sensorModel: 'none',  // Chosen model pump
            resultRequest: '', // API results of the request
            importName: '', // Name of the import saved in database for deletion
        }
    }

    roundTo5Minutes(date) {
        let coeff = 1000 * 60 * 5;
        return new Date(Math.round(date.getTime() / coeff) * coeff);
    }

    getDatePickerFormat(date) {
        // let initDate = useRoundMinutesAndAddSummerTime(date, 1);
        let initDate = this.roundTo5Minutes(date);
        initDate.setUTCHours(initDate.getUTCHours() - initDate.getTimezoneOffset() / 60);
        return initDate.toISOString().substr(0, 16);
    }

    /**
     * manages the sending and the result of the data import request.
     */
    uploadFile = async () => {
        if (this.state.sensorModel !== "none") {
            if (this.state.file) {
                if (this.state.importName) {
                    this.setState({upload: 1});
                    let res = await postUpload(document.getElementById('dataFileAutoInput'), this.state.sensorModel, this.state.importName);
                    if (res[0].ok) {
                        this.setState({upload: 3});
                        // (peut etre fait en meme temps que postUpload mais faut quand meme attendre l'import donc je laisse comme ça)
                        let ranges = await getRangesWithFormattedTimes();
                        if (ranges.length) {
                            // console.log(ranges);
                            this.setState({upload: 4});
                        }
                        // combine les daysselected pour supprimer les éventuels days redondants ?
                        // (en meme temps que getRanges si je laisse getRange après upload)
                        let bolusEvents = await getBolusWithFormattedDateAndTime();
                        if (bolusEvents.length) {
                            // console.log(bolusEvents);
                            this.setState({upload: 5});
                        }
                        let pendingTags = [];
                        for(const range of ranges){
                            let prevDate = [];
                            // bolusEvents.reverse();
                            for(const event of bolusEvents){
                                let date = event.date;
                                let time = event.time;
                                // console.log("date: "+date+" temps: "+time);
                                // let localGmtDate = new Date(date+" "+time).toLocaleString('fr-BE', { timeZone: 'UTC' })
                                // console.log("localGmtDate: "+localGmtDate+" (should be +1 if < 27 or +2 else)");

                                // console.log("date"+date);
                                //faut que range.from soit gmt 0 car si event.time=6:49 et que j'ai demandé 7h15, faut que range.from=6h15
                                // if date+time == GMT+1 alors range.from et to -1
                                // console.log(date+" "+time);
                                // console.log(new Date(date+" "+time)); // Thu Feb 17 2022 06:47:00 GMT+0100
                                // console.log(new Date(date+" "+time).toString().substr(25,6)); //GMT+0100
                                // let currentGmt = new Date(date+" "+time).toString().substr(25,6);
                                // let offset = currentGmt.substr(5, 2);
                                // // console.log(offset == 1);
                                // if (offset == 1){
                                    // console.log(range.from);

                                console.log("Date Bolus: "+date.replace(/-/g, "/")+"\nTime Bolus: "+time); // before replace: 22-05-03 18:32
                                let cleanedDate = date.replace(/-/g, "/");
                                let initBolusDate = new Date(cleanedDate + " " +time);
                                console.log("initBolusGMT0: "+initBolusDate); // Invalid Date
                                // code pour mettre en heure locale (db-->ui)
                                let basicBolusGmt = new Date(initBolusDate.setUTCHours(initBolusDate.getUTCHours() - initBolusDate.getTimezoneOffset() / 60));
                                console.log("bolusGMTok: "+ basicBolusGmt);
                                // timeSameGmt is NaN
                                // let timeSameGmt = basicBolusGmt.getHours() < 10 ? "0" + basicBolusGmt.getHours() + ":" + basicBolusGmt.getMinutes() : basicBolusGmt.getHours() + ":" + basicBolusGmt.getMinutes();
                                let zeroHours = basicBolusGmt.getHours() < 10 ? "0" : "";
                                let zeroMinutes = basicBolusGmt.getMinutes() < 10 ? "0" : "";
                                let timeSameGmt = zeroHours + basicBolusGmt.getHours() + ":" + zeroMinutes + basicBolusGmt.getMinutes();
                                console.log(time+ "<<<<<<<"+timeSameGmt);

                                // let initDate = new Date(cleanedDate + " " +range.from);
                                // let basicGmt = new Date(initDate.setUTCHours(initDate.getUTCHours() - initDate.getTimezoneOffset() / 60));
                                // zeroHours = basicGmt.getHours() < 10 ? "0" : "";
                                // zeroMinutes = basicGmt.getMinutes() < 10 ? "0" : "";
                                // let fromSameGmt = zeroHours + basicGmt.getHours() + ":" +  zeroMinutes + basicGmt.getMinutes();
                                // console.log("from: "+fromSameGmt);
                                //
                                // let initDateTo = new Date(cleanedDate + " " +range.to);
                                // let basicGmtTo = new Date(initDateTo.setUTCHours(initDateTo.getUTCHours() - initDateTo.getTimezoneOffset() / 60));
                                // zeroHours = basicGmtTo.getHours() < 10 ? "0" : "";
                                // zeroMinutes = basicGmtTo.getMinutes() < 10 ? "0" : "";
                                // let toSameGmt = zeroHours + basicGmtTo.getHours() + ":" + zeroMinutes + basicGmtTo.getMinutes();
                                // console.log("to: "+toSameGmt);

                                console.log(range.from + " plus petit que " + timeSameGmt + " plus petit que " + range.to);

                                if (timeSameGmt >= range.from && timeSameGmt <= range.to) {
                                    console.log("comparaison ok, check selecteddays");
                                    let daysNumbers = range.daysNumbers;
                                    if (daysNumbers.includes(new Date(cleanedDate).getDay())) {
                                        // const datetime = this.getDatePickerFormat(new Date(date + " " + time));
                                        // const datetime = this.roundTo5Minutes(new Date(cleanedDate + " " + timeSameGmt));
                                        const datetime = this.roundTo5Minutes(initBolusDate);
                                        console.log("datetime should be same as time in middle: "+datetime);
                                        console.log("this should be -1 ou -2: "+time);

                                        let pendingTag = {};
                                        if(prevDate.includes(cleanedDate)){
                                            console.log("multiple meal detected: " + prevDate +"==="+cleanedDate);

                                        }
                                        else {
                                            pendingTag.pendingName = range.name;
                                            // vu que je lui donne Sun Mar 20 2022 13:40:00 GMT+0100 CHROME (pas SAFARI) sait qu'il faut enlever gmt
                                            // mais si je lui donne un iso deja avant il na pas de GMT+XX donc il insère tel quel
                                            pendingTag.pendingDatetime = datetime//.toISOString().substr(0, 16);
                                            pendingTags.push(pendingTag);
                                            console.log(pendingTag);
                                            prevDate.push(cleanedDate);
                                            // console.log("prevDate"+prevDate);
                                        }
                                    }
                                }
                                // }
                                // if (time >= range.from && time <= range.to) {
                                //     let daysNumbers = range.daysNumbers;
                                //     if (daysNumbers.includes(new Date(date).getDay())) {
                                //         // const datetime = useRoundMinutesAndAddSummerTime(new Date(date + "T" + time), 1);
                                //         const datetime = this.getDatePickerFormat(new Date(date + "T" + time));
                                //         // let datetimeISO = new Date(datetime).toISOString();
                                //         let pendingTag = {};
                                //         pendingTag.pendingName = range.name;
                                //         pendingTag.pendingDatetime = datetime;
                                //         pendingTags.push(pendingTag);
                                //         // console.log(pendingTag);
                                //     }
                                // }
                            }
                        }
                        console.log(pendingTags);
                        let insertIntoTag = await postPendingTag(pendingTags);
                        if (ranges.length) {
                            console.log(insertIntoTag);
                            this.setState({upload: 2});
                        }
                    }
                    else {this.setState({upload: -1})}
                    // postUpload(document.getElementById('dataFileAutoInput'), this.state.sensorModel, this.state.importName).then((res) => {
                    //     if (res[0].ok) {
                    //         this.setState({upload: 3});
                    //         detectEventInRange().then((rep) => {
                    //             this.setState({upload: 2});
                    //             console.log(rep);
                    //         }).catch(res => this.setState({'upload': -1, 'resultRequest': res.toString()}));
                    //     } else {
                    //         this.setState({upload: -1})
                    //     }
                    //     this.setState({'resultRequest': res[1]})
                    // }).catch(res => this.setState({'upload': -1, 'resultRequest': res.toString()}));

                } else {
                    if (!document.getElementById("importName").classList.contains("is-invalid")) {
                        document.getElementById("importName").classList.add("is-invalid");
                    }
                }
            } else {
                if (!document.getElementById("dataFileAutoInput").classList.contains("is-invalid")) {
                    document.getElementById("dataFileAutoInput").classList.add("is-invalid");
                }
            }
        } else {
            if (!document.getElementById("sensorModelSelector").classList.contains("is-invalid")) {
                document.getElementById("sensorModelSelector").classList.add("is-invalid");
            }

        }
    }

    // roundTo5MinutesAndAddSummerTime = (date) => {
    //     let coeff = 1000 * 60 * 5;
    //     let rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
    //
    //     return new Date(rounded.setHours(rounded.getHours()+1));
    // }

    fileChange = (event) => {
        let now = new Date(Date.now());
        let filename = document.getElementById("dataFileAutoInput").files[0].name + " - " + now.toLocaleString();
        this.setState({file: event.target.value, importName: filename});
        document.getElementById("importName").value = filename;
        if (document.getElementById("dataFileAutoInput").classList.contains("is-invalid")) {
            document.getElementById("dataFileAutoInput").classList.remove("is-invalid");
        }
        if (document.getElementById("importName").classList.contains("is-invalid")) {
            document.getElementById("importName").classList.remove("is-invalid");
        }
        this.setState({upload: 0});
    }

    importNameChange = (event) => {
        this.setState({importName: event.target.value});
        if (document.getElementById("importName").classList.contains("is-invalid")) {
            document.getElementById("importName").classList.remove("is-invalid");
        }
        this.setState({upload: 0});
    }

    sensorModelChange = (event) => {
        this.setState({'sensorModel': event.target.value});
        if (document.getElementById("sensorModelSelector").classList.contains("is-invalid")) {
            document.getElementById("sensorModelSelector").classList.remove("is-invalid");
        }
        this.setState({upload: 0});
    }

    /**
     * manages the display of the status of the data import request
     *
     * @return {JSX.Element}
     */
    uploadResults() {
        let upBtn = document.getElementById("uploadButton");
        if (this.state.upload === -1) {
            this.changeUploadButtonStatus("fa-times", "btn-danger", "error");
            document.getElementById("uploadButtonInvalidText").innerText = this.state.resultRequest;
        }
        if (this.state.upload === 0) {
            this.changeUploadButtonStatus("fa-upload", "btn-primary", "upload data");
            upBtn.removeAttribute("disabled");
            document.getElementById("uploadButtonInvalidText").innerText = "";
        }
        if (this.state.upload === 1) {
            // this.changeUploadButtonStatus("fa-sync-alt", "btn-primary", "uploading...");
        }
        if (this.state.upload === 2) {
            this.changeUploadButtonStatus("fa-check", "btn-success", "uploaded !");
        }
        if (this.state.upload === 3) {
            this.changeUploadButtonStatus("fa-sync-alt", "btn-success", "getting the detection config...");
        }
        if (this.state.upload === 4) {
            this.changeUploadButtonStatus("fa-sync-alt", "btn-success", "getting bolus events...");
        }
        if (this.state.upload === 5) {
            this.changeUploadButtonStatus("fa-sync-alt", "btn-success", "detecting events...");
        }
    }

    /**
     * Visual change of upload button
     *
     * @param newIcon
     * @param newBtnColor
     * @param btnText
     */
    changeUploadButtonStatus = (newIcon, newBtnColor, btnText) => {
        let upBtn = document.getElementById("uploadButton");
        let upBtnIcn = document.getElementById("uploadButtonIcon");
        let upBtnTxt = document.getElementById("uploadButtonText");
        upBtnIcn.classList.forEach((className) => {
            if (className.startsWith('fa-')) {
                upBtnIcn.classList.remove(className);
            }
        });
        upBtn.classList.forEach((className) => {
            if (className.startsWith('btn-primary') || className.startsWith('btn-danger') || className.startsWith('btn-success')) {
                upBtn.classList.remove(className);
            }
        });
        upBtn.setAttribute("disabled", "true");
        upBtn.classList.add(newBtnColor);
        upBtnIcn.classList.add(newIcon);
        upBtnTxt.innerText = btnText;
    }

    showButton(){
        if (this.state.upload === 1) {
            return (
                <button id={"uploadButton"} className="btn btn-primary" type="button" disabled>
                    <span  id={"uploadButtonIcon"} className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    <span id={"uploadButtonText"} className="text">Loading...</span>
                </button>
            );
        }
        else{
            return (
                <button id={"uploadButton"} className="btn btn-primary btn-icon-split" onClick={this.uploadFile}>
                                <span className="icon text-white-50">
                                    <i id={"uploadButtonIcon"} className="fas fa-upload"/>
                                </span>
                    <span id={"uploadButtonText"} className="text">Upload data</span>
                </button>
            );
        }
    }

    render() {
        return (
            <div>
                <div id="uploadCard" className="card d-flex border-bottom-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text font-weight-bold text-primary text-uppercase">
                                    File import
                                </div>
                            </div>
                        </div>
                        <hr className="sidebar-divider"/>
                        <form className="ml-2 mr-2" id="uploadForm">
                            <div className="row form-group">
                                <label className={"form-check-label"} htmlFor="sensorModelSelector">Sensor model</label>
                                <select className="form-control" id="sensorModelSelector" name="pumpModel"
                                        onChange={this.sensorModelChange} defaultValue={{value: "none"}}>
                                    <option value="none">Choose a model...</option>
                                    <option value="minimed">MiniMed</option>
                                </select>
                                <div className={"invalid-feedback"}>You have to choose a model</div>
                            </div>
                            <div className="row form-group mt-2">
                                <label className={"form-check-label"} htmlFor="importName">Import name (default : filename)</label>
                                <input type="text" className={"form-control"} id="importName" onChange={this.importNameChange}/>
                                <div className={"invalid-feedback"}>You have to enter a import name</div>
                            </div>
                            <div className="row form-group mt-2">
                                <label className={"form-check-label"} htmlFor="dataFileAutoInput">Sensor data CSV</label>
                                <input type="file" className="form-control-file" id="dataFileAutoInput" name="file" accept=".csv" onChange={this.fileChange}/>
                                <div className={"invalid-feedback"}>You have to choose a CSV file</div>
                            </div>
                        </form>
                        <div className="row d-flex align-items-center justify-content-end mr-2">
                            <div id={"uploadButtonInvalidText"} className={"text-danger mr-4"}/>
                            {this.showButton()}
                        </div>
                        <div className="float-right">
                            <input className="form-check-input " type="checkbox" id={"checkIt"} checked/>
                            <label className="form-check-label " htmlFor={"checkIt"}>auto detection</label>
                        </div>
                        {this.uploadResults()}
                    </div>
                </div>
            </div>
        )
    }
}

export default ImportFileCard;
