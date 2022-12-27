var activeTableName = ''
var activeTableHeader = ''
var port ="http://localhost:8080/webapp/"
const viewTables = async () => {
    try {
       const xhttp = new XMLHttpRequest();
       xhttp.onload = function () 
       {
           var data = this.responseText;
          // alert(data);   //console.log(data) //  var data = "one\ntable2\nnatraj\nraja\nkrishnan"
            createListView(data)
       }
       xhttp.open("GET",`${port}tableList?db=postgres`);
       xhttp.send();

    } catch (error) {
        alert(error)
    }
}

const createListView = (data) => {
    let con =document.getElementById("ddcontinaer");
    let select =document.getElementById("tableSelect");
    con.style.display='block';
    let list =data.split("\n");
     
    for(let i=0;i<list.length-1;i++){
        let tempOption = document.createElement("li")
        tempOption.classList.add("li-btn")
        let atag = document.createElement("a")
        atag.textContent = list[i]
        tempOption.addEventListener("click", function (evt) {
            console.log(evt.target.textContent)
            getTableData(evt.target.textContent)
        })
        tempOption.append(atag) 
        select.append(tempOption)
    }
}
let getTableData = (tableName) => {
       console.log("Current TableName "+tableName);
       let currentTable=tableName
      // console.log(currentTable)
    activeTableName = currentTable
    // window.alert("Table Executed");
    // api to get data
    //  let tvalue = "Name,Company,Salary,department,City,C1\nappu,Wipro,22000,dev,myl,v1\nRaja,Zoho,40000,vm,madurai,v2"
    try {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () 
        {
            var tvalue = this.responseText;
          //  alert(tvalue)
           console.log(tvalue)
            handleOptionClick(tvalue)
        }
        xhttp.open("GET",`${port}CrudOperation?query=${currentTable}`);
        xhttp.send();

     } catch (error) {
         alert(error)
     }
}

let handleOptionClick = (data) => {
    let prevTable = document.getElementById("query-table")
    var root = document.getElementById("table-container")
    if (prevTable != null) {
        root.removeChild(prevTable);
    }
    const tbdy = document.createElement("tbody")
    table = document.createElement("table")
    table.id = "query-table"
    let lines = data.split("\n");
    let header = lines[0].split(",")

    addHeader(header)

    for (let i = 1; i < lines.length-1; i++) {
        let temptr = document.createElement("tr")
        let temp = lines[i].split(",");
        temp.map((info, ind) => {
            let tempDOM = document.createElement('td')
            tempDOM.innerHTML = info;
            temptr.appendChild(tempDOM)
        })
        let td = document.createElement('td')
        let tempDOM = document.createElement('button')
        tempDOM.classList.add("btn")
        // tempDOM.classList.add("btn-dark")
        tempDOM.classList.add("btn")
        tempDOM.style.borderRadius = '50%'
        tempDOM.style.backgroundColor="yellow"
        tempDOM.innerHTML ="EDIT";
            //  '<i class="bi bi-pen"></i>';
        tempDOM.value = i
        tempDOM.addEventListener('click', function (evt) {
          //  console.log(this.parentElement.parentElement.textContent)
        handleEditRowBtn(this.parentElement.parentElement)

        })
        td.append(tempDOM)
        temptr.appendChild(td)
        let tdd = document.createElement('td')

        var del = document.createElement('button')
        del.innerHTML = "DELETE";//'<i class="bi bi-trash"></i>'
        del.style.borderRadius = '50%'
        del.style.backgroundColor="red"

        del.classList.add("btn")
        del.classList.add("btn")
        // del.classList.add("btn-danger")
        del.value = i
        del.addEventListener('click', function (evt) {
            console.log(this.parentElement.parentElement)
            handleDeleteBtn(this.parentElement.parentElement)
            
        })

        tdd.append(del)
        temptr.appendChild(tdd)
        tbdy.appendChild(temptr);
        table.appendChild(tbdy)
    }
    root.appendChild(table)
    const btncontainer = document.getElementById("btn-container")
    btncontainer.style.display = 'block'

}

const addHeader = (data) => {
    activeTableHeader = data
    const thd = document.createElement("thead")
    let temptr = document.createElement("tr")
    data.map((info, ind) => {
        let tempDOM = document.createElement('th')
        tempDOM.innerHTML = info;
        temptr.appendChild(tempDOM)
    })

    let tempDOM = document.createElement('th')
    tempDOM.innerHTML = "Edit BTN";
    temptr.appendChild(tempDOM)
    let tempDOM1 = document.createElement('th')
    tempDOM1.innerHTML = "DEL BTN";
    temptr.appendChild(tempDOM1)

    thd.appendChild(temptr);
    table.appendChild(thd)

}


