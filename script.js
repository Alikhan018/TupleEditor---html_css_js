class SETUPLOCALSTORAGE {
  constructor() {
    this.setUpLocalStorage();
  }
  setUpLocalStorage() {
    if (
      localStorage.getItem("inventory") === null ||
      localStorage.getItem("inventory") === undefined
    ) {
      let inventory = [];
      localStorage.setItem("inventory", JSON.stringify(inventory));
      localStorage.setItem("SrNo", "1");
    }
  }
}

class FormHandler {
  constructor() {
    this.handleFormSubmit();
  }

  handleFormSubmit() {
    const form = document.getElementById("add-save");
    form.addEventListener("click", function () {
      const inputValues = document.querySelectorAll("input");
      const companyName = document.querySelector("select");
      if (companyName.value === "") {
        alert("Select a company name");
        return;
      }
      if(isNaN(inputValues[2].value)) {
        alert("Enter a valid number");
        return
      }
      const uuid = crypto.randomUUID();
      const item = {};
      let localstorage = JSON.parse(localStorage.getItem("inventory"));
      let localSrNo = JSON.parse(localStorage.getItem("SrNo"));
      item.id = uuid;
      item.name = inputValues[0].value;
      item.qty = inputValues[1].value;
      item.company = companyName.value;
      item.price = inputValues[2].value;
      item.date = inputValues[3].value;
      localstorage.push(item);
      localStorage.setItem("inventory", JSON.stringify(localstorage));
      localStorage.setItem("SrNo", (localSrNo + 1).toString());
      location.reload();
    });
  }
}

class RECORDS {
  constructor() {
    this.currentPage = 1;
    this.recordsPerPage = 15;
    this.setUpRecords(this.currentPage);
    this.deleteRecord();
    this.updateRecord();
  }

