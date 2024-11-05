import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import { CreateProduct, Product } from './items';

const url : string = "https://retoolapi.dev/4GOGh2/data";

document.addEventListener("DOMContentLoaded", async () =>{
  const htmlBody = document.getElementById("body") as HTMLBodyElement;
  const createButton = document.createElement("button") as HTMLButtonElement;

  createButton.textContent = "Add new";
  createButton.classList.add("btn");
  createButton.classList.add("btn-info");
  createButton.classList.add("mb-3")

  htmlBody.appendChild(createButton);

  const itemForm = document.getElementById("itemForm") as HTMLFormElement;
  const newRatingInput = document.getElementById("newRating") as HTMLInputElement;
  const deliveryStatusInput = document.getElementById("deliveryStatus") as HTMLInputElement;
  const newProductIdInput = document.getElementById("newProductId") as HTMLInputElement;

  
  const table = document.createElement("table") as HTMLTableElement;
  table.classList.add("table-info");
  table.classList.add("w-100");
  const tbody = document.createElement("tbody");
  const trHeader = document.createElement("tr") as HTMLTableRowElement;
  const th1 = document.createElement("th") as HTMLTableCellElement;
  const th2 = document.createElement("th") as HTMLTableCellElement;
  const th3 = document.createElement("th") as HTMLTableCellElement;
  const th4 = document.createElement("th") as HTMLTableCellElement;

  th1.textContent = "Rating";
  th1.classList.add("table-primary");
  th1.onclick = () => sortTable("rating");
  th2.textContent = "Delivery Status";
  th2.classList.add("table-primary");
  th2.onclick = () => sortTable("status");
  th3.textContent = "Product ID";
  th3.classList.add("table-primary");
  th3.onclick = () => sortTable("productId");
  th4.textContent = "Delete";
  th4.classList.add("table-primary");

  trHeader.appendChild(th1);
  trHeader.appendChild(th2);
  trHeader.appendChild(th3);
  trHeader.appendChild(th4);
  table.appendChild(trHeader);
  table.appendChild(tbody);

  let data : Product[];
  await downloadItems();
  getTable();


  function sortTable(method : string){
    if (method == "rating"){
      data.sort((a,b)=> b.rating - a.rating);
    }
    else if (method == "status") {
      data.sort((a,b) => a.status.localeCompare(b.status));
    }
    else{
      data.sort((a,b) => a.product_id.localeCompare(b.product_id)); 
    }
    getTable();
  }



  function getTable(){
    tbody.textContent = "";
    data.forEach(item => {
      const tr = document.createElement("tr") as HTMLTableRowElement;
      const td1 = document.createElement("td") as HTMLTableCellElement;
      const td2 = document.createElement("td") as HTMLTableCellElement;
      const td3 = document.createElement("td") as HTMLTableCellElement;
      const td4 = document.createElement("td") as HTMLTableCellElement;
      const deleteButton = document.createElement("button") as HTMLButtonElement;
    
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("btn");
      deleteButton.classList.add("btn-danger");
      deleteButton.type = "button";
      deleteButton.addEventListener("click", async () => {
        await deleteItem(item.id);
        await downloadItems();
      })

      td1.textContent = item.rating.toString();
      td1.classList.add("pb-3");
      td2.textContent = item.status;
      td2.classList.add("pb-3");
      td3.textContent = item.product_id;
      td3.classList.add("pb-3");
      td4.appendChild(deleteButton);
      td4.classList.add("pb-3");


      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);

      tbody.appendChild(tr);
    });
    
    htmlBody.appendChild(table);
  }
  async function downloadItems() {
    try {
      const response = await fetch(url);
      data = await response.json() as Product[];
    } catch (error : any) {
      console.error("An error occured while loading the database: " + error.message);
    }
  }

  async function deleteItem(id : number){
    try {
      if (confirm("Are you sure you want to delete this record?")){
        await fetch(url + "/" + id, {
          method: "DELETE"
        });
      }
      else {
        return;
      }
    } catch (error : any) {
      console.error("An error occured while trying to delete this record: " + error.message);
    }
  }

  createButton.addEventListener("click", () => {
    createButton.classList.add("d-none");
    table.classList.add("d-none")
    itemForm.classList.remove("d-none");
  })

  itemForm.addEventListener("submit", async e => {
    e.preventDefault();

    const newItem = {
      rating: parseInt(newRatingInput.value),
      status: deliveryStatusInput.value,
      product_id: newProductIdInput.value
    };

    if (!newItem.rating || !newItem.status || !newItem.product_id){
      alert("Please fill out all fields");
    }
    else {
      await addProd(newItem);
      await downloadItems();
    }


    createButton.classList.remove("d-none");
    table.classList.remove("d-none");
    itemForm.classList.add("d-none");
  })


  async function addProd(newItem : CreateProduct){
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });

    } catch (error : any) {
      console.error("The following error occured: " + error.message)
    }
  }
})