const handleDeleteBtn = async (parentElement) => {
    console.log(activeTableName, " -> delte row option is running")

    let count = parentElement.childElementCount - 2
    let delData = ''

    for (let i = 0; i < count; i++) {
        const main = parentElement.childNodes[i].textContent
        delData += main
        if (count - 1 != i) {
            delData += ","
        }

    }//raja,786,dev,zoho
    //name sal role com 
    //
  // console.log(activeTableHeader.join(" "))
  //console.log(activeTableHeader)
    let joinstring=activeTableHeader.join(" ");
    console.log(joinstring);
    let headForDel=joinstring.split(" ");
    let delValue=delData.split(",");
    let final='';
    for(let i=0;i<headForDel.length;i++){
        final+=" "+headForDel[i]+' = '+"'"+delValue[i]+"'"+' AND'
    }
    let lastIndexOfSpace = final.lastIndexOf(' ');
    let final1=final.substring(0, lastIndexOfSpace);
    console.log(final1);

    console.log(activeTableName);
    let tname=activeTableName;

    try {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () 
        {
            let tvalue = this.responseText;
             alert(tvalue)
            console.log(tvalue)
   
        }         
        xhttp.open("POST",`${port}deleteTableRow?tableName=${tname}&query=${final1}`);
        xhttp.send();
        getTableData(tname);

     } catch (error) {
         alert(error)
     }

}

const handleInsertBtn = async () => {
    console.log(activeTableName, " -> insert")
    console.log(activeTableHeader)

    const mbdy = document.getElementById('mbody')

    while (mbdy.hasChildNodes()) {
        mbdy.removeChild(mbdy.childNodes[0]);
    }

    activeTableHeader.map((items) => {
        const inEle = document.createElement("input");
        inEle.placeholder = items
        mbdy.append(inEle)
    })


}

const handleInsertRow = async () => {
    console.log("handle insert row")
    let values = ""
    let num = document.getElementById("mbody").childElementCount;
    for (let i = 0; i < num; i++) {
        values += document.getElementById("mbody").childNodes[i].value
        if (i != num - 1) {
            values += "','"
        }

    }
    let ans="'"+values+"'"
    console.log(ans)
    getInsertTableData(ans);
    let dismiss = document.getElementById("closeModal").click()
}

let getInsertTableData = (insertdata) => {
 let tname=activeTableName;
 let tinsertdata=insertdata;
 console.log(tname);
 console.log(tinsertdata);
 //  let tvalue = "Name,Company,Salary,department,City,C1\nKrishnan,Wipro,22000,dev,myl,v1\nRaja,Zoho,40000,vm,madurai,v2"
 try {
     const xhttp = new XMLHttpRequest();
     xhttp.onload = function () 
     {
         let tvalue = this.responseText;
         alert(tvalue)
         console.log(tvalue)

     }
     xhttp.open("POST",`${port}insertTableRow?tableName=${tname}&query=${tinsertdata}`);
     xhttp.send();
     getTableData(tname);

  } catch (error) {
      alert(error)
  }

}
let oldData = ""
let editIsactive = false;
const handleEditRowBtn = (parentElement) => {

    if (!editIsactive) {
        oldData = ""

        let count = parentElement.childElementCount - 2
        for (let i = 0; i < count; i++) {
            const main = parentElement.childNodes[i].textContent
            oldData += main
            if (count - 1 != i) {
                oldData += ","
            }


            const temptd = document.createElement("td")
            const ival = document.createElement("input")
            ival.value = parentElement.childNodes[i].textContent
            temptd.append(ival)

            parentElement.replaceChild(temptd, parentElement.childNodes[i])

        }
        editIsactive = true
        console.log(oldData)
    } else {

        let values = ""
        let num = parentElement.childElementCount;
        console.log(num)
        for (let i = 0; i < num - 2; i++) {
            values += parentElement.childNodes[i].childNodes[0].value
            if (i != num - 1) {
                values += ","
            }

        }
        console.log(values)
        console.log(oldData)
        let joinstring=activeTableHeader.join(" ");
        console.log(joinstring);
        //update test1 set name = 'pooja1',role='analyst' where name = 'sakthi' AND  role ='dev';
        let ans=joinstring.split(" ");
        let newval=values.split(",");
        let oldval=oldData.split(",");
        let final='';
        for(let i=0;i<ans.length;i++){
            final+=" "+ans[i]+' = '+"'"+newval[i]+"'"+' ,'
        }
        let lastIndexOfSpace = final.lastIndexOf(' ');
        let finalnew=final.substring(0, lastIndexOfSpace);
        console.log(finalnew);
        //let oldchange=ans[0]+" = "+"'"+oldval[0]+"'"
        let oldchange='';
        for(let i=0;i<ans.length;i++){
            oldchange+=" "+ans[i]+' = '+"'"+oldval[i]+"'"+' AND'
        }
        let lastIndexOfSpace1 =oldchange.lastIndexOf(' ');
        let finalold=oldchange.substring(0, lastIndexOfSpace1);
        console.log(finalold);
      //  console.log(oldchange);


        let tname=activeTableName;

        try {
            const xhttp = new XMLHttpRequest();
            xhttp.onload = function () 
            {
                let tvalue = this.responseText;
                alert(tvalue)
                console.log(tvalue)
       
            }
                            
           xhttp.open("POST",`${port}updateTableRow?tableName=${tname}&query=${finalnew}&newquery=${finalold}`);
           xhttp.send();
           getTableData(tname);
       
         } catch (error) {
             alert(error)
         }
        
      //  getTableData(activeTableName)
        editIsactive = false
    }

}