  //functions to read data
  setUpRecords() {
    let localstorage = JSON.parse(localStorage.getItem("inventory"));
    if (localstorage.length === 0) {
      const table = document.querySelector("#table");
      let p = document.createElement("p");
      p.innerText = "NO RECORDS FOUND";
      p.style.textAlign = "center";
      table.appendChild(p);
      let paginator = document.getElementById("prev-next");
      paginator.style.display = "none";
      return;
    }
    //rendering page numbers at bottom of page
    let noOfanchorTags = localstorage.length / this.recordsPerPage;
    if (localstorage.length < 5) {
      let spanOfPageNo = document.createElement("a");
      spanOfPageNo.href = "#";
      spanOfPageNo.innerHTML = 1;
      document.getElementById("pageNo").appendChild(spanOfPageNo);
    } else {
      //adding event listeners by iteration to get to corresponding page
      for (let i = 0; i < noOfanchorTags; i++) {
        let spanOfPageNo = document.createElement("a");
        spanOfPageNo.href = `#`;
        spanOfPageNo.innerHTML = i + 1;
        spanOfPageNo.onclick = () => {
          this.currentPage = i + 1;
          this.middlefunction(this.currentPage);
        };
        document.getElementById("pageNo").appendChild(spanOfPageNo);
      }
    }

    //adding evt listeners to buttons for page iter.
    document.getElementById("prev").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.middlefunction(this.currentPage);
      }
    });
    document.getElementById("next").addEventListener("click", () => {
      if (this.currentPage < noOfanchorTags) {
        this.currentPage++;
        this.middlefunction(this.currentPage);
      }
    });

    //calling middle function to pass page numbers
    this.middlefunction(this.currentPage);
  }

  middlefunction(page) {
    let localstorage = JSON.parse(localStorage.getItem("inventory"));

    //making table empty before rendering the next page
    let tb = document.getElementById("table-body");
    tb.innerHTML = "";
    while (tb.length > 0) {
      tb[0].parentNode.removeChild(tb[0]);
    }

    //slicing records to our own requirement
    let startIndex = (page - 1) * this.recordsPerPage;
    let endIndex = startIndex + this.recordsPerPage;
    let updatedRecord = localstorage.slice(startIndex, endIndex);
    updatedRecord.map((item, index) => this.renderRecord(item, index));
  }

  renderRecord(item, i) {
    //Selecting Table
    const table = document.querySelector("#table-body");

    //Initialization of elements
    let spanOf_SrNo = document.createElement("span");
    let spanOf_Name = document.createElement("span");
    let spanOf_Qty = document.createElement("span");
    let spanOf_Company = document.createElement("span");
    let spanOf_Price = document.createElement("span");
    let spanOf_Days = document.createElement("span");
    let spanOf_Buttons = document.createElement("span");
    let buttonUpdate = document.createElement("i");
    let buttonDelete = document.createElement("i");
    let data_div = document.createElement("div");
    let icons_div = document.createElement("div");
    //End of initialization

    //adding classes
    spanOf_SrNo.classList = "table-cell";
    spanOf_Name.classList = "table-cell";
    spanOf_Qty.classList = "table-cell";
    spanOf_Company.classList = "table-cell";
    spanOf_Price.classList = "table-cell";
    spanOf_Days.classList = "table-cell";
    spanOf_Buttons.classList = "table-cell";

    //adding data-labels
    spanOf_SrNo.setAttribute("data-label", "Sr No#");
    spanOf_Name.setAttribute("data-label", "Name");
    spanOf_Qty.setAttribute("data-label", "Quantity");
    spanOf_Company.setAttribute("data-label", "Company Name");
    spanOf_Price.setAttribute("data-label", "Price");
    spanOf_Days.setAttribute("data-label", "Days");
    spanOf_Buttons.setAttribute("data-label", "Actions");

    //Assiging values to elements
    spanOf_SrNo.innerText = i + 1;
    spanOf_Name.innerText = item.name;
    spanOf_Qty.innerText = item.qty;
    spanOf_Company.innerText = item.company;
    spanOf_Price.innerText = item.price;
    let days = this.calcDays(item.date); //calculating days
    spanOf_Days.innerText = days;
    buttonUpdate.classList = "fa-solid fa-edit";
    buttonUpdate.id = "update";
    buttonDelete.classList = "fa-solid fa-trash";
    buttonDelete.id = "delete";
    //End of assigning

    icons_div.append(buttonUpdate, buttonDelete);
    icons_div.classList = "small-buttons-flex";
    spanOf_Buttons.appendChild(icons_div);
    data_div.append(
      spanOf_SrNo,
      spanOf_Name,
      spanOf_Qty,
      spanOf_Company,
      spanOf_Price,
      spanOf_Days,
      spanOf_Buttons
    );
    data_div.classList = "table-row";
    table.appendChild(data_div);
  }
  calcDays(date) {
    const today = new Date();
    const postedDate = new Date(date);
    let timeInSeconds = today - postedDate;
    return Math.floor(timeInSeconds / (1000 * 60 * 60 * 24));
  }
  //end of read functions

  //function to delete data
  deleteRecord() {
    let buttons = Array.from(document.querySelectorAll("i"));
    let delButtons = buttons.filter((btn) =>
      btn.classList.contains("fa-trash")
    );
    delButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        let parentDiv = btn.parentElement;
        let grandParent = parentDiv.parentElement;
        let greatGrandParent = grandParent.parentElement;
        let spanOf_SrNo = greatGrandParent.firstChild;
        let SrNo = parseInt(spanOf_SrNo.innerText);
        let localstorage = JSON.parse(localStorage.getItem("inventory"));
        let updatedLocalStorage = [];
        let j = 0;
        for (let i = 0; i < localstorage.length; i++) {
          if (SrNo - 1 !== i) {
            updatedLocalStorage[j] = localstorage[i];
            j++;
          }
        }
        localStorage.setItem("inventory", JSON.stringify(updatedLocalStorage));
        location.reload();
      });
    });
  }
  //end of delete function

  //function to update
  updateRecord() {
    let buttons = Array.from(document.querySelectorAll("i"));
    let updateButtons = buttons.filter((btn) =>
      btn.classList.contains("fa-edit")
    );
    updateButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        let parentDiv = btn.parentElement;
        let grandParent = parentDiv.parentElement;
        let greatGrandParent = grandParent.parentElement;
        let spanOf_SrNo = greatGrandParent.firstChild;
        let SrNo = parseInt(spanOf_SrNo.innerText);
        let localstorage = JSON.parse(localStorage.getItem("inventory"));
        let dataToUpdate = {};
        for (let i = 0; i < localstorage.length; i++) {
          if (SrNo - 1 === i) {
            dataToUpdate = localstorage[i];
            break;
          }
        }

        //setting up data in input fields
        const inputValues = document.querySelectorAll("input");
        const companyName = document.querySelector("select");
        inputValues[0].value = dataToUpdate.name;
        inputValues[1].value = dataToUpdate.qty;
        companyName.value = dataToUpdate.company;
        inputValues[2].value = dataToUpdate.price;
        inputValues[3].value = dataToUpdate.date;
        //end of setting up data

        //renaming btns to save and discard and adding their evts
        let savebtn = document.querySelector("#add-save");
        let discardbtn = document.querySelector("#reset-discard");
        savebtn.innerHTML = `Save <i></i>`;
        let saveIcon = document.querySelector("#add-save i");
        saveIcon.classList = "fa-solid fa-save";
        discardbtn.innerHTML = `Discard <i></i>`;
        let trashIcon = document.querySelector("#reset-discard i");
        trashIcon.classList = "fa-solid fa-trash";
        discardbtn.addEventListener("click", function () {
          savebtn.innerHTML = `Add <i></i>`;
          let saveIcon = document.querySelector("#add-save i");
          saveIcon.classList = "fa-solid fa-add";
          discardbtn.innerHTML = `Reset <i></i>`;
          let trashIcon = document.querySelector("#reset-discard i");
          trashIcon.classList = "fa-solid fa-trash";
        });
        savebtn.addEventListener("click", function (evt) {
          evt.preventDefault();
          savebtn.classList = "fa-solid fa-add";
          discardbtn.innerHTML = `Reset <i></i>`;
          let trashIcon = document.querySelector("#reset-discard i");
          trashIcon.classList = "fa-solid fa-trash";
          for (let i = 0; i < localstorage.length; i++) {
            if (i === SrNo - 1) {
              localstorage[i].name = inputValues[0].value;
              localstorage[i].qty = inputValues[1].value;
              localstorage[i].company = companyName.value;
              localstorage[i].price = inputValues[2].value;
              localstorage[i].date = inputValues[3].value;
              break;
            }
          }
          localStorage.setItem("inventory", JSON.stringify(localstorage));
          location.reload();
        });
        //end of renaming and evts
      });
    });
  }
  //end of update
}

document.addEventListener("DOMContentLoaded", () => {
  new SETUPLOCALSTORAGE();
  new FormHandler();
  new RECORDS();
});
