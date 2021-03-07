

const button = document.getElementById("button");
const input = document.getElementById("input");
const statisticButton = document.getElementById("statistic-button");
statisticButton.addEventListener("click" , ()=>{
    fetch("http://localhost:3000/all/statistic")
    .then((response)=>{
        return response.json()
    }).then((result)=>{
        const table = document.getElementsByTagName("table");
        if(table[0]){
            table[0].remove();

        }
        showSTATISTIC(result);
        console.log(result , typeof(result));
        
    });
});

function showSTATISTIC(data){
    const urlsArrey = [];
    for (const key in data) {
        urlsArrey.push(data[key]);
    }
    const table = document.createElement("table");
    table.classList.add("table");
    let body = document.getElementsByTagName("body");
    document.body.append(table);    

    //creating the tables head:
    let tableRow = document.createElement("tr");
    table.append(tableRow);
    for (const prop in urlsArrey[0]) {
        if(prop!== "id"){
            let tableHead = document.createElement("th");
            tableHead.textContent = prop;
            tableRow.append(tableHead);

        }
    }
    
    //function for adding a singel row + adding classes to properties i want to change their color.
    function addrowes(object){
        let tableRow = document.createElement("tr");
        table.append(tableRow);
        
        for (const prop in object) {
            if(prop!== "id"){

                let tableSection = document.createElement("td");
                tableSection.textContent= object[prop];
                tableRow.append(tableSection);
            }
    

        }
    }

    //adding all rows
    for(let i=0;i<urlsArrey.length;i++){
        addrowes(urlsArrey[i]); 
    }
   
}






